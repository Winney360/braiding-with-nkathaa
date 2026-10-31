import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

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

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Forbidden, administrator privileges required' });
      }

      req.admin = {
        ...user,
        _id: user.id
      };
      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
