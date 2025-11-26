import express from 'express';
import {
  createProject,
  assignImplementingAgency,
  assignExecutingAgency,
  respondToAssignment,
  submitAssignment,
  updateProgress,
  submitUC,
  reviewUC,
  requestTranche,
  releaseTranche,
  getProjects,
  getProjectById,
  getDelayedProjects
} from '../controllers/projectController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create project (State Nodal)
router.post('/', authorizeRoles('state_nodal'), createProject);

// Agency assignment (State Nodal)
router.post('/:projectId/assign-implementing-agency', authorizeRoles('state_nodal'), assignImplementingAgency);
router.post('/:projectId/assign-executing-agency', authorizeRoles('state_nodal'), assignExecutingAgency);

// Agency response
router.post('/assignments/:assignmentId/respond', authorizeRoles('implementing_agency', 'executing_agency'), respondToAssignment);

// Submit assignment (State Nodal)
router.post('/:projectId/submit-assignment', authorizeRoles('state_nodal'), submitAssignment);

// Progress updates (Executing Agency)
router.post('/:projectId/progress', authorizeRoles('executing_agency', 'implementing_agency'), updateProgress);

// Utilization Certificate
router.post('/:projectId/uc', authorizeRoles('executing_agency'), submitUC);
router.post('/uc/:ucId/review', authorizeRoles('state_nodal'), reviewUC);

// Tranche management
router.post('/:projectId/request-tranche', authorizeRoles('executing_agency', 'implementing_agency'), requestTranche);
router.post('/tranches/:trancheId/release', authorizeRoles('state_finance'), releaseTranche);

// Get projects
router.get('/', getProjects);
router.get('/delayed', getDelayedProjects);
router.get('/:projectId', getProjectById);

export default router;
