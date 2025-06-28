import { Router } from 'express';
import { SecurityController } from '../controllers/securityController';
import { authenticate } from '../../../shared/middleware/auth';

const router = Router();

// Get available securities
router.get('/', authenticate, SecurityController.getSecurities);

export default router; 