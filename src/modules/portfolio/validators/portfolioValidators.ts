const { body } = require('express-validator');

exports.validatePortfolio = [
  body('orderRefNo').notEmpty().withMessage('Order Ref No is required'),
  body('securityName').notEmpty().withMessage('Security Name is required'),
  body('transactionType').isIn(['Buy', 'Sell']).withMessage('Invalid transaction type'),
  body('fromDate').isISO8601().withMessage('From Date must be a valid date'),
  body('toDate').optional().isISO8601().withMessage('To Date must be a valid date'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('totalValue').isNumeric().withMessage('Total value must be a number')
];
