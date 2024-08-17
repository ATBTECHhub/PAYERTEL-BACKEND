import Bill from '../models/billModel.js';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from './handlerFactory.js';

/**
 * Controller for handling Bill Payment operations.
 * Utilizes generic CRUD operations from handlerFactory.js.
 */

// Get all bill payments
export const getAllBills = getAll(Bill);

// Get a single bill payment by ID
export const getBill = getOne(Bill);

// Create a new bill payment
export const createBill = createOne(Bill);

// Update a bill payment by ID
export const updateBill = updateOne(Bill);

// Delete a bill payment by ID
export const deleteBill = deleteOne(Bill);
