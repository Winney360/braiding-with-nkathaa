import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function ReviewCard({ review }) {
  if (!review) return null;

  const {
    customerName,
    rating = 5,
    reviewText,
    hairstyleCategory,
    hairstyleName,
    hairstyleImage,
    customerLocation,
    createdAt
  } = review;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Client';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-gray-100 hover:border-[#CBB3E8] transition-all flex flex-col justify-between h-full relative">
      <div>
        {/* Star Rating and Quote mark */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-dark-text ml-1.5">{rating}.0</span>
          </div>

          <Quote className="w-6 h-6 text-[#CBB3E8]/50" />
        </div>

        {/* Hairstyle Tag */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 rounded-full bg-[#CBB3E8]/25 text-[#333333] text-[11px] font-semibold">
            {hairstyleName || hairstyleCategory || 'Knotless Braids'}
          </span>
        </div>

        {/* Review text */}
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic mb-6">
          "{reviewText}"
        </p>
      </div>

      {/* Reviewer Details */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-dark-text text-sm">
              {customerName}
            </span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" title="Verified Customer" />
          </div>
          <span className="text-[11px] text-gray-500">
            {customerLocation || 'Nairobi'}
          </span>
        </div>

        <span className="text-[11px] text-gray-400">{formattedDate}</span>
      </div>
    </div>
  );
}
