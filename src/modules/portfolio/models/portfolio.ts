import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  orderRefNo: string;
  securityName: string;
  transactionType: 'Buy' | 'Sell';
  fromDate: Date;
  toDate: Date;
  quantity: number;
  totalValue: number;
  createdAt: Date;
}

const portfolioSchema: Schema<IPortfolio> = new Schema({
  orderRefNo: { type: String, required: true },
  securityName: { type: String, required: true },
  transactionType: { type: String, enum: ['Buy', 'Sell'], required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  quantity: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
