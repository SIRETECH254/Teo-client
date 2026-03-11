import { useMutation } from '@tanstack/react-query';
import { contactAPI } from '../api';
import type { SubmitContactPayload } from '../types/api.types';

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
