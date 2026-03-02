import { useQuery } from '@tanstack/react-query';
import { tagAPI } from '../api';
import type { GetTagsParams, GetPopularTagsParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all tags with optional filtering and pagination
export const useGetAllTags = (params?: GetTagsParams) => {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: async () => {
      const response = await tagAPI.getAllTags(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single tag details by ID
export const useGetTagById = (tagId: string) => {
  return useQuery({
    queryKey: ['tag', tagId],
    queryFn: async () => {
      const response = await tagAPI.getTagById(tagId);
      return response.data.data;
    },
    enabled: !!tagId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get popular tags
export const useGetPopularTags = (params?: GetPopularTagsParams) => {
  return useQuery({
    queryKey: ['tags', 'popular', params],
    queryFn: async () => {
      const response = await tagAPI.getPopularTags(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
