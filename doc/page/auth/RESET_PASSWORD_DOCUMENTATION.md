# Reset Password Screen Documentation

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
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
```

## Context and State Management
- **Context provider:** `AuthProvider` from `contexts/AuthContext.tsx` wraps the app and exposes the `useAuth` hook.
- **Redux slice:** `redux/slices/authSlice.ts` stores `user`, `isAuthenticated`, `isLoading`, and `error`.
- **Persistent storage:** `localStorage` stores tokens and user data (not used for reset password flow).
- **Hook usage on reset password screen:** `const { resetPassword, isLoading } = useAuth();`
- **Form state:** `formData` object `{ newPassword: string; confirmPassword: string }` managed with `useState`.
- **Additional state:** `showPassword`, `showConfirmPassword`, `isSuccess`, `validationErrors`.
- **URL params:** `token` extracted from URL using `useParams()` hook.

**`resetPassword` function (from `AuthContext.tsx`):**
```typescript
const resetPassword = async (token: string, newPassword: string): Promise<AuthResult> => {
  try {
    await authAPI.resetPassword(token, { newPassword });
    return { success: true };
  } catch (resetError: any) {
    const errorMessage = resetError?.response?.data?.message || resetError?.message || 'Failed to reset password';
    return { success: false, error: errorMessage };
  }
};
```

## UI Structure
- **Screen shell:** Two-column responsive layout (`flex-col lg:flex-row`) with full-height container using `.auth-page` and `.auth-container`.
- **Left side:** Logo and title section, centered vertically and horizontally.
- **Right side:** Password reset form OR success message with confirmation.
- **Typography:** Uses Tailwind utility classes with custom `.auth-title` and `.auth-subtitle` classes for headings.
- **Branding:** Logo image displayed prominently on the left side.
- **Feedback:** Validation errors displayed below inputs, password requirements shown in real-time, success state shows confirmation message.

## Planned Layout

### Form State Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ New Password   │ │
│  │              │   │   │ [🔒 Input] [👁] │ │
│  └──────────────┘   │   │                 │ │
│                     │   │ Password reqs:  │ │
│  Title:             │   │ ✓ At least 6    │ │
│  "Reset your        │   │ ✓ One uppercase │ │
│   password"         │   │ ✓ One lowercase │ │
│                     │   │ ✓ One number    │ │
│  Subtitle:          │   ├─────────────────┤ │
│  "Enter your new    │   │ Confirm Password│ │
│   password below."  │   │ [🔒 Input] [👁] │ │
│                     │   │                 │ │
│                     │   │ ✓ Passwords     │ │
│                     │   │   match         │ │
│                     │   ├─────────────────┤ │
│                     │   │ Validation Error│ │
│                     │   │ (if any)       │ │
│                     │   ├─────────────────┤ │
│                     │   │ Reset Password │ │
│                     │   │ Button         │ │
│                     │   ├─────────────────┤ │
│                     │   │ [Back to login] │ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

### Success State Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ ✓ Success Icon  │ │
│  │              │   │   │                 │ │
│  └──────────────┘   │   │ Password reset  │ │
│                     │   │ successful!     │ │
│  Title:             │   │                 │ │
│  "Password reset    │   │ Your password   │ │
│   successful!"      │   │ has been        │ │
│                     │   │ successfully    │ │
│  Subtitle:          │   │ reset. You can │ │
│  "Your password has │   │ now log in with │ │
│   been successfully  │   │ your new        │ │
│   reset. You can     │   │ password.       │ │
│   now log in with    │   │                 │ │
│   your new password."│   │ [Go to login]   │ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe

### Form State
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │  New Password             │ │
│  │    Logo      │              │  🔒 [_______________] [👁]│ │
│  │              │              │                          │ │
│  └──────────────┘              │  Password must contain:  │ │
│                                 │  ✓ At least 6 characters│ │
│  Reset your password             │  ✓ One uppercase letter │ │
│  Enter your new password below.  │  ✓ One lowercase letter │ │
│                                 │  ✓ One number           │ │
│                                 │                          │ │
│                                 │  Confirm New Password   │ │
│                                 │  🔒 [_______________] [👁]│ │
│                                 │                          │ │
│                                 │  ✓ Passwords match      │ │
│                                 │  (or ✗ Passwords do not)│ │
│                                 │                          │ │
│                                 │  Validation error        │ │
│                                 │  (if any)               │ │
│                                 │                          │ │
│                                 │  [  Reset Password  ]   │ │
│                                 │                          │ │
│                                 │  [Back to login]        │ │
│                                 └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

### Success State
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │      ✓                   │ │
│  │    Logo      │              │                          │ │
│  │              │              │  Password reset          │ │
│  └──────────────┘              │  successful!             │ │
│                                 │                          │ │
│  Password reset successful!     │  Your password has been │ │
│  Your password has been          │  successfully reset.     │ │
│  successfully reset. You can      │  You can now log in with │ │
│  now log in with your new        │  your new password.     │ │
│  password.                       │                          │ │
│                                  │  [  Go to login  ]      │ │
│                                  └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **New Password Input Field** (with show/hide toggle)
  ```typescript
  <div className="auth-field">
    <label htmlFor="newPassword" className="label">New Password</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="newPassword"
        name="newPassword"
        type={showPassword ? 'text' : 'password'}
        required
        className={`input-password pl-10 ${validationErrors.newPassword ? 'border-red-500' : ''}`}
        placeholder="Enter new password"
        value={formData.newPassword}
        onChange={handleInputChange}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="input-toggle-icon"
        >
          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      </div>
      {validationErrors.newPassword && (
        <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
      )}
    </div>
    {/* Password requirements */}
    {formData.newPassword && (
      <div className="mt-2 text-xs text-gray-600">
        <p>Password must contain:</p>
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

- **Confirm Password Input Field** (with show/hide toggle)
  ```typescript
  <div className="auth-field">
    <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        className={`input-password pl-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
        placeholder="Confirm new password"
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
      {validationErrors.confirmPassword && (
        <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
      )}
    </div>
    {/* Password match indicator */}
    {formData.confirmPassword && (
      <div className="mt-2 text-xs">
        {formData.newPassword === formData.confirmPassword ? (
          <p className="text-green-600">✓ Passwords match</p>
        ) : (
          <p className="text-red-600">✗ Passwords do not match</p>
        )}
      </div>
    )}
  </div>
  ```

- **Submit Button**
  ```typescript
  <button
    type="submit"
    disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
    className="auth-button"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Resetting...
      </div>
    ) : (
      'Reset Password'
    )}
  </button>
  ```

- **Back to Login Link**
  ```typescript
  <Link
    to="/login"
    className="text-sm font-medium text-gray-600 hover:text-brand-primary mt-4"
  >
    Back to login
  </Link>
  ```

- **Success State - Go to Login Button**
  ```typescript
  <Link
    to="/login"
    className="auth-button inline-flex items-center justify-center"
  >
    Go to login
  </Link>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `authAPI.resetPassword`.
