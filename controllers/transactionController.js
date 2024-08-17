import Transaction from '../models/transactionModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

// Create a transaction
export const createTransaction = async transactionDetails => {
  try {
    return await Transaction.create({ ...transactionDetails });
  } catch (err) {
    console.log(err);
    throw new AppError('Error creating transaction', 500); // Handle creation errors appropriately
  }
};

// Get the user's transaction history
export const getTransactionHistory = catchAsync(async (req, res, next) => {
  // Extract user ID from either the authenticated user or the request params
  const userId = req.user?._id || req.params.userId;

  // Validate userId
  if (!userId) {
    return next(new AppError('User ID is required', 400));
  }

  // Extract 'from' and 'to' query parameters
  const { from, to } = req.query;

  // Regular expression to match YYYY-MM format
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  let num;
  // Validate 'from' and 'to' date format
  if (from && !dateRegex.test(from)) {
    return next(
      new AppError(`Invalid 'from' date format. Expected format: YYYY-MM`, 400)
    );
  }
  if (to && !dateRegex.test(to)) {
    return next(
      new AppError(`Invalid 'to' date format. Expected format: YYYY-MM`, 400)
    );
  }

  // Date filter initialization
  let dateFilter = {};

  // Build the date filter only if valid 'from' and 'to' dates are provided
  if (from || to) {
    const fromDate = from
      ? new Date(`${from}-01T00:00:00.000Z`)
      : new Date('1970-01-01');
    const toDate = to ? new Date(`${to}-01T23:59:59.999Z`) : new Date(); // End of the month

    // Set 'toDate' to the end of the month if a 'to' date is provided
    if (to) {
      toDate.setMonth(toDate.getMonth() + 1); // Move to the start of the next month
      toDate.setDate(0); // Set to the last day of the previous month
    }

    dateFilter.transactionDate = {
      $gte: fromDate,
      $lt: toDate,
    };

    req.query = {};
  }

  console.log(userId, dateFilter);
  // Initialize API features
  // Build the query with APIFeatures
  const features = new APIFeatures(
    Transaction.find({ user: userId, ...dateFilter }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute the query
  const transactions = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions: !transactions.length ? [] : transactions,
    },
  });
});
