import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['All', 'Knotless', 'Boho Braids', 'Twists', 'Cornrows', 'Goddess', 'Locs', 'Editorial'],
      default: 'Knotless'
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    aspectRatio: {
      type: String,
      default: 'tall' // 'tall', 'square', 'wide' for Pinterest masonry look
    },
    tags: {
      type: [String],
      default: []
    },
    likes: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
