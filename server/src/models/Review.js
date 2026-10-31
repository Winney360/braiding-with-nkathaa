import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true
    },
    hairstyleCategory: {
      type: String,
      default: 'Knotless Braids'
    },
    hairstyleName: {
      type: String,
      default: ''
    },
    hairstyleImage: {
      type: String,
      default: ''
    },
    customerLocation: {
      type: String,
      default: 'Nairobi'
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Review = mongoose.model('Review', reviewSchema);
