import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../api';
import type { AddToCartPayload, UpdateCartItemPayload } from '../types/api.types';
import toast from 'react-hot-toast';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get current user's active cart
export const useGetCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartAPI.getCart();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Add item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartData: AddToCartPayload) => {
      const response = await cartAPI.addToCart(cartData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item added to cart successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skuId, updateData }: { skuId: string; updateData: UpdateCartItemPayload }) => {
      const response = await cartAPI.updateCartItem(skuId, updateData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart item updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item';
      toast.error(errorMessage);
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skuId: string) => {
      const response = await cartAPI.removeFromCart(skuId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(errorMessage);
    },
  });
};

// Clear all items from cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await cartAPI.clearCart();
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart';
      toast.error(errorMessage);
    },
  });
};

// Validate cart items (check stock, prices)
export const useValidateCart = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await cartAPI.validateCart();
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Cart validated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to validate cart';
      toast.error(errorMessage);
    },
  });
};
