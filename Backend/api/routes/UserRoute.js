import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser
} from '../controllers/UserController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a new user (student / organizer / admin based on role in req.body)
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Admin: get all users
router.get('/users', protect, authorize('admin'), getAllUsers);

// Admin: delete a user
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
