import React from 'react';
import { X } from 'lucide-react';
import BookingFlow from './BookingFlow';

export default function BookingModal({ isOpen, onClose, preselectedHairstyleId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-8">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 rounded-full bg-white text-dark-text shadow-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        <BookingFlow
          preselectedHairstyleId={preselectedHairstyleId}
          onBookingComplete={() => {}}
        />
      </div>
    </div>
  );
}
