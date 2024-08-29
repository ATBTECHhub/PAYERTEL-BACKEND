import mongoose from 'mongoose';
import validator from 'validator';

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: [true, 'Email is already registered'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
});

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

export default Waitlist;
