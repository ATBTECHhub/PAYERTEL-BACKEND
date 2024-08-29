import express from 'express';
import {
  viewAllContents,
  createNewContent,
  updateContent,
  deleteContent,
} from '../controllers/contentManagerController.js';
import { contentManagerAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// View all Content
router.get('/contents', contentManagerAuth, viewAllContents);

// Create a new content
router.post('/contents', contentManagerAuth, createNewContent);

// Update an existing content
router.put('/contents/:id', contentManagerAuth, updateContent);

// Delete an content
router.delete('/contents/:id', contentManagerAuth, deleteContent);

export default router;
