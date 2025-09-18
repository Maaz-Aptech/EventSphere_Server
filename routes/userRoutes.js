import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getActiveStudentsCount,
  getCertificatesCount
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new user
// POST /api/users/register
router.post('/register', registerUser);

// Login user
// POST /api/users/login
router.post('/login', loginUser);

// Get current user profile
// GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// Get count of active students
// GET /api/users/active-students-count
router.get('/active-students-count', getActiveStudentsCount);

// Get count of issued certificates
// GET /api/users/certificates-count
router.get('/certificates-count', getCertificatesCount);

export default router;
