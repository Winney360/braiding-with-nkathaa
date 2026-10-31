import express from 'express';
import {
  getAvailableSlots,
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
  simulateMpesaPayment,
  deleteBooking
} from '../controllers/bookingsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/available-slots', getAvailableSlots);
router.get('/my-bookings', getMyBookings);
router.post('/', createBooking);
router.post('/:id/mpesa-simulate', simulateMpesaPayment);

// Admin protected routes
router.get('/', protectAdmin, getAllBookings);
router.patch('/:id/status', protectAdmin, updateBookingStatus);
router.delete('/:id', protectAdmin, deleteBooking);

export default router;
