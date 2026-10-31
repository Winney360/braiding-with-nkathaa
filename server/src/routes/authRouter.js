import express from 'express';
import { adminLogin, getAdminProfile } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', protectAdmin, getAdminProfile);

export default router;
