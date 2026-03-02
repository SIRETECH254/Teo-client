import { useQuery } from '@tanstack/react-query';
import { brandAPI } from '../api';
import type { GetBrandsParams, GetPopularBrandsParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all brands with optional filtering and pagination
export const useGetAllBrands = (params?: GetBrandsParams) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: async () => {
      const response = await brandAPI.getAllBrands(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single brand details by ID
export const useGetBrandById = (brandId: string) => {
  return useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      const response = await brandAPI.getBrandById(brandId);
      return response.data.data;
    },
    enabled: !!brandId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get popular brands
export const useGetPopularBrands = (params?: GetPopularBrandsParams) => {
  return useQuery({
    queryKey: ['brands', 'popular', params],
    queryFn: async () => {
      const response = await brandAPI.getPopularBrands(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get active brands
export const useGetActiveBrands = () => {
  return useQuery({
    queryKey: ['brands', 'active'],
    queryFn: async () => {
      const response = await brandAPI.getActiveBrands();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
