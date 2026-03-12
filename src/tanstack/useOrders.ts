import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderAPI } from '../api';
import type { CreateOrderPayload, GetOrdersParams, GetMyOrdersParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Create a new order from cart
// Response: { success: true, data: { orderId } }
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CreateOrderPayload) => {
      const response = await orderAPI.createOrder(orderData);
      // Create order: data has nested structure with orderId key
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Order created successfully');
    },
    onError: (error: any) => {
      console.error('Create order error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      console.error('Error:', errorMessage);
    },
  });
};

// Get all orders with optional filtering and pagination
// Response: { success: true, data: { orders: [...], pagination: {...} } }
export const useGetOrders = (params?: GetOrdersParams) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const response = await orderAPI.getOrders(params);
      // Orders list: data has nested structure with orders and pagination
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get current user's orders with optional filtering and pagination
// Response: { success: true, data: { orders: [...], pagination: {...} } }
export const useGetMyOrders = (params?: GetMyOrdersParams) => {
  return useQuery({
    queryKey: ['my-orders', params],
    queryFn: async () => {
      const response = await orderAPI.getMyOrders(params);
      // Orders list: data has nested structure with orders and pagination
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single order details by ID
// Response: { success: true, data: { order } }
export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await orderAPI.getOrderById(orderId);
      // Single order: data has nested structure with order key
      return response.data.data.order;
    },
    enabled: !!orderId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
