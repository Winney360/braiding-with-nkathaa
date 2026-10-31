import React, { useState, useEffect } from 'react';
import { Heart, Maximize2, X, Sparkles, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

const GALLERY_CATEGORIES = [
  'All',
  'Knotless',
  'Boho Braids',
  'Twists',
  'Cornrows',
  'Goddess',
  'Locs',
  'Editorial'
];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);
  const [likedMap, setLikedMap] = useState({});
  const { success } = useToast();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await api.getGallery(activeCategory === 'All' ? '' : activeCategory);
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [activeCategory]);

  const handleLike = async (e, item) => {
    e.stopPropagation();
    if (likedMap[item._id]) return;

    try {
      setLikedMap(prev => ({ ...prev, [item._id]: true }));
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, likes: (i.likes || 0) + 1 } : i));
      if (previewItem && previewItem._id === item._id) {
        setPreviewItem(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
      await api.likeGalleryItem(item._id);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#CBB3E8] text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
            Inspiration Board
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#333333] tracking-tight">
            Pinterest-Style Lookbook
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Explore authentic studio results, client selfies, and creative braided artistry. Click any photo to inspect or reserve.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#CBB3E8] text-dark-text shadow-sm ring-2 ring-[#CBB3E8]'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Layout */}
        {loading ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-3xl animate-pulse"
                style={{ height: `${200 + (i % 3) * 100}px` }}
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {items.map((item) => {
              const isLiked = likedMap[item._id];
              return (
                <div
                  key={item._id}
                  onClick={() => setPreviewItem(item)}
                  className="break-inside-avoid group relative rounded-3xl overflow-hidden bg-white shadow-soft border border-gray-100 hover:border-[#CBB3E8] transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                        {item.category}
                      </span>
                      <button
                        onClick={(e) => handleLike(e, item)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          isLiked ? 'bg-[#E34234] text-white' : 'bg-black/30 hover:bg-black/50 text-white'
                        }`}
                        title="Like photo"
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-sm text-white line-clamp-1 mb-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-white/80">
                        <span>{item.likes || 0} Likes</span>
                        <span className="flex items-center gap-1 font-semibold text-[#D4FF3F]">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-soft max-w-md mx-auto">
            <p className="text-gray-500 text-sm mb-4">No gallery images found in this category.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="py-2.5 px-6 rounded-full bg-[#CBB3E8] text-dark-text font-bold text-xs"
            >
              Show All Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Image Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
            {/* Close button */}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-dark-text flex items-center justify-center shadow-md transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="md:w-3/5 bg-black flex items-center justify-center max-h-[80vh]">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>

            {/* Sidebar Details */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-white">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#CBB3E8]/30 text-dark-text text-xs font-bold uppercase tracking-wider mb-2">
                  {previewItem.category}
                </span>

                <h3 className="font-heading font-bold text-xl text-dark-text mb-2">
                  {previewItem.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={(e) => handleLike(e, previewItem)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 text-xs font-semibold transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[previewItem._id] ? 'fill-pink-600' : ''}`} />
                    <span>{previewItem.likes || 0} Likes</span>
                  </button>
                </div>

                {/* Tags */}
                {previewItem.tags && previewItem.tags.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-gray-400 block mb-1">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {previewItem.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking CTA */}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/book"
                  className="w-full py-3.5 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-heading font-bold text-xs text-center shadow-glow-tomato transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Similar Style</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
