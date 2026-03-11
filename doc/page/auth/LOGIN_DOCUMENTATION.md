# Login Screen Documentation

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
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
```

## Context and State Management
- **Context provider:** `AuthProvider` from `contexts/AuthContext.tsx` wraps the app and exposes the `useAuth` hook.
- **Redux slice:** `redux/slices/authSlice.ts` stores `user`, `isAuthenticated`, `isLoading`, and `error`.
- **Persistent storage:** `localStorage` stores `accessToken`, `refreshToken`, and serialized `user` data.
- **Hook usage on login screen:** `const { login, isLoading, error } = useAuth();`
- **Form state:** `formData` object `{ email: string; password: string }` managed with `useState`.
- **Additional state:** `showPassword`.

**`login` function (from `AuthContext.tsx`):**
```typescript
const login = async (credentials: LoginPayload): Promise<AuthResult> => {
  dispatch(loginStart());
  dispatch(setAuthLoading(true));

  try {
    const response = await authAPI.login(credentials);
    const { user: userData, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(loginSuccess({ user: userData, accessToken, refreshToken }));
    return { success: true };
  } catch (loginError: any) {
    const errorMessage = loginError?.response?.data?.message || loginError?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    dispatch(setAuthFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
```

## UI Structure
- **Screen shell:** Two-column responsive layout (`flex-col lg:flex-row`) with full-height container using `.auth-page` and `.auth-container`.
- **Left side:** Logo and title section, centered vertically and horizontally.
- **Right side:** Login form with email input, password input, and forgot password link.
- **Typography:** Uses Tailwind utility classes with custom `.auth-title` and `.auth-subtitle` classes for headings.
- **Branding:** Logo image displayed prominently on the left side.
- **Feedback:** Error banner shown above submit button.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ Email Input     │ │
│  │              │   │   │ Field           │ │
│  └──────────────┘   │   ├─────────────────┤ │
│                     │   │ Password Input │ │
│  Title:             │   │ (with toggle)   │ │
│  "Sign in to        │   ├─────────────────┤ │
│   your account"     │   │ Error Message  │ │
│                     │   │ (if any)       │ │
│  Subtitle:          │   ├─────────────────┤ │
│  "Welcome back!     │   │ Forgot Password│ │
│   Please enter      │   ├─────────────────┤ │
│   your details."    │   │ Sign in Button │ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │  📧 Email Input          │ │
│  │    Logo      │              │                          │ │
│  │              │              │  🔒 Password [👁]        │ │
│  └──────────────┘              │                          │ │
│                                 │  Error message (if any)  │ │
│  Sign in to your account        │                          │ │
│  Welcome back! Please enter     │  Forgot your password?   │ │
│  your details.                  │                          │ │
│                                 │  [  Sign in  ]          │ │
│                                 └──────────────────────────┘ │
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
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
      />
    </div>
  </div>
  ```

- **Password Field** (with show/hide toggle)
  ```typescript
  <div className="auth-field">
    <label htmlFor="password" className="label">Password</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        className="input-password pl-10"
        placeholder="Enter your password"
        value={formData.password}
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
    </div>
  </div>
  ```

- **Submit Button**
  ```typescript
  <button
    type="submit"
    disabled={isLoading}
    className="auth-button"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Signing in...
      </div>
    ) : (
      'Sign in'
    )}
  </button>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `authAPI.login`.
- **Endpoint:** `POST /api/auth/login`.
- **Payload:** `{ email: string; password: string }`.
- **Response contract:** `response.data.data` contains `{ user, accessToken, refreshToken }`.
- **Token handling:** Tokens saved to `localStorage`; Redux receives `loginSuccess` action.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate`, `Link`.
- Form elements: `input`, `button`, `label`, `div`, `p`.
- `react-icons/fi` for icons (FiMail, FiLock, FiEye, FiEyeOff).
- Tailwind CSS classes for styling with custom classes (`.auth-title`, `.auth-button`, `.input`, `.input-password`).
- Logo image from `assets/logo.png`.

## Error Handling
- **API errors:** Handled in `handleSubmit` function.
  - Error message displayed in red banner above submit button.
  - Error stored in local `error` state from context.
- **Input change handling:** `handleInputChange` updates form data when user types.
- **Form state persistence:** Input values persist in local state.

## Navigation Flow
- **Route:** `/login`.
- **On app launch:** `/` redirects based on auth state:
  - Authenticated ➞ `/` (Home).
  - Not authenticated ➞ `/login`.
- **Successful login:** `navigate('/')` (root route, which shows Home for authenticated users).
- **Secondary navigation:**
  - "Forgot your password?" link ➞ `/forgot-password`.
  - "Don't have an account? Sign up" link ➞ `/register`.

## Functions Involved

- **`handleSubmit`** — Calls `login` API, handles navigation on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const credentials: LoginPayload = {
        email: formData.email,
        password: formData.password,
      };

      const result = await login(credentials);
      
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
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
  };
  ```

## Future Enhancements
- Add "Remember me" functionality if needed.
- Add rate limiting feedback when API returns rate limit errors.
- Add account lockout handling for multiple failed login attempts.
- Add biometric authentication support (fingerprint, face ID) for mobile devices.
- Add two-factor authentication (2FA) support.
- Add password strength indicator.
- Add login history tracking.
- Add Google OAuth login option.
