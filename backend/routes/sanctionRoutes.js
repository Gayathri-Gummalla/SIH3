import express from 'express';
import {
  createSanction,
  uploadSanctionPDF,
  approveSanction,
  rejectSanction,
  confirmFundTransfer,
  getSanctions,
  getSanctionById,
  getNationalKPIs
} from '../controllers/sanctionController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create sanction (Central Admin only)
router.post('/', authorizeRoles('central_admin'), createSanction);

// Upload sanction PDF
router.post('/:sanctionId/upload-pdf', authorizeRoles('central_admin'), uploadSanctionPDF);

// Approve/Reject sanction
router.post('/:sanctionId/approve', authorizeRoles('central_admin'), approveSanction);
router.post('/:sanctionId/reject', authorizeRoles('central_admin'), rejectSanction);

// Confirm fund transfer (Central Finance)
router.post('/allocations/:allocationId/confirm', authorizeRoles('central_finance'), confirmFundTransfer);

// Get sanctions
router.get('/', getSanctions);
router.get('/:sanctionId', getSanctionById);

// Get national KPIs (Central Admin only)
router.get('/kpis/national', authorizeRoles('central_admin'), getNationalKPIs);

export default router;
