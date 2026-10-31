import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true
    },
    hairstyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hairstyle',
      required: [true, 'Hairstyle selection is required']
    },
    hairstyleName: {
      type: String,
      required: true
    },
    date: {
      type: String, // Stored as ISO YYYY-MM-DD for straightforward date queries
      required: [true, 'Appointment date is required']
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: [
        '08:30 AM',
        '10:00 AM',
        '11:30 AM',
        '01:00 PM',
        '02:30 PM',
        '04:00 PM',
        '05:30 PM'
      ]
    },
    preferredHairColor: {
      type: String,
      default: '#1B - Natural Black',
      trim: true
    },
    additionalNotes: {
      type: String,
      default: '',
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    totalAmount: {
      type: Number,
      default: 0
    },
    depositAmount: {
      type: Number,
      default: 1000 // In KES or default currency
    },
    depositPaid: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Pending_Deposit', 'Deposit_Paid', 'Full_Paid'],
      default: 'Unpaid'
    },
    mpesaReference: {
      type: String,
      default: ''
    },
    couponCode: {
      type: String,
      default: ''
    },
    discountAmount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Booking = mongoose.model('Booking', bookingSchema);
