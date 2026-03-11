import { useQuery } from '@tanstack/react-query';
import { packagingAPI } from '../api';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get packaging options with optional filtering
export const useGetPackaging = (params = {}) => {
  return useQuery({
    queryKey: ['packaging', params],
    queryFn: async () => {
      const response = await packagingAPI.getPackaging(params);
      return response.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get active packaging options
export const useGetActivePackaging = () => {
  return useQuery({
    queryKey: ['packaging', 'active'],
    queryFn: async () => {
      const response = await packagingAPI.getActivePackaging();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get default packaging option
export const useGetDefaultPackaging = () => {
  return useQuery({
    queryKey: ['packaging', 'default'],
    queryFn: async () => {
      const response = await packagingAPI.getDefaultPackaging();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single packaging option details by ID
export const useGetPackagingById = (packagingId: string) => {
  return useQuery({
    queryKey: ['packaging', packagingId],
    queryFn: async () => {
      const response = await packagingAPI.getPackagingById(packagingId);
      return response.data.data;
    },
    enabled: !!packagingId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
