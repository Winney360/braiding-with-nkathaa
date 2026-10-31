import React, { useState } from 'react';
import { Star, X, Check, Image as ImageIcon } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function WriteReviewModal({ isOpen, onClose, onReviewSubmitted }) {
  const [customerName, setCustomerName] = useState('');
  const [customerLocation, setCustomerLocation] = useState('Nairobi');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hairstyleCategory, setHairstyleCategory] = useState('Knotless Braids');
  const [hairstyleName, setHairstyleName] = useState('');
  const [hairstyleImage, setHairstyleImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) {
      error('Please fill in your name and review message');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitReview({
        customerName: customerName.trim(),
        customerLocation: customerLocation.trim(),
        rating,
        reviewText: reviewText.trim(),
        hairstyleCategory,
        hairstyleName: hairstyleName.trim() || hairstyleCategory,
        hairstyleImage: hairstyleImage.trim()
      });

      if (res.success) {
        success('Thank you! Your review has been submitted.');
        if (onReviewSubmitted) onReviewSubmitted(res.data);
        onClose();
      }
    } catch (err) {
      error(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-lavender/40 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-dark-text p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">
            Share Your Experience
          </span>
          <h3 className="font-heading font-bold text-2xl text-dark-text">
            Write a Client Review
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            How was your braiding session with Nkathaa? We love hearing your feedback!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Rating */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-dark-text ml-2">
                {rating} out of 5 stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cynthia Mwangi"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Kilimani, Nairobi"
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hairstyle Category
              </label>
              <select
                value={hairstyleCategory}
                onChange={(e) => setHairstyleCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#CBB3E8]"
              >
                <option value="Knotless Braids">Knotless Braids</option>
                <option value="Boho Braids">Boho Braids</option>
                <option value="Twists">Twists</option>
                <option value="Cornrows">Cornrows</option>
                <option value="Goddess Braids">Goddess Braids</option>
                <option value="Locs & Faux Locs">Locs & Faux Locs</option>
                <option value="Trending Styles">Trending Styles</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Style Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Medium Boho Knotless"
                value={hairstyleName}
                onChange={(e) => setHairstyleName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Your Review *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell others about the scalp comfort, styling precision, longevity, or salon ambiance..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
              Hairstyle Photo Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://... photo of your finished braids"
              value={hairstyleImage}
              onChange={(e) => setHairstyleImage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-sm shadow-glow-tomato transition-all"
            >
              {submitting ? 'Submitting Review...' : 'Post My Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
