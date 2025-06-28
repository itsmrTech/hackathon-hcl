import { query } from 'express-validator';

export const validatePortfolioSummary = [
  query('orderRefNo').optional().isString().withMessage('Order reference number must be a string'),
  query('securityName').optional().isString().withMessage('Security name must be a string'),
  query('transactionType').optional().isIn(['Buy', 'Sell']).withMessage('Transaction type must be either Buy or Sell'),
  query('fromDate').optional().isISO8601().withMessage('From date must be a valid ISO date'),
  query('toDate').optional().isISO8601().withMessage('To date must be a valid ISO date'),
]; 