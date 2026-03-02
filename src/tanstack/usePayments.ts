import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentAPI } from '../api';
import type { PayInvoicePayload } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Pay for an invoice
export const usePayInvoice = () => {
  return useMutation({
    mutationFn: async (paymentData: PayInvoicePayload) => {
      const response = await paymentAPI.payInvoice(paymentData);
      return response.data.data;
    },
    onSuccess: () => {
      console.log('Payment initiated successfully');
    },
    onError: (error: any) => {
      console.error('Pay invoice error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to pay invoice';
      console.error('Error:', errorMessage);
    },
  });
};

// Get single payment details by ID
export const useGetPaymentById = (paymentId: string) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const response = await paymentAPI.getPaymentById(paymentId);
      return response.data.data;
    },
    enabled: !!paymentId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Query the status of an M-Pesa STK Push payment
export const useQueryMpesaStatus = (checkoutRequestId: string) => {
  return useQuery({
    queryKey: ['payment', 'mpesa-status', checkoutRequestId],
    queryFn: async () => {
      const response = await paymentAPI.queryMpesaStatus(checkoutRequestId);
      return response.data.data;
    },
    enabled: !!checkoutRequestId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Query M-Pesa payment by checkout request ID
export const useQueryMpesaByCheckoutId = (checkoutRequestId: string) => {
  return useQuery({
    queryKey: ['payment', 'mpesa', checkoutRequestId],
    queryFn: async () => {
      const response = await paymentAPI.queryMpesaByCheckoutId(checkoutRequestId);
      return response.data.data;
    },
    enabled: !!checkoutRequestId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
