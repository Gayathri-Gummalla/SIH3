import express from 'express';
import {
  getEscalations,
  getEscalationById,
  resolveEscalation,
  createEscalation,
  triggerEscalationCheck,
  getEscalationStats
} from '../controllers/escalationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get escalations
router.get('/', getEscalations);
router.get('/stats', getEscalationStats);
router.get('/:escalationId', getEscalationById);

// Resolve escalation
router.post('/:escalationId/resolve', resolveEscalation);

// Create escalation manually
router.post('/', authorizeRoles('central_admin', 'state_nodal', 'district_officer'), createEscalation);

// Trigger escalation check (Admin only)
router.post('/trigger-check', authorizeRoles('central_admin'), triggerEscalationCheck);

export default router;
