# Cart Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Cart Items Display](#cart-items-display)
- [Coupon System](#coupon-system)
- [Cart Summary](#cart-summary)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from '../../tanstack/useCart';
import { useValidateCoupon } from '../../tanstack/useCoupons';
import toast from 'react-hot-toast';
```

## Context and State Management
- **TanStack Query hooks:**
  - `useGetCart()` - Fetches current user's cart
  - `useUpdateCartItem()` - Mutation for updating item quantity
  - `useRemoveFromCart()` - Mutation for removing item
  - `useClearCart()` - Mutation for clearing entire cart
  - `useValidateCoupon()` - Mutation for validating/applying coupons
- **Local state:**
  - `couponCode` - Current coupon code input
  - `appliedCoupon` - Applied coupon object with discount info
  - `showClearModal` - Boolean to control clear cart confirmation modal
  - `isApplyingCoupon` - Loading state for coupon application

## UI Structure
- **Screen shell:** Two-column layout on desktop (items left, summary right), stacked on mobile
- **Cart items section:** List of cart items with image, details, quantity controls, remove button
- **Cart summary section:** Sticky on desktop, includes coupon input, subtotal, discount, total
- **Empty state:** Message with link to continue shopping
- **Clear cart modal:** Confirmation dialog for clearing all items
- **Navbar cart badge:** Displays total item count on cart icon in navigation bar

## Planned Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Cart Page                                                   │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │  Cart Items              │  │  Cart Summary            │ │
│  │  ┌────────────────────┐ │  │  Coupon Input            │ │
│  │  │  [Image] Product   │ │  │  Subtotal                │ │
│  │  │  Variants          │ │  │  Discount                │ │
│  │  │  Price             │ │  │  Total                    │ │
│  │  │  [Qty Controls]    │ │  │  [Checkout]              │ │
│  │  └────────────────────┘ │  │  [Continue Shopping]     │ │
│  │  ...                     │  └──────────────────────────┘ │
│  │  [Clear All]             │                               │
│  └──────────────────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

## Cart Items Display

### Item Card Structure
- **Product Image:** Thumbnail with fallback icon
- **Product Title:** Link to product detail page
- **Variant Options:** Display selected variant options
- **Price:** Item price per unit
- **Quantity Controls:** Increment/decrement buttons with input
- **Remove Button:** Individual item removal

### Responsive Design
- **Desktop (lg+):** Quantity controls and remove button inline
- **Mobile:** Quantity controls and remove button in separate row below item details

### Quantity Management
- Minimum quantity: 1
- Maximum quantity: Based on available stock
- Real-time validation and updates
- Toast notifications for success/errors

## Coupon System

### Coupon Input
- Text input for coupon code
- Auto-uppercase conversion
- Apply button with loading state
- Enter key support for quick apply

### Coupon Validation
- Validates coupon code against order amount
- Checks expiration, usage limits, minimum order
- Returns discount amount and type (percentage or fixed)

### Applied Coupon Display
- Shows coupon name and code
- Displays discount amount and type
- Remove button to clear coupon
- Stored in localStorage for persistence

### Auto Re-validation
- Re-validates coupon when cart subtotal changes
- Updates discount amount automatically
- Removes coupon if no longer valid

## Cart Summary

### Price Breakdown
- **Subtotal:** Sum of all item prices × quantities
- **Discount:** Applied coupon discount (if any)
- **Total:** Subtotal minus discount

### Validation
- Total must be above zero to proceed to checkout
- Error message displayed if total is invalid

### Actions
- **Proceed to Checkout:** Navigates to checkout page (disabled if invalid)
- **Continue Shopping:** Returns to products page

## API Integration

### Cart Data Structure
```typescript
{
  _id: string;
  userId?: string | { _id: string; name: string; email: string };
  items: Array<{
    _id: string;
    productId: {
      _id: string;
      title: string;
      images?: Array<{ url: string; isPrimary?: boolean }>;
      primaryImage?: string;
      slug?: string;
    };
    skuId: string;
    quantity: number;
    price: number;
    variantOptions?: Record<string, string>;
    createdAt?: string;
    updatedAt?: string;
  }>;
  totalAmount: number;
  totalItems: number; // Total quantity of items in cart
  status: 'active' | 'converted' | 'abandoned';
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### API Response Structure
The cart API returns responses in the following format:
```typescript
{
  success: true,
  message?: string, // Optional success message
  data: Cart // Cart object as defined above
}
```

The `useGetCart` hook extracts `response.data.data` to get the cart object directly.

### Cart Operations

#### Update Item Quantity
```typescript
await updateCartItem.mutateAsync({
  skuId: string,
  updateData: { quantity: number }
});
```

#### Remove Item
```typescript
await removeFromCart.mutateAsync(skuId: string);
```

#### Clear Cart
```typescript
await clearCart.mutateAsync();
```

#### Validate Coupon
```typescript
await validateCoupon.mutateAsync({
  code: string,
  orderAmount: number
});
```

## Navbar Cart Badge

### Badge Display
- **Location:** Cart icon in the navigation bar (Navbar component)
- **Visibility:** Only shown when user is authenticated and cart has items
- **Count Display:** Shows `totalItems` from cart data, or calculates from item quantities
- **Styling:** Red background with white text, positioned absolutely on top-right of cart icon
- **Format:** Shows count up to 99, displays "99+" for counts above 99

### Implementation
- Uses `useGetCart` hook to fetch cart data
- Calculates item count from `cart.totalItems` or sums item quantities
- Updates automatically when cart changes (via TanStack Query cache invalidation)
- Only renders when `isAuthenticated` is true

## Components Used

### No External Components
- All UI is built directly in the Cart component
- Uses custom Tailwind classes for styling
- Navbar component includes cart badge functionality

## Error Handling

### Loading States
- Skeleton loading during cart fetch
- Loading indicators on buttons during mutations
- Disabled states during operations

### Error States
- Error message with retry button if cart fetch fails
- Toast notifications for operation errors (using react-hot-toast)
- Validation errors shown inline
- All cart operations (add, update, remove, clear) show error toasts on failure

### Empty States
- Empty cart message with icon
- Link to continue shopping
- No summary section displayed

## Navigation Flow

1. User navigates to cart (`/cart`)
2. Cart data is fetched and displayed
3. User can:
   - Update item quantities
   - Remove individual items
   - Apply coupon code
   - Clear entire cart
   - Proceed to checkout
   - Continue shopping
4. After checkout: Navigates to checkout page
5. After continue shopping: Returns to products page

## Functions Involved

### `getProductImage`
- Extracts product image URL
- Prioritizes primary image, falls back to first image
- Returns null if no images (triggers placeholder)

### `formatVariantOptions`
- Formats variant options object to readable string
- Returns "No variants" if empty

### `calculateSubtotal`
- Memoized calculation of cart subtotal
- Sums price × quantity for all items

### `discountAmount`
- Memoized discount amount from applied coupon
- Returns 0 if no coupon applied

### `finalTotal`
- Memoized final total (subtotal - discount)
- Used for checkout validation

### `handleQuantityChange`
- Updates item quantity
- Validates minimum quantity of 1
- Shows toast notifications

### `handleRemoveItem`
- Removes item from cart
- Shows success toast

### `handleClearCart`
- Opens confirmation modal
- Clears applied coupon if exists

### `confirmClearCart`
- Confirms and executes cart clearing
- Clears coupon state
- Shows success toast

### `handleApplyCoupon`
- Validates and applies coupon
- Stores in localStorage
- Shows success/error toasts
- Updates applied coupon state

### `handleRemoveCoupon`
- Removes applied coupon
- Clears localStorage
- Shows success toast

### `handleCheckout`
- Validates total > 0
- Navigates to checkout page

## Toast Notifications

All cart operations use `react-hot-toast` for user feedback:

### Success Toasts
- **Add to Cart:** `"{product.title} added to cart"` (shown in ProductDetail page)
- **Update Quantity:** `"Cart updated"` (shown in Cart page)
- **Remove Item:** `"Item removed from cart"` (shown in Cart page)
- **Clear Cart:** `"Cart cleared"` (shown in Cart page)
- **Apply Coupon:** `"Coupon '{name}' applied successfully!"` (shown in Cart page)
- **Remove Coupon:** `"Coupon removed successfully"` (shown in Cart page)

### Error Toasts
- All operations show error toasts with API error messages
- Fallback messages for network or unknown errors
- Displayed via `toast.error()` from react-hot-toast

## Future Enhancements

1. **Save for Later:** Move items to wishlist
2. **Estimated Delivery:** Show delivery time estimates
3. **Shipping Calculator:** Calculate shipping costs
4. **Gift Options:** Add gift wrapping or messages
5. **Bulk Discounts:** Show quantity-based discounts
6. **Recently Viewed:** Display recently viewed products
7. **Recommended Products:** Show recommendations based on cart
8. **Cart Abandonment:** Save cart for later retrieval
9. **Multiple Carts:** Support for saved carts
10. **Cart Sharing:** Share cart with others
