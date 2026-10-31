import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Scissors,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowLeft,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import HairstyleCard from '../components/HairstyleCard';
import BookingModal from '../components/BookingModal';

export default function HairstyleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [hairstyle, setHairstyle] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setActiveImageIndex(0);
        const res = await api.getHairstyleById(id);
        if (res.success && res.data) {
          setHairstyle(res.data);
          if (res.related) setRelated(res.related);
        }
      } catch (err) {
        console.error('Error fetching hairstyle details:', err);
        error('Hairstyle not found');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${hairstyle?.name} | Braiding with Nkathaa`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
          <div className="lg:col-span-7 aspect-square bg-gray-200 rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!hairstyle) {
    return (
      <div className="pt-36 pb-20 min-h-screen text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-heading font-bold text-dark-text mb-4">Hairstyle Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">The style you are looking for is unavailable or has moved.</p>
        <Link to="/hairstyles" className="py-3 px-6 rounded-full bg-[#CBB3E8] text-dark-text font-bold text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = hairstyle.images && hairstyle.images.length > 0
    ? hairstyle.images
    : ['https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000'];

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/hairstyles')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-dark-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Hairstyles</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Share Style"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Top Section: Gallery & Primary Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7">
            {/* Main Image */}
            <div className="relative aspect-[4/3] sm:aspect-[1/1] rounded-3xl overflow-hidden bg-gray-100 shadow-soft border border-gray-100 mb-4">
              <img
                src={images[activeImageIndex]}
                alt={`${hairstyle.name} photo ${activeImageIndex + 1}`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-dark-text text-xs font-bold shadow-sm">
                  {hairstyle.category}
                </span>
                {hairstyle.isPopular && (
                  <span className="px-3 py-1 rounded-full bg-[#D4FF3F] text-dark-text text-xs font-bold shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-dark-text" />
                    Popular
                  </span>
                )}
                {hairstyle.isTrending && (
                  <span className="px-3 py-1 rounded-full bg-[#E34234] text-white text-xs font-bold shadow-sm flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Trending
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Swatch */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#CBB3E8] ring-2 ring-[#CBB3E8] scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Pricing Card */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-lavender/40">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#7C5BA8] block mb-2">
                {hairstyle.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333] mb-3">
                {hairstyle.name}
              </h1>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl sm:text-4xl font-heading font-extrabold text-[#333333]">
                  KES {hairstyle.price?.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 font-medium">Standard all-inclusive installation</span>
              </div>

              {/* Key Specs Matrix */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Clock className="w-4 h-4 text-[#CBB3E8]" />
                    <span>Duration</span>
                  </div>
                  <span className="font-heading font-bold text-sm text-[#333333] block">
                    {hairstyle.duration}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Scissors className="w-4 h-4 text-[#D4FF3F]" />
                    <span>Hair Length</span>
                  </div>
                  <span className="font-heading font-bold text-sm text-[#333333] block truncate">
                    {hairstyle.hairLengthRequired}
                  </span>
                </div>
              </div>

              {/* Short summary */}
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                {hairstyle.shortDescription}
              </p>

              {/* Booking CTA Button (Tomato Red) */}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full py-4 px-8 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-heading font-bold text-base shadow-glow-tomato transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
              >
                <Calendar className="w-5 h-5" />
                <span>Book This Style</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tension-free guarantee • Deposit refundable 48h prior</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Care Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Full Description & Maintenance */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-[#333333] mb-4">
                About This Hairstyle
              </h2>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                {hairstyle.description}
              </div>
            </div>

            {/* Maintenance Instructions */}
            {hairstyle.maintenanceTips && hairstyle.maintenanceTips.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#7C5BA8] block mb-1">
                  Longevity & Care
                </span>
                <h3 className="text-xl font-heading font-bold text-[#333333] mb-4">
                  Maintenance Instructions
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  {hairstyle.maintenanceTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#D4FF3F] text-[#333333] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
              <h3 className="text-xl font-heading font-bold text-[#333333] mb-4">
                Frequently Asked Questions
              </h3>

              {hairstyle.faqs && hairstyle.faqs.length > 0 ? (
                <div className="space-y-3">
                  {hairstyle.faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={index}
                        className="rounded-2xl border border-gray-100 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                          className="w-full p-4 text-left font-heading font-semibold text-xs sm:text-sm text-dark-text flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#7C5BA8] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/50">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Contact us if you have any questions about this style.</p>
              )}
            </div>
          </div>
        </div>

        {/* Related Hairstyles */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  More in {hairstyle.category}
                </span>
                <h3 className="text-2xl font-heading font-bold text-dark-text">
                  You Might Also Like
                </h3>
              </div>
              <Link to="/hairstyles" className="text-xs font-bold text-dark-text hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <HairstyleCard
                  key={rel._id}
                  hairstyle={rel}
                  onQuickBook={() => {
                    navigate(`/hairstyles/${rel._id}`);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          isOpen={bookingModalOpen}
          preselectedHairstyleId={hairstyle._id}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
