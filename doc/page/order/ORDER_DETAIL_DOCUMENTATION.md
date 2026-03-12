# Order Detail Screen Documentation

## Table of Contents
- [Imports](#imports)
- [Context and State Management](#context-and-state-management)
- [UI Structure](#ui-structure)
- [Planned Layout](#planned-layout)
- [API Integration](#api-integration)
- [Navigation Flow](#navigation-flow)

## Imports
```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiCreditCard, FiMapPin, FiTruck, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useGetOrderById } from '../../../tanstack/useOrders';
```

## Context and State Management
- **Route Params:** `useParams()` extracts `orderId`.
- **TanStack Query:**
  - `useGetOrderById(orderId)` fetches details for the specific order.

## UI Structure
- **Page Container:** Standard centered layout with maximum width for better presentation.
- **Back Button:** Navigation to the order list.
- **Header Section:**
  - Order ID/Reference.
  - Order Status badge.
  - Date and Time of the order.
  - Payment status indicator.
- **Order Items Section:**
  - Product list with images, titles, variants, quantities, and individual prices.
- **Logistics Section:**
  - Service type (Pickup/Delivery).
  - Address information.
- **Payment Summary Section:**
  - Pricing breakdown (Subtotal, Discounts, Fees, Tax, Total).
  - Contextual action button: "Complete Payment" (only for unpaid/pending orders).

## Planned Layout
```
┌────────────────────────────────────────────┐
│ < Back to My Orders                        │
├────────────────────────────────────────────┤
│ Order #12345                 [ DELIVERED ] │
│ Feb 15, 2026                 [ PAID ]      │
├────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌──────────────┐ │
│ │ Items Purchased (3)  │  │ Payment      │ │
│ │ Product A...         │  │ Subtotal...  │ │
│ │ Product B...         │  │ Total...     │ │
│ ├──────────────────────┤  │ [ COMPLETE ] │ │
│ │ Logistics            │  └──────────────┘ │
│ │ Delivery Details...  │                   │
│ └──────────────────────┘                   │
└────────────────────────────────────────────┘
```

## API Integration
- **Hook:** `useGetOrderById` from `src/tanstack/useOrders.ts`.
- **Endpoint:** `GET /api/orders/:id`.

## Navigation Flow
- **Back Button:** Navigates back to `/orders`.
- **Complete Payment:** Navigates to `/payment-status` with `orderId` and `invoiceId` query params if the order is unpaid.
