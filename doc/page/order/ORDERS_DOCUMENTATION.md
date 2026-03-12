# Orders Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [API Integration](#api-integration)
- [Components Used](#components-used)
- [Filtering and Search](#filtering-and-search)
- [Navigation Flow](#navigation-flow)

## Imports
```tsx
import { useState } from 'react';
import { FiSearch, FiPackage, FiFilter, FiLoader } from 'react-icons/fi';
import { useGetMyOrders } from '../../../tanstack/useOrders';
import OrdersCard from '../../../components/order/OrdersCard';
```

## Context and State Management
- **Local State:**
  - `searchTerm` - Stores the string for searching orders by invoice number.
  - `statusFilter` - Stores the current status filter (e.g., PLACED, SHIPPED, etc.).
- **TanStack Query:**
  - `useGetMyOrders(params)` fetches the authenticated user's order list based on filters.

## UI Structure
- **Page Container:** Standard centered layout for authenticated pages.
- **Header Section:**
  - Page Title ("My Orders").
  - Search Input: Real-time filtering by invoice number.
  - Status Dropdown: Allows filtering by order status.
- **Orders List:**
  - Uses `OrdersCard` for each order item.
  - Loading State: Shows a spinner and message during data fetch.
  - Error State: Displays an error message with a retry suggestion.
  - Empty State: Displays a message and a "Clear all filters" button if no orders match criteria.

## Planned Layout
```
┌────────────────────────────────────────────┐
│              MY ORDERS                     │
├────────────────────────────────────────────┤
│ [ SEARCH BY INVOICE ]   [ FILTER STATUS ▼ ]│
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Order #ID                  [ STATUS ] │  │
│  │ Date: ...                  Price: ... │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Order #ID                  [ STATUS ] │  │
│  │ Date: ...                  Price: ... │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

## API Integration
- **Hook:** `useGetMyOrders` from `src/tanstack/useOrders.ts`.
- **Endpoint:** `GET /api/orders/my-orders`.
- **Parameters:** `q` (query), `status`, `page`, `limit`.

## Components Used
- `OrdersCard`: Component for rendering a summary of a single order.

## Filtering and Search
- **Search:** Triggers a refetch with the `q` parameter mapped to `searchTerm`.
- **Status Filter:** Triggers a refetch with the `status` parameter mapped to `statusFilter`.

## Navigation Flow
- Clicking on an order card navigates to `/orders/:orderId` (Order Detail).
