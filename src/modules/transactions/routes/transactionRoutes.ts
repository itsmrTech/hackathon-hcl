import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { validateTransactionHistory } from '../validators/transactionValidators';
import { authenticate } from '../../../shared/middleware/auth';

const router = Router();

// Transaction history route
router.get('/history', authenticate, validateTransactionHistory, TransactionController.getTransactionHistory);

export default router; 