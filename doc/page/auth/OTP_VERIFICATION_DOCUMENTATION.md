# OTP Verification Screen Documentation

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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiMail, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import logo from '../../../assets/logo.png';
```

## Context and State Management
- **Context provider:** `AuthProvider` from `contexts/AuthContext.tsx` wraps the app and exposes the `useAuth` hook.
- **Redux slice:** `redux/slices/authSlice.ts` stores `user`, `isAuthenticated`, `isLoading`, and `error`.
- **Persistent storage:** `localStorage` stores `accessToken`, `refreshToken`, serialized `user` data, and `pendingEmail`.
- **Hook usage on OTP screen:** `const { verifyOTP, resendOTP, isLoading } = useAuth();`
- **Form state:** `otp` array `['', '', '', '', '', '']` managed with `useState` (6 digits).
- **Additional state:** `resendLoading`, `countdown`, `email`.

**`verifyOTP` function (from `AuthContext.tsx`):**
```typescript
const verifyOTP = async (otpData: VerifyOTPPayload): Promise<AuthResult> => {
  dispatch(loginStart());

  try {
    const response = await authAPI.verifyOTP(otpData);
    const { user: userData, accessToken, refreshToken } = response.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(loginSuccess({ user: userData, accessToken, refreshToken }));
    return { success: true };
  } catch (otpError: any) {
    const errorMessage = otpError?.response?.data?.message || otpError?.message || 'OTP verification failed';
    dispatch(loginFailure(errorMessage));
    dispatch(setAuthFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};
```

**`resendOTP` function (from `AuthContext.tsx`):**
```typescript
const resendOTP = async (emailData: ResendOTPPayload): Promise<AuthResult> => {
  try {
    await authAPI.resendOTP(emailData);
    return { success: true };
  } catch (resendError: any) {
    const errorMessage = resendError?.response?.data?.message || resendError?.message || 'Failed to resend OTP';
    return { success: false, error: errorMessage };
  }
};
```

## UI Structure
- **Screen shell:** Two-column responsive layout (`flex-col lg:flex-row`) with full-height container using `.auth-page` and `.auth-container`.
- **Left side:** Logo and title section, centered vertically and horizontally.
- **Right side:** OTP input form with 6 individual input fields, resend button, and back to login link.
- **Typography:** Uses Tailwind utility classes with custom `.auth-title` and `.auth-subtitle` classes for headings.
- **Branding:** Logo image displayed prominently on the left side.
- **Feedback:** Validation error banner shown below OTP inputs.

## Planned Layout
```
┌─────────────────────────────────────────────┐
│  Left Side          │    Right Side         │
│  ┌──────────────┐   │   ┌─────────────────┐ │
│  │    Logo      │   │   │ Enter 6-digit   │ │
│  │              │   │   │ code            │ │
│  └──────────────┘   │   │ [0][0][0][0][0][0]│ │
│                     │   ├─────────────────┤ │
│  Title:             │   │ Validation Error│ │
│  "Verify your       │   │ (if any)       │ │
│   email"            │   ├─────────────────┤ │
│                     │   │ Verify Email   │ │
│  Subtitle:          │   │ Button         │ │
│  "We've sent a      │   ├─────────────────┤ │
│   verification      │   │ Didn't receive │ │
│   code to"          │   │ the code?      │ │
│                     │   │ [Resend code]   │ │
│  Email:             │   ├─────────────────┤ │
│  user@example.com   │   │ [← Back to login]│ │
│                     │   └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## Sketch Wireframe
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────┐              ┌──────────────────────────┐ │
│  │              │              │  Enter the 6-digit code  │ │
│  │    Logo      │              │                          │ │
│  │              │              │  [0] [0] [0] [0] [0] [0] │ │
│  └──────────────┘              │                          │ │
│                                 │  Validation error        │ │
│  Verify your email              │  (if any)               │ │
│  We've sent a verification      │                          │ │
│  code to                        │  [  Verify Email  ]     │ │
│  user@example.com               │                          │ │
│                                 │  Didn't receive the code?│ │
│                                 │  [🔄 Resend code]        │ │
│                                 │  (or "Resend in 60s")   │ │
│                                 │                          │ │
│                                 │  [← Back to login]      │ │
│                                 └──────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

## Form Inputs

- **OTP Input Fields** (6 individual inputs)
  ```typescript
  <div className="flex justify-between gap-2 mb-4">
    {otp.map((digit, index) => (
      <input
        key={index}
        id={`otp-${index}`}
        type="text"
        maxLength={1}
        value={digit}
        onChange={(e) => handleOtpChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
        placeholder="0"
      />
    ))}
  </div>
  ```


- **Submit Button**
  ```typescript
  <button
    type="submit"
    disabled={isLoading || otp.join('').length !== 6}
    className="auth-button"
  >
    {isLoading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Verifying...
      </div>
    ) : (
      'Verify Email'
    )}
  </button>
  ```

- **Resend OTP Button**
  ```typescript
  <button
    type="button"
    onClick={handleResendOTP}
    disabled={resendLoading || countdown > 0}
    className="mt-2 text-sm font-medium text-brand-primary hover:text-brand-accent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
  >
    {resendLoading ? (
      <div className="flex items-center">
        <FiRefreshCw className="animate-spin mr-2" />
        Sending...
      </div>
    ) : countdown > 0 ? (
      `Resend in ${countdown}s`
    ) : (
      <div className="flex items-center">
        <FiRefreshCw className="mr-2" />
        Resend code
      </div>
    )}
  </button>
  ```

- **Back to Login Button**
  ```typescript
  <Link
    to="/login"
    className="text-sm font-medium text-gray-600 hover:text-brand-primary flex items-center justify-center mx-auto mt-4"
  >
    <FiArrowLeft className="mr-2" />
    Back to login
  </Link>
  ```

## API Integration
- **HTTP client:** `axios` instance from `api/config.ts` via `authAPI.verifyOTP` and `authAPI.resendOTP`.
- **Verify OTP endpoint:** `POST /api/auth/verify-otp`.
- **Resend OTP endpoint:** `POST /api/auth/resend-otp`.
- **Verify OTP payload:** `{ email?: string; phone?: string; otp: string }` (6-digit OTP string).
- **Resend OTP payload:** `{ email?: string; phone?: string }`.
- **Response contract:** `response.data.data` contains `{ user, accessToken, refreshToken }` on successful verification.
- **Token handling:** Tokens saved to `localStorage`; Redux receives `loginSuccess` action.
- **Error responses:** API returns message in `response.data.message`; fallback to generic message.

## Components Used
- React + React Router DOM: `useNavigate`, `useLocation`, `Link`.
- Form elements: `input`, `button`, `label`, `div`, `p`.
- `react-icons/fi` for icons (FiMail, FiArrowLeft, FiRefreshCw).
- Tailwind CSS classes for styling with custom classes (`.auth-title`, `.auth-button`).
- Logo image from `assets/logo.png`.

## Error Handling
- **API errors:** Handled in `handleSubmit` function.
  - Error message displayed via error banner.
- **Email retrieval:** Email retrieved from `location.state` or `localStorage.getItem('pendingEmail')`.
  - If no email found, user is redirected to `/login`.
- **Countdown timer:** Prevents spam resend requests with 60-second countdown.

## Navigation Flow
- **Route:** `/otp-verification`.
- **Entry points:**
  - From registration flow (email passed via `location.state`).
  - Direct access (email retrieved from `localStorage.getItem('pendingEmail')`).
- **On mount:** If no email found in state or localStorage, redirects to `/login`.
- **Successful verification:** `navigate('/')` (root route, which shows Home for authenticated users).
- **Secondary navigation:**
  - "Back to login" button ➞ `/login` (clears `pendingEmail` from localStorage).
  - After successful verification, `pendingEmail` is removed from localStorage.

## Functions Involved

- **`handleSubmit`** — Calls `verifyOTP` API, handles navigation on success.
  ```typescript
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const otpString = otp.join('');

      const result = await verifyOTP({
        email,
        otp: otpString
      });

      if (result.success) {
        localStorage.removeItem('pendingEmail');
        navigate('/');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };
  ```

- **`handleOtpChange`** — Updates individual OTP digit and auto-focuses next input.
  ```typescript
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  ```

- **`handleKeyDown`** — Handles backspace to move focus to previous input.
  ```typescript
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  ```

- **`handleResendOTP`** — Resends OTP code and starts countdown timer.
  ```typescript
  const handleResendOTP = async () => {
    setResendLoading(true);
    
    const result = await resendOTP({ email });
    
    if (result.success) {
      setCountdown(60); // 60 seconds countdown
    }
    
    setResendLoading(false);
  };
  ```

- **Email retrieval effect** — Retrieves email from location state or localStorage on mount.
  ```typescript
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('pendingEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem('pendingEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);
  ```

- **Countdown timer effect** — Manages resend countdown timer.
  ```typescript
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  ```

## Future Enhancements
- Add SMS OTP support in addition to email OTP.
- Add voice call OTP option.
- Add OTP expiration timer display.
- Add auto-paste OTP from clipboard support.
- Add biometric verification option after OTP verification.
- Add rate limiting feedback for resend requests.
- Add option to change email address if OTP not received.
- Add accessibility improvements (ARIA labels, keyboard navigation).
- Add OTP verification attempts counter with account lockout after multiple failures.
