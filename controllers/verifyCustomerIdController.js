import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const verifyCustomerId = catchAsync(async (req, res, next) => {
  const { customerId, itemCode, billerCode } = req.body;
  const { VTU_USERNAME: username, VTU_PASSWORD: password } = process.env;

  // Ensure that the necessary fields are provided
  if (!customerId || !billerCode) {
    return next(new AppError('Missing fields are required.', 400));
  }

  // Make the API request to the airtime provider
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

    const { message, data } = response.data;

    res.status(200).json({
      status: 'success',
      message: message || 'Customer details successfully retrieved',
      data: {
        customerDetails: data,
      },
    });
  } catch (error) {
    return next(
      new AppError(error.response.data.message || 'Invalid customerId', 400)
    );
  }
});
