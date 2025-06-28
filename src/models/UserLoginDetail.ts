import mongoose, { Document, Schema } from 'mongoose';

export interface IUserLoginDetail extends Document {
  userDetail: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  emailAddress: string;
  userStatus: 'ACTIVE' | 'INACTIVE';
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date | null;
  modifiedBy: string | null;
}

const userLoginDetailSchema = new Schema<IUserLoginDetail>({
  userDetail: {
    type: Schema.Types.ObjectId,
    ref: 'UserDetail',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  userStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    required: true,
    default: 'ACTIVE',
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
  modifiedOn: {
    type: Date,
    default: null,
  },
  modifiedBy: {
    type: String,
    default: null,
  },
}, {
  timestamps: false, // We're managing timestamps manually
});

export const UserLoginDetail = mongoose.model<IUserLoginDetail>('UserLoginDetail', userLoginDetailSchema); 