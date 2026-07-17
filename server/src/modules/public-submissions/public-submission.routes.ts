/* eslint-disable */
import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';
import { validateBody } from '../../middleware/validate.js';
import { PublicSubmissionModel } from './public-submission.model.js';
import { VerificationModel } from './verification.model.js';

const applicationSchema = z.object({
  fullName: z.string().trim().min(3).max(160),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().min(7).max(30),
  programSlug: z.string().trim().min(1).max(180),
  studyMode: z.string().trim().min(1).max(80),
  intake: z.string().trim().min(1).max(80),
  previousEducation: z.string().trim().min(2).max(500),
  message: z.string().trim().max(2000).optional(),
});
const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.email().trim().toLowerCase(),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
});
const newsletterSchema = z.object({ email: z.email().trim().toLowerCase() });
const ref = (prefix: string) =>
  `${prefix}-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;

export const publicSubmissionRouter = Router();
publicSubmissionRouter.post(
  '/applications',
  validateBody(applicationSchema),
  asyncHandler(async (req, res) => {
    const referenceNumber = ref('JCST-APP');
    await PublicSubmissionModel.create({
      type: 'application',
      referenceNumber,
      email: req.body.email,
      payload: req.body,
    });
    sendSuccess(res, 201, 'Application submitted successfully', {
      referenceNumber,
      status: 'submitted',
    });
  }),
);
publicSubmissionRouter.get(
  '/applications/status',
  asyncHandler(async (req, res) => {
    const referenceNumber = String(req.query['referenceNumber'] ?? '')
      .trim()
      .toUpperCase();
    const email = String(req.query['email'] ?? '')
      .trim()
      .toLowerCase();
    if (!referenceNumber || !email)
      throw new ApiError(400, 'Reference number and email are required');
    const record = await PublicSubmissionModel.findOne({
      type: 'application',
      referenceNumber,
      email,
    });
    if (!record) throw new ApiError(404, 'Application was not found');
    sendSuccess(res, 200, 'Application status retrieved', {
      referenceNumber: record.referenceNumber,
      status: record.status,
      submittedAt: record.createdAt,
    });
  }),
);
publicSubmissionRouter.post(
  '/contact',
  validateBody(contactSchema),
  asyncHandler(async (req, res) => {
    const referenceNumber = ref('JCST-MSG');
    await PublicSubmissionModel.create({
      type: 'contact',
      referenceNumber,
      email: req.body.email,
      payload: req.body,
    });
    sendSuccess(res, 201, 'Your message has been received', { referenceNumber });
  }),
);
publicSubmissionRouter.post(
  '/newsletter',
  validateBody(newsletterSchema),
  asyncHandler(async (req, res) => {
    const existing = await PublicSubmissionModel.findOne({
      type: 'newsletter',
      email: req.body.email,
    });
    if (!existing)
      await PublicSubmissionModel.create({
        type: 'newsletter',
        referenceNumber: ref('JCST-NEWSLETTER'),
        email: req.body.email,
        payload: req.body,
      });
    sendSuccess(res, 200, 'Newsletter subscription saved', { email: req.body.email });
  }),
);

publicSubmissionRouter.get(
  '/verify/:type',
  asyncHandler(async (req, res) => {
    const type = String(req.params['type']) as 'certificate' | 'transcript';
    const number = String(req.query['number'] ?? '')
      .trim()
      .toUpperCase();
    if (!['certificate', 'transcript'].includes(type) || !number)
      throw new ApiError(400, 'A valid verification type and number are required');
    const record = await VerificationModel.findOne({ type, number });
    if (!record) throw new ApiError(404, 'Verification record was not found');
    sendSuccess(res, 200, 'Verification record retrieved', {
      type: record.type,
      number: record.number,
      studentName: record.studentName,
      program: record.program,
      qualification: record.qualification,
      issueDate: record.issueDate,
      status: record.status,
      details: record.safeDetails,
    });
  }),
);
