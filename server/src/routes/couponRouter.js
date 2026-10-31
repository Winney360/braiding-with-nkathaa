import express from 'express';
import { validateCoupon, getCoupons } from '../controllers/couponController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/', protectAdmin, getCoupons);

export default router;
