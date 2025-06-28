import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController';
import { validatePortfolioSummary } from '../validators/portfolioValidators';
import { authenticate } from '../../../shared/middleware/auth';

const router = Router();

// Portfolio summary route
router.get('/summary', authenticate, validatePortfolioSummary, PortfolioController.getSummary);

export default router; 