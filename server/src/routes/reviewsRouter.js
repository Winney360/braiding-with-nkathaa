import express from 'express';
import {
  getApprovedReviews,
  getAllReviews,
  submitReview,
  toggleApproveReview,
  deleteReview
} from '../controllers/reviewsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getApprovedReviews);
router.post('/', submitReview);

// Admin routes
router.get('/all', protectAdmin, getAllReviews);
router.patch('/:id/approve', protectAdmin, toggleApproveReview);
router.delete('/:id', protectAdmin, deleteReview);

export default router;
