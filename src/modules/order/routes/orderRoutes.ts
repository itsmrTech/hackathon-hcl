import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { validateOrder, validateOrderStatus } from '../validators/orderValidators';
import { authenticate } from '../../../shared/middleware/auth';

const router = Router();

// Place new order
router.post('/', authenticate, validateOrder, OrderController.placeOrder);

// Get order status
router.get('/:orderRefNo/status', authenticate, validateOrderStatus, OrderController.getOrderStatus);

export default router; 