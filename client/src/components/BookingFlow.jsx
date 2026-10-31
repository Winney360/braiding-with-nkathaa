import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Scissors, User, Phone, Mail, Sparkles, Check, AlertCircle, MessageSquare, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import MpesaModal from './MpesaModal';

const HAIR_COLORS = [
  { label: '#1B - Natural Black (Most Popular)', color: '#1A1A1A' },
  { label: '#1 - Jet Black', color: '#000000' },
  { label: '#2 - Dark Chocolate Brown', color: '#2C1D11' },
  { label: '#4 - Medium Warm Brown', color: '#4A3324' },
  { label: '#27 - Honey Blonde', color: '#D4AF37' },
  { label: '#30 - Light Auburn Copper', color: '#8B4513' },
  { label: '#99J - Deep Wine Burgundy', color: '#660033' },
  { label: '#613 - Platinum Blonde', color: '#F5E6B3' },
  { label: 'Ombre Blend (#1B Root into #27 Ends)', color: 'linear-gradient(180deg, #1A1A1A 50%, #D4AF37 100%)' }
];

export default function BookingFlow({ preselectedHairstyleId = null, onBookingComplete }) {
  const [step, setStep] = useState(1);
  const [hairstyles, setHairstyles] = useState([]);
  const [loadingHairstyles, setLoadingHairstyles] = useState(true);

  // Form selections
  const [selectedHairstyle, setSelectedHairstyle] = useState(null);
  
  // Date selection: default tomorrow
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowString());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  // Customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredHairColor, setPreferredHairColor] = useState('#1B - Natural Black (Most Popular)');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission & Post-Booking state
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);
  const [showMpesaModal, setShowMpesaModal] = useState(false);

  const { success, error, info } = useToast();

  // Load hairstyles
  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        setLoadingHairstyles(true);
        const res = await api.getHairstyles();
        if (res.success && res.data) {
          setHairstyles(res.data);
          if (preselectedHairstyleId) {
            const match = res.data.find(h => h._id === preselectedHairstyleId || h.slug === preselectedHairstyleId);
            if (match) {
              setSelectedHairstyle(match);
              // advance directly to date selection
              setStep(2);
            }
          }
        }
      } catch (err) {
        error('Failed to load hairstyles');
      } finally {
        setLoadingHairstyles(false);
      }
    };
    fetchHairstyles();
  }, [preselectedHairstyleId]);

  // Load available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setSelectedTimeSlot('');
        const res = await api.getAvailableSlots(selectedDate);
        if (res.success && res.slots) {
          setAvailableSlots(res.slots);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);

  // Validate coupon
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || couponCode.trim() === '') return;

    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(couponCode.trim());
      if (res.success) {
        setCouponApplied(res.data);
        success(`Coupon ${res.data.code} applied! -${res.data.discountPercent}%`);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponApplied(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Pricing calculations
  const originalPrice = selectedHairstyle?.price || 0;
  const discountAmount = couponApplied ? (originalPrice * couponApplied.discountPercent) / 100 : 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const depositAmount = Math.min(1000, finalPrice);

  // Submit appointment
  const handleCompleteBooking = async (e) => {
    e.preventDefault();

    if (!selectedHairstyle) {
      error('Please select a hairstyle');
      setStep(1);
      return;
    }
    if (!selectedDate || !selectedTimeSlot) {
      error('Please select an appointment date and available time slot');
      setStep(2);
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      error('Please complete all contact information');
      return;
    }

    try {
      setSubmitting(true);
      const bookingPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        hairstyleId: selectedHairstyle._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        preferredHairColor,
        additionalNotes: additionalNotes.trim(),
        couponCode: couponApplied ? couponApplied.code : ''
      };

      const res = await api.createBooking(bookingPayload);
      if (res.success && res.data) {
        setBookingSuccessData(res.data);
        setStep(4); // Success step
        success('Your appointment request has been received. We will contact you shortly.');

        // Trigger celebration confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (onBookingComplete) {
          onBookingComplete(res.data);
        }
      }
    } catch (err) {
      if (err.status === 409) {
        error(err.message || 'This slot was just taken. Please choose another slot.');
        setStep(2);
      } else {
        error(err.message || 'Booking submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-soft border border-lavender/40 max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-0 -translate-y-1/2" />
          {[
            { num: 1, label: 'Hairstyle' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Your Details' },
            { num: 4, label: 'Confirmed' }
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all ${
                  step >= item.num
                    ? 'bg-[#CBB3E8] text-[#333333] shadow-md border-2 border-white'
                    : 'bg-gray-100 text-gray-400 border-2 border-white'
                }`}
              >
                {step > item.num ? <Check className="w-4 h-4 text-[#333333]" /> : item.num}
              </div>
              <span className="text-[11px] font-medium text-gray-500 mt-1.5 hidden sm:block">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: HAIRSTYLE SELECTION */}
      {step === 1 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-[#333333]">
              1. Choose Your Preferred Hairstyle
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select the style you want for your appointment. Prices include basic accessories and styling.
            </p>
          </div>

          {loadingHairstyles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {hairstyles.map((style) => {
                const isSelected = selectedHairstyle?._id === style._id;
                return (
                  <div
                    key={style._id}
                    onClick={() => setSelectedHairstyle(style)}
                    className={`cursor-pointer rounded-2xl p-3 border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#CBB3E8] bg-[#CBB3E8]/10 shadow-md ring-2 ring-[#CBB3E8]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={style.images?.[0] || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=300'}
                        alt={style.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-semibold text-gray-500 block truncate">
                          {style.category}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-[#333333] truncate">
                          {style.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <span className="font-semibold text-[#333333]">
                            KES {style.price?.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] truncate">{style.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                if (!selectedHairstyle) {
                  error('Please click on a hairstyle to select it');
                  return;
                }
                setStep(2);
              }}
              disabled={!selectedHairstyle}
              className="py-3 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-medium text-sm shadow-glow-tomato disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Continue to Date & Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SELECTION */}
      {step === 2 && (
        <div className="animate-in fade-in duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-[#333333]">
              2. Select Date & Available Time Slot
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Double booking is prevented. Only available slots can be chosen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Date Picker */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#CBB3E8]" />
                Appointment Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#CBB3E8]"
              />
              <p className="text-[11px] text-gray-500 mt-2">
                Salon hours: Monday through Saturday from 8:00 AM to 7:00 PM.
              </p>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#CBB3E8]" />
                Available Slots on {selectedDate}
              </label>

              {loadingSlots ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                          !slot.isAvailable
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#D4FF3F] text-[#333333] border-[#B7E422] shadow-sm'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-[#333333]'
                        }`}
                      >
                        <span>{slot.time}</span>
                        {!slot.isAvailable ? (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-500 font-bold no-underline">
                            Booked
                          </span>
                        ) : isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#333333]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-2.5 px-5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={!selectedTimeSlot}
              onClick={() => {
                if (!selectedTimeSlot) {
                  error('Please choose a time slot');
                  return;
                }
                setStep(3);
              }}
              className="py-3 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-medium text-sm shadow-glow-tomato disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Continue to Client Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS & REVIEW */}
      {step === 3 && (
        <form onSubmit={handleCompleteBooking} className="animate-in fade-in duration-300">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-bold text-[#333333]">
              3. Client Information & Customization
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Almost done! Enter your contact details and hair preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanessa Mutua"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 712 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vanessa@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>
              </div>

              {/* Preferred Hair Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-gray-400" />
                  Preferred Braid / Extension Color
                </label>
                <select
                  value={preferredHairColor}
                  onChange={(e) => setPreferredHairColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#CBB3E8]"
                >
                  {HAIR_COLORS.map((col) => (
                    <option key={col.label} value={col.label}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                  Special Notes or Scalp Sensitivity
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Sensitive hairline, bringing my own human curls, extra long length desired..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4FF3F]" />
                  Discount Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'FIRST10' or 'NKATHAAVIP'"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 uppercase font-mono text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode}
                    className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-[#CBB3E8] text-xs font-semibold text-dark-text transition-colors"
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-tomato mt-1">{couponError}</p>}
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Code {couponApplied.code} active ({couponApplied.discountPercent}% off)!
                  </p>
                )}
              </div>
            </div>

            {/* Appointment Summary Card */}
            <div className="bg-[#CBB3E8]/15 rounded-2xl p-5 border border-lavender/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-2">
                  Booking Summary
                </span>
                <h4 className="font-heading font-bold text-base text-[#333333] mb-1">
                  {selectedHairstyle?.name}
                </h4>
                <p className="text-xs text-gray-600 mb-4">
                  {selectedHairstyle?.category} • {selectedHairstyle?.duration}
                </p>

                <div className="border-t border-b border-lavender/40 py-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold text-dark-text">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold text-dark-text">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Price:</span>
                    <span className="font-medium">KES {originalPrice?.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount:</span>
                      <span>- KES {discountAmount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-dark-text pt-1">
                    <span>Total Style Cost:</span>
                    <span>KES {finalPrice?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-white/80 border border-lavender/60 text-xs">
                  <div className="flex justify-between font-bold text-emerald-800 mb-0.5">
                    <span>Deposit Due:</span>
                    <span>KES {depositAmount?.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Remaining balance paid at studio via M-Pesa or Cash.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-sm shadow-glow-tomato transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'Confirming Appointment...' : 'Request Appointment'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-2.5 px-5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Time Slots</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION & M-PESA DEPOSIT */}
      {step === 4 && bookingSuccessData && (
        <div className="text-center py-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 rounded-full bg-[#D4FF3F] text-dark-text flex items-center justify-center mx-auto mb-5 shadow-glow-chartreuse">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Appointment Booked
          </span>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#333333] mb-3">
            Your appointment request has been received.
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-8 leading-relaxed">
            We will contact you shortly to confirm your booking and send appointment preparation guidelines.
          </p>

          {/* Booking Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-6 max-w-md mx-auto text-left mb-8 border border-gray-200 text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Client:</span>
              <span className="font-bold text-dark-text">{bookingSuccessData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hairstyle:</span>
              <span className="font-bold text-[#333333]">{bookingSuccessData.hairstyleName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Slot:</span>
              <span className="font-semibold text-dark-text">{bookingSuccessData.date} at {bookingSuccessData.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hair Color:</span>
              <span>{bookingSuccessData.preferredHairColor}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <span>Deposit Required:</span>
              <span className="text-emerald-700">KES {bookingSuccessData.depositAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action CTAs: M-Pesa STK push & WhatsApp direct chat */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => setShowMpesaModal(true)}
              className="flex-1 py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Deposit with M-Pesa</span>
            </button>

            <a
              href={`https://wa.me/254712345678?text=${encodeURIComponent(
                `Hello Nkathaa, I just booked an appointment for ${bookingSuccessData.hairstyleName} on ${bookingSuccessData.date} at ${bookingSuccessData.timeSlot}. My name is ${bookingSuccessData.customerName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-dark-text font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={() => {
                setStep(1);
                setSelectedHairstyle(null);
                setBookingSuccessData(null);
              }}
              className="text-xs text-gray-500 hover:text-dark-text underline"
            >
              Book another appointment
            </button>
          </div>
        </div>
      )}

      {/* M-Pesa STK Push Simulation Modal */}
      {showMpesaModal && bookingSuccessData && (
        <MpesaModal
          booking={bookingSuccessData}
          isOpen={showMpesaModal}
          onClose={() => setShowMpesaModal(false)}
          onPaymentSuccess={(updated) => {
            setBookingSuccessData((prev) => ({
              ...prev,
              status: 'Confirmed',
              depositPaid: true,
              paymentStatus: 'Deposit_Paid'
            }));
          }}
        />
      )}
    </div>
  );
}
