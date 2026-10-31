import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import BookingFlow from '../components/BookingFlow';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const hairstyleId = searchParams.get('hairstyleId');

  return (
    <div className="pt-28 pb-24 min-h-screen bg-gradient-to-b from-[#CBB3E8]/20 via-[#F8F8F8] to-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#E34234] text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-glow-tomato">
            Online Booking System
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            Reserve Your Appointment
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Select your hairstyle, appointment date, and preferred time slot. Zero double bookings guaranteed.
          </p>
        </div>

        {/* Booking Container */}
        <BookingFlow preselectedHairstyleId={hairstyleId} />

        {/* Guarantees & FAQ preview */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-heading font-bold text-sm text-[#333333] mb-1">
              Double-Booking Protected
            </h4>
            <p className="text-xs text-gray-500">
              Only vacant slots can be reserved. Your reserved time is strictly yours.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
            <Sparkles className="w-6 h-6 text-[#7C5BA8] mx-auto mb-2" />
            <h4 className="font-heading font-bold text-sm text-[#333333] mb-1">
              Scalp-Friendly Promise
            </h4>
            <p className="text-xs text-gray-500">
              Zero tight tugging. Comfortable enough to sleep normally on day one.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
            <MessageCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-heading font-bold text-sm text-[#333333] mb-1">
              WhatsApp Support
            </h4>
            <p className="text-xs text-gray-500">
              Have questions prior to booking? Chat with Nkathaa directly at +254 712 345 678.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
