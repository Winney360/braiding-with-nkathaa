import { prisma } from '../config/prisma.js';

export const ALL_TIME_SLOTS = [
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM'
];

// Normalize booking for frontend compatibility
const normalizeBooking = (b) => {
  if (!b) return null;
  // Convert PENDING to Pending, CONFIRMED to Confirmed, etc.
  const statusFormatted = b.status
    ? b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase()
    : 'Pending';

  return {
    ...b,
    _id: b.id,
    status: statusFormatted,
    rawStatus: b.status,
    mpesaReference: b.payment?.transactionCode || ''
  };
};

// Map status string to Prisma Enum
const mapStatusToEnum = (status) => {
  const upper = (status || '').toUpperCase();
  if (['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(upper)) {
    return upper;
  }
  return 'PENDING';
};

// GET /api/bookings/available-slots?date=YYYY-MM-DD
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    // Find all active bookings on this date (excluding cancelled)
    const activeBookings = await prisma.booking.findMany({
      where: {
        date,
        status: { not: 'CANCELLED' }
      },
      select: {
        timeSlot: true,
        hairstyleName: true,
        customerName: true
      }
    });

    const bookedSlotsMap = new Map();
    activeBookings.forEach((b) => {
      bookedSlotsMap.set(b.timeSlot, {
        isBooked: true,
        hairstyleName: b.hairstyleName
      });
    });

    const slots = ALL_TIME_SLOTS.map((time) => {
      const bookedInfo = bookedSlotsMap.get(time);
      return {
        time,
        isAvailable: !bookedInfo,
        status: bookedInfo ? 'Booked' : 'Available'
      };
    });

    res.json({
      success: true,
      date,
      totalSlots: ALL_TIME_SLOTS.length,
      availableCount: slots.filter((s) => s.isAvailable).length,
      slots
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({ success: false, message: 'Server error checking time slots' });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      hairstyleId,
      date,
      timeSlot,
      preferredHairColor,
      additionalNotes,
      notes,
      couponCode
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !hairstyleId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, phone, email, hairstyle, date, time slot)'
      });
    }

    // Prevent duplicate booking for the same date & time slot
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date,
        timeSlot,
        status: { not: 'CANCELLED' }
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The ${timeSlot} appointment slot on ${date} is already reserved. Please select another time or date.`
      });
    }

    // Lookup hairstyle
    const hairstyle = await prisma.hairstyle.findUnique({
      where: { id: hairstyleId }
    });

    if (!hairstyle) {
      return res.status(404).json({ success: false, message: 'Selected hairstyle was not found' });
    }

    // Find or create customer User
    const emailClean = customerEmail.toLowerCase().trim();
    let customer = await prisma.user.findUnique({
      where: { email: emailClean }
    });

    if (!customer) {
      // Auto-create customer account with temporary random password
      customer = await prisma.user.create({
        data: {
          name: customerName.trim(),
          email: emailClean,
          phone: customerPhone.trim(),
          password: 'CustomerAutoAccount2026!',
          role: 'CUSTOMER'
        }
      });
    }

    let finalPrice = hairstyle.price;
    let discount = 0;

    // Validate and apply coupon if provided
    if (couponCode && couponCode.trim() !== '') {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() }
      });

      if (coupon && coupon.isActive && coupon.usedCount < coupon.maxUses) {
        discount = (finalPrice * coupon.discountPercent) / 100;
        finalPrice = Math.max(0, finalPrice - discount);

        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: emailClean,
        hairstyleId: hairstyle.id,
        hairstyleName: hairstyle.name,
        date,
        timeSlot,
        preferredHairColor: preferredHairColor || '#1B - Natural Black',
        notes: (notes || additionalNotes || '').trim(),
        status: 'PENDING',
        totalAmount: finalPrice,
        depositAmount: Math.min(1000, finalPrice),
        depositPaid: false,
        couponCode: couponCode || null,
        discountAmount: discount
      },
      include: {
        customer: true,
        hairstyle: true,
        payment: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Your appointment request has been received. We will contact you shortly.',
      data: normalizeBooking(booking)
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating appointment' });
  }
};

// GET /api/bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const { status, date, search, page = 1, limit = 50 } = req.query;
    const where = {};

    if (status && status !== 'All') {
      where.status = mapStatusToEnum(status);
    }

    if (date) {
      where.date = date;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { customerName: { contains: term, mode: 'insensitive' } },
        { customerPhone: { contains: term, mode: 'insensitive' } },
        { customerEmail: { contains: term, mode: 'insensitive' } },
        { hairstyleName: { contains: term, mode: 'insensitive' } }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        hairstyle: true,
        customer: true,
        payment: true
      },
      orderBy: [
        { date: 'desc' },
        { timeSlot: 'asc' }
      ],
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    });

    const total = await prisma.booking.count({ where });

    res.json({
      success: true,
      count: bookings.length,
      total,
      data: bookings.map(normalizeBooking)
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// GET /api/bookings/my-bookings?query=... (Customer lookup)
export const getMyBookings = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Please provide your phone number or email' });
    }

    const cleanQuery = query.trim();
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { customerPhone: { contains: cleanQuery, mode: 'insensitive' } },
          { customerEmail: { contains: cleanQuery, mode: 'insensitive' } }
        ]
      },
      include: {
        hairstyle: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings.map(normalizeBooking)
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ success: false, message: 'Server error looking up appointments' });
  }
};

// PATCH /api/bookings/:id/status (Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, depositPaid } = req.body;

    const data = {};
    if (status) {
      data.status = mapStatusToEnum(status);
    }
    if (depositPaid !== undefined) {
      data.depositPaid = Boolean(depositPaid);
      if (depositPaid && (!data.status || data.status === 'PENDING')) {
        data.status = 'CONFIRMED';
      }
    }

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: {
        hairstyle: true,
        customer: true,
        payment: true
      }
    });

    res.json({
      success: true,
      message: `Booking status updated to ${updated.status}`,
      data: normalizeBooking(updated)
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Server error updating booking status' });
  }
};

// POST /api/bookings/:id/mpesa-simulate (Simulate M-Pesa STK Push payment)
export const simulateMpesaPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const randomMpesaCode = `QKD${Math.floor(100000 + Math.random() * 900000)}B`;
    const paymentAmount = amount ? Number(amount) : booking.depositAmount;

    // Create or update Payment record
    const payment = await prisma.payment.upsert({
      where: { bookingId: booking.id },
      update: {
        amount: paymentAmount,
        transactionCode: randomMpesaCode,
        status: 'COMPLETED'
      },
      create: {
        bookingId: booking.id,
        amount: paymentAmount,
        transactionCode: randomMpesaCode,
        status: 'COMPLETED',
        paymentMethod: 'M-PESA'
      }
    });

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        depositPaid: true,
        status: 'CONFIRMED'
      },
      include: {
        hairstyle: true,
        payment: true
      }
    });

    res.json({
      success: true,
      message: `M-Pesa payment of KES ${paymentAmount} verified successfully. Transaction Code: ${randomMpesaCode}`,
      data: {
        receiptNumber: randomMpesaCode,
        bookingId: booking.id,
        status: 'Confirmed',
        paymentStatus: 'Deposit_Paid',
        payment
      }
    });
  } catch (error) {
    console.error('Error in M-Pesa payment simulation:', error);
    res.status(500).json({ success: false, message: 'Error processing M-Pesa payment' });
  }
};

// DELETE /api/bookings/:id (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({
      where: { id }
    });
    res.json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Server error deleting booking' });
  }
};
