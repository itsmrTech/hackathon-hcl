import { body, param } from 'express-validator';

export const validateOrder = [
  body('fundName').isString().notEmpty().withMessage('Fund name is required'),
  body('transactionType').isIn(['BUY', 'SELL']).withMessage('Transaction type must be either BUY or SELL'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
];

export const validateOrderStatus = [
  param('orderRefNo').isString().notEmpty().withMessage('Order reference number is required'),
]; 