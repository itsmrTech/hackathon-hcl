import mongoose, { Document, Schema } from 'mongoose';

export interface IAccountDetail extends Document {
  userLoginDetail: mongoose.Types.ObjectId;
  credit: number;
  debit: number;
  runningBalance: number;
  orderDetail: mongoose.Types.ObjectId;
  createdOn: Date;
  createdBy: mongoose.Types.ObjectId;
}

const accountDetailSchema = new Schema<IAccountDetail>({
  userLoginDetail: {
    type: Schema.Types.ObjectId,
    ref: 'UserLoginDetail',
    required: true,
  },
  credit: {
    type: Number,
    default: 0,
    min: 0,
  },
  debit: {
    type: Number,
    default: 0,
    min: 0,
  },
  runningBalance: {
    type: Number,
    default: 10000, // default to $10,000
    min: 0,
  },
  orderDetail: {
    type: Schema.Types.ObjectId,
    ref: 'OrderDetail',
    required: true,
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

export const AccountDetail = mongoose.model<IAccountDetail>('AccountDetail', accountDetailSchema); 