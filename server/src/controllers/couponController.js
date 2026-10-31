import { Coupon } from '../models/Coupon.js';

// POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired promotional code' });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'This promo code has reached its usage limit' });
    }

    res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied! You get ${coupon.discountPercent}% off`,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ success: false, message: 'Server error validating coupon' });
  }
};

// GET /api/coupons (Admin)
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
};
