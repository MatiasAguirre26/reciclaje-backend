import express from 'express';
import userMidlleware from '../middleware/authMiddleware.js';
import {getUser} from '../controllers/userController.js';
const router = express.Router();

// Ruta para obtener los puntos disponibles del usuario
router.get('/:id/points', userMidlleware, getUser);


export default router;
