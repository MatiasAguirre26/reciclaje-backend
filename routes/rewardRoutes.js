import express from 'express';
import {getRewards, redeemReward } from '../controllers/rewardController.js';
import userMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// obtener todas las recompensas
router.get('/', userMiddleware, getRewards);

// canjear una recompensa
//router.post('/redeem', userMiddleware, redeemReward);

export default router;

