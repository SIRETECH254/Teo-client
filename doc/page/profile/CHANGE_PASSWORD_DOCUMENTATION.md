# Change Password Screen Documentation

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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangePassword } from '../../../tanstack/useUsers';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import type { ChangePasswordPayload } from '../../../types/api.types';
```

## Context and State Management
- **TanStack Query hook:** `useChangePassword()` from `tanstack/useUsers.ts` for password change mutation.
- **Hook usage on change password screen:** `const changePassword = useChangePassword();`
- **Form state:** `formData` object `{ currentPassword: string; newPassword: string; confirmPassword: string }` managed with `useState`.
- **Additional state:** `showCurrentPassword`, `showNewPassword`, `showConfirmPassword`, `isSubmitting`.

**`useChangePassword` hook (from `tanstack/useUsers.ts`):**
```typescript
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
    },
  });
};
```

## UI Structure
- **Screen shell:** Single-column layout with password change form.
- **Form fields:** Current password, new password, and confirm password inputs with visibility toggles.
- **Password strength indicator:** Visual feedback for new password strength.
- **Submit button:** Change password button with loading state.
- **Cancel button:** Navigate back to profile page.
- **Feedback:** Success and error messages displayed above form.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Change Password Page                       │
│  ┌───────────────────────────────────────┐ │
│  │  Current Password: [________________] │ │
│  │  New Password: [________________]     │ │
│  │  Password requirements:              │ │
│  │  ✓ At least 6 characters             │ │
│  │  ✓ One uppercase                     │ │
│  │  ✓ One lowercase                     │ │
│  │  ✓ One number                        │ │
│  │                                       │ │
│  │  Confirm Password: [________________] │ │
│  │  ✓ Passwords match                   │ │
│  │                                       │ │
│  │  [Change Password] [Cancel]           │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  🔒 Change Password                                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Current Password                                   │   │
│  │  [🔒 •••••••••••••••] [👁]                         │   │
│  │                                                      │   │
│  │  New Password                                       │   │
│  │  [🔒 •••••••••••••••] [👁]                         │   │
│  │                                                      │   │
│  │  Password must contain:                            │   │
│  │  ✓ At least 6 characters                           │   │
│  │  ✓ One uppercase letter                            │   │
│  │  ✓ One lowercase letter                            │   │
│  │  ✓ One number                                      │   │
│  │                                                      │   │
│  │  Confirm Password                                  │   │
│  │  [🔒 •••••••••••••••] [👁]                         │   │
│  │  ✓ Passwords match                                 │   │
│  │                                                      │   │
│  │  Error message (if any)                            │   │
│  │                                                      │   │
│  │  [  Change Password  ]  [Cancel]                   │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **Current Password Field** (with show/hide toggle)
  ```typescript
  <div className="auth-field">
    <label htmlFor="currentPassword" className="label">
      <FiLock className="inline h-4 w-4 mr-2" />
      Current Password
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="currentPassword"
        name="currentPassword"
        type={showCurrentPassword ? 'text' : 'password'}
        required
        className="input-password pl-10"
        placeholder="Enter your current password"
        value={formData.currentPassword}
        onChange={handleInputChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="input-toggle-icon"
        >
          {showCurrentPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  </div>
  ```

- **New Password Field** (with show/hide toggle and strength indicators)
  ```typescript
  <div className="auth-field">
    <label htmlFor="newPassword" className="label">
      <FiLock className="inline h-4 w-4 mr-2" />
      New Password
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="newPassword"
        name="newPassword"
        type={showNewPassword ? 'text' : 'password'}
        required
        className="input-password pl-10"
        placeholder="Enter your new password"
        value={formData.newPassword}
        onChange={handleInputChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="input-toggle-icon"
        >
          {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
    </div>
    {/* Password requirements */}
    {formData.newPassword && (
      <div className="mt-2 text-xs text-gray-600">
        <p className="mb-2">Password must contain:</p>
        <ul className="list-disc list-inside space-y-1">
          <li className={formData.newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}>
            At least 6 characters
          </li>
          <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
            One uppercase letter
          </li>
          <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
            One lowercase letter
          </li>
          <li className={/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-red-600'}>
            One number
          </li>
        </ul>
      </div>
    )}
  </div>
  ```

- **Confirm Password Field** (with show/hide toggle)
  ```typescript
  <div className="auth-field">
    <label htmlFor="confirmPassword" className="label">
      <FiLock className="inline h-4 w-4 mr-2" />
      Confirm Password
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        className="input-password pl-10"
        placeholder="Confirm your new password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="input-toggle-icon"
        >
          {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
    </div>
    {/* Password match indicator */}
    {formData.confirmPassword && (
      <div className="mt-2 text-xs">
        {formData.newPassword === formData.confirmPassword ? (
          <p className="text-green-600 flex items-center gap-1">
            <FiCheck className="h-4 w-4" />
            Passwords match
          </p>
        ) : (
          <p className="text-red-600 flex items-center gap-1">
            <FiX className="h-4 w-4" />
            Passwords do not match
          </p>
        )}
      </div>
    )}
  </div>
  ```

- **Submit Button**
  ```typescript
  <div className="flex gap-3 mt-6">
    <button
      type="submit"
      disabled={changePassword.isPending || isSubmitting}
      className="btn btn-primary flex-1"
    >
      {changePassword.isPending || isSubmitting ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Changing password...
        </div>
      ) : (
        'Change Password'
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
- **HTTP client:** `axios` instance from `api/config.ts` via `userAPI.changePassword`.
- **Endpoint:** `PUT /api/users/change-password`.
- **Auth Required:** Yes (JWT token in Authorization header).
- **Payload:** `{ currentPassword: string; newPassword: string }`.
- **Response contract:** `response.data.data` contains success message.
- **TanStack Query:** Uses `useChangePassword()` hook for mutation.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate` for navigation.
- TanStack Query: `useChangePassword` hook from `useUsers.ts`.
- `react-icons/fi` for icons (FiLock, FiEye, FiEyeOff, FiCheck, FiX).
- Tailwind CSS classes for styling with custom classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.input-password`, `.label`, `.auth-field`, `.input-toggle-icon`).
- HTML elements: `div`, `form`, `input`, `button`, `label`, `p`, `ul`, `li`.

## Error Handling
- **Loading state:** Shows spinner while submitting password change.
- **Error state:** Displays error message in alert banner if API call fails.
- **Network errors:** Handled by TanStack Query with automatic retry (1 attempt).
- **401 Unauthorized:** Automatically handled by API interceptor (token refresh).
- **Form state persistence:** Input values persist in local state.

## Navigation Flow
- **Route:** `/profile/change-password`.
- **Entry points:**
  - From profile page via "Change Password" button.
  - Direct URL access (requires authentication).
- **Successful password change:** Shows success message and navigates back to profile page after delay, or stays on page with success message.
- **Cancel:** Navigates back to `/profile`.
- **Authentication:** Page should be protected route (requires login).

## Functions Involved

- **`handleSubmit`** — Calls change password API, handles navigation on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const passwordData: ChangePasswordPayload = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      await changePassword.mutateAsync(passwordData);
      
      // Show success message and navigate back
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Change password error:', error);
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

## Future Enhancements
- Add password strength meter with visual progress bar.
- Add password history check (prevent reusing last N passwords).
- Add two-factor authentication requirement for password change.
- Add email notification when password is changed.
- Add session invalidation option (logout all devices after password change).
- Add password expiration reminder.
- Add biometric authentication option for password change.
- Add password change confirmation via email/SMS.
- Add password change attempt rate limiting feedback.
- Add password generator tool for creating strong passwords.
