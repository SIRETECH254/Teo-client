# Edit Profile Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Sketch Wireframe](#sketch-wireframe)
- [Form Inputs](#form-inputs)
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
import { useGetProfile, useUpdateProfile } from '../../../tanstack/useUsers';
import { FiUser, FiPhone, FiMapPin, FiClock, FiCamera, FiX } from 'react-icons/fi';
import type { UpdateProfilePayload } from '../../../types/api.types';
```

## Context and State Management
- **TanStack Query hooks:**
  - `useGetProfile()` - Fetches current user profile for form pre-filling.
  - `useUpdateProfile()` - Updates user profile (supports JSON and FormData).
- **Query key:** `['user', 'profile']` for profile cache.
- **Hook usage:** 
  - `const { data: profile, isLoading } = useGetProfile();`
  - `const updateProfile = useUpdateProfile();`
- **Form state:** `formData` object `{ name: string; phone: string; country: string; timezone: string }` managed with `useState`.
- **Additional state:** `avatarFile`, `avatarPreview`, `isSubmitting`.

**`useUpdateProfile` hook (from `tanstack/useUsers.ts`):**
```typescript
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfilePayload | FormData) => {
      const response = await userAPI.updateProfile(profileData);
      return response.data.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      console.log('Profile updated successfully');
    },
    onError: (error: any) => {
      console.error('Update profile error:', error);
    },
  });
};
```

## UI Structure
- **Screen shell:** Single-column layout with profile edit form.
- **Avatar section:** Avatar preview with upload button and remove option.
- **Form fields:** Name, phone, country, and timezone inputs.
- **Submit button:** Save changes button with loading state.
- **Cancel button:** Navigate back to profile page.
- **Feedback:** Success and error messages displayed above form.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Edit Profile Page                          │
│  ┌───────────────────────────────────────┐ │
│  │  Avatar Section                      │ │
│  │  ┌──────────┐                        │ │
│  │  │  Avatar  │  [Upload] [Remove]     │ │
│  │  └──────────┘                        │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │  Form Fields                         │ │
│  │  Name: [________________]           │ │
│  │  Phone: [________________]          │ │
│  │  Country: [________________]         │ │
│  │  Timezone: [________________]        │ │
│  │                                       │ │
│  │  [Save Changes] [Cancel]             │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ✏️ Edit Profile                                              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Profile Picture                                     │   │
│  │                                                       │   │
│  │  ┌──────┐                                            │   │
│  │  │      │                                            │   │
│  │  │Avatar│  [📷 Upload Photo]  [🗑️ Remove]          │   │
│  │  │      │                                            │   │
│  │  └──────┘                                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Full Name                                          │   │
│  │  [John Doe________________]                         │   │
│  │                                                      │   │
│  │  Phone Number                                       │   │
│  │  [+254712345678________]                           │   │
│  │                                                      │   │
│  │  Country                                            │   │
│  │  [Kenya________________]                           │   │
│  │                                                      │   │
│  │  Timezone                                          │   │
│  │  [Africa/Nairobi________]                          │   │
│  │                                                      │   │
│  │  [  Save Changes  ]  [Cancel]                      │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **Avatar Upload Section**
  ```typescript
  <div className="flex flex-col items-center mb-8">
    <div className="relative mb-4">
      {avatarPreview || profile?.avatar ? (
        <img
          src={avatarPreview || profile?.avatar}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-brand-tint border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-4xl font-semibold text-brand-primary">
            {formData.name?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      )}
    </div>
    
    <div className="flex gap-3">
      <label htmlFor="avatar-upload" className="btn btn-secondary btn-sm cursor-pointer">
        <FiCamera className="h-4 w-4 mr-2" />
        Upload Photo
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </label>
      
      {(avatarPreview || profile?.avatar) && (
        <button
          type="button"
          onClick={handleRemoveAvatar}
          className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
        >
          <FiX className="h-4 w-4 mr-2" />
          Remove
        </button>
      )}
    </div>
  </div>
  ```

- **Name Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="name" className="label">
      <FiUser className="inline h-4 w-4 mr-2" />
      Full Name
    </label>
    <input
      id="name"
      name="name"
      type="text"
      required
      className="input"
      placeholder="Enter your full name"
      value={formData.name}
      onChange={handleInputChange}
    />
  </div>
  ```

- **Phone Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="phone" className="label">
      <FiPhone className="inline h-4 w-4 mr-2" />
      Phone Number
    </label>
    <input
      id="phone"
      name="phone"
      type="tel"
      required
      className="input"
      placeholder="Enter your phone number"
      value={formData.phone}
      onChange={handleInputChange}
    />
  </div>
  ```

- **Country Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="country" className="label">
      <FiMapPin className="inline h-4 w-4 mr-2" />
      Country
    </label>
    <input
      id="country"
      name="country"
      type="text"
      className="input"
      placeholder="Enter your country"
      value={formData.country || ''}
      onChange={handleInputChange}
    />
  </div>
  ```

- **Timezone Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="timezone" className="label">
      <FiClock className="inline h-4 w-4 mr-2" />
      Timezone
    </label>
    <input
      id="timezone"
      name="timezone"
      type="text"
      className="input"
      placeholder="e.g., Africa/Nairobi"
      value={formData.timezone || ''}
      onChange={handleInputChange}
    />
  </div>
  ```

- **Submit Button**
  ```typescript
  <div className="flex gap-3 mt-6">
    <button
      type="submit"
      disabled={updateProfile.isPending || isSubmitting}
      className="btn btn-primary flex-1"
    >
      {updateProfile.isPending || isSubmitting ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Saving...
        </div>
      ) : (
        'Save Changes'
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
- **HTTP client:** `axios` instance from `api/config.ts` via `userAPI.updateProfile`.
- **Endpoint:** `PUT /api/users/profile`.
- **Auth Required:** Yes (JWT token in Authorization header).
- **Content-Type:** `application/json` for regular updates, `multipart/form-data` for avatar upload.
- **Payload:** `{ name?: string; phone?: string; avatar?: string | null; country?: string; timezone?: string }` or `FormData` for avatar upload.
- **Response contract:** `response.data.data.user` contains updated user object.
- **TanStack Query:** Uses `useUpdateProfile()` hook with automatic cache invalidation.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate` for navigation.
- TanStack Query: `useGetProfile` and `useUpdateProfile` hooks from `useUsers.ts`.
- `react-icons/fi` for icons (FiUser, FiPhone, FiMapPin, FiClock, FiCamera, FiX).
- Tailwind CSS classes for styling with custom classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.input`, `.label`, `.auth-field`).
- HTML elements: `div`, `form`, `input`, `button`, `label`, `img`, `p`.

## Error Handling
- **Loading state:** Shows spinner while fetching profile data or submitting form.
- **Error state:** Displays error message in alert banner if API call fails.
- **Avatar validation:** Validates file type and size before upload (logs errors to console).
- **Network errors:** Handled by TanStack Query with automatic retry (1 attempt).
- **401 Unauthorized:** Automatically handled by API interceptor (token refresh).
- **Form state persistence:** Input values persist in local state.

## Navigation Flow
- **Route:** `/profile/edit`.
- **Entry points:**
  - From profile page via "Edit Profile" button.
  - Direct URL access (requires authentication).
- **Successful update:** Stays on edit page with success message, or navigates back to profile.
- **Cancel:** Navigates back to `/profile`.
- **Authentication:** Page should be protected route (requires login).

## Functions Involved

- **`handleSubmit`** — Prepares FormData if avatar uploaded, calls update API.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileData: UpdateProfilePayload | FormData;

      // If avatar file is selected, use FormData
      if (avatarFile) {
        const formDataObj = new FormData();
        formDataObj.append('name', formData.name);
        formDataObj.append('phone', formData.phone);
        if (formData.country) formDataObj.append('country', formData.country);
        if (formData.timezone) formDataObj.append('timezone', formData.timezone);
        formDataObj.append('avatar', avatarFile);
        profileData = formDataObj;
      } else if (avatarRemoved) {
        // If avatar was removed, send null
        profileData = {
          name: formData.name,
          phone: formData.phone,
          avatar: null,
          country: formData.country || undefined,
          timezone: formData.timezone || undefined,
        };
      } else {
        // Regular JSON update
        profileData = {
          name: formData.name,
          phone: formData.phone,
          country: formData.country || undefined,
          timezone: formData.timezone || undefined,
        };
      }

      await updateProfile.mutateAsync(profileData);
      
      // Navigate back to profile or show success message
      navigate('/profile');
    } catch (error: any) {
      console.error('Update profile error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  ```

- **`handleInputChange`** — Updates form data state when user types in input fields.
  ```typescript
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  ```

- **`handleAvatarChange`** — Handles avatar file selection and creates preview.
  ```typescript
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('Image size must be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarRemoved(false);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  ```

- **`handleRemoveAvatar`** — Removes avatar and sets flag for API call.
  ```typescript
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarRemoved(true);
  };
  ```

- **Effect to pre-fill form** — Loads profile data into form when profile is fetched.
  ```typescript
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        timezone: profile.timezone || '',
      });
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile]);
  ```

## Future Enhancements
- Add country and timezone dropdown selectors with autocomplete.
- Add phone number formatting and validation with country codes.
- Add avatar cropping functionality before upload.
- Add image compression before upload to reduce file size.
- Add profile completion progress indicator.
- Add social media account linking.
- Add profile visibility settings (public/private).
- Add profile verification badge system.
- Add profile activity log/history.
- Add profile export functionality.
