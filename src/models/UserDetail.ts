import mongoose, { Document, Schema } from 'mongoose';

export interface IUserDetail extends Document {
  firstName: string;
  lastName: string;
  emailAddress: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date | null;
  modifiedBy: string | null;
}

const userDetailSchema = new Schema<IUserDetail>({
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
    unique: true,
    lowercase: true,
    trim: true,
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

export const UserDetail = mongoose.model<IUserDetail>('UserDetail', userDetailSchema); 