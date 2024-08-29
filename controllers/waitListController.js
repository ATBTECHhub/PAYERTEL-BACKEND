import Waitlist from '../models/waitListModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendWaitlistConfirmationEmail } from '../utils/email.js';

export const addToWaitList = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  // Check if email already exists
  const existingEmail = await Waitlist.findOne({ email });
  if (existingEmail) {
    return next(new AppError('Email already on waitlist', 400));
  }

  // Save the new email
  await Waitlist.create({ email });

  // Send confirmation email
  try {
    await sendWaitlistConfirmationEmail(email);

    res.status(201).json({
      status: 'success',
      message: 'Email added to waitlist successfully',
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        500
      )
    );
  }
});
