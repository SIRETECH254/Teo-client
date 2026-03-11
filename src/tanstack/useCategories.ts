import { useQuery } from '@tanstack/react-query';
import { categoryAPI } from '../api';
import type { GetCategoriesParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all categories with optional filtering and pagination
export const useGetAllCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const response = await categoryAPI.getAllCategories(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get category tree structure
// Response: { success: true, data: { categories: [...] } }
export const useGetCategoryTree = () => {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const response = await categoryAPI.getCategoryTree();
      // Category tree: data has nested structure with categories key
      return response.data.data.categories;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single category details by ID
// Response: { success: true, data: { category: {...} } }
export const useGetCategoryById = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await categoryAPI.getCategoryById(categoryId);
      // Single category: data has nested structure with category key
      return response.data.data.category;
    },
    enabled: !!categoryId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get root categories
// Response: { success: true, data: { categories: [...] } }
export const useGetRootCategories = () => {
  return useQuery({
    queryKey: ['categories', 'root'],
    queryFn: async () => {
      const response = await categoryAPI.getRootCategories();
      // Root categories: data has nested structure with categories key
      return response.data.data.categories;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
