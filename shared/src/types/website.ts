export const WEBSITE_CONTENT_TYPES = [
  'page',
  'section',
  'copy',
  'navigation',
  'footer',
  'department',
  'program',
  'course',
  'lecturer',
  'announcement',
  'faq',
  'facility',
  'testimonial',
  'statistic',
  'setting',
] as const;

export type WebsiteContentType = (typeof WEBSITE_CONTENT_TYPES)[number];

export interface WebsiteContentRecord {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteCollectionData {
  items: WebsiteContentRecord[];
}

export interface WebsiteNavigationItem {
  id: string;
  label: string;
  to: string;
  enabled: boolean;
  order: number;
  external?: boolean;
  children?: WebsiteNavigationItem[];
}

export interface WebsiteFooterLink {
  label: string;
  to: string;
  enabled: boolean;
  external?: boolean;
}

export interface WebsiteFooterColumn {
  title: string;
  order: number;
  enabled: boolean;
  links: WebsiteFooterLink[];
}

export interface WebsiteSiteSettings {
  institutionName: string;
  shortName: string;
  motto: string;
  establishedText: string;
  logoUrl: string;
  logoAlt: string;
  faviconUrl: string;
  address: string;
  phone: string;
  email: string;
  admissionsEmail: string;
  officeHours: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkColor: string;
  copyrightText: string;
}

export interface WebsiteFooterData {
  description: string;
  columns: WebsiteFooterColumn[];
  legalLinks: WebsiteFooterLink[];
  socialLinks: WebsiteFooterLink[];
  newsletterEnabled: boolean;
}

export interface WebsiteBootstrapData {
  site: WebsiteSiteSettings;
  copy: Record<string, string>;
  sections: WebsiteContentRecord[];
  navigation: WebsiteNavigationItem[];
  footer: WebsiteFooterData;
}

export interface PublicApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  programSlug: string;
  studyMode: string;
  intake: string;
  previousEducation: string;
  message?: string;
}

export interface ContactMessageInput {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
