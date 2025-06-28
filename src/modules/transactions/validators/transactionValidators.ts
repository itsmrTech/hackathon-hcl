import { query } from 'express-validator';

export const validateTransactionHistory = [
  query('orderRefNo').optional().isString(),
  query('securityName').optional().isString(),
  query('transactionType').optional().isIn(['Buy', 'Sell']),
  query('orderStatus').optional().isIn(['Submitted', 'Cancelled', 'Executed', 'Completed', 'Failed']),
  query('fromDate').optional().isISO8601(),
  query('toDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
];
