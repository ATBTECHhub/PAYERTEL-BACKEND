import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { createTransaction } from '../controllers/transactionController.js';
import initiateRefund from './initiateRefund.js';
import { fetchBillInfo } from '../utils/fetchBillInfo.js';

const validateBillsTransaction = catchAsync(async (req, res, next) => {
  const { customerId, itemCode, billerCode, category } = req.body;
  const { status, orderId, data, errorDetails } = req.transactionResponse;

  const billInfo = await fetchBillInfo(itemCode, billerCode, category);

  const transactionData = {
    user: req.user._id,
    serviceProvider: billInfo.billerName,
    transactionName: billInfo.name,
    transactionType: billInfo.groupName,
    category: billInfo.category,
    amount: req.verifiedPayment.amount,
    customerId,
    customerDetails: data,
  };

  const transactionMessage = `${billInfo.groupName} ${category === 'electricity' ? `(${itemCode.toUpperCase()})` : ''} transaction`;

  if (status === 'success') {
    const newTransaction = await createTransaction({
      ...transactionData,
      status: 'successful',
      paymentDetails: req.verifiedPayment,
    });

    return res.status(200).json({
      status,
      message: `${transactionMessage} successfully completed.`,
      data: {
        transaction: newTransaction,
      },
    });
  } else if (status === 'processing') {
    const newTransaction = await createTransaction({
      ...transactionData,
      status,
      paymentDetails: { ...req.verifiedPayment, orderId },
    });

    return res.status(200).json({
      status,
      message: `${errorDetails}`,
      data: {
        transaction: newTransaction,
      },
    });
  } else {
    const refundDetails = await initiateRefund(req);

    await createTransaction({
      ...transactionData,
      status: 'failed',
      paymentDetails: refundDetails,
    });

    return next(
      new AppError(
        `${transactionMessage} failed. Your wallet has been refunded automatically.`,
        400,
        errorDetails
      )
    );
  }
});

export default validateBillsTransaction;
