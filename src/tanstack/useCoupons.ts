import { useMutation } from '@tanstack/react-query';
import { couponAPI } from '../api';
import type { ValidateCouponPayload } from '../types/api.types';

// Validate a coupon code
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (couponData: ValidateCouponPayload) => {
      const response = await couponAPI.validateCoupon(couponData);
      return response.data.data;
    },
    onError: (error: any) => {
      console.error('Validate coupon error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to validate coupon';
      console.error('Error:', errorMessage);
    },
  });
};

// Apply a coupon to an order (typically used during order creation)
export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: async (couponData: ValidateCouponPayload) => {
      const response = await couponAPI.applyCoupon(couponData);
      return response.data.data;
    },
    onError: (error: any) => {
      console.error('Apply coupon error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to apply coupon';
      console.error('Error:', errorMessage);
    },
  });
};
