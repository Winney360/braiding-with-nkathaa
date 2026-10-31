import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, SlidersHorizontal, Flame, X } from 'lucide-react';
import { api } from '../api/client';
import HairstyleCard from '../components/HairstyleCard';
import BookingModal from '../components/BookingModal';

const CATEGORIES = [
  'All',
  'Knotless Braids',
  'Boho Braids',
  'Twists',
  'Cornrows',
  'Goddess Braids',
  'Locs & Faux Locs',
  'Trending Styles'
];

export default function HairstylesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState('All');
  const [durationFilter, setDurationFilter] = useState('All');
  const [onlyTrending, setOnlyTrending] = useState(searchParams.get('trending') === 'true');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedHairstyleId, setSelectedHairstyleId] = useState(null);

  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        setLoading(true);
        let queryParams = [];

        if (searchTerm.trim()) queryParams.push(`search=${encodeURIComponent(searchTerm.trim())}`);
        if (selectedCategory && selectedCategory !== 'All') queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
        if (onlyTrending) queryParams.push(`trending=true`);
        if (onlyPopular) queryParams.push(`popular=true`);
        if (sortBy) queryParams.push(`sort=${sortBy}`);

        if (priceRange === 'under_4000') {
          queryParams.push('maxPrice=4000');
        } else if (priceRange === '4000_5500') {
          queryParams.push('minPrice=4000');
          queryParams.push('maxPrice=5500');
        } else if (priceRange === 'above_5500') {
          queryParams.push('minPrice=5500');
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const res = await api.getHairstyles(queryString);

        if (res.success) {
          let list = res.data;

          // Client-side duration filter if selected
          if (durationFilter === 'short') {
            list = list.filter(h => (h.durationMinutes || 240) <= 210);
          } else if (durationFilter === 'medium') {
            list = list.filter(h => (h.durationMinutes || 240) > 210 && (h.durationMinutes || 240) <= 300);
          } else if (durationFilter === 'long') {
            list = list.filter(h => (h.durationMinutes || 240) > 300);
          }

          setHairstyles(list);
        }
      } catch (err) {
        console.error('Error fetching hairstyles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHairstyles();
  }, [searchTerm, selectedCategory, priceRange, durationFilter, onlyTrending, onlyPopular, sortBy]);

  const handleQuickBook = (style) => {
    setSelectedHairstyleId(style?._id);
    setBookingModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange('All');
    setDurationFilter('All');
    setOnlyTrending(false);
    setOnlyPopular(false);
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    priceRange !== 'All' ||
    durationFilter !== 'All' ||
    onlyTrending ||
    onlyPopular;

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Hairstyle Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            Discover Your Next Crown
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
            Browse knotless braids, boho twists, tribal stitch cornrows, and soft faux locs. Every style is installed with tension-free technique and premium fibers.
          </p>
        </div>

        {/* Search & Main Filter Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-lavender/40 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search styles (e.g., Knotless, Boho, Fulani, Twists)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:border-[#CBB3E8] focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-dark-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="md:col-span-3">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs font-semibold focus:outline-none focus:border-[#CBB3E8]"
              >
                <option value="All">All Price Tiers</option>
                <option value="under_4000">Under KES 4,000</option>
                <option value="4000_5500">KES 4,000 - 5,500</option>
                <option value="above_5500">Above KES 5,500</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-xs font-semibold focus:outline-none focus:border-[#CBB3E8]"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="duration">Fastest Duration</option>
              </select>
            </div>
          </div>

          {/* Category Pills & Quick Toggles */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#CBB3E8] text-[#333333] font-bold shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyTrending(!onlyTrending)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                  onlyTrending
                    ? 'bg-[#E34234] text-white shadow-glow-tomato'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setOnlyPopular(!onlyPopular)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                  onlyPopular
                    ? 'bg-[#D4FF3F] text-[#333333]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#333333]" />
                <span>Popular</span>
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-tomato hover:underline font-semibold ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count Summary */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 px-1">
          <span>
            Showing <strong>{hairstyles.length}</strong> {hairstyles.length === 1 ? 'hairstyle' : 'hairstyles'}
          </span>
          {selectedCategory !== 'All' && (
            <span>Filtered by category: <strong className="text-dark-text">{selectedCategory}</strong></span>
          )}
        </div>

        {/* Hairstyles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 h-96 shadow-soft animate-pulse flex flex-col justify-between">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : hairstyles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hairstyles.map((style) => (
              <HairstyleCard
                key={style._id}
                hairstyle={style}
                onQuickBook={handleQuickBook}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-gray-100 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#CBB3E8]/30 text-dark-text flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-dark-text mb-2">
              No matching hairstyles found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Try adjusting your search criteria or resetting filters to see our full catalogue.
            </p>
            <button
              onClick={handleClearFilters}
              className="py-2.5 px-6 rounded-full bg-[#CBB3E8] hover:bg-[#A88BD4] text-dark-text font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

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
