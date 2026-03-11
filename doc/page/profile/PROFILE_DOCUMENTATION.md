# Profile Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Sketch Wireframe](#sketch-wireframe)
- [Profile Information Display](#profile-information-display)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useNavigate } from 'react-router-dom';
import { useGetProfile } from '../../../tanstack/useUsers';
import { FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiEdit2, FiLock, FiMap, FiBell } from 'react-icons/fi';
```

## Context and State Management
- **TanStack Query hook:** `useGetProfile()` from `tanstack/useUsers.ts` fetches current user profile.
- **Query key:** `['user', 'profile']` for cache management.
- **Hook usage on profile screen:** `const { data: profile, isLoading, isError, error } = useGetProfile();`
- **Profile data structure:** `{ id, name, email, phone, avatar, country, timezone }`
- **Loading state:** `isLoading` indicates initial data fetch.
- **Error state:** `isError` and `error` handle API errors.

**`useGetProfile` hook (from `tanstack/useUsers.ts`):**
```typescript
export const useGetProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data.data.user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
```

## UI Structure
- **Screen shell:** Single-column layout with profile information card and action buttons.
- **Profile card:** Displays user avatar, name, email, phone, country, and timezone.
- **Action buttons:** Links to edit profile, change password, manage addresses, and notification preferences.
- **Typography:** Uses Tailwind utility classes with custom button classes.
- **Avatar display:** Circular avatar image or initials fallback.
- **Feedback:** Loading spinner during data fetch, error message on failure.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Profile Page                               │
│  ┌───────────────────────────────────────┐ │
│  │  Profile Card                         │ │
│  │  ┌──────────┐                         │ │
│  │  │  Avatar  │  Name                   │ │
│  │  │          │  Email                  │ │
│  │  └──────────┘  Phone                  │ │
│  │                 Country               │ │
│  │                 Timezone              │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │ [Edit Profile] [Change Password]│ │ │
│  │  └─────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │ [Manage Addresses]              │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │ [Notification Preferences]      │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  👤 Profile                                           │   │
│  │                                                       │   │
│  │  ┌──────┐                                             │   │
│  │  │      │  John Doe                                   │   │
│  │  │ Avatar│  john@example.com                          │   │
│  │  │      │  +254712345678                             │   │
│  │  └──────┘  📍 Kenya                                  │   │
│  │            🕐 Africa/Nairobi                         │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  ✏️  Edit Profile    🔒 Change Password       │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  📍 Manage Addresses                            │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  │                                                       │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │  🔔 Notification Preferences                     │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Profile Information Display

- **Avatar Display**
  ```typescript
  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-brand-tint border-4 border-white shadow-lg">
    {profile?.avatar ? (
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      <span className="text-3xl font-semibold text-brand-primary">
        {profile?.name?.charAt(0).toUpperCase() || 'U'}
      </span>
    )}
  </div>
  ```

- **Profile Information Section**
  ```typescript
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <FiUser className="h-5 w-5 text-brand-primary" />
      <div>
        <p className="text-sm text-gray-500">Full Name</p>
        <p className="text-lg font-semibold text-gray-900">{profile?.name || 'N/A'}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      <FiMail className="h-5 w-5 text-brand-primary" />
      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="text-lg font-semibold text-gray-900">{profile?.email || 'N/A'}</p>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      <FiPhone className="h-5 w-5 text-brand-primary" />
      <div>
        <p className="text-sm text-gray-500">Phone</p>
        <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'N/A'}</p>
      </div>
    </div>
    
    {profile?.country && (
      <div className="flex items-center gap-3">
        <FiMapPin className="h-5 w-5 text-brand-primary" />
        <div>
          <p className="text-sm text-gray-500">Country</p>
          <p className="text-lg font-semibold text-gray-900">{profile.country}</p>
        </div>
      </div>
    )}
    
    {profile?.timezone && (
      <div className="flex items-center gap-3">
        <FiClock className="h-5 w-5 text-brand-primary" />
        <div>
          <p className="text-sm text-gray-500">Timezone</p>
          <p className="text-lg font-semibold text-gray-900">{profile.timezone}</p>
        </div>
      </div>
    )}
  </div>
  ```

- **Action Buttons**
  ```typescript
  <div className="flex flex-col sm:flex-row gap-3 mt-6">
    <button
      onClick={() => navigate('/profile/edit')}
      className="btn btn-primary flex items-center justify-center gap-2"
    >
      <FiEdit2 className="h-4 w-4" />
      Edit Profile
    </button>
    
    <button
      onClick={() => navigate('/profile/change-password')}
      className="btn btn-secondary flex items-center justify-center gap-2"
    >
      <FiLock className="h-4 w-4" />
      Change Password
    </button>
  </div>
  
  <button
    onClick={() => navigate('/profile/addresses')}
    className="btn btn-secondary w-full flex items-center justify-center gap-2 mt-3"
  >
    <FiMap className="h-4 w-4" />
    Manage Addresses
  </button>
  
  <button
    onClick={() => navigate('/profile/notifications')}
    className="btn btn-secondary w-full flex items-center justify-center gap-2 mt-3"
  >
    <FiBell className="h-4 w-4" />
    Notification Preferences
  </button>
  ```

- **Loading State**
  ```typescript
  {isLoading && (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
    </div>
  )}
  ```

- **Error State**
  ```typescript
  {isError && (
    <div className="alert alert-error">
      <p>{error?.response?.data?.message || 'Failed to load profile'}</p>
    </div>
  )}
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `userAPI.getProfile`.
- **Endpoint:** `GET /api/users/profile`.
- **Auth Required:** Yes (JWT token in Authorization header).
- **Response contract:** `response.data.data.user` contains profile object.
- **TanStack Query:** Uses `useGetProfile()` hook for data fetching and caching.
- **Cache management:** Profile data cached for 5 minutes (staleTime).
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate` for navigation.
- TanStack Query: `useGetProfile` hook for data fetching.
- `react-icons/fi` for icons (FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiEdit2, FiLock, FiMap, FiBell).
- Tailwind CSS classes for styling with custom classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.alert`, `.alert-error`).
- HTML elements: `div`, `img`, `button`, `p`, `span`.

