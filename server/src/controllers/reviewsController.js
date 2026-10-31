import { prisma } from '../config/prisma.js';

const normalizeReview = (r) => ({
  ...r,
  _id: r.id,
  reviewText: r.comment, // Map comment to reviewText for frontend compatibility
  hairstyleImage: r.imageUrl
});

// GET /api/reviews (Approved)
export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

    const ratingBreakdown = {
      5: reviews.filter((r) => r.rating === 5).length,
      4: reviews.filter((r) => r.rating === 4).length,
      3: reviews.filter((r) => r.rating === 3).length,
      2: reviews.filter((r) => r.rating === 2).length,
      1: reviews.filter((r) => r.rating === 1).length
    };

    res.json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating),
      ratingBreakdown,
      data: reviews.map(normalizeReview)
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
};

// GET /api/reviews/all (Admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      count: reviews.length,
      data: reviews.map(normalizeReview)
    });
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
      comment,
      hairstyleCategory,
      hairstyleName,
      hairstyleImage,
      imageUrl,
      customerLocation
    } = req.body;

    const reviewContent = comment || reviewText;
    if (!customerName || !rating || !reviewContent) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and review text are required'
      });
    }

    const saved = await prisma.review.create({
      data: {
        customerName: customerName.trim(),
        customerLocation: customerLocation || 'Nairobi',
        rating: Number(rating),
        comment: reviewContent.trim(),
        hairstyleCategory: hairstyleCategory || 'Knotless Braids',
        hairstyleName: hairstyleName || '',
        imageUrl: imageUrl || hairstyleImage || null,
        isApproved: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted successfully.',
      data: normalizeReview(saved)
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(400).json({ success: false, message: error.message || 'Error submitting review' });
  }
};

// PATCH /api/reviews/:id/approve (Admin)
export const toggleApproveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: !review.isApproved }
    });

    res.json({
      success: true,
      message: `Review has been ${updated.isApproved ? 'approved' : 'unapproved'}`,
      data: normalizeReview(updated)
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ success: false, message: 'Server error updating review status' });
  }
};

// DELETE /api/reviews/:id (Admin)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error deleting review' });
  }
};
