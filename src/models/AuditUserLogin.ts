import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditUserLogin extends Document {
  userLoginDetail: mongoose.Types.ObjectId;
  sessionId: string;
  loginStatus: 'SUCCESS' | 'FAILED';
  loginDateTime: Date;
  logoutDateTime: Date | null;
}

const auditUserLoginSchema = new Schema<IAuditUserLogin>({
  userLoginDetail: {
    type: Schema.Types.ObjectId,
    ref: 'UserLoginDetail',
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    trim: true,
  },
  loginStatus: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true,
  },
  loginDateTime: {
    type: Date,
    default: Date.now,
  },
  logoutDateTime: {
    type: Date,
    default: null,
  },
}, {
  timestamps: false, // We're managing timestamps manually
});

export const AuditUserLogin = mongoose.model<IAuditUserLogin>('AuditUserLogin', auditUserLoginSchema); 