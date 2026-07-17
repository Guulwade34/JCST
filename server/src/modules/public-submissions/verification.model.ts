import { model, Schema } from 'mongoose';
const verificationSchema = new Schema(
  {
    type: { type: String, enum: ['certificate', 'transcript'], required: true, index: true },
    number: { type: String, required: true, uppercase: true, trim: true, index: true },
    studentName: { type: String, required: true },
    program: { type: String, required: true },
    qualification: { type: String, default: '' },
    issueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['valid', 'revoked', 'replaced'],
      default: 'valid',
      required: true,
    },
    safeDetails: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false },
);
verificationSchema.index({ type: 1, number: 1 }, { unique: true });
export const VerificationModel = model('Verification', verificationSchema);
