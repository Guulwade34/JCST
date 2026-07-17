import { model, Schema } from 'mongoose';

const publicSubmissionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['application', 'contact', 'newsletter'],
      required: true,
      index: true,
    },
    referenceNumber: { type: String, required: true, unique: true, index: true },
    status: { type: String, required: true, default: 'submitted', index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, versionKey: false },
);
publicSubmissionSchema.index({ type: 1, email: 1, createdAt: -1 });
export const PublicSubmissionModel = model('PublicSubmission', publicSubmissionSchema);
