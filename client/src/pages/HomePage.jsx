import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Clock,
  Scissors,
  Star,
  CheckCircle2,
  MessageCircle,
  Phone,
  ChevronRight
} from 'lucide-react';
import { InstagramIcon } from '../components/Icons';
import { api } from '../api/client';
import HairstyleCard from '../components/HairstyleCard';
import ReviewCard from '../components/ReviewCard';
import BookingModal from '../components/BookingModal';

export default function HomePage() {
  const [featuredHairstyles, setFeaturedHairstyles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHairstyleId, setSelectedHairstyleId] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [hairstylesRes, reviewsRes, galleryRes] = await Promise.all([
          api.getHairstyles('?popular=true'),
          api.getApprovedReviews(),
          api.getGallery()
        ]);

        if (hairstylesRes.success) setFeaturedHairstyles(hairstylesRes.data.slice(0, 4));
        if (reviewsRes.success) setReviews(reviewsRes.data.slice(0, 3));
        if (galleryRes.success) setGalleryPreview(galleryRes.data.slice(0, 6));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleQuickBook = (hairstyle) => {
    setSelectedHairstyleId(hairstyle?._id || null);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-[#CBB3E8]/35 via-[#CBB3E8]/10 to-transparent">
        {/* Decorative background blurs */}
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#CBB3E8]/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#D4FF3F]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Highlight Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#CBB3E8] shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-[#E34234] animate-ping" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#333333]">
                  Nairobi's Premier Braiding Boutique
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#D4FF3F] text-[#333333] text-[10px] font-bold">
                  Tension-Free
                </span>
              </div>

              {/* Brand Name & Tagline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-[#333333] tracking-tight leading-[1.15] mb-5">
                Braiding with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5BA8] via-[#333333] to-[#E34234]">
                  Nkathaa
                </span>
              </h1>

              <p className="text-xl sm:text-2xl font-heading font-medium text-gray-700 italic mb-6">
                "Beautiful Braids. Professional Care."
              </p>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Elevating the African braiding experience with pain-free precision, clean scalp parting, and bespoke extensions that protect your natural hair and celebrate your crown.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Primary CTA: Tomato Red */}
                <Link
                  to="/book"
                  className="w-full sm:w-auto py-4 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-heading font-bold text-base shadow-glow-tomato transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </Link>

                {/* Secondary CTA: Lavender */}
                <Link
                  to="/hairstyles"
                  className="w-full sm:w-auto py-4 px-8 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-[#333333] font-heading font-bold text-base shadow-soft transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Explore Hairstyles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-gray-200/80 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <span className="font-heading font-bold text-2xl text-[#333333] block">100+</span>
                  <span className="text-xs text-gray-500 font-medium">Happy Clients</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-2xl text-[#333333] block">50+</span>
                  <span className="text-xs text-gray-500 font-medium">Hairstyles Done</span>
                </div>
                <div>
                  <span className="font-heading font-bold text-2xl text-[#333333] flex items-center justify-center lg:justify-start gap-1">
                    4.9 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Average Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hairstyle Showcase Image with Floating Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Hairstyle Image */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop"
                    alt="Braiding with Nkathaa signature knotless braids styling"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs uppercase tracking-widest text-[#D4FF3F] font-bold block mb-1">
                      Signature Masterpiece
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                      Luxury Boho Knotless Braids
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      Raw virgin human hair curls & seamless scalp blend
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1: Tension-free Scalp */}
                <div className="absolute -top-4 -left-4 sm:left-[-1.5rem] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-lavender/60 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-[#D4FF3F] text-[#333333] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#333333] block">100% Tension-Free</span>
                    <span className="text-[10px] text-gray-500">Zero scalp pain or bumps</span>
                  </div>
                </div>

                {/* Floating Badge 2: Certified Master Braider */}
                <div className="absolute -bottom-4 -right-4 sm:right-[-1.5rem] bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-lavender/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#CBB3E8] text-[#333333] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#333333] block">VIP Studio Care</span>
                    <span className="text-[10px] text-gray-500">Kilimani, Nairobi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED HAIRSTYLES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#CBB3E8]/30 text-[#333333] text-xs font-bold uppercase tracking-wider mb-2">
                Popular Signatures
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
                Featured Braiding Styles
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-lg">
                Explore our most-requested hairstyles. Crafted with gentle tension and premium hair fibers for flawless durability.
              </p>
            </div>
            <Link
              to="/hairstyles"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#333333] hover:text-[#7C5BA8] group"
            >
              <span>View All 8+ Hairstyles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredHairstyles.map((style) => (
              <HairstyleCard
                key={style._id}
                hairstyle={style}
                onQuickBook={handleQuickBook}
              />
            ))}
          </div>

          {/* Interactive AI Matcher Teaser */}
          <div className="mt-14 bg-gradient-to-r from-[#CBB3E8]/30 via-white to-[#D4FF3F]/30 p-8 rounded-3xl border border-lavender/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4FF3F] text-[#333333] flex items-center justify-center font-bold shadow-sm shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#333333]">
                  Not sure which style matches your face shape?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Use our AI Hairstyle Matcher to find the ideal protective braid for your lifestyle and hairline.
                </p>
              </div>
            </div>
            <Link
              to="/ai-stylist"
              className="px-6 py-3 rounded-full bg-[#333333] hover:bg-black text-white font-semibold text-xs shrink-0 shadow-md transition-all flex items-center gap-2"
            >
              <span>Take 60-Sec AI Quiz</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4FF3F] text-[#333333] text-xs font-bold uppercase tracking-wider mb-2">
              The Nkathaa Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
              Why Queens Choose Us
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              We reimagined hair braiding as an indulgent self-care ritual without pain, rush, or scalp irritation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scissors,
                title: 'Professional Styling',
                desc: 'Mastery in razor-clean stitch parting, uniform thickness, and precision density tailored to your natural hairline.'
              },
              {
                icon: Sparkles,
                title: 'Quality Products',
                desc: 'Pre-stretched hypoallergenic fibers, 100% virgin human curls, and organic rosemary scalp hydration.'
              },
              {
                icon: Calendar,
                title: 'Convenient Booking',
                desc: 'Live 24/7 online booking, zero double booking, instant slot confirmation, and seamless M-Pesa deposit handling.'
              },
              {
                icon: Heart,
                title: 'Personalized Service',
                desc: 'Private studio appointment with bespoke refreshment, Netflix entertainment, and gentle tension-free hands.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 shadow-soft border border-gray-100 hover:border-[#CBB3E8] transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#CBB3E8]/30 text-[#333333] flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#333333] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATISTICS */}
      <section className="py-16 bg-[#CBB3E8]/25 border-y border-lavender/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#333333] block mb-1">
                100+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Happy Clients
              </span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#333333] block mb-1">
                50+
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Hairstyles Completed
              </span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#333333] block mb-1">
                100%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Flexible Booking
              </span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#333333] block mb-1">
                4.9★
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Five-Star Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4FF3F] text-[#333333] text-xs font-bold uppercase tracking-wider mb-2">
                Client Love
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
                What Our Clients Say
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Honest feedback from natural hair lovers who trust Nkathaa.
              </p>
            </div>
            <Link
              to="/reviews"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-[#333333] hover:text-[#7C5BA8] group"
            >
              <span>Read All Reviews</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-[#CBB3E8]/40 text-[#333333] text-xs font-bold uppercase tracking-wider mb-2">
              Instagram & Studio Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
              Recent Hair Artwork
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              A peek into our everyday braiding magic. Clean roots, glossy finishes, and happy crowns.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {galleryPreview.map((item) => (
              <Link
                key={item._id}
                to="/gallery"
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-200 block shadow-sm hover:shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold p-2 text-center">
                  <span>{item.category}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-[#333333] font-heading font-bold text-sm shadow-soft transition-all"
            >
              <span>Explore Full Pinterest-Style Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. QUICK CONTACT & APPOINTMENT BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#CBB3E8]/40 via-white to-[#D4FF3F]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-lavender/50 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#E34234] text-white text-xs font-bold uppercase tracking-wider mb-4">
                Now Booking for this Week
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] mb-4">
                Ready for Flawless Braids?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed">
                Skip the waiting line. Select your style, pick your date, and book your appointment online in under 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  to="/book"
                  className="w-full sm:w-auto py-4 px-10 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-heading font-bold text-base shadow-glow-tomato transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment Now</span>
                </Link>

                <a
                  href="https://wa.me/254712345678?text=Hello%20Nkathaa,%20I%20have%20a%20question%20about%20booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-4 px-8 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-[#333333] font-heading font-bold text-base shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Direct Contact Links */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 pt-6 border-t border-gray-100">
                <a href="tel:+254712345678" className="flex items-center gap-1.5 hover:text-[#333333]">
                  <Phone className="w-4 h-4 text-[#CBB3E8]" />
                  <span>+254 712 345 678</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#333333]">
                  <InstagramIcon className="w-4 h-4 text-[#D4FF3F]" />
                  <span>@braidingwithnkathaa</span>
                </a>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kilimani Studio, Nairobi</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          isOpen={bookingModalOpen}
          preselectedHairstyleId={selectedHairstyleId}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
