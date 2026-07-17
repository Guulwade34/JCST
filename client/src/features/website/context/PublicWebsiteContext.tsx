/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import type {
  WebsiteBootstrapData,
  WebsiteContentRecord,
  WebsiteFooterColumn,
  WebsiteFooterData,
  WebsiteFooterLink,
  WebsiteNavigationItem,
  WebsiteSiteSettings,
} from '@jcst/shared';
import { websiteApi } from '../websiteApi';

const EMPTY_SITE: WebsiteSiteSettings = {
  institutionName: '',
  shortName: '',
  motto: '',
  establishedText: '',
  logoUrl: '',
  logoAlt: '',
  faviconUrl: '',
  address: '',
  phone: '',
  email: '',
  admissionsEmail: '',
  officeHours: '',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  darkColor: '',
  copyrightText: '',
};

const EMPTY_FOOTER: WebsiteFooterData = {
  description: '',
  columns: [],
  legalLinks: [],
  socialLinks: [],
  newsletterEnabled: false,
};

const EMPTY_BOOTSTRAP: WebsiteBootstrapData = {
  site: EMPTY_SITE,
  copy: {},
  sections: [],
  navigation: [],
  footer: EMPTY_FOOTER,
};

interface PublicWebsiteContextValue extends WebsiteBootstrapData {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  text: (key: string) => string;
  section: (slug: string) => WebsiteContentRecord | undefined;
}

const PublicWebsiteContext = createContext<PublicWebsiteContextValue | null>(null);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const asBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback;

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const normalizeNavigation = (value: unknown): WebsiteNavigationItem[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item, index): WebsiteNavigationItem => ({
      id: asString(item['id']) || `navigation-${index + 1}`,
      label: asString(item['label']),
      to: asString(item['to']),
      enabled: asBoolean(item['enabled'], true),
      order: asNumber(item['order'], index),
      external: asBoolean(item['external']),
      children: normalizeNavigation(item['children']),
    }))
    .filter((item) => item.enabled && item.label.length > 0 && item.to.length > 0)
    .sort((left, right) => left.order - right.order);
};

const normalizeFooterLinks = (value: unknown): WebsiteFooterLink[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item): WebsiteFooterLink => ({
      label: asString(item['label']),
      to: asString(item['to']),
      enabled: asBoolean(item['enabled'], true),
      external: asBoolean(item['external']),
    }))
    .filter((item) => item.enabled && item.label.length > 0 && item.to.length > 0);
};

const normalizeFooterColumns = (value: unknown): WebsiteFooterColumn[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((item, index): WebsiteFooterColumn => ({
      title: asString(item['title']),
      order: asNumber(item['order'], index),
      enabled: asBoolean(item['enabled'], true),
      links: normalizeFooterLinks(item['links']),
    }))
    .filter((item) => item.enabled && item.title.length > 0)
    .sort((left, right) => left.order - right.order);
};

const createSiteSettings = (record: WebsiteContentRecord): WebsiteSiteSettings => {
  const metadata = record.metadata;

  return {
    institutionName: asString(metadata['institutionName']),
    shortName: asString(metadata['shortName']),
    motto: asString(metadata['motto']),
    establishedText: asString(metadata['establishedText']),
    logoUrl: asString(metadata['logoUrl']),
    logoAlt: asString(metadata['logoAlt']),
    faviconUrl: asString(metadata['faviconUrl']),
    address: asString(metadata['address']),
    phone: asString(metadata['phone']),
    email: asString(metadata['email']),
    admissionsEmail: asString(metadata['admissionsEmail']),
    officeHours: asString(metadata['officeHours']),
    primaryColor: asString(metadata['primaryColor']),
    secondaryColor: asString(metadata['secondaryColor']),
    accentColor: asString(metadata['accentColor']),
    darkColor: asString(metadata['darkColor']),
    copyrightText: asString(metadata['copyrightText']),
  };
};

const createBootstrapFallback = async (): Promise<WebsiteBootstrapData> => {
  const [siteRecord, navigationRecord, footerRecord, copyRecords, sectionRecords] =
    await Promise.all([
      websiteApi.get('setting', 'site'),
      websiteApi.get('navigation', 'public-header'),
      websiteApi.get('footer', 'public-footer'),
      websiteApi.list('copy'),
      websiteApi.list('section'),
    ]);

  const copy = Object.fromEntries(
    copyRecords.map((record) => {
      const key = asString(record.metadata['key']) || record.slug;
      return [key, record.body] as const;
    }),
  );

  return {
    site: createSiteSettings(siteRecord),
    copy,
    sections: [...sectionRecords].sort((left, right) => left.order - right.order),
    navigation: normalizeNavigation(navigationRecord.metadata['items']),
    footer: {
      description: footerRecord.body,
      columns: normalizeFooterColumns(footerRecord.metadata['columns']),
      legalLinks: normalizeFooterLinks(footerRecord.metadata['legalLinks']),
      socialLinks: normalizeFooterLinks(footerRecord.metadata['socialLinks']),
      newsletterEnabled: asBoolean(footerRecord.metadata['newsletterEnabled'], true),
    },
  };
};

const loadPublicWebsite = async (): Promise<WebsiteBootstrapData> => {
  try {
    return await websiteApi.bootstrap();
  } catch (bootstrapError) {
    try {
      return await createBootstrapFallback();
    } catch {
      throw bootstrapError;
    }
  }
};

export const PublicWebsiteProvider = ({ children }: { children: ReactNode }) => {
  const query = useQuery({
    queryKey: ['website', 'bootstrap'],
    queryFn: loadPublicWebsite,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const data = query.data ?? EMPTY_BOOTSTRAP;

  useEffect(() => {
    if (!data.site.faviconUrl) return;

    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = data.site.faviconUrl;
  }, [data.site.faviconUrl]);

  const value = useMemo<PublicWebsiteContextValue>(
    () => ({
      ...data,
      isLoading: query.isLoading,
      isError: query.isError,
      errorMessage:
        query.error instanceof Error
          ? query.error.message
          : query.isError
            ? 'Public website content could not be loaded.'
            : '',
      text: (key: string) => data.copy[key] ?? '',
      section: (slug: string) => data.sections.find((item) => item.slug === slug),
    }),
    [data, query.error, query.isError, query.isLoading],
  );

  const style = {
    '--jcst-primary': data.site.primaryColor || '#082F63',
    '--jcst-secondary': data.site.secondaryColor || '#9B111E',
    '--jcst-accent': data.site.accentColor || '#C58B14',
    '--jcst-dark': data.site.darkColor || '#061A35',
  } as CSSProperties;

  return (
    <PublicWebsiteContext.Provider value={value}>
      <div style={style}>{children}</div>
    </PublicWebsiteContext.Provider>
  );
};

export const usePublicWebsite = (): PublicWebsiteContextValue => {
  const value = useContext(PublicWebsiteContext);

  if (!value) {
    throw new Error('usePublicWebsite must be used inside PublicWebsiteProvider');
  }

  return value;
};

export const useWebsiteText = (key: string): string => usePublicWebsite().text(key);
export const useWebsiteSection = (slug: string): WebsiteContentRecord | undefined =>
  usePublicWebsite().section(slug);
export const useWebsiteNavigation = (): WebsiteNavigationItem[] => usePublicWebsite().navigation;