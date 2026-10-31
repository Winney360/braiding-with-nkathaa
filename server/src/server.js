import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

import hairstylesRouter from './routes/hairstylesRouter.js';
import bookingsRouter from './routes/bookingsRouter.js';
import reviewsRouter from './routes/reviewsRouter.js';
import galleryRouter from './routes/galleryRouter.js';
import authRouter from './routes/authRouter.js';
import analyticsRouter from './routes/analyticsRouter.js';
import couponRouter from './routes/couponRouter.js';
import aiRecommendationRouter from './routes/aiRecommendationRouter.js';
import uploadRouter from './routes/uploadRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded media
const uploadDir = path.resolve('uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/hairstyles', hairstylesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/auth', authRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/ai-recommend', aiRecommendationRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Braiding with Nkathaa',
    tagline: 'Beautiful Braids. Professional Care.',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server and connect to DB
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(` ✨ Braiding with Nkathaa API Server running on port ${PORT}`);
      console.log(` 💅 Health Check: http://localhost:${PORT}/api/health`);
      console.log(` 🔐 Admin Login: admin@nkathaa.com / AdminPassword123!`);
      console.log(`==================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
