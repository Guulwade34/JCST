import {
  PERMISSIONS,
  USER_ROLES,
  USER_STATUSES,
  type Permission,
  type UserRole,
  type UserStatus,
} from '@jcst/shared';
import { model, Schema, type HydratedDocument } from 'mongoose';

export interface UserRecord {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  permissions: Permission[];
  status: UserStatus;
  emailVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserRecord>;

const userSchema = new Schema<UserRecord>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 80,
    },
    roles: {
      type: [String],
      enum: USER_ROLES,
      default: ['student'],
      required: true,
    },
    permissions: {
      type: [String],
      enum: PERMISSIONS,
      default: [],
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: 'pending',
      required: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
      select: false,
    },
    lockedUntil: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    archivedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true, name: 'users_email_unique' });
userSchema.index({ roles: 1, status: 1 }, { name: 'users_roles_status' });

export const UserModel = model<UserRecord>('User', userSchema);
