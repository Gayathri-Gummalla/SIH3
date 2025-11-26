import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getUsers
} from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);

// Admin only
router.get('/users', authenticateToken, authorizeRoles('central_admin', 'state_nodal'), getUsers);

export default router;
