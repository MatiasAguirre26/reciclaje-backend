import express from 'express';
import { searchUser, addPoints } from '../controllers/adminController.js';
import userMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/search-user', userMiddleware, searchUser);
router.post('/add-points', userMiddleware, addPoints);

export default router;