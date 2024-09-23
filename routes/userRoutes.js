import express from 'express';
import userMidlleware from '../middleware/authMiddleware.js';
import {getUser} from '../controllers/userController.js';
const router = express.Router();

// Ruta para obtener los cupones disponibles
router.get('/:id/points', userMidlleware, getUser);

// Ruta para canjear un cupón

export default router;
