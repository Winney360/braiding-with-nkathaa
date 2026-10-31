import { Booking } from '../models/Booking.js';
import { Hairstyle } from '../models/Hairstyle.js';
import { Coupon } from '../models/Coupon.js';

export const ALL_TIME_SLOTS = [
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM'
];

// GET /api/bookings/available-slots?date=YYYY-MM-DD
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }

    // Find all active bookings on this date (excluding cancelled)
    const activeBookings = await Booking.find({
      date,
      status: { $ne: 'Cancelled' }
    }).select('timeSlot hairstyleName customerName');

    const bookedSlotsMap = new Map();
    activeBookings.forEach(b => {
      bookedSlotsMap.set(b.timeSlot, {
        isBooked: true,
        hairstyleName: b.hairstyleName
      });
    });

    const slots = ALL_TIME_SLOTS.map(time => {
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
      availableCount: slots.filter(s => s.isAvailable).length,
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
      couponCode
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !hairstyleId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, phone, email, hairstyle, date, time slot)'
      });
    }

    // Prevent double booking for the same slot
    const existingBooking = await Booking.findOne({
      date,
      timeSlot,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The ${timeSlot} appointment slot on ${date} is already reserved. Please select another time or date.`
      });
    }

    // Get hairstyle details
    const hairstyle = await Hairstyle.findById(hairstyleId);
    if (!hairstyle) {
      return res.status(404).json({ success: false, message: 'Selected hairstyle was not found' });
    }

    let finalPrice = hairstyle.price;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode && couponCode.trim() !== '') {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true
      });
      if (coupon && coupon.usedCount < coupon.maxUses) {
        discount = (finalPrice * coupon.discountPercent) / 100;
        finalPrice = Math.max(0, finalPrice - discount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const booking = new Booking({
      customerName,
      customerPhone,
      customerEmail,
      hairstyle: hairstyle._id,
      hairstyleName: hairstyle.name,
      date,
      timeSlot,
      preferredHairColor: preferredHairColor || '#1B - Natural Black',
      additionalNotes: additionalNotes || '',
      status: 'Pending',
      totalAmount: finalPrice,
      depositAmount: Math.min(1000, finalPrice), // KES 1,000 standard deposit
      depositPaid: false,
      paymentStatus: 'Unpaid',
      couponCode: couponCode || '',
      discountAmount: discount
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Your appointment request has been received. We will contact you shortly.',
      data: savedBooking
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
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (date) {
      filter.date = date;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { customerName: { $regex: search.trim(), $options: 'i' } },
        { customerPhone: { $regex: search.trim(), $options: 'i' } },
        { customerEmail: { $regex: search.trim(), $options: 'i' } },
        { hairstyleName: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('hairstyle')
      .sort({ date: -1, timeSlot: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// GET /api/bookings/my-bookings?search=... (Customer lookup)
export const getMyBookings = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Please provide your phone number or email' });
    }

    const cleanQuery = query.trim();
    const bookings = await Booking.find({
      $or: [
        { customerPhone: { $regex: cleanQuery, $options: 'i' } },
        { customerEmail: { $regex: cleanQuery, $options: 'i' } }
      ]
    })
      .populate('hairstyle')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ success: false, message: 'Server error looking up appointments' });
  }
};

// PATCH /api/bookings/:id/status (Admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, depositPaid } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    const updateFields = {};
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      updateFields.status = status;
    }

    if (paymentStatus) {
      updateFields.paymentStatus = paymentStatus;
    }

    if (depositPaid !== undefined) {
      updateFields.depositPaid = Boolean(depositPaid);
      if (depositPaid && (!updateFields.paymentStatus || updateFields.paymentStatus === 'Unpaid')) {
        updateFields.paymentStatus = 'Deposit_Paid';
      }
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('hairstyle');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({
      success: true,
      message: `Booking status updated to ${updated.status}`,
      data: updated
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
    const { phoneNumber, amount } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const randomMpesaCode = `QKD${Math.floor(100000 + Math.random() * 900000)}B`;

    booking.depositPaid = true;
    booking.paymentStatus = 'Deposit_Paid';
    booking.mpesaReference = randomMpesaCode;
    booking.status = 'Confirmed';
    await booking.save();

    res.json({
      success: true,
      message: `M-Pesa payment of KES ${amount || booking.depositAmount} verified successfully. Transaction Code: ${randomMpesaCode}`,
      data: {
        receiptNumber: randomMpesaCode,
        bookingId: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus
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
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking removed successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ success: false, message: 'Server error deleting booking' });
  }
};
