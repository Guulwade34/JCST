import { model, Schema, type HydratedDocument, type Types } from 'mongoose';

export interface RefreshSessionRecord {
  userId: Types.ObjectId;
  familyId: string;
  tokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
  replacedBySessionId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshSessionDocument = HydratedDocument<RefreshSessionRecord>;

const refreshSessionSchema = new Schema<RefreshSessionRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    familyId: {
      type: String,
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    ipAddress: {
      type: String,
      default: null,
      maxlength: 128,
    },
    userAgent: {
      type: String,
      default: null,
      maxlength: 512,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },
    revokedReason: {
      type: String,
      default: null,
      maxlength: 160,
    },
    replacedBySessionId: {
      type: Schema.Types.ObjectId,
      ref: 'RefreshSession',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'sessions_ttl' });
refreshSessionSchema.index(
  { userId: 1, revokedAt: 1, expiresAt: 1 },
  { name: 'sessions_user_active' },
);

export const RefreshSessionModel = model<RefreshSessionRecord>(
  'RefreshSession',
  refreshSessionSchema,
);
