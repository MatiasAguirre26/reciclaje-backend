import express from 'express';
import { getPendingTransactionsForUser, confirmTransaction } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();


router.use(authMiddleware);
router.use(adminMiddleware);


router.get('/users/:userId/pending-transactions', getPendingTransactionsForUser);


router.post('/transactions/:transactionId/confirm', confirmTransaction);

export default router;
