import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderRefNo: string;
  userId: mongoose.Types.ObjectId;
  fundName: string;
  transactionType: 'Buy' | 'Sell';
  quantity: number;
  orderValue: number;
  status: 'Submitted' | 'Cancelled' | 'Executed' | 'Completed' | 'Failed';
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  orderRefNo: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fundName: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['Buy', 'Sell'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  orderValue: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Cancelled', 'Executed', 'Completed', 'Failed'],
    default: 'Submitted',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Generate order reference number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderRefNo) {
    this.orderRefNo = `ORD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>('Order', orderSchema); 