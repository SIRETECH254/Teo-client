# Product Detail Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Product Information Display](#product-information-display)
- [Variant Selection](#variant-selection)
- [Add to Cart Functionality](#add-to-cart-functionality)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductById } from '../../tanstack/useProducts';
import { useAddToCart } from '../../tanstack/useCart';
import VariantSelector from '../../components/product/VariantSelector';
import CartSuccessModal from '../../components/cart/CartSuccessModal';
import ReviewsSection from '../../components/product/ReviewsSection';
import toast from 'react-hot-toast';
```

## Context and State Management
- **TanStack Query hooks:**
  - `useGetProductById(id)` - Fetches product details (already populated with brand, categories, collections, tags as objects)
  - `useAddToCart()` - Mutation hook for adding items to cart
- **Local state:**
  - `selectedVariants` - Object mapping variant IDs to selected option IDs
  - `selectedSKU` - Currently selected SKU based on variant selection
  - `quantity` - Quantity to add to cart (default: 1)
  - `currentImageIndex` - Index of currently displayed product image
  - `showCartSuccessModal` - Boolean to control cart success modal visibility

## UI Structure
- **Screen shell:** Two-column layout on desktop (images left, info right), stacked on mobile
- **Image gallery:** Main image display with thumbnail navigation (up to 6 images)
- **Product information:** Title, price, SKU, brand, categories, collections, tags (displayed directly from populated API data)
- **Variant selector:** Dynamic variant selection using `selectedVariantOptions` from API
- **Quantity selector:** Increment/decrement controls with stock validation
- **Add to cart button:** Validates selection and stock before adding
- **Description section:** HTML description display
- **Features section:** Bulleted list of product features
- **Reviews section:** Product reviews with ratings and comments

## Planned Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Product Detail Page                                        │
│  ┌──────────────────────┐  ┌────────────────────────────┐ │
│  │  Image Gallery        │  │  Product Information        │ │
│  │  ┌──────────────────┐│  │  Title                      │ │
│  │  │                  ││  │  Price                      │ │
│  │  │   Main Image     ││  │  SKU                        │ │
│  │  │                  ││  │  Brand                      │ │
│  │  └──────────────────┘│  │  Categories                │ │
│  │  [Thumbnail Grid]    │  │  Collections               │ │
│  │                       │  │  Tags                       │ │
│  │                       │  │  Variants                  │ │
│  │                       │  │  Quantity                 │ │
│  │                       │  │  [Add to Cart]             │ │
│  └──────────────────────┘  └────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Description                                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Features                                                │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Reviews Section                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Product Information Display

### Image Gallery
- Main image displays current selected image
- Thumbnail grid shows up to 6 images
- Click thumbnail to change main image
- Fallback icon if no images available

### Pricing
- Displays price from selected SKU or base price
- Shows compare price if available (strikethrough)
- Displays SKU code

### Classifications
- Brand name (with icon) - Displayed directly from `product.brand.name` (already populated)
- Categories (comma-separated) - Displayed directly from `product.categories.map(c => c.name).join(', ')` (already populated)
- Collections (comma-separated) - Displayed directly from `product.collections.map(c => c.name).join(', ')` (already populated)
- Tags (comma-separated) - Displayed directly from `product.tags.map(t => t.name).join(', ')` (already populated)

## Variant Selection

### Variant Data Source
- Uses `product.selectedVariantOptions` from API response
- Transforms `selectedVariantOptions` into variant-like objects with only selected options
- Each variant shows only the options that are configured in `selectedVariantOptions`

### Auto-Selection Logic
- Automatically selects first available option for each variant on load
- Prioritizes options with stock > 0
- Falls back to first option if none have stock

### Variant Selector Component
- Displays variants from `selectedVariantOptions` (e.g., Size, Color)
- Visual indicators:
  - Selected: Primary color border, checkmark icon
  - Available: Gray border, hover effects
- Stock numbers are not displayed (removed for customer-facing UI)

### SKU Matching
- Matches selected variant combination to corresponding SKU
- Updates price information based on selected SKU
- Validates that all variants are selected before allowing add to cart

## Add to Cart Functionality

### Validation Steps
1. Check if all variants are selected (if variants exist)
2. Check if selected combination has stock
3. Validate quantity against available stock
4. Ensure SKU is available

### Add to Cart Process
1. Prepare variant options object
2. Call `useAddToCart` mutation
3. Display toast notification with product name: `"{product.title} added to cart"`
4. Show success modal on completion

### Cart Success Modal
- Shows confirmation message
- Options: "Add Again" (stay on page) or "Go to Cart" (navigate)

## API Integration

### Product Data Structure
The API returns fully populated data with brand, categories, collections, and tags as objects:
```typescript
{
  _id: string;
  title: string;
  description?: string;
  images?: Array<{ url: string; isPrimary?: boolean }>;
  basePrice?: number;
  comparePrice?: number;
  skuCode?: string;
  brand?: { _id: string; name: string; ... }; // Already populated as object
  categories?: Array<{ _id: string; name: string; ... }>; // Already populated as objects
  collections?: Array<{ _id: string; name: string; ... }>; // Already populated as objects
  tags?: Array<{ _id: string; name: string; ... }>; // Already populated as objects
  features?: string[];
  selectedVariantOptions?: Array<{
    variantId: { _id: string; name: string; options: Array<{...}> };
    optionIds: Array<{ _id: string; value: string; ... }>;
  }>;
  skus?: Array<{
    _id: string;
    skuCode: string;
    price?: number;
    stock?: number;
    attributes?: Array<{
      variantId: { _id: string; ... } | string;
      optionId: { _id: string; ... } | string;
    }>;
  }>;
}
```

### Data Display
- All classification data (brand, categories, collections, tags) is displayed directly from the populated API response
- No additional data fetching or processing is required
- Brand: `product.brand?.name`
- Categories: `product.categories.map(c => c.name).join(', ')`
- Collections: `product.collections.map(c => c.name).join(', ')`
- Tags: `product.tags.map(t => t.name).join(', ')`

## Components Used

### VariantSelector
- **Props:**
  - `variants` - Array of variant objects (transformed from `selectedVariantOptions`)
  - `selectedOptions` - Object mapping variant IDs to option IDs
  - `onOptionSelect` - Callback function for option selection
  - `disabled` - Optional boolean to disable all options
  - `className` - Optional CSS classes
- **Features:** Visual selection feedback with checkmark icon, hover effects
- **Note:** Stock numbers are not displayed (removed for customer-facing UI)

### CartSuccessModal
- **Props:**
  - `isOpen` - Boolean to control visibility
  - `onClose` - Close handler
  - `onContinueShopping` - Continue shopping handler
  - `onGoToCart` - Navigate to cart handler
  - `itemName` - Product name to display
- **Features:** Success animation, action buttons

### ReviewsSection
- **Props:**
  - `productId` - Product ID for fetching reviews
  - `className` - Optional CSS classes
- **Features:** Review display, rating stats, pagination

## Error Handling

### Loading States
- Full page skeleton during initial load
- Uses Tailwind `animate-pulse` for skeleton effect

### Error States
- Product not found: Shows message with "Back to Products" button
- API errors: Displayed via toast notifications (using react-hot-toast)
- Validation errors: Shown before attempting add to cart via toast notifications
- Add to cart errors: Displayed via toast with error message from API

### Empty States
- No images: Shows placeholder icon
- No variants: Hides variant selector
- No stock: Disables add to cart button (validated internally, not displayed to user)

## Navigation Flow

1. User navigates from products list to product detail (`/products/:id`)
2. Page loads product data and related information
3. User can:
   - View product images
   - Select variants (if available)
   - Adjust quantity
   - Add to cart
   - View description and features
   - Read reviews
4. After adding to cart:
   - Toast notification appears: "{product.title} added to cart"
   - Success modal appears
   - User can continue shopping or go to cart
5. Back button returns to products list

## Functions Involved

### `getPopulatedVariants`
- Memoized function that transforms `product.selectedVariantOptions` into variant-like objects
- Returns array of variant objects with only selected options from `selectedVariantOptions`
- Uses `selectedVariantOptions` instead of `variants` to show only configured options

### `getAvailableSKUs`
- Memoized function that filters SKUs with stock > 0
- Used for products without variants

### `getTotalAvailableStock`
- Memoized function that calculates total stock across all SKUs
- Used for products without variants

### `handleVariantChange`
- Callback for variant option selection
- Updates `selectedVariants` state

### `areAllVariantsSelected`
- Checks if all variants have a selected option
- Used for validation before add to cart

### `hasSelectedCombinationStock`
- Checks if selected variant combination has available stock
- Used for validation before add to cart

### `handleQuantityChange`
- Handles manual quantity input
- Validates minimum value of 1

### `increaseQuantity`
- Increments quantity
- Respects maximum stock limit

### `decreaseQuantity`
- Decrements quantity
- Respects minimum value of 1

### `handleAddToCart`
- Main function for adding item to cart
- Performs all validations
- Calls mutation hook
- Shows toast notification with product name: `"{product.title} added to cart"`
- Shows success modal on completion

### Data Display
- Classification data (brand, categories, collections, tags) is displayed directly from populated API response
- No helper functions needed - data is already in the correct format
- Brand: `typeof product.brand === 'object' ? product.brand.name : 'Unknown Brand'`
- Categories: `product.categories.map(c => c.name).join(', ')`
- Collections: `product.collections.map(c => c.name).join(', ')`
- Tags: `product.tags.map(t => t.name).join(', ')`

## Future Enhancements

1. **Image Zoom:** Add zoom functionality for product images
2. **Related Products:** Display related or recommended products
3. **Wishlist Integration:** Add to wishlist functionality
4. **Share Functionality:** Share product via social media or link
5. **Product Comparison:** Compare multiple products
6. **Stock Alerts:** Notify when out-of-stock items become available
7. **Quick View Modal:** Quick view from products list
8. **Image Lightbox:** Full-screen image viewing
9. **Video Support:** Product video display
10. **AR/3D View:** 3D product visualization
