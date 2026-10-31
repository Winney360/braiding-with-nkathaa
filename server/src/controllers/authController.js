import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

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

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        message: 'Welcome back, Nkathaa!',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id)
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
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
