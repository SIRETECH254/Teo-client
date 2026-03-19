import { useMutation, useQuery } from '@tanstack/react-query';
import { contactAPI } from '../api';
import type { SubmitContactPayload, GetMyMessagesParams } from '../types/api.types';

// Submit contact form message
export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (messageData: SubmitContactPayload) => {
      const response = await contactAPI.submitMessage(messageData);
      return response.data.data;
    },
    onSuccess: () => {
      console.log('Contact message submitted successfully');
    },
    onError: (error: any) => {
      console.error('Submit contact error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit contact message';
      console.error('Error:', errorMessage);
    },
  });
};

// Get all contact messages submitted by the authenticated user
export const useMyMessages = (params?: GetMyMessagesParams) => {
  return useQuery({
    queryKey: ['my-messages', params],
    queryFn: async () => {
      const response = await contactAPI.getMyMessages(params);
      return {
        messages: response.data.data,
        pagination: response.data.pagination
      };
    },
  });
};

// Get single contact message by its ID
export const useContactMessage = (id: string) => {
  return useQuery({
    queryKey: ['contact-message', id],
    queryFn: async () => {
      const response = await contactAPI.getMessageById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};
