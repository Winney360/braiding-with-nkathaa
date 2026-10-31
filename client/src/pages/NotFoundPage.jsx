import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="pt-36 pb-24 min-h-screen flex items-center justify-center text-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-soft border border-lavender/40">
        <div className="w-16 h-16 rounded-full bg-[#CBB3E8]/30 text-dark-text flex items-center justify-center mx-auto mb-4">
          <Scissors className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
          Page Not Found
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-[#333333] mb-3">
          404 - Lost Your Parting?
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
          The page or hairstyle you were looking for doesn't exist or may have been repositioned.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato transition-all"
        >
          <span>Return Home</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
