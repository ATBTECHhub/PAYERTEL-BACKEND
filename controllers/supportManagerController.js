import Ticket from '../models/ticketModel.js';
import AppError from '../utils/appError.js';



// Ticketing System Controllers
/// Get all tickets
// Get all tickets
export const viewAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({});
    if (!tickets.length) {
      return next(AppError(404, 'No tickets found'));
    }
    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// Get ticket by ID
export const viewTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return next(AppError(404, `Ticket with ID ${id} not found`));
    }

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolution } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return next(AppError(404, `Ticket with ID ${id} not found`));
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (resolution) ticket.resolution = resolution;

    await ticket.save();

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

// Delete ticket
export const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return next(AppError(404, `Ticket with ID ${id} not found`));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// User Feedback Controllers

// View all feedback
export const viewAllFeedback = async (req, res, next) => {
  try {
    if (!feedbacks.length) {
      return next(AppError(404, 'No feedback found'));
    }
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Respond to feedback
export const respondToFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { responseMessage } = req.body;

    const feedback = feedbacks.find(f => f.id === id);

    if (!feedback) {
      return next(AppError(404, `Feedback with ID ${id} not found`));
    }

    if (!responseMessage) {
      return next(AppError(400, 'Response message is required'));
    }

    feedback.response = responseMessage;

    res.status(200).json({ message: 'Response sent', feedback });
  } catch (error) {
    next(error);
  }
};

// Support Analytics Controllers

// View all support analytics
export const viewSupportAnalytics = async (req, res, next) => {
  try {
    if (!Object.keys(analytics).length) {
      return next(AppError(404, 'No analytics data found'));
    }
    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

//GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

//GET USER DETAILS
export const getUserById = async (req, res, next) => {
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

// View system performance metrics
export const viewSystemPerformance = (req, res) => {
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
