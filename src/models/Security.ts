import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurity extends Document {
  securityId: number;
  securityName: string;
  value: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const securitySchema = new Schema<ISecurity>({
  securityId: {
    type: Number,
    required: true,
    unique: true,
  },
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
}, {
  timestamps: true,
});

export const Security = mongoose.model<ISecurity>('Security', securitySchema); 