import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  WebsiteContentRecord,
  WebsiteContentType,
  WebsiteBootstrapData,
} from '@jcst/shared';
import { apiClient } from '@/services/apiClient';

export const websiteApi = {
  bootstrap: async (): Promise<WebsiteBootstrapData> => {
    const response =
      await apiClient.get<ApiSuccessResponse<WebsiteBootstrapData>>('/website/bootstrap');
    return response.data.data;
  },
  list: async (type: WebsiteContentType): Promise<WebsiteContentRecord[]> => {
    const response = await apiClient.get<ApiSuccessResponse<{ items: WebsiteContentRecord[] }>>(
      `/website/${type}`,
    );
    return response.data.data.items;
  },
  get: async (type: WebsiteContentType, slug: string): Promise<WebsiteContentRecord> => {
    const response = await apiClient.get<ApiSuccessResponse<WebsiteContentRecord>>(
      `/website/${type}/${slug}`,
    );
    return response.data.data;
  },
  adminList: async (type?: WebsiteContentType): Promise<WebsiteContentRecord[]> => {
    const response = await apiClient.get<ApiPaginatedResponse<WebsiteContentRecord>>(
      '/admin/website',
      { params: { type, limit: 100 } },
    );
    return response.data.data;
  },
  create: async (data: Omit<WebsiteContentRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post<ApiSuccessResponse<WebsiteContentRecord>>(
      '/admin/website',
      data,
    );
    return response.data.data;
  },
  update: async (id: string, data: Partial<WebsiteContentRecord>) => {
    const response = await apiClient.patch<ApiSuccessResponse<WebsiteContentRecord>>(
      `/admin/website/${id}`,
      data,
    );
    return response.data.data;
  },
  archive: async (id: string) => apiClient.delete(`/admin/website/${id}`),
};
