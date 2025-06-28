import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderDetail extends Document {
  securityDetail: mongoose.Types.ObjectId;
  orderRefNo: string;
  orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  transactionType: 'BUY' | 'SELL';
  orderValue: number;
  createdOn: Date;
  createdBy: mongoose.Types.ObjectId;
  quantity: number;
}

const orderDetailSchema = new Schema<IOrderDetail>({
  securityDetail: {
    type: Schema.Types.ObjectId,
    ref: 'SecurityDetail',
    required: true,
  },
  orderRefNo: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
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
    type: Number,
    required: false,
    min:0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
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
