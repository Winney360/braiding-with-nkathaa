import express from 'express';
import {
  getHairstyles,
  getHairstyleById,
  createHairstyle,
  updateHairstyle,
  deleteHairstyle
} from '../controllers/hairstylesController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHairstyles);
router.get('/:id', getHairstyleById);
router.post('/', protectAdmin, createHairstyle);
router.put('/:id', protectAdmin, updateHairstyle);
router.delete('/:id', protectAdmin, deleteHairstyle);

export default router;
