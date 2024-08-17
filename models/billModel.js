import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  billerCode: {
    type: String,
    required: [true, 'Biller code is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  defaultCommission: {
    type: Number,
    required: [true, 'Default commission is required'],
    default: 0,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  isAirtime: {
    type: Boolean,
    default: false,
  },
  billerName: {
    type: String,
    required: [true, 'Biller name is required'],
  },
  itemCode: {
    type: String,
    required: [true, 'Item code is required'],
  },
  shortName: {
    type: String,
    required: [true, 'Short name is required'],
  },
  fee: {
    type: Number,
    default: 0,
  },
  commissionOnFee: {
    type: Boolean,
    default: false,
  },
  regExpression: {
    type: String,
    required: [true, 'Regular expression is required'],
  },
  labelName: {
    type: String,
    required: [true, 'Label name is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  isResolvable: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    required: [true, 'Group name is required'],
  },
  category: {
    type: String,
    required: [true, 'Category name is required'],
  },
  defaultCommissionOnAmount: {
    type: Number,
    default: null,
  },
  commissionOnFeeOrAmount: {
    type: Number,
    default: null,
  },
  validityPeriod: {
    type: Number,
    default: null,
  },
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
