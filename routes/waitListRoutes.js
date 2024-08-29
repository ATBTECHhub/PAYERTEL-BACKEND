import express from 'express';
import { addToWaitList } from '../controllers/waitListController.js';

const router = express.Router();

// Endpoint to add an email to the waitlist
router.post('/', addToWaitList);

export default router;
