import crypto from 'crypto';
import axios from 'axios';
import AppError from '../utils/appError.js';
import { configDotenv } from 'dotenv';
import User from '../models/userModel.js';

configDotenv();

const initiateRefund = async req => {
  const { verifiedPayment } = req;

  try {
    if (verifiedPayment.type === 'wallet') {
      // Refund a wallet transaction
      const userId = req.user.id;
      const { amount } = verifiedPayment;

      const user = await User.findById(userId);

      user.adjustWalletBalance(amount, 'credit');
      await user.save({ validateBeforeSave: false });

      return {
        id: crypto.randomBytes(16).toString('hex'),
        amountRefunded: amount,
        destination: 'Wallet',
        status: 'completed',
        createdAt: new Date().toISOString(),
        type: 'refund',
      };
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.flutterwave.com/v3/transactions/${verifiedPayment.id}/refund`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.FLW_SECRET_TEST_KEY}`,
      },
    };

    const response = await axios.request(config);

    const { status, data } = response.data;

    const refundDetails = {
      id: data.id,
      amountRefunded: data.amount_refunded,
      destination: data.destination,
      status: data.status,
      createdAt: data.created_at,
      type: 'refund',
    };

    if (status === 'success' && data.status === 'completed') {
      return refundDetails;
    } else {
      throw new AppError('Refund payment failed. Please try again.', 400);
    }
  } catch (error) {
    return verifiedPayment;
  }
};

export default initiateRefund;
