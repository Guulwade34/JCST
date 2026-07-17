import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { requirePermissions } from '../../middleware/authorize.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  archiveContent,
  createContent,
  getPublicBootstrap,
  getPublicContent,
  listAdminContent,
  listPublicContent,
  updateContent,
} from './website-content.controller.js';
import {
  websiteContentInputSchema,
  websiteContentUpdateSchema,
} from './website-content.validation.js';

export const publicWebsiteRouter = Router();
publicWebsiteRouter.get('/bootstrap', asyncHandler(getPublicBootstrap));
publicWebsiteRouter.get('/:type', asyncHandler(listPublicContent));
publicWebsiteRouter.get('/:type/:slug', asyncHandler(getPublicContent));

export const adminWebsiteRouter = Router();
adminWebsiteRouter.use(authenticate, requirePermissions('settings.manage'));
adminWebsiteRouter.get('/', asyncHandler(listAdminContent));
adminWebsiteRouter.post('/', validateBody(websiteContentInputSchema), asyncHandler(createContent));
adminWebsiteRouter.patch(
  '/:id',
  validateBody(websiteContentUpdateSchema),
  asyncHandler(updateContent),
);
adminWebsiteRouter.delete('/:id', asyncHandler(archiveContent));