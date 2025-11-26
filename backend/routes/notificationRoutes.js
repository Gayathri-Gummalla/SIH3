import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  sendTestNotification
} from '../controllers/notificationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get notifications
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);

// Mark as read
router.post('/:notificationId/read', markAsRead);
router.post('/mark-all-read', markAllAsRead);

// Send test notification (for testing)
router.post('/test', authorizeRoles('central_admin'), sendTestNotification);

export default router;
