import { useQuery } from '@tanstack/react-query';
import type { WebsiteContentType } from '@jcst/shared';
import { websiteApi } from './websiteApi';

export const useWebsiteCollection = (type: WebsiteContentType) =>
  useQuery({ queryKey: ['website', type], queryFn: () => websiteApi.list(type) });

export const useWebsiteItem = (type: WebsiteContentType, slug: string) =>
  useQuery({
    queryKey: ['website', type, slug],
    queryFn: () => websiteApi.get(type, slug),
    enabled: Boolean(slug),
  });
