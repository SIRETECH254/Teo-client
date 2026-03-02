import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressAPI } from '../api';
import type { CreateAddressPayload, UpdateAddressPayload } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get all addresses for current user
export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await addressAPI.getUserAddresses();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single address details by ID
// Response: { success: true, data: { address } }
export const useGetAddressById = (addressId: string) => {
  return useQuery({
    queryKey: ['address', addressId],
    queryFn: async () => {
      const response = await addressAPI.getAddressById(addressId);
      // Single address: data has nested structure with address key
      return response.data.data.address;
    },
    enabled: !!addressId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Create new address
// Response: { success: true, data: { address } }
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: CreateAddressPayload) => {
      const response = await addressAPI.createAddress(addressData);
      // Create address: data has nested structure with address key
      return response.data.data.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      console.log('Address created successfully');
    },
    onError: (error: any) => {
      console.error('Create address error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create address';
      console.error('Error:', errorMessage);
    },
  });
};

// Update address
// Response: { success: true, data: { address } }
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ addressId, addressData }: { addressId: string; addressData: UpdateAddressPayload }) => {
      const response = await addressAPI.updateAddress(addressId, addressData);
      // Update address: data has nested structure with address key
      return response.data.data.address;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', variables.addressId] });
      console.log('Address updated successfully');
    },
    onError: (error: any) => {
      console.error('Update address error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update address';
      console.error('Error:', errorMessage);
    },
  });
};

// Delete address
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await addressAPI.deleteAddress(addressId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      console.log('Address deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete address error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete address';
      console.error('Error:', errorMessage);
    },
  });
};

// Set address as default
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await addressAPI.setDefaultAddress(addressId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', 'default'] });
      console.log('Default address set successfully');
    },
    onError: (error: any) => {
      console.error('Set default address error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to set default address';
      console.error('Error:', errorMessage);
    },
  });
};

// Get user's default address
export const useGetDefaultAddress = () => {
  return useQuery({
    queryKey: ['address', 'default'],
    queryFn: async () => {
      const response = await addressAPI.getDefaultAddress();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};
