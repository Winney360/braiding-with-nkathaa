const BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('nkathaa_admin_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  // If body is FormData, delete Content-Type to allow browser boundary calculation
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `API error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Hairstyles
  getHairstyles: (params = '') => apiRequest(`/api/hairstyles${params}`),
  getHairstyleById: (id) => apiRequest(`/api/hairstyles/${id}`),
  createHairstyle: (data) => apiRequest('/api/hairstyles', { method: 'POST', body: JSON.stringify(data) }),
  updateHairstyle: (id, data) => apiRequest(`/api/hairstyles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHairstyle: (id) => apiRequest(`/api/hairstyles/${id}`, { method: 'DELETE' }),

  // Bookings
  getAvailableSlots: (date) => apiRequest(`/api/bookings/available-slots?date=${encodeURIComponent(date)}`),
  createBooking: (data) => apiRequest('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: (query) => apiRequest(`/api/bookings/my-bookings?query=${encodeURIComponent(query)}`),
  getAllBookings: (params = '') => apiRequest(`/api/bookings${params}`),
  updateBookingStatus: (id, data) => apiRequest(`/api/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  simulateMpesa: (id, data) => apiRequest(`/api/bookings/${id}/mpesa-simulate`, { method: 'POST', body: JSON.stringify(data) }),
  deleteBooking: (id) => apiRequest(`/api/bookings/${id}`, { method: 'DELETE' }),

  // Reviews
  getApprovedReviews: () => apiRequest('/api/reviews'),
  getAllReviews: () => apiRequest('/api/reviews/all'),
  submitReview: (data) => apiRequest('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  toggleApproveReview: (id) => apiRequest(`/api/reviews/${id}/approve`, { method: 'PATCH' }),
  deleteReview: (id) => apiRequest(`/api/reviews/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: (category = '') => apiRequest(`/api/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  addGalleryItem: (data) => apiRequest('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
  likeGalleryItem: (id) => apiRequest(`/api/gallery/${id}/like`, { method: 'PATCH' }),
  deleteGalleryItem: (id) => apiRequest(`/api/gallery/${id}`, { method: 'DELETE' }),

  // Auth
  adminLogin: (credentials) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getAdminProfile: () => apiRequest('/api/auth/me'),

  // Analytics
  getAnalytics: () => apiRequest('/api/analytics'),

  // Coupon
  validateCoupon: (code) => apiRequest('/api/coupons/validate', { method: 'POST', body: JSON.stringify({ code }) }),

  // AI Recommendation
  getAiRecommendations: (criteria) => apiRequest('/api/ai-recommend', { method: 'POST', body: JSON.stringify(criteria) }),

  // File Upload
  uploadImage: (formData) => apiRequest('/api/upload', { method: 'POST', body: formData })
};
