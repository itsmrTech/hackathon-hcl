import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Order } from '../models/Order';
import { User } from '../modules/auth/models/User';
import { authenticate, AuthRequest } from '../shared/middleware/auth';

const router = Router();

// Validation middleware
const validatePortfolioSummary = [
  query('orderRefNo').optional().isString(),
  query('securityName').optional().isString(),
  query('transactionType').optional().isIn(['Buy', 'Sell']),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

// Portfolio summary route
router.get('/summary', authenticate, validatePortfolioSummary, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { orderRefNo, securityName, transactionType, fromDate, toDate } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    // Get user's account balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: 'User not found' } });
    }

    // Build query
    const query: any = { userId };
    
    if (orderRefNo) query.orderRefNo = orderRefNo;
    if (securityName) query.fundName = securityName;
    if (transactionType) query.transactionType = transactionType;
    
    if (fromDate || toDate) {
      query.orderDate = {};
      if (fromDate) query.orderDate.$gte = new Date(fromDate as string);
      if (toDate) query.orderDate.$lte = new Date(toDate as string);
    }

    // Get orders
    const orders = await Order.find(query).sort({ orderDate: -1 });

    // Calculate summaries
    const summaries = orders.map(order => ({
      orderDate: order.orderDate.toISOString().split('T')[0],
      orderRefNo: order.orderRefNo,
      fundName: order.fundName,
      transactionType: order.transactionType,
      credit: order.transactionType === 'Sell' ? order.orderValue : 0,
      debit: order.transactionType === 'Buy' ? order.orderValue : 0,
      runningBalance: 0, // This would be calculated based on transaction history
    }));

    res.status(200).json({
      success: true,
      data: {
        accountRunningBalance: user.accountBalance,
        summaries,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router; 