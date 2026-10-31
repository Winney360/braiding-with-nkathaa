import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Scissors, ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function HairstyleCard({ hairstyle, onQuickBook }) {
  if (!hairstyle) return null;

  const {
    _id,
    name,
    category,
    price,
    duration,
    hairLengthRequired,
    shortDescription,
    images = [],
    isPopular,
    isTrending
  } = hairstyle;

  const displayImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 hover:border-[#CBB3E8] hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image container */}
      <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#333333] text-xs font-semibold shadow-sm">
            {category}
          </span>
          {isPopular && (
            <span className="px-2.5 py-1 rounded-full bg-[#D4FF3F] text-[#333333] text-xs font-bold shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#333333]" />
              Popular
            </span>
          )}
          {isTrending && (
            <span className="px-2.5 py-1 rounded-full bg-[#E34234] text-white text-xs font-bold shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
          <span className="text-xs text-gray-500 font-medium mr-1">from</span>
          <span className="text-sm font-heading font-extrabold text-[#333333]">
            KES {price?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg sm:text-xl text-[#333333] mb-2 group-hover:text-[#7C5BA8] transition-colors">
            <Link to={`/hairstyles/${_id}`}>{name}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {shortDescription}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-xs text-gray-500 mb-5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#CBB3E8]" />
              <span className="truncate">{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#D4FF3F]" />
              <span className="truncate">{hairLengthRequired}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Link
            to={`/hairstyles/${_id}`}
            className="flex-1 py-2.5 px-3 rounded-full bg-[#CBB3E8]/30 hover:bg-[#CBB3E8] text-[#333333] font-medium text-xs text-center transition-all flex items-center justify-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              if (onQuickBook) {
                onQuickBook(hairstyle);
              } else {
                window.location.href = `/book?hairstyleId=${_id}`;
              }
            }}
            className="flex-1 py-2.5 px-3 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-medium text-xs shadow-glow-tomato transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
