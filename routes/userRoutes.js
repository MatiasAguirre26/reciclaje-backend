import express from 'express';
import userMidlleware from '../middleware/authMiddleware.js';
import {getUser, updateUserPoints} from '../controllers/userController.js';
const router = express.Router();

// Ruta para obtener los puntos disponibles del usuario
router.get('/:id/points', userMidlleware, getUser);

// Ruta para actualizar los puntos del usuario
router.put('/:id/points', userMidlleware, updateUserPoints);

export default router;
