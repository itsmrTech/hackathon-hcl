import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import { Order } from '../models/Order';
import { authenticate, AuthRequest } from '../shared/middleware/auth';

const router = Router();

// Validation middleware
const validateTransactionHistory = [
  query('orderRefNo').optional().isString(),
  query('securityName').optional().isString(),
  query('transactionType').optional().isIn(['Buy', 'Sell']),
  query('orderStatus').optional().isIn(['Submitted', 'Cancelled', 'Executed', 'Completed', 'Failed']),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
];

// Transaction history route
router.get('/history', authenticate, validateTransactionHistory, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      orderRefNo, 
      securityName, 
      transactionType, 
      orderStatus, 
      fromDate, 
      toDate 
    } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: { message: 'User not authenticated' } });
    }

    // Check if at least one filter is provided
    const hasFilters = orderRefNo || securityName || transactionType || orderStatus || fromDate || toDate;
    if (!hasFilters) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'At least one filter parameter is required' } 
      });
    }

    // Build query
    const query: any = { userId };
    
    if (orderRefNo) query.orderRefNo = orderRefNo;
    if (securityName) query.fundName = securityName;
    if (transactionType) query.transactionType = transactionType;
    if (orderStatus) query.status = orderStatus;
    
    if (fromDate || toDate) {
      query.orderDate = {};
      if (fromDate) query.orderDate.$gte = new Date(fromDate as string);
      if (toDate) query.orderDate.$lte = new Date(toDate as string);
    }

    // Get transactions
    const orders = await Order.find(query).sort({ orderDate: -1 });

    // Format transactions
    const transactions = orders.map(order => ({
      orderRefNo: order.orderRefNo,
      securityName: order.fundName,
      transactionType: order.transactionType,
      orderStatus: order.status,
      orderDate: order.orderDate.toISOString().split('T')[0],
      quantity: order.quantity,
      orderValue: order.orderValue,
    }));

    res.status(200).json({
      success: true,
      data: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router; 