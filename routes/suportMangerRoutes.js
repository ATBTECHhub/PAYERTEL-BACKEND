// routes/supportRoutes.js
import express from 'express';
import {
  viewAllTickets,
  viewTicketById,
  updateTicketStatus,
  deleteTicket,
  viewAllFeedback,
  respondToFeedback,
  viewSupportAnalytics,
  getAllUsers,
  getUserById,
  viewAllTransactions,
  viewSystemPerformance
} from '../controllers/supportManagerController.js';
import { supportManagerAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// Ticketing System Routes
router.get('/tickets', supportManagerAuth, viewAllTickets);
router.get('/tickets/:id', supportManagerAuth, viewTicketById);
router.put('/tickets/:id', supportManagerAuth, updateTicketStatus);
router.delete('/tickets/:id', supportManagerAuth, deleteTicket);

// User Feedback Routes
router.get('/users', supportManagerAuth, getAllUsers);
router.get('/users/:id', supportManagerAuth, getUserById);
router.get('/feedback', supportManagerAuth, viewAllFeedback);
router.post('/feedback/respond/:id', supportManagerAuth, respondToFeedback);

// Support Analytics Routes
router.get('/analytics', supportManagerAuth, viewSupportAnalytics);

//view all transaction
router.get('/transactions', supportManagerAuth, viewAllTransactions);

//system monitoring
router.get('/system/performance', supportManagerAuth, viewSystemPerformance);

export default router;
