import { PERMISSIONS } from '@jcst/shared';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { UserModel } from '../modules/users/user.model.js';
import { hashPassword } from '../services/password.service.js';

const seedAdmin = async (): Promise<void> => {
  const email = env.SEED_ADMIN_EMAIL;
  const password = env.SEED_ADMIN_PASSWORD;
  const firstName = env.SEED_ADMIN_FIRST_NAME ?? 'System';
  const lastName = env.SEED_ADMIN_LAST_NAME ?? 'Administrator';

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('The development admin seed is disabled in production');
  }

  await connectDatabase();
  const passwordHash = await hashPassword(password);

  await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      $set: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        roles: ['super-admin'],
        permissions: [...PERMISSIONS],
        status: 'active',
        emailVerified: true,
        archivedAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
      $setOnInsert: {
        lastLoginAt: null,
      },
    },
    { upsert: true, returnDocument: 'after', runValidators: true },
  );

  logger.info({ email }, 'Development super-admin account is ready');
};

void seedAdmin()
  .then(disconnectDatabase)
  .catch(async (error) => {
    logger.error({ error }, 'Admin seed failed');
    await disconnectDatabase();
    process.exitCode = 1;
  });
