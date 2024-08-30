import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { configDotenv } from 'dotenv';

import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import generateOTP from '../utils/generateOTP.js';
import { sendOTP, sendPasswordReset } from '../utils/email.js';

configDotenv();

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, phone, password, passwordConfirm } = req.body;

  // Check if email already exists (case-insensitive)
  const existingUserByEmail = await User.findOne({
    email: { $regex: new RegExp('^' + email + '$', 'i') },
  });

  if (existingUserByEmail) {
    return next(
      new AppError(
        'Email already exists, please login or reset your password if you have forgotten it.',
        400
      )
    );
  }

  // Check if phone number already exists
  const existingUserByPhone = await User.findOne({ phone });
  if (existingUserByPhone) {
    return next(
      new AppError(
        'Phone number already exists, please login or reset your password if you have forgotten it.',
        400
      )
    );
  }

  const otp = generateOTP();
  const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  await sendOTP(email, otp, name); // Send OTP to email

  // Check if session is initialized
  if (!req.session) {
    return next(new AppError('Session is not initialized', 500));
  }

  // Store OTP and user data in session
  req.session.otp = otp;
  req.session.otpExpires = otpExpires;
  req.session.user = { name, email, phone, password, passwordConfirm };

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to email',
  });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  const { otp: storedOTP, otpExpires } = req.session;

  if (Date.now() > otpExpires) {
    return next(new AppError('OTP has expired', 400));
  }

  if (storedOTP !== otp) {
    return next(new AppError('Invalid OTP', 400));
  }

  const { name, email, phone, password, passwordConfirm } = req.session.user;

  const newUser = await User.create({
    name,
    email,
    phone,
    password,
    passwordConfirm,
  });

  req.session.otp = null;
  req.session.otpExpires = null;
  req.session.user = null;

  createSendToken(newUser, 201, res);
});

export const resendOTP = catchAsync(async (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return next(new AppError('No user found in session', 400));
  }

  // Initialize resend count and timestamp if they don't exist
  if (!req.session.otpResendCount) {
    req.session.otpResendCount = 0;
    req.session.otpResendStartTime = Date.now();
  }

  // Check if 24 hours have passed since the first resend attempt
  const timeSinceFirstResend = Date.now() - req.session.otpResendStartTime;
  if (timeSinceFirstResend > 1 * 60 * 60 * 1000) {
    req.session.otpResendCount = 0; // Reset the counter
    req.session.otpResendStartTime = Date.now(); // Reset the start time
  }

  // Limit resend attempts to 5
  if (req.session.otpResendCount >= 2) {
    return next(
      new AppError(
        'You have exceeded the maximum number of OTP resend attempts. Please try again after 1 hour.',
        429
      )
    );
  }

  // Generate a new OTP
  const otp = generateOTP();

  // Set the new OTP and expiration time in the session
  const otpExpires = Date.now() + 10 * 60 * 1000;
  req.session.otp = otp;
  req.session.otpExpires = otpExpires;

  // Increment the resend count
  req.session.otpResendCount += 1;

  // Send the OTP to the user
  await sendOTP(user.email, otp, user.name);

  res.status(200).json({
    status: 'success',
    message: 'OTP resent to email',
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordReset(user.email, resetToken, user.name);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};
