const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderRefNo: { type: String },
  securityName: { type: String },
  transactionType: { type: String, enum: ['Buy', 'Sell'] },
  fromDate: { type: Date },
  toDate: { type: Date },
  quantity: { type: Number },
  totalValue: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);