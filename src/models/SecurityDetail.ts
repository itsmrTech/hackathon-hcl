import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurityDetail extends Document {
  securityName: string;
  value: number;
  isActive: boolean;
  createdOn: Date;
  createdBy: string;
}

const securityDetailSchema = new Schema<ISecurityDetail>({
  securityName: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: false, // We're managing timestamps manually
});

export const SecurityDetail = mongoose.model<ISecurityDetail>('SecurityDetail', securityDetailSchema); 