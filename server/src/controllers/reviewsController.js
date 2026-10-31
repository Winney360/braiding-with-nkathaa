import { Review } from '../models/Review.js';

// GET /api/reviews (Public: only approved reviews)
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    res.json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating),
      ratingBreakdown,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
};

// GET /api/reviews/all (Admin: all reviews)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
};

// POST /api/reviews (Public submit)
export const submitReview = async (req, res) => {
  try {
    const {
      customerName,
      rating,
      reviewText,
      hairstyleCategory,
      hairstyleName,
      hairstyleImage,
      customerLocation
    } = req.body;

    if (!customerName || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and review text are required'
      });
    }

    const review = new Review({
      customerName,
      rating: Number(rating),
      reviewText,
      hairstyleCategory: hairstyleCategory || 'Knotless Braids',
      hairstyleName: hairstyleName || '',
      hairstyleImage: hairstyleImage || '',
      customerLocation: customerLocation || 'Nairobi',
      isApproved: true // Auto-approved or set to true for high engagement
    });

    const saved = await review.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted successfully.',
      data: saved
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(400).json({ success: false, message: error.message || 'Error submitting review' });
  }
};

// PATCH /api/reviews/:id/approve (Admin)
export const toggleApproveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.json({
      success: true,
      message: `Review has been ${review.isApproved ? 'approved' : 'unapproved'}`,
      data: review
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ success: false, message: 'Server error updating review status' });
  }
};

// DELETE /api/reviews/:id (Admin)
export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error deleting review' });
  }
};
