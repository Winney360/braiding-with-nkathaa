import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nkathaa_luxury_braiding_jwt_secret_key_2026_987654321'
      );

      const admin = await AdminUser.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized, admin not found' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
