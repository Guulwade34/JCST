import { WEBSITE_CONTENT_TYPES, type WebsiteContentType } from '@jcst/shared';
import { model, Schema, type HydratedDocument } from 'mongoose';

export interface WebsiteContentRecord {
  type: WebsiteContentType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string;
  icon: string;
  order: number;
  featured: boolean;
  published: boolean;
  metadata: Record<string, unknown>;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type WebsiteContentDocument = HydratedDocument<WebsiteContentRecord>;

const websiteContentSchema = new Schema<WebsiteContentRecord>(
  {
    type: { type: String, enum: WEBSITE_CONTENT_TYPES, required: true, index: true },
    slug: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    title: { type: String, required: true, trim: true, maxlength: 220 },
    excerpt: { type: String, default: '', trim: true, maxlength: 1000 },
    body: { type: String, default: '', maxlength: 50000 },
    imageUrl: { type: String, default: '', trim: true, maxlength: 2000 },
    icon: { type: String, default: '', trim: true, maxlength: 80 },
    order: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, versionKey: false },
);

websiteContentSchema.index(
  { type: 1, slug: 1 },
  { unique: true, name: 'website_type_slug_unique' },
);
websiteContentSchema.index({ type: 1, published: 1, order: 1 }, { name: 'website_public_listing' });
websiteContentSchema.index(
  { title: 'text', excerpt: 'text', body: 'text' },
  { name: 'website_text_search' },
);

export const WebsiteContentModel = model<WebsiteContentRecord>(
  'WebsiteContent',
  websiteContentSchema,
);
