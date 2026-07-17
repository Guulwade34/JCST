/* eslint-disable */
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { WebsiteContentModel } from './website-content.model.js';
import { ApiError } from '../../utils/apiError.js';
import { sendSuccess } from '../../utils/apiResponse.js';

const serialize = (document: any) => ({
  id: document.id,
  type: document.type,
  slug: document.slug,
  title: document.title,
  excerpt: document.excerpt,
  body: document.body,
  imageUrl: document.imageUrl,
  icon: document.icon,
  order: document.order,
  featured: document.featured,
  published: document.published,
  metadata: document.metadata ?? {},
  createdAt: document.createdAt.toISOString(),
  updatedAt: document.updatedAt.toISOString(),
});

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
const asBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;
const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const normalizeLinks = (value: unknown): any[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => ({
      id: asString(item['id']) || `link-${index + 1}`,
      label: asString(item['label']),
      to: asString(item['to']),
      enabled: asBoolean(item['enabled'], true),
      order: asNumber(item['order'], index),
      external: asBoolean(item['external']),
      children: normalizeLinks(item['children']),
    }))
    .filter((item) => item.label && item.to && item.enabled)
    .sort((a, b) => a.order - b.order);
};

export const getPublicBootstrap = async (_request: Request, response: Response) => {
  /*
   * `sanitizeFilter` is enabled globally in database.ts.
   * Because of that, using `{ type: { $in: [...] } }` is intentionally
   * treated as an untrusted object and Mongoose attempts to cast the whole
   * `$in` object to a string.
   *
   * Query each allowed type with a plain string instead. This keeps filter
   * sanitization enabled and avoids weakening API security.
   */
  const bootstrapTypes = [
    'copy',
    'section',
    'navigation',
    'footer',
    'setting',
  ] as const;

  const records = (
    await Promise.all(
      bootstrapTypes.map((type) =>
        WebsiteContentModel.find({
          type,
          published: true,
        })
          .sort({
            order: 1,
            title: 1,
          })
          .exec(),
      ),
    )
  ).flat();

  const copy: Record<string, string> = {};
  const sections: any[] = [];
  let siteRecord: any;
  let navigationRecord: any;
  let footerRecord: any;

  for (const record of records) {
    if (record.type === 'copy') {
      const copyKey = asString(record.metadata?.['key']) || record.slug;
      copy[copyKey] = record.body;
    }
    if (record.type === 'section') sections.push(serialize(record));
    if (record.type === 'setting' && record.slug === 'site') siteRecord = record;
    if (record.type === 'navigation' && record.slug === 'public-header') navigationRecord = record;
    if (record.type === 'footer' && record.slug === 'public-footer') footerRecord = record;
  }

  const siteMetadata = siteRecord?.metadata ?? {};
  const footerMetadata = footerRecord?.metadata ?? {};

  const site = {
    institutionName: asString(siteMetadata['institutionName']),
    shortName: asString(siteMetadata['shortName']),
    motto: asString(siteMetadata['motto']),
    establishedText: asString(siteMetadata['establishedText']),
    logoUrl: asString(siteMetadata['logoUrl']),
    logoAlt: asString(siteMetadata['logoAlt']),
    faviconUrl: asString(siteMetadata['faviconUrl']),
    address: asString(siteMetadata['address']),
    phone: asString(siteMetadata['phone']),
    email: asString(siteMetadata['email']),
    admissionsEmail: asString(siteMetadata['admissionsEmail']),
    officeHours: asString(siteMetadata['officeHours']),
    primaryColor: asString(siteMetadata['primaryColor']),
    secondaryColor: asString(siteMetadata['secondaryColor']),
    accentColor: asString(siteMetadata['accentColor']),
    darkColor: asString(siteMetadata['darkColor']),
    copyrightText: asString(siteMetadata['copyrightText']),
  };

  const columns = Array.isArray(footerMetadata['columns'])
    ? footerMetadata['columns']
        .filter(
          (item: unknown): item is Record<string, unknown> =>
            Boolean(item) && typeof item === 'object',
        )
        .map((item, index) => ({
          title: asString(item['title']),
          order: asNumber(item['order'], index),
          enabled: asBoolean(item['enabled'], true),
          links: normalizeLinks(item['links']),
        }))
        .filter((item) => item.title && item.enabled)
        .sort((a, b) => a.order - b.order)
    : [];

  return sendSuccess(response, 200, 'Website bootstrap retrieved', {
    site,
    copy,
    sections,
    navigation: normalizeLinks(navigationRecord?.metadata?.['items']),
    footer: {
      description: footerRecord?.body ?? '',
      columns,
      legalLinks: normalizeLinks(footerMetadata['legalLinks']),
      socialLinks: normalizeLinks(footerMetadata['socialLinks']),
      newsletterEnabled: asBoolean(footerMetadata['newsletterEnabled'], true),
    },
  });
};

export const listPublicContent = async (request: Request, response: Response) => {
  const type = String(request.params['type']);
  const query = String(request.query['q'] ?? '').trim();
  const filter: any = { type, published: true };
  if (query) filter['$text'] = mongoose.trusted({ $search: query });
  const items = await WebsiteContentModel.find(filter).sort({ order: 1, title: 1 });
  return sendSuccess(response, 200, 'Website content retrieved', { items: items.map(serialize) });
};

export const getPublicContent = async (request: Request, response: Response) => {
  const item = await WebsiteContentModel.findOne({
    type: String(request.params['type']),
    slug: String(request.params['slug']),
    published: true,
  } as any);
  if (!item) throw new ApiError(404, 'Website content was not found');
  return sendSuccess(response, 200, 'Website content retrieved', serialize(item));
};

export const listAdminContent = async (request: Request, response: Response) => {
  const page = Math.max(1, Number(request.query['page'] ?? 1));
  const limit = Math.min(100, Math.max(1, Number(request.query['limit'] ?? 20)));
  const filter: any = {};
  if (request.query['type']) filter['type'] = String(request.query['type']);
  if (request.query['q']) {
    filter['$text'] = mongoose.trusted({ $search: String(request.query['q']) });
  }
  const [items, total] = await Promise.all([
    WebsiteContentModel.find(filter)
      .sort({ type: 1, order: 1, title: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    WebsiteContentModel.countDocuments(filter),
  ]);
  return response.status(200).json({
    success: true,
    message: 'Website content retrieved',
    data: items.map(serialize),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const createContent = async (request: Request, response: Response) => {
  const item = await WebsiteContentModel.create({
    ...request.body,
    createdBy: request.auth?.userId,
    updatedBy: request.auth?.userId,
  });
  return sendSuccess(response, 201, 'Website content created', serialize(item));
};

export const updateContent = async (request: Request, response: Response) => {
  const item = await WebsiteContentModel.findByIdAndUpdate(
    request.params['id'],
    { ...request.body, updatedBy: request.auth?.userId },
    { returnDocument: 'after', runValidators: true },
  );
  if (!item) throw new ApiError(404, 'Website content was not found');
  return sendSuccess(response, 200, 'Website content updated', serialize(item));
};

export const archiveContent = async (request: Request, response: Response) => {
  const item = await WebsiteContentModel.findByIdAndUpdate(
    request.params['id'],
    { published: false, updatedBy: request.auth?.userId },
    { returnDocument: 'after', runValidators: true },
  );
  if (!item) throw new ApiError(404, 'Website content was not found');
  return sendSuccess(response, 200, 'Website content archived', serialize(item));
};