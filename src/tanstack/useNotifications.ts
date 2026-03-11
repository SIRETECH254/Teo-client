import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../api';
import type { GetNotificationsParams } from '../types/api.types';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes

// Get current user's notifications
export const useGetNotifications = (params?: GetNotificationsParams) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await notificationAPI.getNotifications(params);
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get unread notification count
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await notificationAPI.getUnreadCount();
      return response.data.data;
    },
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Get single notification details by ID
export const useGetNotification = (notificationId: string) => {
  return useQuery({
    queryKey: ['notification', notificationId],
    queryFn: async () => {
      const response = await notificationAPI.getNotification(notificationId);
      return response.data.data;
    },
    enabled: !!notificationId,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

// Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationAPI.markAsRead(notificationId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      console.log('Notification marked as read');
    },
    onError: (error: any) => {
      console.error('Mark notification as read error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
      console.error('Error:', errorMessage);
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationAPI.markAllAsRead();
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      console.log('All notifications marked as read');
    },
    onError: (error: any) => {
      console.error('Mark all notifications as read error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark all notifications as read';
      console.error('Error:', errorMessage);
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationAPI.deleteNotification(notificationId);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      console.log('Notification deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete notification error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete notification';
      console.error('Error:', errorMessage);
    },
  });
};
