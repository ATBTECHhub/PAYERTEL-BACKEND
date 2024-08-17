import crypto from 'crypto';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { createTransaction } from './transactionController.js';
import { fetchBillInfo } from '../utils/fetchBillInfo.js';

// Function to get the user's wallet balance
export const getUserWallet = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select('wallet');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      wallet: user.wallet,
    },
  });
});

// Function to credit the user's wallet
export const creditUserWallet = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { amount } = req.verifiedPayment;

  if (!amount || amount <= 0) {
    return next(new AppError('Please provide a valid amount', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.adjustWalletBalance(amount, 'credit');

  await user.save({ validateBeforeSave: false });
  console.log(user, amount);

  const type = req.verifiedPayment.type
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const transaction = await createTransaction({
    user: userId,
    serviceProvider: 'Wallet',
    transactionName: `Fund Wallet - ${type}`,
    transactionType: 'Fund Wallet',
    category: 'wallet',
    amount: req.verifiedPayment.amount,
    status: 'successful',
    customerId: user.phone,
    accountName: user.name,
    paymentDetails: req.verifiedPayment,
  });

  res.status(200).json({
    status: 'success',
    message: 'Wallet credited successfully',
    data: {
      transaction,
    },
  });
});

// Function to debit the user's wallet
export const debitUserWallet = catchAsync(async (req, res, next) => {
  const { itemCode, billerCode, category } = req.body;
  const userId = req.user.id;

  const billInfo = await fetchBillInfo(itemCode, billerCode, category);

  if (!billInfo) {
    return next(new AppError('Invalid bill information', 400));
  }
  // Check if amount is provided and valid. If not, use the bill amount instead.
  const amount = billInfo.amount > 0 ? billInfo.amount : req.body?.amount;

  if (!amount || amount <= 0) {
    return next(new AppError('Please provide a valid amount', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.wallet.balance < amount) {
    return next(new AppError('Insufficient wallet balance', 400));
  }

  // Deduct from wallet balance
  user.adjustWalletBalance(amount, 'debit');
  await user.save({ validateBeforeSave: false });

  // Generate paymentDetails object
  const paymentDetails = {
    id: crypto.randomBytes(16).toString('hex'),
    amount: amount,
    type: 'wallet',
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  req.verifiedPayment = paymentDetails;
  next();
});
