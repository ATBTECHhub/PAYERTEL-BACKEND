import express from 'express';
import { getTransactionHistory } from '../controllers/transactionController.js';
import { protect, restrictTo } from '../middleware/protect.js';

const router = express.Router();

// Authenticated users can view their own transaction history
router.get('/', protect, getTransactionHistory);

// Admins can view transaction history for a specific user by passing the userId
router.get('/:userId', protect, restrictTo('admin'), getTransactionHistory);

export default router;
