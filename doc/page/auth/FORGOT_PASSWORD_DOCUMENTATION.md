# Forgot Password Screen Documentation

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
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
```

## Context and State Management
- **Context provider:** `AuthProvider` from `contexts/AuthContext.tsx` wraps the app and exposes the `useAuth` hook.
- **Redux slice:** `redux/slices/authSlice.ts` stores `user`, `isAuthenticated`, `isLoading`, and `error`.
- **Persistent storage:** `localStorage` stores tokens and user data (not used for forgot password flow).
- **Hook usage on forgot password screen:** `const { forgotPassword, isLoading } = useAuth();`
- **Form state:** `email` string managed with `useState`.
- **Additional state:** `isSubmitted`.

**`forgotPassword` function (from `AuthContext.tsx`):**
```typescript
const forgotPassword = async (email: string): Promise<AuthResult> => {
  try {
    await authAPI.forgotPassword({ email });
    return { success: true };
  } catch (forgotError: any) {
    const errorMessage = forgotError?.response?.data?.message || forgotError?.message || 'Failed to send reset email';
    return { success: false, error: errorMessage };
  }
};
```

## UI Structure
- **Screen shell:** Two-column responsive layout (`flex-col lg:flex-row`) with full-height container using `.auth-page` and `.auth-container`.
- **Left side:** Logo and title section, centered vertically and horizontally.
- **Right side:** Email input form OR success message with confirmation.
- **Typography:** Uses Tailwind utility classes with custom `.auth-title` and `.auth-subtitle` classes for headings.
- **Branding:** Logo image displayed prominently on the left side.
- **Feedback:** Validation error displayed below email input, success state shows confirmation message.

## Planned Layout

### Form State Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ Email address   │ │
│  │              │   │   │ [📧 Input field] │ │
│  └──────────────┘   │   ├─────────────────┤ │
│                     │   │ Validation Error│ │
│  Title:             │   │ (if any)       │ │
│  "Forgot your       │   ├─────────────────┤ │
│   password?"        │   │ Send reset      │ │
│                     │   │ instructions    │ │
│  Subtitle:          │   │ Button         │ │
│  "No worries!       │   ├─────────────────┤ │
│   Enter your email  │   │ [← Back to login]│ │
│   and we'll send    │   └─────────────────┘ │
│   you reset         │                       │
│   instructions."    │                       │
└─────────────────────────────────────────────┘
```

### Success State Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ ✓ Success Icon  │ │
│  │              │   │   │                 │ │
│  └──────────────┘   │   │ Check your email│ │
│                     │   │                 │ │
│  Title:             │   │ We've sent      │ │
│  "Check your        │   │ password reset  │ │
│   email"            │   │ instructions to │ │
│                     │   │ user@example.com│ │
│  Subtitle:          │   │                 │ │
│  "We've sent        │   │ If you don't see│ │
│   password reset    │   │ the email, check│ │
│   instructions to"  │   │ your spam folder│ │
│                     │   │                 │ │
│  Email:             │   │ [← Back to login]│ │
│  user@example.com   │   │                 │ │
│                     │   │ Didn't receive │ │
│                     │   │ the email?      │ │
│                     │   │ [Try again]     │ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe

### Form State
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │  Email address            │ │
│  │    Logo      │              │  📧 [_________________]   │ │
│  │              │              │                          │ │
│  └──────────────┘              │  Validation error         │ │
│                                 │  (if any)                │ │
│  Forgot your password?          │                          │ │
│  No worries! Enter your email   │  [Send reset instructions]│ │
│  and we'll send you reset       │                          │ │
│  instructions.                  │  [← Back to login]      │ │
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
│  │              │              │  Check your email        │ │
│  └──────────────┘              │                          │ │
│                                 │  We've sent password     │ │
│  Check your email                │  reset instructions to  │ │
│  We've sent password reset       │  user@example.com       │ │
│  instructions to                 │                          │ │
│  user@example.com                │  If you don't see the    │ │
│                                  │  email, check your spam │ │
│                                  │  folder.                │ │
│                                  │                          │ │
│                                  │  [← Back to login]      │ │
│                                  │                          │ │
│                                  │  Didn't receive the     │ │
│                                  │  email? [Try again]     │ │
│                                  └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **Email Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="email" className="label">Email address</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiMail className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="input pl-10"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  </div>
  ```

- **Submit Button**
  ```typescript
  <button
    type="submit"
    disabled={isLoading || !email}
    className="auth-button"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Sending...
      </div>
    ) : (
      'Send reset instructions'
    )}
  </button>
  ```

- **Back to Login Link**
  ```typescript
  <Link
    to="/login"
    className="text-sm font-medium text-gray-600 hover:text-brand-primary flex items-center justify-center mx-auto mt-4"
  >
    <FiArrowLeft className="mr-2" />
    Back to login
  </Link>
  ```

- **Success State - Back to Login Button**
  ```typescript
  <Link
    to="/login"
    className="auth-button inline-flex items-center justify-center"
  >
    <FiArrowLeft className="mr-2" />
    Back to login
  </Link>
  ```

- **Success State - Try Again Button**
  ```typescript
  <button
    onClick={() => setIsSubmitted(false)}
    className="font-medium text-brand-primary hover:text-brand-accent transition-colors mt-4"
  >
    Try again
  </button>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.js` via `authAPI.forgotPassword`.
- **Endpoint:** `POST /api/auth/forgot-password`.
- **Payload:** `{ email: string }`.
- **Response contract:** Success response typically contains `{ success: true, message: string }`.
- **Token handling:** No tokens involved in forgot password flow.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `Link`.
- Form elements: `input`, `button`, `label`, `div`, `p`.
- `react-icons/fi` for icons (FiMail, FiArrowLeft, FiCheck).
- Tailwind CSS classes for styling with custom classes (`.auth-title`, `.auth-button`, `.input`, `.auth-inline-message-success`).
- Logo image from `assets/logo.png`.

## Error Handling
- **API errors:** Handled in `handleSubmit` function.
  - Error message displayed via error banner.
- **Form state persistence:** Email value persists in local state.

## Navigation Flow
- **Route:** `/forgot-password`.
- **Entry points:**
  - From login page via "Forgot your password?" link.
  - Direct URL access.
- **On successful submission:** Component switches to success state (no navigation).
- **Secondary navigation:**
  - "Back to login" link ➞ `/login`.
  - "Try again" button (in success state) ➞ Resets to form state.

## Functions Involved

- **`handleSubmit`** — Calls `forgotPassword` API, switches to success state on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };
  ```

## Future Enhancements
- Add phone number option for password reset (SMS verification).
- Add security questions as alternative verification method.
- Add account recovery hints for locked or disabled accounts.
- Add rate limiting feedback when API returns rate limit errors.
- Add email delivery status tracking.
- Add option to resend reset email if not received.
- Add password reset link expiration timer display.
- Add accessibility improvements (ARIA labels, keyboard navigation).
- Add CAPTCHA to prevent abuse.
- Add email domain validation for better user experience.
