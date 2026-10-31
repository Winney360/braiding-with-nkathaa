import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const hairstyleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hairstyle name is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Knotless Braids', 'Boho Braids', 'Twists', 'Cornrows', 'Goddess Braids', 'Locs & Faux Locs', 'Trending Styles', 'Kids Styling'],
      default: 'Knotless Braids'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      default: '3 - 4 hours'
    },
    durationMinutes: {
      type: Number,
      default: 240
    },
    hairLengthRequired: {
      type: String,
      required: [true, 'Hair length requirement is required'],
      default: 'At least 3-4 inches of natural hair'
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Full description is required']
    },
    images: {
      type: [String],
      required: true,
      validate: [val => val.length > 0, 'At least one hairstyle image is required']
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    maintenanceTips: {
      type: [String],
      default: []
    },
    faqs: [faqSchema]
  },
  {
    timestamps: true
  }
);

// Pre-save slug generator
hairstyleSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

export const Hairstyle = mongoose.model('Hairstyle', hairstyleSchema);
