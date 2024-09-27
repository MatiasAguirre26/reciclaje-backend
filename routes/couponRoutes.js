import express from 'express';
import { getCoupons, redeemCoupon } from '../controllers/couponController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCoupons);
router.post('/redeem', authMiddleware, redeemCoupon);

export default router;
