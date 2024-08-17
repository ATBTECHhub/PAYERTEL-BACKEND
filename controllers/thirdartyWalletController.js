import axios from 'axios';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getThirdPartyWalletBalance = catchAsync(async (req, res, next) => {
  const { VTU_USERNAME: username, VTU_PASSWORD: password } = process.env;

  // Make the API request to the main wallet account provider
  try {
    const response = await axios.get('https://vtu.ng/wp-json/api/v1/balance', {
      params: {
        username,
        password,
      },
    });

    const { data } = response.data;

    res.status(200).json({
      status: 'success',
      message: 'Main Wallet balance successfully retrieved',
      data: {
        mainWallet: {
          balance: data.balance,
          currency: data.currency,
        },
      },
    });
  } catch (error) {
    return next(
      new AppError(
        'Unable to fetch Main Wallet balance at the moments',
        400,
        error.response.data.message
      )
    );
  }
});
