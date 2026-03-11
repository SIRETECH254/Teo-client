import { useQuery } from '@tanstack/react-query';
import { collectionAPI } from '../api';
import type { GetCollectionsParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all collections with optional filtering and pagination
export const useGetAllCollections = (params?: GetCollectionsParams) => {
  return useQuery({
    queryKey: ['collections', params],
    queryFn: async () => {
      const response = await collectionAPI.getAllCollections(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single collection details by ID
export const useGetCollectionById = (collectionId: string) => {
  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const response = await collectionAPI.getCollectionById(collectionId);
      return response.data.data;
    },
    enabled: !!collectionId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get active collections
export const useGetActiveCollections = () => {
  return useQuery({
    queryKey: ['collections', 'active'],
    queryFn: async () => {
      const response = await collectionAPI.getActiveCollections();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
