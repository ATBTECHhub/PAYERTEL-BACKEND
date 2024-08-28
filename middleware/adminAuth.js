// middlewares/superAdminAuth.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const superAdminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'SuperAdmin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Not authorized as SuperAdmin.',
      });
    }

    req.user = user; // Attach user information to the request object
    next();
  } catch (error) {
    console.error(`Authorization error: ${error.message}`);
    res.status(403).json({
      success: false,
      error: 'Invalid token or authorization failed.',
    });
  }
};

export const financialManagerAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'FinancialManager') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Not authorized as Financial Manager.',
      });
    }

    req.user = user; // Attach user information to the request object
    next();
  } catch (error) {
    console.error(`Authorization error: ${error.message}`);
    res.status(403).json({
      success: false,
      error: 'Invalid token or authorization failed.',
    });
  }
};

export const supportManagerAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'SupportManager') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Not authorized as Support Manager.',
      });
    }

    req.user = user; // Attach user information to the request object
    next();
  } catch (error) {
    console.error(`Authorization error: ${error.message}`);
    res.status(403).json({
      success: false,
      error: 'Invalid token or authorization failed.',
    });
  }
};

export const contentManagerAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'ContentManager') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Not authorized as Content Manager.',
      });
    }

    req.user = user; // Attach user information to the request object
    next();
  } catch (error) {
    console.error(`Authorization error: ${error.message}`);
    res.status(403).json({
      success: false,
      error: 'Invalid token or authorization failed.',
    });
  }
};