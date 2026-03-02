# AuthContext Documentation

## Overview

This document provides comprehensive documentation for the AuthContext implementation in the TEO KICKS e-commerce web application. The AuthContext provides authentication functionality using Redux as the single source of truth (no useReducer), adapted for a React web environment.

**Location:** `src/contexts/AuthContext.tsx`

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [State Management](#state-management)
3. [Storage Strategy](#storage-strategy)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Type Definitions](#type-definitions)

---

## Architecture Overview

The AuthContext provides a centralized authentication system that:

- Uses **Redux** as the single source of truth for all auth state
- Persists authentication state using **localStorage**
- Integrates with **react-router-dom** for navigation
- Provides authentication functions (login, register, OTP, password reset, etc.)
- Handles token refresh and validation automatically via API interceptors
- Manages user profile updates

### Component Structure

```
AuthProvider (Context Provider)
├── Redux Integration (useSelector, useDispatch)
├── localStorage Integration (token persistence)
├── Navigation Integration (react-router-dom)
└── Auth Functions (login, register, logout, etc.)
```

---

## State Management

### Why Redux Only?

- **Single Source of Truth**: All auth state comes from Redux store
- **Consistency**: No conflicts between local and global state
- **Persistence**: Redux Persist handles state persistence automatically
- **Simplicity**: Fewer moving parts, easier to debug

### Redux State Structure

The auth state is managed entirely through Redux:

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Redux Actions Used

The AuthContext uses the following Redux actions from `src/redux/slices/authSlice.ts`:

- `loginStart()` - Sets loading state
- `loginSuccess({ user, accessToken, refreshToken })` - Sets authenticated state
- `loginFailure(error)` - Sets error state
- `registerStart()` - Sets loading for registration
- `registerSuccess()` - Clears loading after registration
- `registerFailure(error)` - Sets registration error
- `logout()` - Clears all auth state
- `updateUser(user)` - Updates user in state
- `setTokens({ accessToken, refreshToken? })` - Updates tokens
- `clearError()` - Clears error state
- `setLoading(boolean)` - Sets loading state
- `setAuthLoading(boolean)` - Sets loading and clears error
- `setAuthSuccess(user)` - Sets user and authenticated state
- `setAuthFailure(error | null)` - Sets error state
- `clearAuth()` - Clears all auth state and resets loading

### State Access

All state is accessed via `useAppSelector` (typed Redux hooks):

```typescript
const user = useAppSelector((state: RootState) => state.auth.user);
const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
const isLoading = useAppSelector((state: RootState) => state.auth.isLoading);
const error = useAppSelector((state: RootState) => state.auth.error);
```

---

## Storage Strategy

### localStorage Keys

The following keys are used in localStorage:

- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - Serialized user object (JSON string)

### Storage Flow

1. **On Login/Register**: Tokens and user data are stored in localStorage
2. **On App Start**: AuthContext rehydrates state from localStorage
3. **Background Validation**: User profile is refreshed in background without clearing tokens on failure
4. **On Logout**: All tokens and user data are removed from localStorage

### Rehydration Strategy

```typescript
// 1. Rehydrate immediately from localStorage
if (token && storedUser) {
  // Restore state from storage
  dispatch(setAuthSuccess(storedUser));
  dispatch(setTokens({ accessToken: token }));
}

// 2. Background validation (non-blocking)
// Refresh user profile without clearing tokens on failure
```

---

## API Reference

### AuthProvider Props

```typescript
interface AuthProviderProps {
  children: React.ReactNode;
}
```

### Context Value

The AuthContext provides the following value:

```typescript
interface AuthContextValue {
  // State (from Redux)
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth Functions
  login: (credentials: LoginPayload) => Promise<AuthResult>;
  register: (userData: RegisterPayload) => Promise<AuthResult>;
  verifyOTP: (otpData: VerifyOTPPayload) => Promise<AuthResult>;
  resendOTP: (emailData: ResendOTPPayload) => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<AuthResult>;
  resetPassword: (token: string, newPassword: string) => Promise<AuthResult>;
  updateProfile: (profileData: UpdateProfilePayload | FormData) => Promise<AuthResult>;
  changePassword: (passwordData: ChangePasswordPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
  clearError: () => void;
}
```

### Function Details

#### `login(credentials)`

Authenticates a user with email/phone and password.

**Parameters:**
- `credentials: LoginPayload` - Either `{ email: string; password: string }` or `{ phone: string; password: string }`

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

**Example:**
```typescript
// Login with email
const result = await login({ email: 'user@example.com', password: 'password123' });

// Or login with phone
const result = await login({ phone: '+1234567890', password: 'password123' });

if (result.success) {
  // User is authenticated
}
```

#### `register(userData)`

Registers a new user account.

**Parameters:**
- `userData: RegisterPayload` - `{ name: string; email: string; phone: string; password: string; role?: string }`

**Returns:**
```typescript
Promise<{ success: boolean; data?: any; error?: string }>
```

**Example:**
```typescript
const result = await register({
  name: 'John Doe',
  email: 'user@example.com',
  phone: '+1234567890',
  password: 'password123',
  role: 'customer' // Optional, defaults to "customer"
});
```

#### `verifyOTP(otpData)`

Verifies OTP and activates account. Supports both email and phone verification.

**Parameters:**
- `otpData: VerifyOTPPayload` - Either `{ email?: string; otp: string }` or `{ phone?: string; otp: string }`

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

**Example:**
```typescript
// Verify with email
const result = await verifyOTP({ email: 'user@example.com', otp: '123456' });

// Or verify with phone
const result = await verifyOTP({ phone: '+1234567890', otp: '123456' });
```

#### `resendOTP(emailData)`

Resends OTP verification. Supports both email and phone.

**Parameters:**
- `emailData: ResendOTPPayload` - Either `{ email?: string }` or `{ phone?: string }`

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

**Example:**
```typescript
// Resend to email
await resendOTP({ email: 'user@example.com' });

// Or resend to phone
await resendOTP({ phone: '+1234567890' });
```

#### `forgotPassword(email)`

Sends password reset email.

**Parameters:**
- `email: string`

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

#### `resetPassword(token, newPassword)`

Resets password using reset token.

**Parameters:**
- `token: string` - Password reset token
- `newPassword: string` - New password

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

#### `updateProfile(profileData)`

Updates user profile information. Supports both object and FormData (for file uploads).

**Parameters:**
- `profileData: UpdateProfilePayload | FormData` - `{ name?: string; phone?: string; avatar?: string | null; country?: string; timezone?: string }` or `FormData` for file uploads

**Returns:**
```typescript
Promise<{ success: boolean; user?: User; error?: string }>
```

**Example:**
```typescript
// Update with object
const result = await updateProfile({
  name: 'John Doe',
  phone: '+1234567890',
  country: 'US',
  timezone: 'America/New_York'
});

// Or update with FormData (for avatar upload)
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('avatar', file);
const result = await updateProfile(formData);
```

#### `changePassword(passwordData)`

Changes user password.

**Parameters:**
- `passwordData: { currentPassword: string; newPassword: string }`

**Returns:**
```typescript
Promise<{ success: boolean; error?: string }>
```

#### `logout()`

Logs out the current user and clears all auth data.

**Returns:**
```typescript
Promise<void>
```

**Note:** Automatically navigates to login page after logout.

#### `clearError()`

Clears the current error state.

**Returns:**
```typescript
void
```

---

## Integration Guide

### 1. Provider Setup

Wrap your app with `AuthProvider` in the root:

```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
```

### 2. Using Auth in Components

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123',
    });

    if (result.success) {
      // Handle success
    } else {
      // Handle error (result.error)
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <span>Welcome, {user?.name}!</span>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### 3. Protected Routes

Use the auth state to protect routes:

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## Usage Examples

### Login Flow

```typescript
import { useNavigate } from 'react-router-dom';
const { login, isLoading, error } = useAuth();
const navigate = useNavigate();

const handleLogin = async (email: string, password: string) => {
  const result = await login({ email, password });

  if (result.success) {
    // Navigate to home or dashboard
    navigate('/dashboard');
  } else {
    // Error is already set in Redux state
    console.error('Login failed:', result.error);
  }
};

// Or login with phone
const handleLoginWithPhone = async (phone: string, password: string) => {
  const result = await login({ phone, password });
  if (result.success) {
    navigate('/dashboard');
  }
};
```

### Registration Flow

```typescript
import { useNavigate } from 'react-router-dom';
const { register, verifyOTP, resendOTP } = useAuth();
const navigate = useNavigate();

// Step 1: Register
const handleRegister = async () => {
  const result = await register({
    name: 'John Doe',
    email: 'user@example.com',
    phone: '+1234567890',
    password: 'password123',
  });
  if (result.success) {
    // Show OTP input screen
    setShowOTP(true);
  }
};

// Step 2: Verify OTP (with email or phone)
const handleVerifyOTP = async (email: string, otp: string) => {
  const result = await verifyOTP({ email, otp });
  if (result.success) {
    navigate('/dashboard');
  }
};

// Or verify with phone
const handleVerifyOTPWithPhone = async (phone: string, otp: string) => {
  const result = await verifyOTP({ phone, otp });
  if (result.success) {
    navigate('/dashboard');
  }
};

// Step 3: Resend OTP if needed
const handleResendOTP = async (email: string) => {
  await resendOTP({ email });
};
```

### Profile Update

```typescript
const { updateProfile, user } = useAuth();

const handleUpdateProfile = async (profileData) => {
  try {
    const result = await updateProfile(profileData);
    if (result.success) {
      console.log('Updated user:', result.user);
    }
  } catch (error) {
    // Handle error
  }
};
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is automatically navigated to login page
};
```

---

## Best Practices

### 1. Error Handling

Always check the `success` property and handle errors:

```typescript
const result = await login(credentials);
if (!result.success) {
  alert(result.error);
}
```

### 2. Loading States

Use the `isLoading` state from context to show loading indicators:

```typescript
const { isLoading } = useAuth();
if (isLoading) {
  return <div>Loading...</div>;
}
```

### 3. State Access

Access state directly from context, not from Redux:

```typescript
// ✅ Good
const { user, isAuthenticated } = useAuth();

// ❌ Avoid (unless you need Redux-specific features)
const user = useSelector((state) => state.auth.user);
```

### 4. Token Management

Tokens are automatically managed by AuthContext and the API interceptors:
- Stored in localStorage on login
- Refreshed automatically on 401 errors
- Cleared on logout

### 5. Navigation

Use `react-router-dom` navigation after auth actions:

```typescript
const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = async () => {
  const result = await login(credentials);
  if (result.success) {
    navigate('/dashboard', { replace: true });
  }
};
```

---

## Troubleshooting

### State Not Persisting

- Check if Redux Persist is configured correctly
- Verify localStorage is available (no errors in console)
- Ensure `auth` slice is in the persist whitelist

### Navigation Not Working

- Ensure `react-router-dom` is properly installed
- Check that navigation happens after async operations complete
- Use `navigate('/login', { replace: true })` for auth flows

### Token Refresh Issues

- Check API interceptor configuration in `src/api/config.ts`
- Verify refresh token endpoint is correct
- Check network connectivity

### Error State Not Clearing

- Use `clearError()` function to manually clear errors
- Errors are automatically cleared on new auth attempts

---

## Type Definitions

### User Type

```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  roles: IRole[];
  isVerified: boolean;
  country?: string;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IRole {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}
```

**Note:** The `User` type in Redux is aliased to `IUser` from `src/types/api.types.ts`.

### Auth Result Type

```typescript
interface AuthResult {
  success: boolean;
  error?: string;
  data?: any;
  user?: User;
}
```

---

## Notes

- All authentication state is managed through Redux
- Tokens are persisted in localStorage for offline access
- User profile is automatically refreshed on app start
- Background token validation doesn't clear tokens on failure (preserves offline access)
- Navigation is handled automatically on logout
- Error messages come from the API when available

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Project:** TEO KICKS E-Commerce Application
