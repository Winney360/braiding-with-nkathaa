import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectAdmin, getDashboardAnalytics);

export default router;
