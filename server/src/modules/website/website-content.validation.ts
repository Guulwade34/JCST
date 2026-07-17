import { WEBSITE_CONTENT_TYPES } from '@jcst/shared';
import { z } from 'zod';

export const websiteContentInputSchema = z.object({
  type: z.enum(WEBSITE_CONTENT_TYPES),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(1).max(220),
  excerpt: z.string().trim().max(1000).default(''),
  body: z.string().max(50000).default(''),
  imageUrl: z
    .string()
    .trim()
    .max(2000)
    .refine(
      (value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value),
      'Image URL must be empty, an absolute HTTP(S) URL, or a root-relative path',
    )
    .default(''),
  icon: z.string().trim().max(80).default(''),
  order: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const websiteContentUpdateSchema = websiteContentInputSchema.partial();
