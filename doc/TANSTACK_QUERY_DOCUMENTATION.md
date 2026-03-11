# TanStack Query Documentation

## Overview

This document provides comprehensive documentation for TanStack Query (React Query) implementation in the TEO KICKS e-commerce application. TanStack Query is used for server state management, providing data fetching, caching, synchronization, and updating capabilities.

**Location:** All TanStack Query hooks are located in the `src/tanstack/` folder.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Setup and Configuration](#setup-and-configuration)
3. [QueryClient Configuration](#queryclient-configuration)
4. [Custom Hooks Pattern](#custom-hooks-pattern)
5. [Query Hooks (useQuery)](#query-hooks-usequery)
6. [Mutation Hooks (useMutation)](#mutation-hooks-usemutation)
7. [Cache Invalidation Strategies](#cache-invalidation-strategies)
8. [Error Handling Patterns](#error-handling-patterns)
9. [Best Practices](#best-practices)
10. [Usage Examples](#usage-examples)
11. [Integration with Existing Code](#integration-with-existing-code)
12. [Troubleshooting](#troubleshooting)
13. [Notes](#notes)
14. [Available Hooks Reference](#available-hooks-reference)

---

## Introduction

TanStack Query (formerly React Query) is a powerful data synchronization library for React applications. It provides:

- **Automatic Caching**: Data is cached automatically with configurable stale times
- **Background Refetching**: Keeps data fresh automatically
- **Request Deduplication**: Prevents duplicate requests
- **Optimistic Updates**: Update UI before server confirms
- **Error Handling**: Built-in error states and retry logic
- **Loading States**: Built-in loading and fetching states

### Why TanStack Query?

- Reduces boilerplate code for data fetching
- Provides excellent developer experience
- Handles complex caching scenarios automatically
- Works seamlessly with existing API layer (axios)
- Integrates well with Redux for client state

---

## Setup and Configuration

### Installation

```bash
npm install @tanstack/react-query
```

### Provider Setup

The QueryClientProvider is set up in `src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Wrap your app
<QueryClientProvider client={queryClient}>
  {/* Your app */}
</QueryClientProvider>
```

---

## QueryClient Configuration

### Default Options

The QueryClient is configured with the following default options:

- **staleTime**: `5 * 60 * 1000` (5 minutes)
  - Data is considered fresh for 5 minutes
  - No refetch occurs during this time

- **gcTime**: `10 * 60 * 1000` (10 minutes, formerly cacheTime)
  - Unused data is garbage collected after 10 minutes
  - Data remains in cache for this duration even if not used

- **retry**: `1`
  - Failed requests are retried once
  - Reduces unnecessary network calls

- **refetchOnWindowFocus**: `false`
  - Prevents automatic refetch when window regains focus
  - Better for e-commerce workflows

### Mutation Default Options

- **retry**: `1`
  - Failed mutations are retried once

---

## Custom Hooks Pattern

### Folder Structure

All TanStack Query hooks are organized in the `src/tanstack/` folder:

```
src/
└── tanstack/
    ├── index.ts
    ├── useUsers.ts
    ├── useProducts.ts
    ├── useCategories.ts
    ├── useBrands.ts
    ├── useCollections.ts
    ├── useTags.ts
    ├── useCart.ts
    ├── useOrders.ts
    ├── usePayments.ts
    ├── useAddresses.ts
    ├── useReviews.ts
    ├── useCoupons.ts
    ├── usePackaging.ts
    ├── useNotifications.ts
    └── useContact.ts
```

### Hook Naming Convention

- **Query Hooks**: `useGet[Resource]` or `useGet[Resource]ById`
  - Example: `useGetAllProducts`, `useGetProductById`

- **Mutation Hooks**: `use[Action][Resource]`
  - Example: `useAddToCart`, `useUpdateProfile`, `useCreateOrder`

---

## Query Hooks (useQuery)

Query hooks are used for GET operations (fetching data).

### Basic Structure

```typescript
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../api';

export const useGetAllProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productAPI.getAllProducts(params);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
```

### Query Hook Options

- **queryKey**: Array that uniquely identifies the query
  - Format: `['resource', params/id]`
  - Used for cache management and invalidation

- **queryFn**: Async function that fetches data
  - Must return a Promise
  - Typically calls API and returns `response.data.data` (nested data property)

- **enabled**: Boolean to conditionally enable/disable query
  - Useful when query depends on other data
  - Example: `enabled: !!productId`

- **staleTime**: Time in milliseconds before data is considered stale
  - Default: 5 minutes (from QueryClient config)

- **gcTime**: Time in milliseconds before unused data is garbage collected
  - Default: 10 minutes (from QueryClient config)

### Query Hook Return Value

```typescript
const {
  data,           // The data returned from queryFn
  isLoading,      // True if query is fetching for the first time
  isFetching,     // True if query is fetching (including refetches)
  isError,        // True if query encountered an error
  error,          // Error object if query failed
  refetch,        // Function to manually refetch
  isSuccess,      // True if query succeeded
} = useGetAllProducts();
```

### Conditional Queries

```typescript
export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productAPI.getProductById(productId);
      return response.data.data;
    },
    enabled: !!productId, // Only run if productId exists
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
```

---

## Mutation Hooks (useMutation)

Mutation hooks are used for POST, PUT, PATCH, and DELETE operations.

### Basic Structure

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '../api';

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartData: AddToCartPayload) => {
      const response = await cartAPI.addToCart(cartData);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Item added to cart successfully');
    },
    onError: (error: any) => {
      console.error('Add to cart error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
      console.error('Error:', errorMessage);
    },
  });
};
```

### Mutation Hook Options

- **mutationFn**: Async function that performs the mutation
  - Receives variables as parameter
  - Must return a Promise

- **onSuccess**: Callback executed on successful mutation
  - Typically used for cache invalidation and notifications

- **onError**: Callback executed on mutation failure
  - Typically used for error handling and notifications

### Mutation Hook Return Value

```typescript
const {
  mutate,         // Function to trigger mutation
  mutateAsync,    // Async function that returns a Promise
  isPending,      // True if mutation is in progress
  isError,        // True if mutation failed
  error,          // Error object if mutation failed
  isSuccess,      // True if mutation succeeded
  data,           // Data returned from successful mutation
  reset,          // Function to reset mutation state
} = useAddToCart();

// Usage
mutate(cartData);
// or
await mutateAsync(cartData);
```

### Mutation with Variables

```typescript
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ addressId, addressData }: { addressId: string; addressData: UpdateAddressPayload }) => {
      const response = await addressAPI.updateAddress(addressId, addressData);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and specific address
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      queryClient.invalidateQueries({ queryKey: ['address', variables.addressId] });
      console.log('Address updated successfully');
    },
    onError: (error: any) => {
      console.error('Update address error:', error);
    },
  });
};
```

---

## Cache Invalidation Strategies

### Invalidate Queries

Invalidate queries to trigger refetch:

```typescript
// Invalidate all queries with key 'products'
queryClient.invalidateQueries({ queryKey: ['products'] });

// Invalidate specific product
queryClient.invalidateQueries({ queryKey: ['product', productId] });

// Invalidate all queries starting with 'order'
queryClient.invalidateQueries({ queryKey: ['order'] });
```

### Refetch Queries

Manually refetch queries:

```typescript
// Refetch all 'orders' queries
queryClient.refetchQueries({ queryKey: ['orders'] });
```

### Update Query Data

Update cache directly without refetching:

```typescript
queryClient.setQueryData(['product', productId], (oldData) => {
  return { ...oldData, ...updatedData };
});
```

### Common Patterns

1. **After Create**: Invalidate list query
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['addresses'] });
   }
   ```

2. **After Update**: Invalidate both list and item queries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient.invalidateQueries({ queryKey: ['orders'] });
     queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
   }
   ```

3. **After Delete**: Invalidate list query
   ```typescript
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['addresses'] });
   }
   ```

---

## Error Handling Patterns

### Query Error Handling

```typescript
const { data, isError, error } = useGetAllProducts();

if (isError) {
  const errorMessage = error?.response?.data?.message || 'Failed to fetch products';
  // Handle error (show toast, alert, etc.)
}
```

### Mutation Error Handling

```typescript
const addToCart = useAddToCart();

const handleAddToCart = async (cartData: AddToCartPayload) => {
  try {
    await addToCart.mutateAsync(cartData);
    // Success handling
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Failed to add item to cart';
    // Error handling
  }
};
```

### Global Error Handling

Errors are logged in the mutation's `onError` callback. For user-facing errors, consider:

- Toast notifications (can be added later)
- Alert dialogs
- Error state in UI components

---

## Best Practices

### 1. Query Key Structure

- Use consistent, hierarchical query keys
- Include all parameters that affect the query
- Example: `['products', { page: 1, limit: 10 }]`

### 2. Stale Time Configuration

- Set appropriate stale times based on data freshness requirements
- Use longer stale times for relatively static data (categories, brands)
- Use shorter stale times for frequently changing data (cart, orders)

### 3. Conditional Queries

- Use `enabled` option to prevent unnecessary queries
- Example: `enabled: !!productId` prevents query when productId is missing

### 4. Cache Invalidation

- Invalidate related queries after mutations
- Invalidate both list and detail queries after updates
- Consider optimistic updates for better UX

### 5. Error Handling

- Always handle errors in mutations
- Provide user-friendly error messages
- Log errors for debugging

### 6. TypeScript

- Type all hook parameters and return values
- Use proper types from API responses
- Leverage TypeScript for better developer experience

### 7. Performance

- Use `staleTime` to reduce unnecessary refetches
- Use `gcTime` to manage cache size
- Consider pagination for large datasets

---

## Usage Examples

### Example 1: Fetching Products

```typescript
import { useGetAllProducts } from '../tanstack';

function ProductsList() {
  const { data, isLoading, isError, error } = useGetAllProducts({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      {data?.products?.map((product: any) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Adding to Cart

```typescript
import { useAddToCart } from '../tanstack';

function ProductCard({ productId, skuId }: { productId: string; skuId: string }) {
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId,
        skuId,
        quantity: 1,
      });
      // Show success message
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={addToCart.isPending}>
      {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Example 3: Updating Profile

```typescript
import { useUpdateProfile } from '../tanstack';

function EditProfile() {
  const updateProfile = useUpdateProfile();

  const handleUpdate = async (profileData: UpdateProfilePayload) => {
    try {
      await updateProfile.mutateAsync(profileData);
      // Show success message
    } catch (error) {
      // Error handling
    }
  };

  return <button onClick={() => handleUpdate({ name: 'John Doe' })}>Update</button>;
}
```

### Example 4: Conditional Query

```typescript
import { useGetProductById } from '../tanstack';

function ProductDetails({ productId }: { productId?: string }) {
  const { data, isLoading } = useGetProductById(productId || '');

  if (!productId) return <div>No product selected</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>{data?.product?.name}</div>;
}
```

### Example 5: Multiple Queries

```typescript
import { useGetCart, useGetNotifications } from '../tanstack';

function Header() {
  const { data: cart } = useGetCart();
  const { data: notifications } = useGetNotifications({ page: 1, limit: 5 });

  return (
    <div>
      <div>Cart Items: {cart?.items?.length || 0}</div>
      <div>Notifications: {notifications?.items?.length || 0}</div>
    </div>
  );
}
```

---

## Integration with Existing Code

### API Layer

TanStack Query hooks use the existing API layer (`src/api/index.ts`):

```typescript
import { productAPI } from '../api';

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productAPI.getProductById(productId);
      return response.data.data;
    },
  });
};
```

### Redux Integration

- TanStack Query handles server state (data from API)
- Redux handles client state (UI state, auth state)
- Both can coexist in the same application

### Auth Context

- **Authentication operations** (register, login, OTP, password reset, Google auth) are handled in `AuthContext` (`src/contexts/AuthContext.tsx`) and are **not** moved to TanStack Query hooks
- API interceptors handle token management (`src/api/config.ts`)
- TanStack Query hooks automatically use authenticated requests via axios interceptors

---

## Troubleshooting

### Common Issues

1. **Queries not refetching**
   - Check `staleTime` configuration
   - Verify query keys are correct
   - Ensure `refetchOnWindowFocus` is not blocking

2. **Cache not invalidating**
   - Verify query keys match exactly
   - Check that `invalidateQueries` is called in `onSuccess`

3. **TypeScript errors**
   - Ensure proper types are imported
   - Check API response types match expected types

4. **Multiple requests**
   - Check if queries are enabled unnecessarily
   - Verify request deduplication is working

---

## Notes

- All hooks follow TypeScript typing conventions
- Error handling uses console.error (toast notifications can be added later)
- Cache invalidation follows consistent patterns
- Query keys are structured as arrays: `['resource', params/id]`
- Hooks are organized by resource type for better maintainability
- Response data structure: `response.data.data` (nested data property)
- Import paths in examples may need adjusting depending on component location

---

## Available Hooks Reference

### User Hooks (`useUsers.ts`)

- `useGetProfile()` - Get current user profile
- `useUpdateProfile()` - Update current user profile
- `useChangePassword()` - Change user password
- `useGetNotificationPreferences()` - Get notification preferences
- `useUpdateNotificationPreferences()` - Update notification preferences

### Product Hooks (`useProducts.ts`)

- `useGetAllProducts(params?)` - Get all products with optional filtering
- `useGetProductById(productId)` - Get single product by ID
- `useGetOptimizedImages(productId, params?)` - Get optimized product images

### Category Hooks (`useCategories.ts`)

- `useGetAllCategories(params?)` - Get all categories with optional filtering
- `useGetCategoryTree()` - Get category tree structure
- `useGetCategoryById(categoryId)` - Get single category by ID
- `useGetRootCategories()` - Get root categories

### Brand Hooks (`useBrands.ts`)

- `useGetAllBrands(params?)` - Get all brands with optional filtering
- `useGetBrandById(brandId)` - Get single brand by ID
- `useGetPopularBrands(params?)` - Get popular brands
- `useGetActiveBrands()` - Get active brands

### Collection Hooks (`useCollections.ts`)

- `useGetAllCollections(params?)` - Get all collections with optional filtering
- `useGetCollectionById(collectionId)` - Get single collection by ID
- `useGetActiveCollections()` - Get active collections

### Tag Hooks (`useTags.ts`)

- `useGetAllTags(params?)` - Get all tags with optional filtering
- `useGetTagById(tagId)` - Get single tag by ID
- `useGetPopularTags(params?)` - Get popular tags

### Cart Hooks (`useCart.ts`)

- `useGetCart()` - Get current user's active cart
- `useAddToCart()` - Add item to cart
- `useUpdateCartItem()` - Update cart item quantity
- `useRemoveFromCart()` - Remove item from cart
- `useClearCart()` - Clear all items from cart
- `useValidateCart()` - Validate cart items (check stock, prices)

### Order Hooks (`useOrders.ts`)

- `useCreateOrder()` - Create a new order from cart
- `useGetOrders(params?)` - Get all orders with optional filtering
- `useGetOrderById(orderId)` - Get single order by ID

### Payment Hooks (`usePayments.ts`)

- `usePayInvoice()` - Pay for an invoice
- `useGetPaymentById(paymentId)` - Get single payment by ID
- `useQueryMpesaStatus(checkoutRequestId)` - Query M-Pesa STK Push status
- `useQueryMpesaByCheckoutId(checkoutRequestId)` - Query M-Pesa payment by checkout ID

### Address Hooks (`useAddresses.ts`)

- `useGetUserAddresses()` - Get all addresses for current user
- `useGetAddressById(addressId)` - Get single address by ID
- `useCreateAddress()` - Create new address
- `useUpdateAddress()` - Update address
- `useDeleteAddress()` - Delete address
- `useSetDefaultAddress()` - Set address as default
- `useGetDefaultAddress()` - Get user's default address

### Review Hooks (`useReviews.ts`)

- `useGetProductReviews(productId, params?)` - Get all reviews for a product
- `useCreateReview()` - Create a new review
- `useUpdateReview()` - Update own review
- `useDeleteReview()` - Delete own review
- `useGetUserReviews(params?)` - Get current user's reviews
- `useGetReviewById(reviewId)` - Get single review by ID

### Coupon Hooks (`useCoupons.ts`)

- `useValidateCoupon()` - Validate a coupon code
- `useApplyCoupon()` - Apply a coupon to an order

### Packaging Hooks (`usePackaging.ts`)

- `useGetActivePackaging()` - Get active packaging options
- `useGetDefaultPackaging()` - Get default packaging option
- `useGetPackagingById(packagingId)` - Get single packaging option by ID

### Notification Hooks (`useNotifications.ts`)

- `useGetNotifications(params?)` - Get current user's notifications
- `useGetUnreadCount()` - Get unread notification count
- `useGetNotification(notificationId)` - Get single notification by ID
- `useMarkNotificationAsRead()` - Mark notification as read
- `useMarkAllNotificationsAsRead()` - Mark all notifications as read
- `useDeleteNotification()` - Delete notification

### Contact Hooks (`useContact.ts`)

- `useSubmitContact()` - Submit contact form message

---

**Last Updated:** February 2026  
**Version:** 1.0.0
