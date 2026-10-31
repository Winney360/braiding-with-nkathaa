import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, CheckCircle, Award, Heart, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import ReviewCard from '../components/ReviewCard';
import WriteReviewModal from '../components/WriteReviewModal';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [ratingBreakdown, setRatingBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getApprovedReviews();
      if (res.success) {
        setReviews(res.data);
        setAverageRating(res.averageRating || 5.0);
        setRatingBreakdown(res.ratingBreakdown || {});
        setTotalReviews(res.count || res.data.length);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#D4FF3F] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Verified Experiences
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            Client Reviews & Testimonials
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Read authentic feedback from natural hair clients who entrust their hair crowns to Nkathaa.
          </p>
        </div>

        {/* Rating Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-lavender/40 mb-14 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Score Big Display */}
            <div className="md:col-span-5 text-center md:border-r md:border-gray-100 md:pr-8">
              <span className="text-5xl sm:text-6xl font-heading font-extrabold text-dark-text block mb-2">
                {averageRating}
              </span>
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Based on <strong>{totalReviews}</strong> verified client testimonials
              </p>

              <button
                onClick={() => setModalOpen(true)}
                className="mt-6 py-3 px-6 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Submit Your Review</span>
              </button>
            </div>

            {/* Rating Bars */}
            <div className="md:col-span-7 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingBreakdown[stars] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-gray-600 font-medium">{stars} Stars</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#CBB3E8] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev._id} review={rev} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft max-w-md mx-auto">
            <p className="text-gray-500 text-sm mb-4">No reviews yet. Be the first to leave a review!</p>
            <button
              onClick={() => setModalOpen(true)}
              className="py-3 px-6 rounded-full bg-[#E34234] text-white font-bold text-xs"
            >
              Write First Review
            </button>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <WriteReviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onReviewSubmitted={() => {
            fetchReviews();
          }}
        />
      )}
    </div>
  );
}
