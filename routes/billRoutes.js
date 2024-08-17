import express from 'express';
import { protect, restrictTo } from '../middleware/protect.js';
import {
  getAllBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
} from '../controllers/billController.js';
import { airtimeTopUp } from '../controllers/airtimeController.js';
import verifyPayment from '../middleware/verifyPayment.js';
import validateBillsTransaction from '../middleware/validateBillsTransaction.js';
import { dataBundlePurchase } from '../controllers/dataBundleController.js';
import { verifyCustomerId } from '../controllers/verifyCustomerIdController.js';
import { cableTvSubscription } from '../controllers/cableTvController.js';
import { electricityBillPayment } from '../controllers/electricityController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Bill payment routes
router.route('/').get(getAllBills).post(restrictTo('admin'), createBill);

router
  .route('/:id')
  .get(getBill)
  .patch(restrictTo('admin'), updateBill)
  .delete(restrictTo('admin'), deleteBill);

router.post(
  '/airtime-top-up',
  verifyPayment,
  airtimeTopUp,
  validateBillsTransaction
);

router.post(
  '/data-bundle-purchase',
  verifyPayment,
  dataBundlePurchase,
  validateBillsTransaction
);

router.post(
  '/cableTv-subscription',
  verifyPayment,
  cableTvSubscription,
  validateBillsTransaction
);

router.post(
  '/electricity-bill-payment',
  verifyPayment,
  electricityBillPayment,
  validateBillsTransaction
);

router.post('/verify-customerid', verifyCustomerId);

export default router;
