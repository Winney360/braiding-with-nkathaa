import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'nkathaa_luxury_braiding_jwt_secret_key_2026_987654321',
    { expiresIn: '30d' }
  );
};

// POST /api/auth/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Welcome back, Nkathaa!',
      data: {
        id: user.id,
        _id: user.id, // For backwards compatibility
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
      }
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// GET /api/auth/me
export const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.admin
  });
};
