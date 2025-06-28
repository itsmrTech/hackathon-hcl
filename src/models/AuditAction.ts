import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditAction extends Document {
  userLoginDetail: mongoose.Types.ObjectId;
  userAction: string;
  startDateTime: Date;
  endDateTime: Date | null;
}

const auditActionSchema = new Schema<IAuditAction>({
  userLoginDetail: {
    type: Schema.Types.ObjectId,
    ref: 'UserLoginDetail',
    required: true,
  },
  userAction: {
    type: String,
    required: true,
    trim: true,
  },
  startDateTime: {
    type: Date,
    default: Date.now,
  },
  endDateTime: {
    type: Date,
    default: null,
  },
}, {
  timestamps: false, // We're managing timestamps manually
});

export const AuditAction = mongoose.model<IAuditAction>('AuditAction', auditActionSchema); 