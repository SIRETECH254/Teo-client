# Notification Preferences Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Sketch Wireframe](#sketch-wireframe)
- [Preference Toggles](#preference-toggles)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from '../../../tanstack/useUsers';
import { FiBell, FiMail, FiPhone, FiSmartphone, FiPackage, FiTag, FiAlertCircle } from 'react-icons/fi';
import type { UpdateNotificationPreferencesPayload } from '../../../types/api.types';
```

## Context and State Management
- **TanStack Query hooks:**
  - `useGetNotificationPreferences()` - Fetches current notification preferences.
  - `useUpdateNotificationPreferences()` - Updates notification preferences.
- **Query key:** `['user', 'notification-preferences']` for preferences cache.
- **Hook usage:**
  - `const { data: preferences, isLoading } = useGetNotificationPreferences();`
  - `const updatePreferences = useUpdateNotificationPreferences();`
- **Form state:** `preferences` object managed with `useState` synced with API data.
- **Additional state:** `isSaving`, `saveSuccess`.

**`useGetNotificationPreferences` hook (from `tanstack/useUsers.ts`):**
```typescript
export const useGetNotificationPreferences = () => {
  return useQuery({
    queryKey: ['user', 'notification-preferences'],
    queryFn: async () => {
      const response = await userAPI.getNotificationPreferences();
      return response.data.data.notificationPreferences;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
```

**`useUpdateNotificationPreferences` hook (from `tanstack/useUsers.ts`):**
```typescript
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UpdateNotificationPreferencesPayload) => {
      const response = await userAPI.updateNotificationPreferences(preferences);
      return response.data.data.notificationPreferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'notification-preferences'] });
      console.log('Notification preferences updated successfully');
    },
    onError: (error: any) => {
      console.error('Update notification preferences error:', error);
    },
  });
};
```

## UI Structure
- **Screen shell:** Single-column layout with grouped preference toggles.
- **Preference groups:** Organized by notification type (General, Order Updates, Marketing).
- **Toggle switches:** Individual toggles for each preference with labels and descriptions.
- **Save button:** Optional save button or auto-save on toggle change.
- **Feedback:** Success and error messages displayed above preferences.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Notification Preferences Page              │
│  ┌───────────────────────────────────────┐ │
│  │  General Notifications                 │ │
│  │  ☑ Email notifications                │ │
│  │  ☑ SMS notifications                  │ │
│  │  ☑ In-app notifications               │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Order Updates                         │ │
│  │  ☑ Order status updates               │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Marketing                             │ │
│  │  ☐ Promotions and offers              │ │
│  │  ☐ Stock alerts                        │ │
│  └───────────────────────────────────────┘ │
│  [Save Preferences] [Cancel]               │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  🔔 Notification Preferences                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  General Notifications                              │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 📧 Email notifications            [Toggle ON]│  │   │
│  │  │ Receive notifications via email              │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 📱 SMS notifications            [Toggle ON]  │  │   │
│  │  │ Receive notifications via SMS                │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 📲 In-app notifications         [Toggle ON]  │  │   │
│  │  │ Receive notifications in the app             │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Order Updates                                      │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 📦 Order status updates          [Toggle ON]│  │   │
│  │  │ Get notified about order status changes      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Marketing                                          │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 🏷️ Promotions and offers        [Toggle OFF] │  │   │
│  │  │ Receive promotional offers and discounts      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ ⚠️ Stock alerts                  [Toggle OFF]│  │   │
│  │  │ Get notified when items are back in stock     │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [  Save Preferences  ]  [Cancel]                           │
└───────────────────────────────────────────────────────────────┘
```

## Preference Toggles

- **General Notifications Section**
  ```typescript
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <FiBell className="h-5 w-5 text-brand-primary" />
      General Notifications
    </h2>
    
    <div className="space-y-4">
      {/* Email notifications */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <FiMail className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="font-medium text-gray-900">Email notifications</p>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences?.email || false}
            onChange={(e) => handleToggleChange('email', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>
      
      {/* SMS notifications */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <FiPhone className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="font-medium text-gray-900">SMS notifications</p>
            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences?.sms || false}
            onChange={(e) => handleToggleChange('sms', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>
      
      {/* In-app notifications */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <FiSmartphone className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="font-medium text-gray-900">In-app notifications</p>
            <p className="text-sm text-gray-500">Receive notifications in the app</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences?.inApp || false}
            onChange={(e) => handleToggleChange('inApp', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>
    </div>
  </div>
  ```

- **Order Updates Section**
  ```typescript
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <FiPackage className="h-5 w-5 text-brand-primary" />
      Order Updates
    </h2>
    
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <FiPackage className="h-5 w-5 text-brand-primary" />
        <div>
          <p className="font-medium text-gray-900">Order status updates</p>
          <p className="text-sm text-gray-500">Get notified about order status changes</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={preferences?.orderUpdates || false}
          onChange={(e) => handleToggleChange('orderUpdates', e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
      </label>
    </div>
  </div>
  ```

