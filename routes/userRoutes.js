import express from 'express';
import { login, register } from '../controllers/userControllers.js';
import { validateLogin } from '../middleware/loginValidationMiddleware.js';
import { validateRegister } from '../middleware/registerValidationMiddleware.js';

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);



export default router;

