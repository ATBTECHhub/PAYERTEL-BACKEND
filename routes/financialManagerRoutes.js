import express from 'express';
import { financialManagerAuth } from '../middleware/adminAuth.js';
import {
  getAllUsers,
  getUserById,
  viewAllTransactions,
  processRefund,
  approveOrFlagTransaction,
  generateFinancialReport,
} from '../controllers/financialManagerController.js';
const router = express.Router();

router.get('/users', financialManagerAuth, getAllUsers);
router.get('/users/:id', financialManagerAuth, getUserById);
router.get('/transactions', financialManagerAuth, viewAllTransactions);
router.post('/transactions/approve',financialManagerAuth,approveOrFlagTransaction);
router.post('/transactions/refund', financialManagerAuth, processRefund);
router.get('/reports/financial', financialManagerAuth, generateFinancialReport);


export default router;