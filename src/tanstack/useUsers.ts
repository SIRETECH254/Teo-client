import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api';
import type {
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateNotificationPreferencesPayload,
} from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get current user profile
// Response: { success: true, data: { user } }
export const useGetProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      // User profile: data has nested structure with user key
      return response.data.data.user;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Update current user profile
// Response: { success: true, data: { user: {...} } }
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfilePayload | FormData) => {
      const response = await userAPI.updateProfile(profileData);
      // Update profile: data has nested structure with user key
      return response.data.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      console.log('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      console.error('Error:', errorMessage);
    },
  });
};

// Change user password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (passwordData: ChangePasswordPayload) => {
      const response = await userAPI.changePassword(passwordData);
      return response.data.data;
    },
    onSuccess: () => {
      console.log('Password changed successfully');
    },
    onError: (error: any) => {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      console.error('Error:', errorMessage);
    },
  });
};

// Get notification preferences
// Response: { success: true, data: { notificationPreferences: {...} } }
export const useGetNotificationPreferences = () => {
  return useQuery({
    queryKey: ['user', 'notification-preferences'],
    queryFn: async () => {
      const response = await userAPI.getNotificationPreferences();
      // Notification preferences: data has nested structure
      return response.data.data.notificationPreferences;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Update notification preferences
// Response: { success: true, data: { notificationPreferences: {...} } }
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UpdateNotificationPreferencesPayload) => {
      const response = await userAPI.updateNotificationPreferences(preferences);
      // Update notification preferences: data has nested structure
      return response.data.data.notificationPreferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'notification-preferences'] });
      console.log('Notification preferences updated successfully');
    },
    onError: (error: any) => {
      console.error('Update notification preferences error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update notification preferences';
      console.error('Error:', errorMessage);
    },
  });
};
