import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const electricityBillPayment = catchAsync(async (req, res, next) => {
  const { phone, customerId, itemCode, billerCode, category } = req.body;
  const { VTU_USERNAME: username, VTU_PASSWORD: password } = process.env;

  // Ensure that the required fields are provided
  if (!customerId || !itemCode || !billerCode || !category) {
    return next(
      new AppError(
        'Missing fields are required to perform this transaction.',
        400
      )
    );
  }

  // Verify customerId
  try {
    const response = await axios.get(
      'https://vtu.ng/wp-json/api/v1/verify-customer',
      {
        params: {
          username,
          password,
          customer_id: customerId,
          service_id: billerCode.toLowerCase(),
          variation_id: itemCode,
        },
      }
    );

    const { code, data } = response.data;

    // Make the API request to the electricity provider
    if (code === 'success') {
      await axios.get('https://vtu.ng/wp-json/api/v1/electricity', {
        params: {
          username,
          password,
          phone,
          service_id: billerCode.toLowerCase(),
          meter_number: customerId,
          variation_id: itemCode,
          amount: req.verifiedPayment.amount,
        },
      });

      // If the request is successful, update the transaction status to 'success'
      // and return the transaction response
      req.transactionResponse = { status: 'success', data };
    }
  } catch (error) {
    // If the API request fails, check if it's due to a temporary processing error
    // and update the transaction status to 'processing'
    if (error.response.data.code === 'processing') {
      req.transactionResponse = {
        status: error.response.data.code,
        orderId: error.response.data.order_id,
        errorDetails: error.response.data.message,
      };

      // If the error is due to a network issue, update the transaction status to 'fail'
      // and return the transaction response
    } else {
      req.transactionResponse = {
        status: 'fail',
        errorDetails: error.response.data.message,
      };
    }
  }

  // Proceed to the next middleware to validate and finalize the transaction
  return next();
});
