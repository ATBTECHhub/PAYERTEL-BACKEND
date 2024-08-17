import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user'],
  },
  serviceProvider: {
    type: String,
    required: [true, 'Transaction must have a service provider'],
  },
  transactionName: {
    type: String,
    required: [true, 'Transaction must have a name'],
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction must belong to a type'],
  },
  category: {
    type: String,
    required: [true, 'Transaction must belong to a category'],
  },
  amount: {
    type: Number,
    required: [true, 'Transaction must have an amount'],
  },
  status: {
    type: String,
    enum: ['successful', 'failed', 'processing'],
    required: [true, 'Transaction must have a status'],
  },
  customerId: {
    type: String,
    required: [true, 'Transaction must have a customer ID'],
  },
  customerDetails: Object,
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  paymentDetails: {
    type: Object,
    required: [true, 'Payment details are required'],
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
