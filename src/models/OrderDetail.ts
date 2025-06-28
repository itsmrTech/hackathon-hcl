import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderDetail extends Document {
  securityDetail: mongoose.Types.ObjectId;
  orderRefNo: string;
  orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  transactionType: 'BUY' | 'SELL';
  orderValue: string;
  createdOn: Date;
  createdBy: mongoose.Types.ObjectId;
}

const orderDetailSchema = new Schema<IOrderDetail>({
  securityDetail: {
    type: Schema.Types.ObjectId,
    ref: 'SecurityDetail',
    required: true,
  },
  orderRefNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    required: true,
    default: 'PENDING',
  },
  transactionType: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true,
  },
  orderValue: {
    type: String,
    required: true,
    trim: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'UserLoginDetail',
    required: true,
  },
}, {
  timestamps: false, // We're managing timestamps manually
});

export const OrderDetail = mongoose.model<IOrderDetail>('OrderDetail', orderDetailSchema); 