## Error Handling
- **Loading state:** Shows spinner while fetching profile data.
- **Error state:** Displays error message in alert banner if API call fails.
- **Empty state:** Handles missing profile fields gracefully (shows 'N/A').
- **Network errors:** Handled by TanStack Query with automatic retry (1 attempt).
- **401 Unauthorized:** Automatically handled by API interceptor (token refresh).

## Navigation Flow
- **Route:** `/profile`.
- **Entry points:**
  - From navigation menu/sidebar.
  - Direct URL access (requires authentication).
- **Navigation to other pages:**
  - "Edit Profile" button ➞ `/profile/edit`.
  - "Change Password" button ➞ `/profile/change-password`.
  - "Manage Addresses" button ➞ `/profile/addresses`.
  - "Notification Preferences" button ➞ `/profile/notifications`.
- **Authentication:** Page should be protected route (requires login).

## Functions Involved

- **Component render** — Displays profile information and action buttons.
  ```typescript
  const Profile = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading, isError, error } = useGetProfile();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="alert alert-error">
          <p>{error?.response?.data?.message || 'Failed to load profile'}</p>
        </div>
      );
    }

    return (
      <div className="page-container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Profile</h1>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {/* Profile content */}
          </div>
        </div>
      </div>
    );
  };
  ```

## Future Enhancements
- Add profile completion progress indicator.
- Add account verification status badge.
- Add profile statistics (orders, reviews, etc.).
- Add social media account linking.
- Add profile activity timeline.
- Add profile sharing functionality.
- Add profile export/download option.
- Add profile deletion/account deactivation option.
- Add two-factor authentication status and setup.
- Add account security settings overview.
