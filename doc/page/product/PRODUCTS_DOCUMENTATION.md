# Products Listing Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [Search and Filtering](#search-and-filtering)
- [Product Grid](#product-grid)
- [Pagination](#pagination)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Error Handling](#error-handling)
- [Navigation Flow](#navigation-flow)
- [Functions Involved](#functions-involved)
- [Future Enhancements](#future-enhancements)

## Imports
```typescript
import { useState } from 'react';
import { useGetAllProducts } from '../../tanstack/useProducts';
import { useGetAllCategories } from '../../tanstack/useCategories';
import { useGetAllCollections } from '../../tanstack/useCollections';
import { useGetAllBrands } from '../../tanstack/useBrands';
import { useGetAllTags } from '../../tanstack/useTags';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import Pagination from '../../components/ui/Pagination';
import { FiPackage, FiSearch, FiFilter, FiX, FiTag, FiFolder, FiGrid, FiBarChart2, FiAward } from 'react-icons/fi';
```

## Context and State Management
- **TanStack Query hooks:**
  - `useGetAllProducts(params)` - Fetches products based on filters and pagination
  - `useGetAllCategories()` - Fetches available categories for filtering
  - `useGetAllCollections()` - Fetches available collections for filtering
  - `useGetAllBrands()` - Fetches available brands for filtering
  - `useGetAllTags()` - Fetches available tags for filtering
- **Local state:**
  - `search` - Search query string
  - `category` - Selected category ID
  - `collection` - Selected collection ID
  - `brand` - Selected brand ID
  - `tag` - Selected tag ID
  - `sort` - Sorting criteria (newest, price_asc, etc.)
  - `page` - Current pagination page

## UI Structure
- **Header:** Page title and search bar
- **Filters Bar:** Dropdown selectors for Category, Collection, Brand, Tag, and Sort Order
- **Filter Actions:** Indicator of applied filters and "Clear All" button
- **Product Grid:** Responsive grid of product cards
- **Pagination:** Navigation controls for multiple pages of products
- **Empty State:** Message displayed when no products match the criteria

## Planned Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Products Listing Page                                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Title: Our Products                                  │ │
│  │  [ Search Products...                             ]    │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  [Category] [Collection] [Brand] [Tag] [Sort]         │ │
│  │  ---------------------------------------------------   │ │
│  │  Filters applied: Yes/None             [Clear All]     │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │ Product  │  │ Product  │  │ Product  │  │ Product  │ │ │
│  │  │ Card     │  │ Card     │  │ Card     │  │ Card     │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                [ Pagination Controls ]                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Search and Filtering

### Search Bar
- Real-time search by product title
- Resets page to 1 on input change

### Dropdown Filters
- **Categories:** Filter by product category
- **Collections:** Filter by specific collections
- **Brands:** Filter by product brand
- **Tags:** Filter by product tags
- All filters reset the current page to 1 when changed

### Sorting
- Options include:
  - Newest First
  - Oldest First
  - Price: Low to High
  - Price: High to Low
  - Name: A to Z
  - Name: Z to A

## Product Grid

### Loading State
- Displays 8 `ProductCardSkeleton` components while data is fetching
- Uses grid layout consistent with the actual products

### Product Cards
- Responsive grid: 1 column (mobile), 2 columns (small), 3 columns (large), 4 columns (extra large)
- Each card displays image, title, price, and category

## Pagination

### Pagination Logic
- Uses the unified `Pagination` component
- Displays current page, total pages, and total items
- Handles "Showing X to Y of Z" information
- Provides First, Previous, Next, and Last page navigation

## API Integration

### Request Parameters
```typescript
{
  search: string | undefined;
  category: string | undefined;
  collection: string | undefined;
  brand: string | undefined;
  tag: string | undefined;
  sort: string | undefined;
  status: 'active';
  page: number;
  limit: 20;
}
```

### Response Structure
```typescript
{
  products: Array<IProduct>;
  pagination: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }
}
```

## Components Used

### ProductCard
- Displays individual product summary
- Link to product detail page

### ProductCardSkeleton
- Visual placeholder for loading states

### Pagination
- Standardized pagination controls with page info and navigation buttons

## Error Handling

### Loading States
- Grid of skeleton cards
- Pulse animation for visual feedback

### Error States
- Error message with "Retry" button
- Handles both network errors and API errors

### Empty States
- Custom empty state with icon when no products are found
- "Clear All Filters" button to reset the view

## Navigation Flow

1. User arrives at `/products`
2. Initial products are loaded (page 1)
3. User can:
   - Search for specific items
   - Apply multiple filters
   - Change sort order
   - Navigate through pages
4. Clicking a product card navigates to `/products/:id`

## Functions Involved

### `handleClearFilters`
- Resets all filter states (search, category, collection, brand, tag, sort)
- Resets page to 1

### `setPage`
- Updates the current page state, triggering a re-fetch of product data

## Future Enhancements

1. **Price Range Slider:** Filter products by price range
2. **Infinite Scroll:** Optional alternative to traditional pagination
3. **Grid/List View Toggle:** Switch between different layout styles
4. **Quick View:** Modal to view product details without leaving the list
5. **Mobile Filter Drawer:** Better filtering experience on small screens
