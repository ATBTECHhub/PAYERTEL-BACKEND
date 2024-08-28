import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Transaction from '../models/transactionModel.js';
import SystemLog from '../models/systemLogModel.js';

//CREATE SUPERADMIN ACCOUNT
export const createSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name && !email && !password && !role) {
      return res.status(400).json({
        message: 'Please fill all fields',
      });
    }
    const existingSuperAdmin = await User.findOne({ role: 'SuperAdmin' });
    if (!existingSuperAdmin) {
      const superAdmin = new User({
        name,
        email,
        password,
        role
      });

      const salt = await bcrypt.genSalt(10);
      superAdmin.password = await bcrypt.hash(superAdmin.password, salt);

      await superAdmin.save();
      console.log('SuperAdmin account created successfully');
    } else {
      console.log('SuperAdmin account already exists');
    }
  } catch (error) {
    next(error);
  }
};

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

//CREATE AN NEW USER
export const createUser = async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }

  try {
    const { name, email, phone, role } = req.body;

    // Ensure all required fields are filled
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all fields',
      });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(errorResponse(409, 'User already exists'));
    }

    // Create the new user
    const newUser = new User({
      name,
      email,
      phone,
      role: role || 'user', // Assign role based on input, default to 'user'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};

//UPDATE THE USER INFORMATION
export const updateUser = async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

//DELETE OR DEACTIVATE USER
export const deleteUser = async (req, res, next) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

//SYSTEM MAINTENANCE/MONITORING (SuperAdmin only)
// View system performance metrics
export const viewSystemPerformance = (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    const uptime = process.uptime();
    const performanceMetrics = {
      uptime: `${Math.floor(uptime / 60)} minutes`,
      responseTime: '50ms', // Replace with actual calculation
    };
    res.status(200).json({ success: true, data: performanceMetrics });
  } catch (error) {
    next(error);
  }
};

// View error logs
export const viewErrorLogs = (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    // Logic to fetch and return system error logs
    const errorLogs = []; // Replace with actual error logs retrieval
    res.status(200).json({ success: true, data: errorLogs });
  } catch (error) {
    next(error);
  }
};

// Run system maintenance
export const runSystemMaintenance = (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    // Perform system maintenance tasks (e.g., backups, updates)
    res.status(200).json({
      success: true,
      message: 'System maintenance executed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

//ROLE MANAGEMENT
// Create a new role
export const createRole = async (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    const { name, permissions } = req.body;
    const roleExists = await Role.findOne({ name });

    if (roleExists) {
      return res
        .status(400)
        .json({ success: false, error: 'Role already exists.' });
    }

    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

// Update role permissions
export const updateRolePermissions = async (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found.' });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  if (req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      error: 'You do not have permission to perform this action.',
    });
  }
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found.' });
    }

    res
      .status(200)
      .json({ success: true, message: 'Role deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

//SECURITY MAMNAGEMENT
// View access logs
export const viewAccessLogs = (req, res) => {
  try {
    // Logic to retrieve access logs
    const accessLogs = []; // Replace with actual access logs retrieval
    res.status(200).json({ success: true, data: accessLogs });
  } catch (error) {
    next(error);
  }
};

// Manage security alerts
export const manageSecurityAlerts = (req, res) => {
  try {
    const { alerts } = req.body;
    // Logic to set up and manage security alerts
    res.status(200).json({
      success: true,
      message: 'Security alerts updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// Manage admin roles and permissions
export const manageAdminRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, permissions } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { role, permissions },
      { new: true }
    );

    if (!updatedRole)
      return res.status(404).json({ success: false, error: 'Role not found.' });

    res.status(200).json({ success: true, data: updatedRole });
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

// Generate system reports
export const generateSystemReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Fetch system logs within the given date range
    const logs = await SystemLog.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // Categorize log types
    const errors = logs.filter(log => log.level === 'error');
    const warnings = logs.filter(log => log.level === 'warning');
    const infos = logs.filter(log => log.level === 'info');

    // Generate report summary
    const report = {
      startDate,
      endDate,
      totalLogs: logs.length,
      errors: errors.length,
      warnings: warnings.length,
      infos: infos.length,
    };

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
