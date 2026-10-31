import express from 'express';
import {
  getGalleryItems,
  addGalleryItem,
  likeGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryItems);
router.patch('/:id/like', likeGalleryItem);

// Admin routes
router.post('/', protectAdmin, addGalleryItem);
router.delete('/:id', protectAdmin, deleteGalleryItem);

export default router;
