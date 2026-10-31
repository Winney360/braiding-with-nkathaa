import express from 'express';
import { getHairstyleRecommendations } from '../controllers/aiRecommendationController.js';

const router = express.Router();

router.post('/', getHairstyleRecommendations);

export default router;
