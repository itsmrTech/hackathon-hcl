import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurity extends Document {
  securityName: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const securitySchema = new Schema<ISecurity>({
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
}, {
  timestamps: true,
});

export const Security = mongoose.model<ISecurity>('Security', securitySchema); 