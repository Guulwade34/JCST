/* eslint-disable */
import {
  connectDatabase,
  disconnectDatabase,
} from '../config/database.js';
import { logger } from '../config/logger.js';
import { WebsiteContentModel } from '../modules/website/website-content.model.js';

/**
 * IMPORTANT:
 * Replace the placeholder values below with official JCST payment
 * numbers and support contacts BEFORE accepting real student payments.
 */
const paymentAccounts = [
  {
    id: 'evc-plus',
    provider: 'EVC Plus',
    accountNumber: '+252613426430',
    accountName: 'Jubbaland College of Science and Technology',
    instructions:
      'Send the exact course fee, keep the transaction message, and enter its reference in the enrollment form.',
    type: 'mobile-money',
    enabled: true,
  },
  {
    id: 'zaad',
    provider: 'ZAAD',
    accountNumber: '252613426430',
    accountName: 'Jubbaland College of Science and Technology',
    instructions:
      'Use the official JCST account only and keep the transaction reference for verification.',
    type: 'mobile-money',
    enabled: true,
  },
  {
    id: 'bank-transfer',
    provider: 'Bank Transfer',
    accountNumber: '252613426430',
    accountName: 'Jubbaland College of Science and Technology',
    instructions:
      'Transfer the exact course fee and enter the bank transaction reference in the enrollment form.',
    type: 'bank',
    enabled: true,
  },
];

const paymentSupportWhatsapp =
  '+252613426430'; // Replace with official JCST WhatsApp number

const paymentSupportEmail =
  'admin@jcst.edu.so'; // Replace with official JCST support email  

const run = async () => {
  await connectDatabase();

  try {
    const page = await WebsiteContentModel.findOneAndUpdate(
      {
        type: 'page',
        slug: 'e-learning',
      },
      {
        $set: {
          'metadata.paymentAccounts': paymentAccounts,
          'metadata.paymentSupportWhatsapp':
            paymentSupportWhatsapp,
          'metadata.paymentSupportEmail':
            paymentSupportEmail,
          'metadata.paymentVerificationNotice':
            'Course access is activated only after the JCST finance team verifies the payment transaction.',
        },
      },
      {
        new: true,
      },
    );

    if (!page) {
      throw new Error(
        'The E-Learning page record was not found. Run the E-Learning page seed first.',
      );
    }

    logger.info(
      'E-Learning payment accounts and verification contacts were updated successfully',
    );
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      'Failed to update E-Learning payment configuration',
    );

    process.exitCode = 1;
  }
};

run()
  .catch((error) => {
    logger.error(
      {
        err: error,
      },
      'Failed to run E-Learning payment configuration script',
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });