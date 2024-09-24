import express from 'express';
import { confirmRecycling } from '../controllers/recyclingController.js';
import userMiddleware from '../middleware/authMiddleware.js';
import { user } from '@nextui-org/react';
const router = express.Router();

router.route("/confirmation").post( userMiddleware,confirmRecycling);
console.log("probando");
export default router;