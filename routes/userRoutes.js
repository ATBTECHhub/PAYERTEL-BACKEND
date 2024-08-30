import express from 'express';
import {
  getMe,
  updateMe,
  deleteMe,
  getUser,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  getUserWallet,
  creditUserWallet,
} from '../controllers/userWalletController.js';
import { protect, restrictTo } from '../middleware/protect.js';
import verifyPayment from '../middleware/verifyPayment.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// User routes
router.get('/me', getMe);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// Wallet routes
router.get('/wallet', getUserWallet);
router.post('/wallet/fund', verifyPayment, creditUserWallet);

// Admin routes
router.use(restrictTo('SuperAdmin'));

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
