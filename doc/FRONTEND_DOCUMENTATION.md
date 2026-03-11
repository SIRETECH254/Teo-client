# TEO KICKS - E-commerce Client Frontend Documentation

## Table of Contents
- [Technology Stack](#technology-stack)
- [Required Packages](#required-packages)
- [Architecture Overview](#architecture-overview)
- [Pages & Screens](#pages--screens)
- [Components](#components)
- [Hooks](#hooks)
- [Constants](#constants)
- [Routing Structure](#routing-structure)
- [Styling Approach](#styling-approach)
- [UI Design System](#ui-design-system)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)
- [Code Style & Best Practices](#code-style--best-practices)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Additional Resources](#additional-resources)
- [Version Information](#version-information)
- [Support & Contribution](#support--contribution)

---

## Technology Stack

- **Framework:** React (web)
- **Language:** TypeScript
- **Routing:** React Router Dom
- **Styling:** Tailwind CSS
- **Build System:** Vite
- **Platform:** Web (browser)
- **Optional:** Socket.io client for real-time updates (backend uses Socket.io for live order status updates and notifications)

---

## Required Packages

### Core Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.0.0",
  "typescript": "~5.9.3",
  "vite": "^7.2.5"
}
```

### Routing
```json
{
  "react-router-dom": "^7.0.0"
}
```

### Styling & UI
```json
{
  "tailwindcss": "^4.1.18",
  "@tailwindcss/vite": "^4.1.18"
}
```

### HTTP & API
```json
{
  "axios": "^1.7.0"
}
```

### State Management
```json
{
  "@reduxjs/toolkit": "^2.3.0",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0",
  "@tanstack/react-query": "^5.60.0"
}
```

### Real-Time
```json
{
  "socket.io-client": "^4.8.0"
}
```

### Icons & Visual
```json
{
  "react-icons": "^5.4.0"
}
```

### Time & Date
```json
{
  "date-fns": "^4.1.0"
}
```

### Forms & Validation
```json
{
  "react-hook-form": "^7.53.0",
  "@hookform/resolvers": "^3.9.0",
  "yup": "^1.4.0"
}
```

### Dev Dependencies
```json
{
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@types/node": "^24.10.1",
  "@vitejs/plugin-react": "^5.1.1",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "typescript-eslint": "^8.46.4"
}
```

---

## Architecture Overview

### Folder Structure
```
teo-client/
├── src/
│   ├── routes/                   # Route components (or pages/)
│   │   ├── index.tsx             # Root redirect (auth-based)
│   │   ├── NotFound.tsx          # 404 page
│   │   ├── public/               # Public (unauthenticated) routes
│   │   │   ├── Home.tsx          # Landing page with featured products
│   │   │   ├── ProductList.tsx   # Product catalog with filters
│   │   │   ├── ProductDetail.tsx # Single product page
│   │   │   ├── Category.tsx      # Category page with products
│   │   │   ├── Brand.tsx         # Brand page with products
│   │   │   ├── Collection.tsx    # Collection page with products
│   │   │   ├── Search.tsx        # Search results page
│   │   │   ├── Cart.tsx         # Shopping cart page
│   │   │   ├── Checkout.tsx     # Checkout flow
│   │   │   ├── ContactUs.tsx    # Contact form page
│   │   │   ├── About.tsx        # About page
│   │   │   ├── Login.tsx        # User login
│   │   │   ├── Register.tsx     # User registration
│   │   │   ├── VerifyOtp.tsx    # OTP verification
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   └── protected/            # Authenticated routes (layout + guard)
│   │       ├── Layout.tsx        # Authenticated layout (header, footer)
│   │       ├── Profile.tsx       # User profile view/edit
│   │       ├── ChangePassword.tsx
│   │       ├── orders/
│   │       │   ├── Orders.tsx    # Order history list
│   │       │   └── OrderDetail.tsx # Single order details
│   │       ├── addresses/
│   │       │   ├── Addresses.tsx # Address list
│   │       │   ├── AddressAdd.tsx
│   │       │   └── AddressEdit.tsx
│   │       ├── reviews/
│   │       │   ├── Reviews.tsx   # User's review list
│   │       │   └── ReviewAdd.tsx # Add review for product
│   │       ├── Wishlist.tsx     # Wishlist/favorites page
│   │       └── Notifications.tsx # Notification center
│   │
│   ├── components/
│   │   ├── ui/                    # Base UI components (Design System)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   ├── forms/
│   │   │   ├── FormInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── Checkbox.tsx
│   │   ├── product/              # Product-specific components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   └── AddToCartButton.tsx
│   │   ├── cart/                 # Cart components
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CouponInput.tsx
│   │   ├── checkout/             # Checkout components
│   │   │   ├── AddressForm.tsx
│   │   │   ├── PaymentMethodSelector.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── order/                # Order components
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   └── OrderTimeline.tsx
│   │   └── tables/
│   │       ├── Table.tsx
│   │       ├── TableHeader.tsx
│   │       ├── TableRow.tsx
│   │       └── Pagination.tsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useThemeColor.ts
│   │   └── queries/              # TanStack Query hooks (optional co-location)
│   │       ├── useProducts.ts
│   │       ├── useCart.ts
│   │       ├── useOrders.ts
│   │       ├── useCategories.ts
│   │       ├── useBrands.ts
│   │       ├── useCollections.ts
│   │       ├── useAddresses.ts
│   │       ├── useReviews.ts
│   │       ├── useCoupons.ts
│   │       └── useNotifications.ts
│   │
│   ├── constants/
│   │   └── theme.ts               # Brand colors (purple/pink), typography, spacing
│   │
│   ├── api/                       # API client and domain modules
│   │   ├── client.ts              # Axios instance + interceptors
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── brands.ts
│   │   ├── collections.ts
│   │   ├── tags.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   ├── addresses.ts
│   │   ├── reviews.ts
│   │   ├── coupons.ts
│   │   ├── packaging.ts
│   │   ├── notifications.ts
│   │   └── contact.ts
│   │
│   ├── store/                     # Redux store (auth, cart, wishlist)
│   │   ├── index.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── cartSlice.ts       # Optional: cart state
│   │   │   └── wishlistSlice.ts   # Optional: wishlist state
│   │   └── persistConfig.ts
│   │
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   ├── QueryProvider.tsx
│   │   └── ReduxProvider.tsx
│   │
│   ├── types/                     # Shared TypeScript types
│   │   └── index.ts
│   │
│   ├── assets/
│   │   └── images/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
├── doc/
│   └── FRONTEND_DOCUMENTATION.md
│
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── tailwind.config.js
```

### Architecture Patterns

#### 1. **Routing**
- React Router Dom with path-based routes.
- Route groups: public (home, products, cart, checkout, contact, about, auth pages) vs protected (profile, orders, addresses, reviews, wishlist, notifications).
- Layout route for protected area (header, footer, outlet).
- Auth guard: redirect unauthenticated users to `/login` when accessing protected routes.

#### 2. **Component Layers**
- **UI Components:** Base design system in `components/ui/` (Button, Input, Card, Modal, Alert, Badge).
- **Layout Components:** Navigation and page structure in `components/layout/` (Navbar, Footer, Container).
- **Product Components:** Product-specific UI in `components/product/` (ProductCard, ProductGrid, ProductImageGallery, VariantSelector, QuantitySelector, AddToCartButton).
- **Cart Components:** Shopping cart UI in `components/cart/` (CartItem, CartSummary, CouponInput).
- **Checkout Components:** Checkout flow UI in `components/checkout/` (AddressForm, PaymentMethodSelector, OrderSummary).
- **Order Components:** Order display UI in `components/order/` (OrderCard, OrderStatusBadge, OrderTimeline).
- **Form Components:** Form-specific inputs in `components/forms/` (FormInput, Select, DatePicker, Checkbox).
- **Table Components:** Data presentation in `components/tables/` (Table, TableHeader, TableRow, Pagination).
- **Route/Page Components:** Full pages in `src/routes/`.

#### 3. **Styling**
- Tailwind CSS utility-first.
- Design tokens in `constants/theme.ts` and Tailwind config (purple/pink brand palette, spacing, typography).
- No inline styles for layout; prefer Tailwind classes.

#### 4. **State Management**
- **Redux (or similar):** Global app state; auth slice (user, tokens), optional cart slice, optional wishlist slice with redux-persist (e.g. localStorage) for web.
- **AuthProvider:** Wraps app; exposes login, logout, refresh, user, isAuthenticated, isLoading; coordinates token and redirects.
- **TanStack Query:** Server state for products, categories, brands, collections, cart, orders, payments, addresses, reviews, coupons, notifications; query/mutation hooks per domain.
- **Local state:** useState/useReducer for UI-only state (modals, filters, form draft, product variant selection).
- **Navigation state:** React Router (location, params).

#### 5. **Services Layer**
- Central API client in `api/client.ts` (axios with base URL, request/response interceptors for auth and refresh).
- Domain modules in `api/` (auth, users, products, categories, brands, collections, tags, cart, orders, payments, addresses, reviews, coupons, packaging, notifications, contact) calling the client.
- Environment variable `VITE_API_URL` for base URL.

---

## Pages & Screens

### 1. Root Layout (`App.tsx`)
**Purpose:** Root navigation structure and app-wide configuration.

**Features:**
- React Router setup (BrowserRouter).
- Providers: QueryClientProvider (TanStack Query), Redux Provider (with persist), AuthProvider.
- Route tree: public routes, protected layout, 404.
- Global layout wrapper.

**Routes:**
- `/` — Root index (home page).
- Public routes (home, products, cart, checkout, contact, about, auth pages).
- Protected routes under layout (profile, orders, addresses, reviews, wishlist, notifications).
- `*` — NotFound (404).

---

### 2. Root Index (Home)
**Purpose:** Landing page with featured content.

**Features:**
- Hero section with call-to-action.
- Featured products carousel/grid.
- Popular categories showcase.
- Featured collections.
- Popular brands section.
- Optional promotional banners.

**Route:** `/`

**Backend:** `GET /api/products`, `GET /api/categories`, `GET /api/collections`, `GET /api/brands/popular`

---

### 3. Not Found Page
**Purpose:** 404 for unmatched routes.

**Features:**
- User-friendly message.
- Link/button back to home.

**Route:** `*`

---

### 4. Public Shopping Pages

#### Product List (`/products`)
**Purpose:** Product catalog with filtering and sorting.

**Features:**
- Product grid/list view toggle.
- Filters: category, brand, price range, tags.
- Sort options: price (low-high, high-low), newest, popularity.
- Search within products.
- Pagination.
- Breadcrumbs navigation.

**Backend:** `GET /api/products` (with query params for filters, sort, pagination)

**Route:** `/products`

---

#### Product Detail (`/products/:id`)
**Purpose:** Single product page with full details.

**Features:**
- Product image gallery (with zoom, thumbnails).
- Product title, description, price, compare price.
- Variant selector (size, color, etc.) with stock indicators.
- Quantity selector.
- Add to cart button.
- Add to wishlist button.
- Product reviews section.
- Related products carousel.
- Breadcrumbs navigation.

**Backend:** `GET /api/products/:id`, `GET /api/products/:id/optimized-images`, `GET /api/reviews/products/:productId`

**Route:** `/products/:id`

---

#### Category Page (`/categories/:slug`)
**Purpose:** Display products filtered by category.

**Features:**
- Category name and description.
- Product grid with same filters as product list.
- Pagination.
- Breadcrumbs navigation.

**Backend:** `GET /api/categories/:categoryId`, `GET /api/products` (filtered by category)

**Route:** `/categories/:slug`

---

#### Brand Page (`/brands/:slug`)
**Purpose:** Display products filtered by brand.

**Features:**
- Brand logo, name, description.
- Product grid with same filters as product list.
- Pagination.
- Breadcrumbs navigation.

**Backend:** `GET /api/brands/:brandId`, `GET /api/products` (filtered by brand)

**Route:** `/brands/:slug`

---

#### Collection Page (`/collections/:slug`)
**Purpose:** Display products in a collection.

**Features:**
- Collection name and description.
- Product grid.
- Pagination.
- Breadcrumbs navigation.

**Backend:** `GET /api/collections/:collectionId`, `GET /api/products` (filtered by collection)

**Route:** `/collections/:slug`

---

#### Search Results (`/search`)
**Purpose:** Search results page.

**Features:**
- Search query display.
- Product results grid.
- Filters and sort options.
- Pagination.
- "No results" state.

**Backend:** `GET /api/products` (with search query param)

**Route:** `/search?q=query`

---

#### Shopping Cart (`/cart`)
**Purpose:** Shopping cart page with item management.

**Features:**
- Cart items list with image, name, variant, quantity, price.
- Update quantity controls.
- Remove item button.
- Coupon code input and apply button.
- Cart summary (subtotal, discounts, fees, tax, total).
- Proceed to checkout button.
- Empty cart state.
- Continue shopping link.

**Backend:** `GET /api/cart`, `PUT /api/cart/items/:skuId`, `DELETE /api/cart/items/:skuId`, `POST /api/coupons/validate`, `GET /api/cart/validate`

**Route:** `/cart`

---

#### Checkout (`/checkout`)
**Purpose:** Checkout flow for placing orders.

**Features:**
- Multi-step flow or single page:
  1. Address selection/creation (delivery address for delivery orders).
  2. Order type selection (pickup or delivery).
  3. Payment method selection (M-Pesa, Paystack Card, Cash, Post to Bill, COD).
  4. Order review (items, pricing breakdown, address, payment method).
- Address form (for new addresses).
- Payment method forms (phone for M-Pesa, card details for Paystack).
- Order summary sidebar/section.
- Place order button.
- Loading states during payment processing.
- Success/error handling.

**Backend:** `GET /api/addresses`, `POST /api/addresses`, `GET /api/packaging/public`, `POST /api/orders`, `POST /api/payments/pay-invoice`

**Route:** `/checkout`

---

#### Contact Us (`/contact`)
**Purpose:** Contact form page.

**Features:**
- Contact form: name, email, phone, subject, message.
- Form validation.
- Submit and success message.
- Optional store information display.

**Backend:** `POST /api/contact` (or similar endpoint)

**Route:** `/contact`

---

#### About (`/about`)
**Purpose:** About page with company information.

**Features:**
- Company story/mission.
- Optional team section.
- Store information from store config.

**Route:** `/about`

---

### 5. Public (Auth) Pages

#### Register (`/register`)
**Purpose:** User registration with OTP verification.

**Features:**
- Registration form: name, email, phone, password, confirm password.
- Form validation.
- Google OAuth option.
- Submit triggers OTP send.
- Redirect to verify OTP page.

**Backend:** `POST /api/auth/register`, `GET /api/auth/google`

**Route:** `/register`

---

#### Verify OTP (`/verify-otp`)
**Purpose:** Verify OTP and activate account.

**Features:**
- Email or phone + OTP input.
- Resend OTP option.
- Redirect to home or login on success.

**Backend:** `POST /api/auth/verify-otp`, `POST /api/auth/resend-otp`

**Route:** `/verify-otp`

---

#### Login (`/login`)
**Purpose:** User authentication.

**Features:**
- Email or phone + password form.
- Form validation.
- Error display.
- Google OAuth option.
- Redirect to home or intended page on success.
- Links to forgot password and register.

**Backend:** `POST /api/auth/login`, `GET /api/auth/google`

**Route:** `/login`

---

#### Forgot Password (`/forgot-password`)
**Purpose:** Request password reset.

**Features:**
- Email input.
- Submit sends reset instructions.
- Success message and link to login.

**Backend:** `POST /api/auth/forgot-password`

**Route:** `/forgot-password`

---

#### Reset Password (`/reset-password/:token`)
**Purpose:** Set new password with token.

**Features:**
- Token from URL params.
- New password + confirm fields.
- Validation; submit reset.
- Redirect to login on success.

**Backend:** `POST /api/auth/reset-password/:token`

**Route:** `/reset-password/:token`

---

### 6. Protected Layout
**Purpose:** Wrapper for all authenticated pages with shared chrome.

**Features:**
- Auth guard: redirect to `/login` if not authenticated.
- Header with logo, navigation links, cart icon, user menu, logout.
- Footer with links and information.
- Main content area (outlet).

**Route:** All child routes under this layout.

---

### 7. Profile (`/profile`)
**Purpose:** View and edit own profile.

**Features:**
- Display current user (name, email, phone, avatar).
- Edit form (name, email, phone, avatar upload).
- Link to change password.
- Notification preferences section.
- Save and success/error feedback.

**Backend:** `GET /api/users/profile`, `PUT /api/users/profile`, `GET /api/users/notifications`, `PUT /api/users/notifications`

**Route:** `/profile`

---

### 8. Change Password (`/profile/change-password`)
**Purpose:** Change authenticated user's password.

**Features:**
- Current password, new password, confirm new password.
- Validation and submit.
- Success message and optional redirect to profile.

**Backend:** `PUT /api/users/change-password`

**Route:** `/profile/change-password`

---

### 9. Order Management

#### Orders List (`/orders`)
**Purpose:** View order history for authenticated user.

**Features:**
- Order cards/list with order number, date, status, total amount.
- Filters: status (PLACED, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED).
- Sort by date (newest first).
- Pagination.
- Click order card to view details.

**Backend:** `GET /api/orders`

**Route:** `/orders`

---

#### Order Detail (`/orders/:id`)
**Purpose:** View single order details with status tracking.

**Features:**
- Order information: order number, date, status, payment status.
- Order status timeline/stepper.
- Order items: product image, name, variant, quantity, price.
- Pricing breakdown: subtotal, discounts, fees, tax, total.
- Delivery information (if delivery order): address, delivery fee.
- Payment information: method, status, transaction references.
- Actions: cancel order (if allowed), track order, download invoice/receipt.
- Related links: reorder, contact support.

**Backend:** `GET /api/orders/:id`, `GET /api/invoices/:id`, `GET /api/receipts/:id`

**Route:** `/orders/:id`

---

### 10. Address Management

#### Addresses List (`/addresses`)
**Purpose:** Manage user addresses.

**Features:**
- List of saved addresses with name, address, default indicator.
- Actions: set as default, edit, delete.
- "Add new address" button.
- Empty state if no addresses.

**Backend:** `GET /api/addresses`, `PUT /api/addresses/:addressId/default`, `DELETE /api/addresses/:addressId`

**Route:** `/addresses`

---

#### Add Address (`/addresses/new`)
**Purpose:** Create new address.

**Features:**
- Address form: name, address, coordinates (lat/lng), regions, details, set as default.
- Optional map picker for coordinates.
- Validation; submit.
- Redirect to addresses list on success.

**Backend:** `POST /api/addresses`

**Route:** `/addresses/new`

---

#### Edit Address (`/addresses/:id/edit`)
**Purpose:** Edit existing address.

**Features:**
- Pre-filled form with current address data.
- Update and save.
- Success/error feedback.

**Backend:** `PUT /api/addresses/:addressId`

**Route:** `/addresses/:id/edit`

---

### 11. Review Management

#### Reviews List (`/reviews`)
**Purpose:** View user's product reviews.

**Features:**
- List of reviews with product image, name, rating, comment, date.
- Filter by rating.
- Actions: edit, delete (own reviews only).
- Link to product page.

**Backend:** `GET /api/reviews/user/reviews`

**Route:** `/reviews`

---

#### Add Review (`/reviews/new`)
**Purpose:** Add review for a product (typically from order detail or product page).

**Features:**
- Product information display.
- Review form: rating (1-5 stars), comment.
- Validation; submit.
- Success message and redirect.

**Backend:** `POST /api/reviews/products/:productId`

**Route:** `/reviews/new?productId=:id` or embedded in product/order pages

---

### 12. Wishlist (`/wishlist`)
**Purpose:** View and manage wishlist/favorites.

**Features:**
- Product grid/list of wishlisted items.
- Product cards with image, name, price, add to cart button.
- Remove from wishlist button.
- Empty wishlist state.
- Optional: move to cart, share wishlist.

**Backend:** Wishlist API (if implemented) or local state management

**Route:** `/wishlist`

---

### 13. Notifications (`/notifications`)
**Purpose:** Notification center for current user.

**Features:**
- List of notifications with unread indicator.
- Filter by type (order_created, payment_success, order_status_changed, invoice_generated, receipt_issued).
- Mark as read, mark all as read.
- Delete notification.
- Unread count badge.
- Click notification to navigate to related page (order, etc.).

**Backend:** `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`, `DELETE /api/notifications/:id`

**Route:** `/notifications`

---

## Components

### UI Components (`components/ui/`)

- **Icons:** Use **react-icons** (e.g. `Fa*`, `Io*`, `Md*`, `Hi*` from Font Awesome, Ionicons, Material Design, Heroicons).
- **Button:** Variants primary, secondary, danger, ghost, disabled; primary button color per design system.
- **Input:** Text input with border, focus, error state; optional label and error message.
- **Card:** Container with optional accent strip (primary color); padding, border-radius, shadow.
- **Modal:** Dialog overlay; title, content, footer actions; close on overlay/escape.
- **Alert:** Success, error, info variants; icon + message.
- **Badge:** Status badges (e.g. PLACED, CONFIRMED, PACKED, SHIPPED, DELIVERED, CANCELLED, REFUNDED; PENDING, PAID, UNPAID).

### Layout Components (`components/layout/`)

- **Navbar:** Top bar with logo, navigation links (Home, Products, Categories, Brands, Collections), search bar, cart icon with count, user menu (Profile, Orders, Wishlist, Logout), login/register links.
- **Footer:** Page footer with links, store information, social media, copyright.
- **Container:** Page content wrapper with max-width and padding.

### Product Components (`components/product/`)

- **ProductCard:** Product card with image, name, price, compare price, rating, quick view/add to cart.
- **ProductGrid:** Responsive grid layout for product cards.
- **ProductImageGallery:** Image gallery with main image, thumbnails, zoom functionality.
- **VariantSelector:** Variant selection (size, color, etc.) with stock indicators.
- **QuantitySelector:** Quantity input with increment/decrement buttons.
- **AddToCartButton:** Add to cart button with loading state and success feedback.

### Cart Components (`components/cart/`)

- **CartItem:** Cart item display with image, name, variant, quantity controls, price, remove button.
- **CartSummary:** Cart summary with subtotal, discounts, fees, tax, total, coupon input.
- **CouponInput:** Coupon code input with apply button and validation feedback.

### Checkout Components (`components/checkout/`)

- **AddressForm:** Address form for creating/editing addresses (name, address, coordinates, regions, details).
- **PaymentMethodSelector:** Payment method selection (M-Pesa, Paystack Card, Cash, Post to Bill, COD) with method-specific forms.
- **OrderSummary:** Order summary sidebar/section with items, pricing breakdown, address, payment method.

### Order Components (`components/order/`)

- **OrderCard:** Order card with order number, date, status, total, items preview.
- **OrderStatusBadge:** Status badge component for order statuses.
- **OrderTimeline:** Order status timeline/stepper showing order progress.

### Form Components (`components/forms/`)

- **FormInput:** Label + input + error message; optional required indicator.
- **Select:** Dropdown for single select (e.g. category, brand, payment method, address).
- **DatePicker:** Date selection (for order date filters, etc.).
- **Checkbox:** Boolean option.

### Table Components (`components/tables/`)

- **Table:** Semantic table wrapper; header + body.
- **TableHeader:** Header row with sortable column headers if needed.
- **TableRow:** Row with cells; optional click and actions.
- **Pagination:** Previous/next, page numbers, page size; integrate with list queries.

---

## Hooks

- **useAuth:** From AuthProvider; returns `{ user, isAuthenticated, isLoading, login, logout, refresh }`. Used for guard and header.
- **useThemeColor:** Optional; returns theme color by name (e.g. primary, secondary) for programmatic styling.
- **TanStack Query hooks:** Co-locate with API or in `hooks/queries/`: 
  - **Products:** `useProducts(filters, pagination)`, `useProduct(id)`, `useOptimizedImages(productId)`
  - **Categories:** `useCategories()`, `useCategory(id)`, `useCategoryTree()`, `useCategoriesWithProducts()`
  - **Brands:** `useBrands()`, `useBrand(id)`, `usePopularBrands()`, `useActiveBrands()`
  - **Collections:** `useCollections()`, `useCollection(id)`, `useActiveCollections()`
  - **Tags:** `useTags()`, `useTag(id)`, `usePopularTags()`
  - **Cart:** `useCart()`, `useAddToCart()`, `useUpdateCartItem()`, `useRemoveFromCart()`, `useClearCart()`, `useValidateCart()`
  - **Orders:** `useOrders(filters)`, `useOrder(id)`, `useCreateOrder()`
  - **Payments:** `usePayment(id)`, `usePayInvoice()`, `useQueryMpesaStatus()`
  - **Addresses:** `useAddresses()`, `useAddress(id)`, `useCreateAddress()`, `useUpdateAddress()`, `useDeleteAddress()`, `useSetDefaultAddress()`, `useDefaultAddress()`
  - **Reviews:** `useProductReviews(productId)`, `useUserReviews()`, `useReview(id)`, `useCreateReview()`, `useUpdateReview()`, `useDeleteReview()`
  - **Coupons:** `useValidateCoupon()`, `useApplyCoupon()`
  - **Packaging:** `usePackagingList()`, `useActivePackaging()`, `useDefaultPackaging()`
  - **Notifications:** `useNotifications()`, `useNotification(id)`, `useUnreadCount()`, `useMarkAsRead()`, `useMarkAllAsRead()`, `useDeleteNotification()`
  
  Each encapsulates `useQuery`/`useMutation` and API calls.

---

## Constants

### Theme Constants (`constants/theme.ts`)

#### Brand Palette (Purple/Pink theme)
```typescript
export const BrandColors = {
  primary: '#4B2E83',        // Primary - brand identity, primary text
  secondary: '#E879F9',      // Secondary - accents, highlights
  primaryButton: '#3A1F66',  // Primary button - action buttons
  secondaryButton: '#FDE7FF', // Secondary button - soft actions
  light: '#F8F5FF',          // Light - section backgrounds

  text: '#000000',
  background: '#ffffff',
  border: '#e5e5e5',

  error: '#a33c3c',
  success: '#2d8a2d',
  disabled: '#f0f0f0',
  disabledText: '#999999',
};
```

#### Typography
- Headings: Poppins (or similar), bold/semibold; sizes 28–32px (h1), 22–26px (h2), 18–20px (h3).
- Body: Inter (or similar), regular; 14–16px.
- Caption: 12px; labels, helper text.

#### Spacing (4-point scale)
- xs: 4, sm: 8, md: 12, base: 16, lg: 24, xl: 32, 2xl: 48, 3xl: 64 (px).
- Use Tailwind equivalents: p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16.

---

## Routing Structure

### Route Hierarchy

- **Public:** `/`, `/products`, `/products/:id`, `/categories/:slug`, `/brands/:slug`, `/collections/:slug`, `/search`, `/cart`, `/checkout`, `/contact`, `/about`, `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password/:token`
- **Protected (under layout):** `/profile`, `/profile/change-password`, `/orders`, `/orders/:id`, `/addresses`, `/addresses/new`, `/addresses/:id/edit`, `/reviews`, `/reviews/new`, `/wishlist`, `/notifications`
- **Root:** `/` → Home page
- **404:** `*` → NotFound

### Auth Guard Pattern

- Protected layout (or wrapper) checks `isAuthenticated` from AuthProvider (or Redux).
- If `isLoading`, show loading UI.
- If `!isAuthenticated`, redirect to `/login` (and optionally save intended URL for post-login redirect).
- Otherwise render outlet (child routes).
- Public routes (home, products, cart) are accessible without authentication.
- Cart and checkout may require authentication at checkout step (redirect to login if needed).

---

## Styling Approach

- **Tailwind CSS:** Utility-first; content paths in config for `./src/**/*.{ts,tsx}`.
- **Theme integration:** Extend Tailwind theme in `tailwind.config.js` with colors from `constants/theme.ts` (e.g. `brand.primary`, `brand.secondary`, `brand.primaryButton`, `brand.secondaryButton`, `brand.light`), fontFamily (Poppins, Inter), spacing if needed.
- **Global styles:** In `src/index.css`, use Tailwind directives (`@tailwind base; @tailwind components; @tailwind utilities;`); add any custom base (e.g. font imports, minimal resets).
- **Component styling:** Prefer Tailwind classes; avoid inline styles except for dynamic values. Use design tokens (purple/pink palette, spacing) consistently.

---

## UI Design System

### Overview

The TEO KICKS E-commerce UI uses a **purple/pink** theme for primary actions and accents, with neutral backgrounds and text for readability.

**Design philosophy:** Modern, vibrant, engaging; purple used for brand identity and primary actions, pink for accents and highlights.

### Brand Palette (Purple/Pink)

| Role           | Hex       | Usage                          | Tailwind class       |
|----------------|-----------|--------------------------------|----------------------|
| Primary        | `#4B2E83` | Brand identity, primary text   | `text-primary`       |
| Secondary      | `#E879F9` | Accents, highlights            | `text-secondary`     |
| Primary Button | `#3A1F66` | Action buttons                 | `bg-primary-button`  |
| Secondary Button| `#FDE7FF` | Soft actions                  | `bg-secondary-button`|
| Light          | `#F8F5FF` | Section backgrounds            | `bg-light`           |
| Text           | `#000000` | Primary text                   | `text-black`         |
| Background     | `#ffffff` | Page background                | `bg-white`           |
| Border         | `#e5e5e5` | Dividers, inputs               | `border-gray-300`    |

### Typography

- **H1:** Poppins 700, 28–32px; page titles.
- **H2:** Poppins 600, 22–26px; section titles.
- **H3:** Poppins 600, 18–20px; subsection.
- **Body:** Inter 400, 14–16px; general text.
- **Caption:** Inter 300/400, 12px; labels, helper text.

### Spacing & Grid

- 4-point scale: 4, 8, 12, 16, 24, 32, 48, 64 px.
- Minimum padding for interactive elements: 16px.
- Section spacing: 24–32px; page-level up to 64px on large screens.

### Buttons

- **Primary:** Primary button color (`#3A1F66`), white text; hover darker purple.
- **Secondary:** Secondary button color (`#FDE7FF`), primary text; hover light pink.
- **Danger:** Red for delete/destructive.
- **Ghost:** Transparent, primary text.
- **Disabled:** Gray background and text.
- Min height ~48px; border-radius e.g. `rounded-xl`.

### Forms & Inputs

- Border `#e5e5e5`; focus border primary color (2px).
- Label above input; error text and border in red.
- Border-radius `rounded-lg`.
- **Form validation:** Use **yup** for schema validation with **react-hook-form** (`@hookform/resolvers/yup`).

### Cards & Containers

- White background; padding `p-6`; border-radius `rounded-2xl`; optional shadow.
- Optional 4px top accent strip in primary color.

### Tables

- Header: light background (`#F8F5FF`), primary or dark text.
- Rows: white; hover light background; border between rows.
- Align numbers/currency right; text left.

### Notifications & Alerts

- Success: green; icon + message.
- Error: red; icon + message.
- Info: light background (`#F8F5FF`); dark text.

### Accessibility

- Contrast: body text and UI meet WCAG AA (e.g. 4.5:1).
- Focus: visible focus ring (e.g. primary color or neutral).
- Touch targets: min ~48px where applicable.
- Labels: all inputs have associated labels.

### Responsive

- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px.
- Navigation: mobile menu/hamburger on small screens.
- Product grids: responsive columns (1 on mobile, 2-3 on tablet, 4+ on desktop).
- Tables: consider horizontal scroll or card stack on mobile.

### Component Directory

- `components/ui/` — Button, Input, Card, Modal, Alert, Badge.
- `components/layout/` — Navbar, Footer, Container.
- `components/product/` — ProductCard, ProductGrid, ProductImageGallery, VariantSelector, QuantitySelector, AddToCartButton.
- `components/cart/` — CartItem, CartSummary, CouponInput.
- `components/checkout/` — AddressForm, PaymentMethodSelector, OrderSummary.
- `components/order/` — OrderCard, OrderStatusBadge, OrderTimeline.
- `components/forms/` — FormInput, Select, DatePicker, Checkbox.
- `components/tables/` — Table, TableHeader, TableRow, Pagination.

---

## State Management

- **Redux (or similar):** Global app state; 
  - **Auth slice:** Holds user and tokens. Persist to localStorage via redux-persist so sessions survive refresh. Serialize only safe fields (no raw password).
  - **Cart slice (optional):** Can store cart items locally for faster UI updates, but sync with server via TanStack Query. Alternatively, use TanStack Query only for cart state.
  - **Wishlist slice (optional):** Store wishlist items locally. Can be managed via TanStack Query if backend supports it, or purely local state.
- **AuthProvider:** Wraps app; reads/writes auth state (Redux or local); provides login, logout, refresh, user, isAuthenticated, isLoading. On mount, optionally validate token or refresh; redirect unauthenticated users from protected routes.
- **TanStack Query:** Server state for all API-backed data (products, categories, brands, collections, tags, cart, orders, payments, addresses, reviews, coupons, packaging, notifications). Use default staleTime (e.g. 5 min) and gcTime (e.g. 10 min); query keys per resource and filters; mutations invalidate relevant queries. Co-locate hooks with API modules or in `hooks/queries/`.
- **Local state:** useState/useReducer for UI-only state (modals, filters, form draft, UI toggles, product variant selection, quantity selectors, checkout step navigation).
- **Navigation state:** React Router (location, params); no duplicate state for route data.

---

## API Integration

### API Client

- **File:** `api/client.ts` (or `services/api.ts`).
- **Base URL:** From `import.meta.env.VITE_API_URL` (e.g. `http://localhost:4500`).
- **Request interceptor:** Attach `Authorization: Bearer <accessToken>` from Redux or AuthProvider.
- **Response interceptor:** On 401, try refresh (e.g. `POST /api/auth/refresh-token` with refreshToken); on success update token and retry request; on failure clear auth and redirect to login. For other errors, optionally show toast or global error handler.
- **Content-Type:** `application/json` for JSON bodies; for file uploads use FormData and do not set Content-Type (browser sets multipart boundary).

### Domain Modules

- **auth:** register, login, logout, refreshToken, forgotPassword, resetPassword, verifyOtp, resendOtp, getMe, googleAuth, googleAuthCallback, googleAuthMobile.
- **users:** getProfile, updateProfile, changePassword, getNotificationPreferences, updateNotificationPreferences.
- **products:** getAllProducts (with filters, pagination, search), getProductById, getOptimizedImages.
- **categories:** getAllCategories, getCategoryTree, getCategoryById, getCategoriesWithProducts, getRootCategories.
- **brands:** getAllBrands, getBrandById, getPopularBrands, getActiveBrands, getBrandsWithProducts.
- **collections:** getAllCollections, getCollectionById, getActiveCollections, getCollectionsWithProducts.
- **tags:** getAllTags, getTagById, getPopularTags, getTagsWithProducts.
- **cart:** getCart, addToCart, updateCartItem, removeFromCart, clearCart, validateCart.
- **orders:** createOrder, getOrders, getOrderById.
- **payments:** payInvoice, getPaymentById, queryMpesaStatus, queryMpesaByCheckoutId.
- **addresses:** getUserAddresses, getAddressById, createAddress, updateAddress, deleteAddress, setDefaultAddress, getDefaultAddress.
- **reviews:** getProductReviews, createReview, updateReview, deleteReview, getUserReviews, getReviewById.
- **coupons:** validateCoupon, applyCoupon.
- **packaging:** getPackagingList, getActivePackaging, getDefaultPackaging, getPackagingById.
- **notifications:** getNotifications, getUnreadCount, getNotification, markAsRead, markAllAsRead, deleteNotification.
- **contact:** submitContact (or createContact).

### Environment Variables

- `VITE_API_URL` — Backend API base URL (e.g. `http://localhost:4500`).
- Do not put secrets (e.g. API keys for server-only use) in Vite env; backend handles those.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to project: `cd teo-client`
2. Install dependencies: `npm install`
3. Copy env: `cp .env.example .env` and set `VITE_API_URL` to your backend URL (e.g. `http://localhost:4500`).
4. Start dev server: `npm run dev`
5. Build: `npm run build`
6. Preview build: `npm run preview`

### Development

- Run backend (TEO KICKS API) so API calls resolve (see backend doc at `../TEO-API/server/doc/BACKEND_DOCUMENTATION.md`).
- Use React Router and AuthProvider so protected routes redirect to login when not authenticated.
- Public routes (home, products, cart) are accessible without authentication.

---

## Code Style & Best Practices

- **TypeScript:** Strict mode; type props and API responses; avoid `any` where possible.
- **Path aliases:** Use `@/` for `src/` (e.g. `@/components/ui/Button`, `@/api/client`). Configure in `tsconfig.json` and `vite.config.ts`.
- **Components:** Functional components; named exports for components, default for page/route components if preferred.
- **Naming:** PascalCase for components; camelCase for files (e.g. `UserList.tsx`); `use` prefix for hooks; UPPER_SNAKE for constants.
- **Props:** Define interfaces or types for component props and API payloads.

---

## Security Considerations

- **Token storage (web):** Access token in memory (Redux/context) is preferable; if persisting, use redux-persist to localStorage and accept XSS risk for refresh token, or use httpOnly cookies if backend supports it. Do not store tokens in sessionStorage for long-lived refresh if avoidable.
- **HTTPS:** Use HTTPS in production for API and app.
- **Secrets:** No backend API secrets or private keys in frontend env or code.
- **Auth:** Validate token and refresh before sensitive operations; redirect to login on 401 after refresh failure.

---

## Testing

- **Unit/component:** Jest + React Testing Library; test critical UI and hooks.
- **E2E (optional):** Playwright or Cypress for login flow, product browsing, cart, and checkout flows.
- **API mocking:** MSW (Mock Service Worker) or similar for tests that call API.

---

## Additional Resources

- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)
- Backend: TEO KICKS API documentation at `../TEO-API/server/doc/BACKEND_DOCUMENTATION.md`

---

## Version Information

- **Document version:** 1.0.0
- **React:** 19.x
- **TypeScript:** 5.9.x
- **Vite:** 7.x
- **Tailwind CSS:** 4.x

---

## Support & Contribution

- **New features:** Add routes and pages under `src/routes/public/` or `src/routes/protected/`; add API modules and query hooks as needed; document new pages in this file.
- **New components:** Place in appropriate component directory (`components/ui/`, `components/layout/`, `components/product/`, `components/cart/`, `components/checkout/`, `components/order/`, `components/forms/`, `components/tables/`); follow design system (purple/pink theme, spacing, typography).
- **Doc updates:** Keep this document in sync with route list, API modules, and design tokens when adding or changing features.

---

**Last Updated:** January 2026
