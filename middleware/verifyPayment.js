import axios from 'axios';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import Transaction from '../models/transactionModel.js';
import { debitUserWallet } from '../controllers/userWalletController.js';

// Helper function to verify payment with Flutterwave
const verifyPaymentWithFlutterwave = async paymentId => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${paymentId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_TEST_KEY}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status === 'success' && data.status === 'successful') {
      return data;
    } else {
      throw new AppError('Payment verification failed. Please try again.', 400);
    }
  } catch (error) {
    // Handle potential errors from the API request
    if (error.response && error.response.data) {
      throw new AppError(
        error.response.data.message || 'Payment verification failed.',
        400
      );
    }
    throw new AppError('An error occurred during payment verification.', 500);
  }
};

// Middleware to verify payment
const verifyPayment = catchAsync(async (req, res, next) => {
  const { paymentId, paymentType } = req.body;

  const validPaymentTypes = ['wallet', 'other'];

  if (!validPaymentTypes.includes(paymentType.toLowerCase())) {
    return next(
      new AppError(
        'Payment type is required and must be either "wallet" or "other".',
        400
      )
    );
  }

  if (paymentType === 'wallet') {
    // Perform wallet deduction for the payment
    await debitUserWallet(req, res, next);
    return;
  }

  // Check if value has already been received for the provided paymentId
  const existingTransaction = await Transaction.findOne({
    'paymentDetails.id': parseInt(paymentId, 10),
  });

  // If the value has already been received, return an error
  if (existingTransaction && existingTransaction.status === 'successful') {
    return next(
      new AppError('Value has already been received for this paymentId.', 400)
    );
  }

  // Verify the payment with Flutterwave
  const paymentDetails = await verifyPaymentWithFlutterwave(paymentId);

  req.verifiedPayment = {
    id: paymentDetails.id,
    amount: paymentDetails.amount,
    type: paymentDetails.payment_type,
    status: paymentDetails.status,
    createdAt: paymentDetails.created_at,
  };

  // Proceed to the next middleware or controller
  next();
});

export default verifyPayment;
