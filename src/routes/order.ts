import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { Order } from '../models/Order';
import { Security } from '../modules/securities/models/Security';
import { User } from '../modules/auth/models/User';
import { authenticate, AuthRequest } from '../shared/middleware/auth';

const router = Router();

// Validation middleware
const validateOrder = [
  body('fundName').isString().notEmpty(),
  body('transactionType').isIn(['Buy', 'Sell']),
  body('quantity').isInt({ min: 1 }),
];

const validateOrderStatus = [
  param('orderRefNo').isString().notEmpty(),
];

// Place new order
router.post('/', authenticate, validateOrder, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fundName, transactionType, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    // Check if security exists
    const security = await Security.findOne({ securityName: fundName, isActive: true });
    if (!security) {
      return res.status(400).json({ success: false, error: { message: 'Invalid Security Name' } });
    }

    // Calculate order value
    const orderValue = quantity * security.value;

    // Check user balance for buy orders
    if (transactionType === 'Buy') {
      const user = await User.findById(userId);
      if (!user || user.accountBalance < orderValue) {
        return res.status(400).json({ success: false, error: { message: 'Insufficient balance' } });
      }
    }

    // Create order
    const order = new Order({
      userId,
      fundName,
      transactionType,
      quantity,
      orderValue,
      status: 'Submitted',
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: {
        orderRefNo: order.orderRefNo,
        status: order.status,
        orderValue: order.orderValue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get order status
router.get('/:orderRefNo/status', authenticate, validateOrderStatus, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderRefNo } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    const order = await Order.findOne({ orderRefNo, userId });
    if (!order) {
      return res.status(404).json({ success: false, error: { message: 'Invalid Order Ref No.' } });
    }

    res.status(200).json({
      success: true,
      data: {
        orderRefNo: order.orderRefNo,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router; 