import express from 'express';
import { handleRecyclingQuestion } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/ask', handleRecyclingQuestion);

export default router;