- **Endpoint:** `POST /api/auth/reset-password/:token`.
- **Payload:** `{ newPassword: string }`.
- **URL parameter:** `token` extracted from URL route parameter.
- **Response contract:** Success response typically contains `{ success: true, message: string }`.
- **Token handling:** Reset token is passed in URL, not stored in localStorage.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `Link`, `useParams`, `useNavigate`.
- Form elements: `input`, `button`, `label`, `div`, `p`, `ul`, `li`.
- `react-icons/fi` for icons (FiLock, FiEye, FiEyeOff, FiCheck).
- Tailwind CSS classes for styling with custom classes (`.auth-title`, `.auth-button`, `.input-password`).
- Logo image from `assets/logo.png`.

## Error Handling
- **Validation errors:** Client-side validation validates password format and match before submission.
  - Password must be at least 6 characters.
  - Password must contain at least one uppercase letter, one lowercase letter, and one number.
  - Confirm password must match new password.
  - Errors stored in `validationErrors` state object.
  - Displayed below respective input fields in red text.
- **API errors:** Handled in `handleSubmit` function.
  - Error message displayed via error banner.
  - Error stored in validation errors if validation fails.
- **Real-time validation:** Password requirements shown with visual indicators (green/red) as user types.
- **Password match indicator:** Shows green checkmark when passwords match, red X when they don't.
- **Form state persistence:** Input values persist in local state after validation failures.

## Navigation Flow
- **Route:** `/reset-password/:token`.
- **Entry points:**
  - From password reset email link (contains token in URL).
  - Direct URL access with valid token.
- **On successful reset:** Component switches to success state, then user can navigate to login.
- **Secondary navigation:**
  - "Back to login" link ➞ `/login`.
  - "Go to login" button (in success state) ➞ `/login`.

## Functions Involved

- **`handleSubmit`** — Validates passwords, calls `resetPassword` API, switches to success state on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Validate form data
      if (!formData.newPassword || formData.newPassword.length < 6 || !/[A-Z]/.test(formData.newPassword) || !/[a-z]/.test(formData.newPassword) || !/\d/.test(formData.newPassword)) {
        setValidationErrors({ newPassword: 'Password must meet all requirements' });
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setValidationErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }

      if (!token) {
        setValidationErrors({ general: 'Invalid reset token' });
        return;
      }

      const result = await resetPassword(token, formData.newPassword);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setValidationErrors({ general: result.error || 'Failed to reset password' });
      }
    } catch (error) {
      setValidationErrors({ general: 'An unexpected error occurred' });
    }
  };
  ```

- **`handleInputChange`** — Updates form data state when user types in input fields.
  ```typescript
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error for this field
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof validationErrors];
        return newErrors;
      });
    }
  };
  ```

- **Token extraction** — Extracts reset token from URL parameters.
  ```typescript
  const { token } = useParams<{ token: string }>();
  ```

## Future Enhancements
- Add password strength meter with visual indicator.
- Add option to show/hide password requirements initially.
- Add token expiration validation and display.
- Add option to regenerate reset link if token expired.
- Add security check to prevent using recently used passwords.
- Add password history tracking.
- Add biometric authentication option after password reset.
- Add email notification when password is successfully reset.
- Add rate limiting feedback for reset attempts.
- Add accessibility improvements (ARIA labels, keyboard navigation).
- Add password generator option for users.
