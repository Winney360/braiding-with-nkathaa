import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Scissors,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  LogOut,
  Search,
  Filter,
  Image as ImageIcon,
  Star,
  Check,
  RefreshCw,
  Eye,
  CreditCard
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminDashboardPage() {
  const { admin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'bookings', 'hairstyles', 'customers', 'reviews', 'gallery'
  const [loading, setLoading] = useState(true);

  // Analytics data
  const [analytics, setAnalytics] = useState(null);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Hairstyles state
  const [hairstyles, setHairstyles] = useState([]);
  const [hairstyleModalOpen, setHairstyleModalOpen] = useState(false);
  const [editingHairstyle, setEditingHairstyle] = useState(null);

  // Hairstyle Form fields
  const [hsName, setHsName] = useState('');
  const [hsCategory, setHsCategory] = useState('Knotless Braids');
  const [hsPrice, setHsPrice] = useState('');
  const [hsDuration, setHsDuration] = useState('4 - 5 hours');
  const [hsHairLength, setHsHairLength] = useState('At least 3-4 inches');
  const [hsShortDesc, setHsShortDesc] = useState('');
  const [hsDesc, setHsDesc] = useState('');
  const [hsImages, setHsImages] = useState('');
  const [hsPopular, setHsPopular] = useState(false);
  const [hsTrending, setHsTrending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);

  // Gallery state
  const [gallery, setGallery] = useState([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState('Knotless');
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galAspectRatio, setGalAspectRatio] = useState('tall');
  const [galTags, setGalTags] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Load all admin data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, bookingsRes, hairstylesRes, reviewsRes, galleryRes] = await Promise.all([
        api.getAnalytics(),
        api.getAllBookings(),
        api.getHairstyles(),
        api.getAllReviews(),
        api.getGallery()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (hairstylesRes.success) setHairstyles(hairstylesRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (galleryRes.success) setGallery(galleryRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      error('Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Handle booking status update
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const res = await api.updateBookingStatus(id, { status: newStatus });
      if (res.success) {
        success(`Appointment status updated to ${newStatus}`);
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        // refresh analytics
        const anaRes = await api.getAnalytics();
        if (anaRes.success) setAnalytics(anaRes.data);
      }
    } catch (err) {
      error(err.message || 'Error updating status');
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await api.deleteBooking(id);
      if (res.success) {
        success('Booking deleted');
        setBookings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      error(err.message || 'Error deleting booking');
    }
  };

  // Open Hairstyle Modal (Add or Edit)
  const openHairstyleModal = (style = null) => {
    if (style) {
      setEditingHairstyle(style);
      setHsName(style.name);
      setHsCategory(style.category);
      setHsPrice(style.price);
      setHsDuration(style.duration);
      setHsHairLength(style.hairLengthRequired);
      setHsShortDesc(style.shortDescription);
      setHsDesc(style.description);
      setHsImages(style.images ? style.images.join(', ') : '');
      setHsPopular(style.isPopular || false);
      setHsTrending(style.isTrending || false);
    } else {
      setEditingHairstyle(null);
      setHsName('');
      setHsCategory('Knotless Braids');
      setHsPrice('');
      setHsDuration('4 - 5 hours');
      setHsHairLength('At least 3-4 inches');
      setHsShortDesc('');
      setHsDesc('');
      setHsImages('');
      setHsPopular(false);
      setHsTrending(false);
    }
    setHairstyleModalOpen(true);
  };

  // Handle Image File Upload to backend
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(formData);
      if (res.success && res.url) {
        const fullUrl = res.url.startsWith('http') ? res.url : `${window.location.origin}${res.url}`;
        setHsImages(prev => (prev ? `${prev}, ${fullUrl}` : fullUrl));
        success('Image uploaded successfully!');
      }
    } catch (err) {
      error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Hairstyle (Create or Update)
  const handleSaveHairstyle = async (e) => {
    e.preventDefault();
    if (!hsName || !hsPrice || !hsShortDesc || !hsDesc) {
      error('Please complete all required fields');
      return;
    }

    const imagesArray = hsImages
      ? hsImages.split(',').map(s => s.trim()).filter(Boolean)
      : ['https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1000'];

    const payload = {
      name: hsName.trim(),
      category: hsCategory,
      price: Number(hsPrice),
      duration: hsDuration,
      hairLengthRequired: hsHairLength,
      shortDescription: hsShortDesc.trim(),
      description: hsDesc.trim(),
      images: imagesArray,
      isPopular: hsPopular,
      isTrending: hsTrending
    };

    try {
      if (editingHairstyle) {
        const res = await api.updateHairstyle(editingHairstyle._id, payload);
        if (res.success) {
          success('Hairstyle updated!');
          setHairstyles(prev => prev.map(h => h._id === editingHairstyle._id ? res.data : h));
        }
      } else {
        const res = await api.createHairstyle(payload);
        if (res.success) {
          success('Hairstyle created!');
          setHairstyles(prev => [res.data, ...prev]);
        }
      }
      setHairstyleModalOpen(false);
    } catch (err) {
      error(err.message || 'Error saving hairstyle');
    }
  };

  // Delete Hairstyle
  const handleDeleteHairstyle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hairstyle?')) return;
    try {
      const res = await api.deleteHairstyle(id);
      if (res.success) {
        success('Hairstyle deleted');
        setHairstyles(prev => prev.filter(h => h._id !== id));
      }
    } catch (err) {
      error(err.message || 'Error deleting hairstyle');
    }
  };

  // Toggle Review Approval
  const handleToggleApproveReview = async (id) => {
    try {
      const res = await api.toggleApproveReview(id);
      if (res.success) {
        success(res.message);
        setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: !r.isApproved } : r));
      }
    } catch (err) {
      error(err.message || 'Error updating review');
    }
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this client review permanently?')) return;
    try {
      const res = await api.deleteReview(id);
      if (res.success) {
        success('Review deleted');
        setReviews(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      error(err.message || 'Error deleting review');
    }
  };

  // Save Gallery Item
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    if (!galTitle || !galImageUrl) {
      error('Title and Image URL are required');
      return;
    }

    try {
      const tagsArray = galTags ? galTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const res = await api.addGalleryItem({
        title: galTitle.trim(),
        category: galCategory,
        imageUrl: galImageUrl.trim(),
        aspectRatio: galAspectRatio,
        tags: tagsArray
      });

      if (res.success) {
        success('Photo added to gallery!');
        setGallery(prev => [res.data, ...prev]);
        setGalleryModalOpen(false);
        setGalTitle('');
        setGalImageUrl('');
        setGalTags('');
      }
    } catch (err) {
      error(err.message || 'Error adding gallery photo');
    }
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    try {
      const res = await api.deleteGalleryItem(id);
      if (res.success) {
        success('Photo deleted from gallery');
        setGallery(prev => prev.filter(g => g._id !== id));
      }
    } catch (err) {
      error(err.message || 'Error deleting photo');
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
    const matchesSearch =
      bookingSearch === '' ||
      b.customerName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone?.includes(bookingSearch) ||
      b.hairstyleName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.date?.includes(bookingSearch);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Admin Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-lavender/50 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF3F] text-dark-text text-[10px] font-bold">
                Logged in as Admin
              </span>
              <span className="text-xs text-gray-400">Kilimani Studio Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#333333]">
              Admin Control Center
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Welcome, {admin?.name || 'Nkathaa'} • Real-time bookings, hairstyle catalog & revenue control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="py-2.5 px-5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8">
          {[
            { id: 'analytics', label: 'Analytics Overview', icon: TrendingUp },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: 'hairstyles', label: `Hairstyles (${hairstyles.length})`, icon: Scissors },
            { id: 'customers', label: `Clients (${analytics?.customers?.length || 0})`, icon: Users },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: ImageIcon }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#CBB3E8] text-dark-text shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ANALYTICS OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Bookings</span>
                  <div className="w-10 h-10 rounded-xl bg-[#CBB3E8]/30 text-dark-text flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-heading font-extrabold text-[#333333] block mb-1">
                  {analytics?.totalBookings || 0}
                </span>
                <span className="text-xs text-gray-500">
                  {analytics?.statusCounts?.Completed || 0} completed appointments
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upcoming Slots</span>
                  <div className="w-10 h-10 rounded-xl bg-[#D4FF3F]/40 text-dark-text flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-heading font-extrabold text-[#333333] block mb-1">
                  {analytics?.upcomingCount || 0}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">
                  Scheduled for upcoming days
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue Collected</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-3xl font-heading font-extrabold text-emerald-700 block mb-1">
                  KES {(analytics?.totalRevenue || 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">
                  Potential total: KES {(analytics?.potentialRevenue || 0).toLocaleString()}
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Most Booked Style</span>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <span className="text-lg font-heading font-extrabold text-[#333333] block mb-1 truncate">
                  {analytics?.mostBookedHairstyle || 'Knotless Braids'}
                </span>
                <span className="text-xs text-gray-500">
                  {analytics?.mostBookedCount || 0} clients ordered
                </span>
              </div>
            </div>

            {/* Monthly Trend Chart & Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Monthly Booking Visual Chart */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-dark-text">
                      Monthly Bookings Overview
                    </h3>
                    <p className="text-xs text-gray-500">Appointment trajectory over the past 6 months</p>
                  </div>
                </div>

                {/* Visual Bar Chart */}
                <div className="flex items-end justify-between h-56 pt-8 pb-2 border-b border-gray-100 gap-3">
                  {analytics?.monthlyTrends?.map((item, i) => {
                    const maxVal = Math.max(...(analytics.monthlyTrends.map(m => m.bookings) || [30]));
                    const barHeightPercent = Math.max(15, (item.bookings / (maxVal * 1.15)) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-bold text-dark-text opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.bookings} appts
                        </span>
                        <div
                          className="w-full max-w-[42px] bg-gradient-to-t from-[#CBB3E8] to-[#D4FF3F] rounded-t-xl group-hover:brightness-95 transition-all"
                          style={{ height: `${barHeightPercent}%` }}
                        />
                        <span className="text-[11px] font-semibold text-gray-500 mt-1 whitespace-nowrap">
                          {item.month.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-dark-text mb-1">
                    Status Breakdown
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">Current booking pipeline</p>

                  <div className="space-y-4">
                    {[
                      { label: 'Confirmed', count: analytics?.statusCounts?.Confirmed || 0, color: 'bg-emerald-500' },
                      { label: 'Pending Review', count: analytics?.statusCounts?.Pending || 0, color: 'bg-amber-400' },
                      { label: 'Completed', count: analytics?.statusCounts?.Completed || 0, color: 'bg-[#CBB3E8]' },
                      { label: 'Cancelled', count: analytics?.statusCounts?.Cancelled || 0, color: 'bg-rose-400' }
                    ].map((st) => (
                      <div key={st.label} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3 h-3 rounded-full ${st.color}`} />
                          <span className="font-medium text-gray-700">{st.label}</span>
                        </div>
                        <span className="font-bold text-dark-text">{st.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 text-xs text-gray-500">
                  <p>M-Pesa deposits automatically switch status to <strong>Confirmed</strong>.</p>
                </div>
              </div>
            </div>

            {/* Upcoming Appointments Table Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-lg text-dark-text">
                  Upcoming Appointments (Next in Queue)
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-[#7C5BA8] hover:underline"
                >
                  Manage All Bookings →
                </button>
              </div>

              {analytics?.upcomingAppointments?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Hairstyle</th>
                        <th className="pb-3">Date & Time</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Deposit</th>
                        <th className="pb-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {analytics.upcomingAppointments.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50/60">
                          <td className="py-3.5">
                            <span className="font-bold text-dark-text block">{app.customerName}</span>
                            <span className="text-[11px] text-gray-400">{app.customerPhone}</span>
                          </td>
                          <td className="py-3.5 font-medium">{app.hairstyleName}</td>
                          <td className="py-3.5">
                            <span className="block font-semibold">{app.date}</span>
                            <span className="text-gray-400">{app.timeSlot}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5">
                            {app.depositPaid ? (
                              <span className="text-emerald-700 font-bold text-[11px]">Paid</span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">Pending</span>
                            )}
                          </td>
                          <td className="py-3.5 text-right">
                            {app.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(app._id, 'Confirmed')}
                                className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No upcoming appointments scheduled yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 animate-in fade-in duration-200">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by client name, phone, or style..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-full text-xs font-semibold transition-all ${
                      bookingStatusFilter === st
                        ? 'bg-[#CBB3E8] text-dark-text shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Client Information</th>
                    <th className="pb-3">Hairstyle</th>
                    <th className="pb-3">Appointment Slot</th>
                    <th className="pb-3">Hair Color / Notes</th>
                    <th className="pb-3">Total / Deposit</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/70">
                      <td className="py-4">
                        <span className="font-bold text-dark-text block">{b.customerName}</span>
                        <a href={`tel:${b.customerPhone}`} className="text-gray-500 hover:text-dark-text block">
                          {b.customerPhone}
                        </a>
                        <span className="text-[10px] text-gray-400 block">{b.customerEmail}</span>
                      </td>

                      <td className="py-4 font-semibold text-dark-text">
                        {b.hairstyleName}
                      </td>

                      <td className="py-4">
                        <span className="font-bold block">{b.date}</span>
                        <span className="text-gray-500">{b.timeSlot}</span>
                      </td>

                      <td className="py-4 max-w-xs">
                        <span className="block text-gray-700 truncate">{b.preferredHairColor}</span>
                        {b.additionalNotes && (
                          <span className="text-[11px] text-gray-400 italic line-clamp-1">"{b.additionalNotes}"</span>
                        )}
                      </td>

                      <td className="py-4">
                        <span className="font-bold block">KES {b.totalAmount?.toLocaleString()}</span>
                        <span className={`text-[10px] font-semibold ${b.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                          Deposit: {b.depositPaid ? `Paid (${b.mpesaReference || 'M-Pesa'})` : 'Unpaid'}
                        </span>
                      </td>

                      <td className="py-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border focus:outline-none ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : b.status === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : b.status === 'Completed'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 text-right space-x-1">
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No bookings found matching current criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HAIRSTYLES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'hairstyles' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="font-heading font-bold text-xl text-dark-text">
                  Hairstyles Catalog Management
                </h3>
                <p className="text-xs text-gray-500">Add, edit pricing, upload hairstyle images, or delete styles</p>
              </div>

              <button
                onClick={() => openHairstyleModal(null)}
                className="py-2.5 px-6 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hairstyle</span>
              </button>
            </div>

            {/* Hairstyles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairstyles.map((style) => (
                <div
                  key={style._id}
                  className="rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between hover:border-[#CBB3E8] transition-all bg-white"
                >
                  <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                    <img
                      src={style.images?.[0] || 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400'}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-white/90 text-dark-text text-[10px] font-bold">
                        {style.category}
                      </span>
                      {style.isPopular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#D4FF3F] text-dark-text text-[10px] font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-base text-dark-text mb-1">
                        {style.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {style.shortDescription}
                      </p>
                      <div className="flex items-center justify-between text-xs font-semibold text-dark-text border-t border-gray-100 pt-2 mb-3">
                        <span>KES {style.price?.toLocaleString()}</span>
                        <span className="text-gray-400 font-normal">{style.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => openHairstyleModal(style)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteHairstyle(style._id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CLIENTS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-xl text-dark-text mb-1">
              Client Contact & Loyalty Directory
            </h3>
            <p className="text-xs text-gray-500 mb-6">Aggregated client history, lifetime bookings & spend</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Client Name</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Appointments</th>
                    <th className="pb-3">Total Spent</th>
                    <th className="pb-3">Last Visit</th>
                    <th className="pb-3 text-right">VIP Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics?.customers?.map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50/70">
                      <td className="py-3.5 font-bold text-dark-text">{c.name}</td>
                      <td className="py-3.5 text-gray-600">{c.phone}</td>
                      <td className="py-3.5 text-gray-500">{c._id}</td>
                      <td className="py-3.5 font-semibold">{c.totalBookings} visits</td>
                      <td className="py-3.5 font-bold text-emerald-700">KES {c.totalSpent?.toLocaleString()}</td>
                      <td className="py-3.5 text-gray-500">{c.lastBookingDate}</td>
                      <td className="py-3.5 text-right">
                        {c.totalBookings >= 3 ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#D4FF3F] text-dark-text text-[10px] font-extrabold">
                            VIP Tier
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px]">
                            Regular
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(!analytics?.customers || analytics.customers.length === 0) && (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No client records yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: REVIEWS MODERATION */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-xl text-dark-text mb-1">
              Client Testimonials Moderation
            </h3>
            <p className="text-xs text-gray-500 mb-6">Review, approve, or remove client feedback</p>

            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-[#CBB3E8] transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-sm text-dark-text">
                        {r.customerName}
                      </span>
                      <span className="text-xs text-gray-400">• {r.customerLocation || 'Nairobi'}</span>
                      <span className="text-xs font-bold text-amber-500 flex items-center">
                        ★ {r.rating}.0
                      </span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#CBB3E8]/30 text-dark-text text-[10px] font-semibold mb-2">
                      {r.hairstyleName || r.hairstyleCategory}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      "{r.reviewText}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleApproveReview(r._id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        r.isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isApproved ? 'Approved ✓' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-xs">
                  No reviews submitted yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GALLERY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-gray-100 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-heading font-bold text-xl text-dark-text">
                  Gallery Photos Management
                </h3>
                <p className="text-xs text-gray-500">Upload high-resolution client photos for the Pinterest gallery</p>
              </div>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="py-2.5 px-6 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g._id} className="relative rounded-2xl overflow-hidden aspect-[3/4] group bg-gray-100 border">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white text-xs">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                        {g.category}
                      </span>
                      <h5 className="font-bold text-xs mt-1 line-clamp-1">{g.title}</h5>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{g.likes || 0} Likes</span>
                      <button
                        onClick={() => handleDeleteGalleryItem(g._id)}
                        className="p-1 rounded bg-rose-600 text-white"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT HAIRSTYLE */}
      {/* ========================================================================= */}
      {hairstyleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading font-bold text-2xl text-dark-text mb-4">
              {editingHairstyle ? 'Edit Hairstyle' : 'Add New Hairstyle'}
            </h3>

            <form onSubmit={handleSaveHairstyle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Style Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Waist-Length French Curl Braids"
                    value={hsName}
                    onChange={(e) => setHsName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={hsCategory}
                    onChange={(e) => setHsCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#CBB3E8]"
                  >
                    <option value="Knotless Braids">Knotless Braids</option>
                    <option value="Boho Braids">Boho Braids</option>
                    <option value="Twists">Twists</option>
                    <option value="Cornrows">Cornrows</option>
                    <option value="Goddess Braids">Goddess Braids</option>
                    <option value="Locs & Faux Locs">Locs & Faux Locs</option>
                    <option value="Trending Styles">Trending Styles</option>
                    <option value="Kids Styling">Kids Styling</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    placeholder="5000"
                    value={hsPrice}
                    onChange={(e) => setHsPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="4 - 5 hours"
                    value={hsDuration}
                    onChange={(e) => setHsDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hair Length Required</label>
                  <input
                    type="text"
                    placeholder="At least 3-4 inches"
                    value={hsHairLength}
                    onChange={(e) => setHsHairLength(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description (for cards) *</label>
                <input
                  type="text"
                  required
                  placeholder="One-sentence teaser describing the styling technique and benefits..."
                  value={hsShortDesc}
                  onChange={(e) => setHsShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown of how the style is installed, extensions used, and feeling on the scalp..."
                  value={hsDesc}
                  onChange={(e) => setHsDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              {/* Image URLs & Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Image URLs (comma-separated) or Upload File
                </label>
                <input
                  type="text"
                  placeholder="https://... , https://..."
                  value={hsImages}
                  onChange={(e) => setHsImages(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8] mb-2"
                />
                <div className="flex items-center gap-3">
                  <label className="py-2 px-4 rounded-xl bg-gray-100 hover:bg-[#CBB3E8] text-xs font-bold text-dark-text cursor-pointer transition-colors">
                    <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image from Computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <span className="text-[11px] text-gray-400">JPG, PNG, WebP supported</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={hsPopular}
                    onChange={(e) => setHsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-tomato"
                  />
                  <span>Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={hsTrending}
                    onChange={(e) => setHsTrending(e.target.checked)}
                    className="w-4 h-4 rounded text-tomato"
                  />
                  <span>Mark as Trending</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setHairstyleModalOpen(false)}
                  className="py-2.5 px-5 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato"
                >
                  Save Hairstyle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPLOAD GALLERY PHOTO */}
      {/* ========================================================================= */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <h3 className="font-heading font-bold text-xl text-dark-text mb-4">
              Add Photo to Gallery
            </h3>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waist-Length Honey Blonde Boho"
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={galCategory}
                  onChange={(e) => setGalCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#CBB3E8]"
                >
                  <option value="Knotless">Knotless</option>
                  <option value="Boho Braids">Boho Braids</option>
                  <option value="Twists">Twists</option>
                  <option value="Cornrows">Cornrows</option>
                  <option value="Goddess">Goddess</option>
                  <option value="Locs">Locs</option>
                  <option value="Editorial">Editorial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={galImageUrl}
                  onChange={(e) => setGalImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="#Knotless, #Summer, #Nairobi"
                  value={galTags}
                  onChange={(e) => setGalTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#CBB3E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="py-2.5 px-5 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-full bg-[#E34234] hover:bg-[#CC3326] text-white font-bold text-xs shadow-glow-tomato"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
