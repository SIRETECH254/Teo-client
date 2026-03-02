import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewAPI } from '../api';
import type { CreateReviewPayload, UpdateReviewPayload, GetReviewsParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all reviews for a product
// Response: { success: true, data: { reviews: [...], pagination: {...}, stats: {...} } }
export const useGetProductReviews = (productId: string, params?: GetReviewsParams) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId, params],
    queryFn: async () => {
      const response = await reviewAPI.getProductReviews(productId, params);
      // Product reviews: data has nested structure with reviews, pagination, and stats
      return response.data.data;
    },
    enabled: !!productId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Create a new review
// Response: { success: true, data: review }
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewPayload) => {
      const response = await reviewAPI.createReview(reviewData);
      // Create review: data is review object directly
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.product] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
      console.log('Review created successfully');
    },
    onError: (error: any) => {
      console.error('Create review error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create review';
      console.error('Error:', errorMessage);
    },
  });
};

// Update own review
// Response: { success: true, data: review }
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, reviewData }: { reviewId: string; reviewData: UpdateReviewPayload }) => {
      const response = await reviewAPI.updateReview(reviewId, reviewData);
      // Update review: data is review object directly
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review', variables.reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
      console.log('Review updated successfully');
    },
    onError: (error: any) => {
      console.error('Update review error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update review';
      console.error('Error:', errorMessage);
    },
  });
};

// Delete own review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await reviewAPI.deleteReview(reviewId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'user'] });
      console.log('Review deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete review error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      console.error('Error:', errorMessage);
    },
  });
};

// Get current user's reviews
export const useGetUserReviews = (params?: GetReviewsParams) => {
  return useQuery({
    queryKey: ['reviews', 'user', params],
    queryFn: async () => {
      const response = await reviewAPI.getUserReviews(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single review details by ID
export const useGetReviewById = (reviewId: string) => {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      const response = await reviewAPI.getReviewById(reviewId);
      return response.data.data;
    },
    enabled: !!reviewId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