- **Marketing Section**
  ```typescript
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <FiTag className="h-5 w-5 text-brand-primary" />
      Marketing
    </h2>
    
    <div className="space-y-4">
      {/* Promotions */}
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <FiTag className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="font-medium text-gray-900">Promotions and offers</p>
            <p className="text-sm text-gray-500">Receive promotional offers and discounts</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences?.promotions || false}
            onChange={(e) => handleToggleChange('promotions', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>
      
      {/* Stock alerts */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <FiAlertCircle className="h-5 w-5 text-brand-primary" />
          <div>
            <p className="font-medium text-gray-900">Stock alerts</p>
            <p className="text-sm text-gray-500">Get notified when items are back in stock</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={preferences?.stockAlerts || false}
            onChange={(e) => handleToggleChange('stockAlerts', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
        </label>
      </div>
    </div>
  </div>
  ```

- **Save Button**
  ```typescript
  <div className="flex gap-3 mt-6">
    <button
      onClick={handleSave}
      disabled={updatePreferences.isPending || isSaving}
      className="btn btn-primary flex-1"
    >
      {updatePreferences.isPending || isSaving ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Saving...
        </div>
      ) : (
        'Save Preferences'
      )}
    </button>
    
    <button
      type="button"
      onClick={() => navigate('/profile')}
      className="btn btn-secondary flex-1"
    >
      Cancel
    </button>
  </div>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `userAPI.getNotificationPreferences` and `userAPI.updateNotificationPreferences`.
- **Get preferences endpoint:** `GET /api/users/notifications`.
- **Update preferences endpoint:** `PUT /api/users/notifications`.
- **Auth Required:** Yes (JWT token in Authorization header).
- **Payload:** `{ email: boolean; sms: boolean; inApp: boolean; orderUpdates: boolean; promotions: boolean; stockAlerts: boolean }`.
- **Response contract:** `response.data.data.notificationPreferences` contains preferences object.
- **TanStack Query:** Uses hooks for data fetching, mutations, and cache invalidation.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate` for navigation.
- TanStack Query: `useGetNotificationPreferences` and `useUpdateNotificationPreferences` hooks from `useUsers.ts`.
- `react-icons/fi` for icons (FiBell, FiMail, FiPhone, FiSmartphone, FiPackage, FiTag, FiAlertCircle).
- Tailwind CSS classes for styling with custom classes (`.btn`, `.btn-primary`, `.btn-secondary`).
- HTML elements: `div`, `form`, `input`, `button`, `label`, `p`, `h2`.

## Error Handling
- **Loading state:** Shows spinner while fetching preferences.
- **Error state:** Displays error message in alert banner if API call fails.
- **Save state:** Shows loading indicator while saving preferences.
- **Success state:** Shows success message after successful save.
- **Network errors:** Handled by TanStack Query with automatic retry (1 attempt).
- **401 Unauthorized:** Automatically handled by API interceptor (token refresh).
- **Optimistic updates:** UI updates immediately, reverts on error.

## Navigation Flow
- **Route:** `/profile/notifications`.
- **Entry points:**
  - From profile page via "Notification Preferences" button.
  - Direct URL access (requires authentication).
- **Successful save:** Shows success message, stays on page or navigates back to profile.
- **Cancel:** Navigates back to `/profile`.
- **Authentication:** Page should be protected route (requires login).

## Functions Involved

- **`handleToggleChange`** — Updates preference state and optionally auto-saves.
  ```typescript
  const handleToggleChange = async (key: string, value: boolean) => {
    const updatedPreferences = {
      ...preferences,
      [key]: value,
    };
    
    setPreferences(updatedPreferences);
    
    // Auto-save on toggle change (optional)
    // Or use manual save button approach
    try {
      await updatePreferences.mutateAsync(updatedPreferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      // Revert on error
      setPreferences(preferences);
      console.error('Failed to update preference:', error);
    }
  };
  ```

- **`handleSave`** — Saves all preferences to API.
  ```typescript
  const handleSave = async () => {
    setIsSaving(true);
    setValidationErrors({});

    try {
      const preferencesData: UpdateNotificationPreferencesPayload = {
        email: preferences?.email || false,
        sms: preferences?.sms || false,
        inApp: preferences?.inApp || false,
        orderUpdates: preferences?.orderUpdates || false,
        promotions: preferences?.promotions || false,
        stockAlerts: preferences?.stockAlerts || false,
      };

      await updatePreferences.mutateAsync(preferencesData);
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to save preferences';
      setValidationErrors({ general: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };
  ```

- **Effect to sync preferences** — Loads preferences into state when fetched.
  ```typescript
  useEffect(() => {
    if (preferences) {
      setPreferences({
        email: preferences.email || false,
        sms: preferences.sms || false,
        inApp: preferences.inApp || false,
        orderUpdates: preferences.orderUpdates || false,
        promotions: preferences.promotions || false,
        stockAlerts: preferences.stockAlerts || false,
      });
    }
  }, [preferences]);
  ```

## Future Enhancements
- Add notification frequency settings (immediate, daily digest, weekly digest).
- Add quiet hours configuration (no notifications during specific times).
- Add notification sound preferences.
- Add push notification settings for mobile apps.
- Add email notification format preferences (HTML/text).
- Add notification channel preferences per notification type.
- Add notification preview/test functionality.
- Add notification history/log.
- Add notification grouping preferences.
- Add notification priority levels.
