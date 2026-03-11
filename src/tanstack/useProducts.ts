import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../api';
import type { GetProductsParams, GetOptimizedImagesParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all products with optional filtering and pagination
// Response: { success: true, data: products.docs, pagination: {...} }
export const useGetAllProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productAPI.getAllProducts(params);
      // Products list: data is array directly, pagination at root level
      return {
        products: response.data.data || [],
        pagination: response.data.pagination,
      };
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single product details by ID
// Response: { success: true, data: product }
export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productAPI.getProductById(productId);
      // Single product: data is product object directly
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get optimized and responsive image URLs for a product
// Response: { success: true, data: { images: [...] } }
export const useGetOptimizedImages = (productId: string, params?: GetOptimizedImagesParams) => {
  return useQuery({
    queryKey: ['product', productId, 'optimized-images', params],
    queryFn: async () => {
      const response = await productAPI.getOptimizedImages(productId, params);
      // Optimized images: data has nested structure
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
