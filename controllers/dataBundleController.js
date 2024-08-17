import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const dataBundlePurchase = catchAsync(async (req, res, next) => {
  const { customerId, itemCode, billerCode, category } = req.body;
  const { VTU_USERNAME: username, VTU_PASSWORD: password } = process.env;

  // Ensure that the billerCode and customerId fields are provided
  if (!customerId || !itemCode || !billerCode || !category) {
    return next(
      new AppError(
        'Missing fields are required to perform this transaction.',
        400
      )
    );
  }

  // Make the API request to the data bundle provider
  try {
    await axios.get('https://vtu.ng/wp-json/api/v1/data', {
      params: {
        username,
        password,
        phone: customerId,
        network_id: billerCode.toLowerCase(),
        variation_id: itemCode,
      },
    });

    // If the request is successful, update the transaction status to 'success'
    // and return the transaction response
    req.transactionResponse = { status: 'success' };
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
