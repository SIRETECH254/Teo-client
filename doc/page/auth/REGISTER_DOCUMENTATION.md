# Register Screen Documentation

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
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiUser } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
```

## Context and State Management
- **Context provider:** `AuthProvider` from `contexts/AuthContext.tsx` wraps the app and exposes the `useAuth` hook.
- **Redux slice:** `redux/slices/authSlice.ts` stores `user`, `isAuthenticated`, `isLoading`, and `error`.
- **Persistent storage:** `localStorage` stores tokens and user data (not used during registration, only after OTP verification).
- **Hook usage on register screen:** `const { register, isLoading, error } = useAuth();`
- **Form state:** `formData` object `{ name: string; email: string; phone: string; password: string; confirmPassword: string }` managed with `useState`.
- **Additional state:** `showPassword`, `showConfirmPassword`.

**`register` function (from `AuthContext.tsx`):**
```typescript
const register = async (userData: RegisterPayload): Promise<AuthResult> => {
  dispatch(registerStart());

  try {
    const response = await authAPI.register(userData);
    dispatch(registerSuccess());
    return { success: true, data: response.data.data };
  } catch (registerError: any) {
    const errorMessage = registerError?.response?.data?.message || registerError?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));
    dispatch(setAuthFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
```

## UI Structure
- **Screen shell:** Two-column responsive layout (`flex-col lg:flex-row`) with full-height container using `.auth-page` and `.auth-container`.
- **Left side:** Logo and title section, centered vertically and horizontally.
- **Right side:** Registration form with name, email, phone, password, and confirm password inputs.
- **Typography:** Uses Tailwind utility classes with custom `.auth-title` and `.auth-subtitle` classes for headings.
- **Branding:** Logo image displayed prominently on the left side.
- **Feedback:** Error banner shown above submit button, password strength indicators.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ Name Input      │ │
│  │              │   │   │ Field           │ │
│  └──────────────┘   │   ├─────────────────┤ │
│                     │   │ Email Input     │ │
│  Title:             │   │ Field           │ │
│  "Create your       │   ├─────────────────┤ │
│   account"           │   │ Phone Input     │ │
│                     │   │ Field           │ │
│  Subtitle:          │   ├─────────────────┤ │
│  "Join us today!    │   │ Password Input │ │
│   Fill in your      │   │ (with toggle)   │ │
│   details below."   │   │ Password reqs:  │ │
│                     │   ├─────────────────┤ │
│                     │   │ Confirm Password│ │
│                     │   │ (with toggle)   │ │
│                     │   ├─────────────────┤ │
│                     │   │ Error Message  │ │
│                     │   │ (if any)       │ │
│                     │   ├─────────────────┤ │
│                     │   │ Sign up Button │ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │  👤 Name Input            │ │
│  │    Logo      │              │                          │ │
│  │              │              │  📧 Email Input          │ │
│  └──────────────┘              │                          │ │
│                                 │  📱 Phone Input          │ │
│  Create your account             │                          │ │
│  Join us today! Fill in your    │  🔒 Password [👁]        │ │
│  details below.                 │  Password requirements:  │ │
│                                 │  ✓ At least 6 chars     │ │
│                                 │  ✓ One uppercase        │ │
│                                 │  ✓ One lowercase        │ │
│                                 │  ✓ One number           │ │
│                                 │                          │ │
│                                 │  🔒 Confirm Password [👁]│ │
│                                 │  ✓ Passwords match      │ │
│                                 │                          │ │
│                                 │  Error message (if any) │ │
│                                 │                          │ │
│                                 │  [  Sign up  ]          │ │
│                                 │                          │ │
│                                 │  Already have account?  │ │
│                                 │  [Sign in]              │ │
│                                 └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **Name Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="name" className="label">Full Name</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiUser className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="name"
        name="name"
        type="text"
        required
        className="input pl-10"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleInputChange}
      />
    </div>
  </div>
  ```

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

- **Phone Input Field**
  ```typescript
  <div className="auth-field">
    <label htmlFor="phone" className="label">Phone number</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiPhone className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="phone"
        name="phone"
        type="tel"
        required
        className="input pl-10"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleInputChange}
      />
    </div>
  </div>
  ```

- **Password Field** (with show/hide toggle and strength indicators)
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
    {/* Password requirements */}
    {formData.password && (
      <div className="mt-2 text-xs text-gray-600">
        <p>Password must contain:</p>
        <ul className="list-disc list-inside space-y-1">
          <li className={formData.password.length >= 6 ? 'text-green-600' : 'text-red-600'}>
            At least 6 characters
          </li>
          <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
            One uppercase letter
          </li>
          <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
            One lowercase letter
          </li>
          <li className={/\d/.test(formData.password) ? 'text-green-600' : 'text-red-600'}>
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
    <label htmlFor="confirmPassword" className="label">Confirm Password</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="h-5 w-5 text-brand-primary" />
      </div>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        required
        className="input-password pl-10"
        placeholder="Confirm your password"
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
        {formData.password === formData.confirmPassword ? (
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
    disabled={isLoading}
    className="auth-button"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Creating account...
      </div>
    ) : (
      'Sign up'
    )}
  </button>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `authAPI.register`.
- **Endpoint:** `POST /api/auth/register`.
- **Payload:** `{ name: string; email: string; phone: string; password: string; role?: string }`.
- **Response contract:** `response.data.data` contains user data (without tokens, tokens come after OTP verification).
- **Token handling:** No tokens stored during registration; user must verify OTP first.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate`, `Link`.
- Form elements: `input`, `button`, `label`, `div`, `p`, `ul`, `li`.
- `react-icons/fi` for icons (FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiUser).
- Tailwind CSS classes for styling with custom classes (`.auth-title`, `.auth-button`, `.input`, `.input-password`).
- Logo image from `assets/logo.png`.

## Error Handling
- **API errors:** Handled in `handleSubmit` function.
  - Error message displayed in red banner above submit button.
  - Error stored in local `error` state from context.
- **Input change handling:** `handleInputChange` updates form data when user types.
- **Form state persistence:** Input values persist in local state.

## Navigation Flow
- **Route:** `/register`.
- **Entry points:**
  - From login page via "Don't have an account? Sign up" link.
  - Direct URL access.
- **Successful registration:** `navigate('/otp-verification', { state: { email: formData.email } })` (passes email to OTP screen).
- **Secondary navigation:**
  - "Already have an account? Sign in" link ➞ `/login`.

## Functions Involved

- **`handleSubmit`** — Calls `register` API, handles navigation on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData: RegisterPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer'
      };

      const result = await register(userData);
      
      if (result.success) {
        navigate('/otp-verification', { state: { email: formData.email } });
      }
    } catch (error) {
      console.error('Registration error:', error);
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
- Add email domain validation for better user experience.
- Add phone number format validation with country code.
- Add password strength meter with visual indicator.
- Add terms and conditions checkbox.
- Add privacy policy acceptance checkbox.
- Add referral code input field.
- Add social media registration options (Google, Facebook).
- Add email verification before allowing registration.
- Add CAPTCHA to prevent abuse.
- Add account creation analytics tracking.
