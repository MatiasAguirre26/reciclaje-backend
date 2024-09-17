import express from 'express';
import { getCoupons, redeemCoupon } from '../controllers/couponController.js';

const router = express.Router();

// Ruta para obtener los cupones disponibles
router.get('/', getCoupons);

// Ruta para canjear un cupón
router.post('/redeem', redeemCoupon);

export default router;
