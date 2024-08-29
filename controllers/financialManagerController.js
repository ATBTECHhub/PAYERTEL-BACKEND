import Role from "../models/roleModel.js";
import User from "../models/userModel.js"


//VIEW ALL USERS 
//GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

//GET USER DETAILS
export const getUserById = async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

//FINANCIAL MANAGEMENT
// View all transactions
export const viewAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate(
      'userId',
      'name email'
    ); // Populates with user info
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

// Approve or flag transactions
export const approveOrFlagTransaction = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    if (!['approved', 'flagged'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "approved" or "flagged".',
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: 'Transaction not found.' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// Process refunds
export const processRefund = async (req, res) => {
  try {
    const { transactionId, amount } = req.body;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, error: 'Transaction not found.' });
    }

    if (
      transaction.transactionType !== 'payment' ||
      transaction.status !== 'approved'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Only approved payments can be refunded.',
      });
    }

    const refund = new Transaction({
      userId: transaction.userId,
      amount,
      status: 'approved',
      transactionType: 'refund',
    });

    await refund.save();

    res.status(201).json({ success: true, data: refund });
  } catch (error) {
    next(error);
  }
};

//FINANCIAL REPORT
// Generate financial reports
export const generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch transactions within the given date range
    const transactions = await Transaction.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // Calculate total revenue, refunds, and net earnings
    const revenue = transactions
      .filter(
        txn => txn.transactionType === 'payment' && txn.status === 'approved'
      )
      .reduce((acc, txn) => acc + txn.amount, 0);

    const refunds = transactions
      .filter(
        txn => txn.transactionType === 'refund' && txn.status === 'approved'
      )
      .reduce((acc, txn) => acc + txn.amount, 0);

    const netEarnings = revenue - refunds;

    // Generate report summary
    const report = {
      startDate,
      endDate,
      totalRevenue: revenue,
      totalRefunds: refunds,
      netEarnings,
      transactionCount: transactions.length,
    };

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};