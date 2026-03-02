# TEO KICKS API Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Product Endpoints](#product-endpoints)
  - [Category Endpoints](#category-endpoints)
  - [Brand Endpoints](#brand-endpoints)
  - [Collection Endpoints](#collection-endpoints)
  - [Tag Endpoints](#tag-endpoints)
  - [Cart Endpoints](#cart-endpoints)
  - [Order Endpoints](#order-endpoints)
  - [Payment Endpoints](#payment-endpoints)
  - [Address Endpoints](#address-endpoints)
  - [Review Endpoints](#review-endpoints)
  - [Coupon Endpoints](#coupon-endpoints)
  - [Packaging Option Endpoints](#packaging-option-endpoints)
  - [Notification Endpoints](#notification-endpoints)
  - [Contact Endpoints](#contact-endpoints)
- [Response Format](#response-format)
- [Status Codes](#status-codes)
- [Error Handling](#error-handling)
- [Integrations](#integrations)
- [Usage Examples](#usage-examples)
- [Notes](#notes)

---

## Overview

This document provides comprehensive documentation for all API endpoints available in the TEO KICKS e-commerce application. The API follows RESTful conventions and uses JWT-based authentication with role-based access control.

**Base URL:** `http://localhost:5000` (configurable via `VITE_API_URL` environment variable)

All API endpoints are prefixed with `/api`, so the full URL format is: `http://localhost:5000/api/{endpoint}`

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <accessToken>
```

### Authentication Flow

1. **Register/Login** - Obtain access token and refresh token
2. **OTP Verification** - Verify account via OTP sent to email/phone
3. **Token Storage** - Tokens are stored in localStorage
4. **Automatic Refresh** - Access tokens are automatically refreshed when expired (401 response)
5. **Token Refresh** - Use refresh token to get a new access token
6. **OAuth Support** - Google OAuth authentication available

### Role-Based Access Control

The system uses a unified user model with roles:
- `customer` - Regular customers shopping on the platform
- `admin` - Administrators managing the system
- Additional roles can be assigned as needed

---

## API Endpoints

### Auth Endpoints

**Base:** `/api/auth`

#### Register
- **Endpoint:** `POST /auth/register`
- **Description:** User registration with OTP verification
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "password": "string",
    "role": "string" // Optional, defaults to "customer"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please verify your email with the OTP sent.",
    "data": {
      "userId": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "roles": [],
      "isVerified": false
    }
  }
  ```

#### Verify OTP
- **Endpoint:** `POST /auth/verify-otp`
- **Description:** Verify OTP and activate account
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "phone": "string", // Optional, either email or phone required
    "otp": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Email verified successfully",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "roles": [],
        "isVerified": true
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

#### Resend OTP
- **Endpoint:** `POST /auth/resend-otp`
- **Description:** Resend OTP for verification
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "phone": "string" // Optional, either email or phone required
  }
  ```

#### Login
- **Endpoint:** `POST /auth/login`
- **Description:** User login (email/phone + password)
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "phone": "string", // Optional, either email or phone required
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "avatar": "string",
        "roles": [],
        "isVerified": true
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

#### Logout
- **Endpoint:** `POST /auth/logout`
- **Description:** Logout user and invalidate tokens
- **Auth Required:** Yes

#### Forgot Password
- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Send password reset email
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```

#### Reset Password
- **Endpoint:** `POST /auth/reset-password/:token`
- **Description:** Reset password with token from email
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "newPassword": "string"
  }
  ```

#### Refresh Token
- **Endpoint:** `POST /auth/refresh-token`
- **Description:** Refresh JWT access token
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```

#### Get Current User
- **Endpoint:** `GET /auth/me`
- **Description:** Get current authenticated user profile
- **Auth Required:** Yes

#### Google Auth
- **Endpoint:** `GET /auth/google`
- **Description:** Initiate Google OAuth login
- **Auth Required:** No
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "authUrl": "string"
    }
  }
  ```

#### Google Auth Callback
- **Endpoint:** `POST /auth/google/callback`
- **Description:** Handle Google OAuth callback
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "code": "string"
  }
  ```

#### Google Auth Mobile
- **Endpoint:** `POST /auth/google/mobile`
- **Description:** Google OAuth for mobile apps using ID token
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "idToken": "string"
  }
  ```

---

### User Endpoints

**Base:** `/api/users`

#### Get Own Profile
- **Endpoint:** `GET /users/profile`
- **Description:** Get current user profile
- **Auth Required:** Yes

#### Update Own Profile
- **Endpoint:** `PUT /users/profile`
- **Description:** Update own profile
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "phone": "string",
    "avatar": "string",
    "country": "string",
    "timezone": "string"
  }
  ```
- **Content-Type:** `application/json` or `multipart/form-data` (for avatar upload)

#### Change Password
- **Endpoint:** `PUT /users/change-password`
- **Description:** Change user password
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```

#### Get Notification Preferences
- **Endpoint:** `GET /users/notifications`
- **Description:** Get notification preferences
- **Auth Required:** Yes

#### Update Notification Preferences
- **Endpoint:** `PUT /users/notifications`
- **Description:** Update notification preferences
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "email": "boolean",
    "sms": "boolean",
    "inApp": "boolean",
    "orderUpdates": "boolean",
    "promotions": "boolean",
    "stockAlerts": "boolean"
  }
  ```

#### Admin Create Customer
- **Endpoint:** `POST /users/admin-create`
- **Description:** Admin creates a new customer account
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "roles": ["string"] // Optional, defaults to customer
  }
  ```

#### Get All Users
- **Endpoint:** `GET /users`
- **Description:** Get all users (paginated, admin only)
- **Auth Required:** Yes (Admin)
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `search` - Search query
  - `role` - Filter by role
  - `status` - Filter by status (active/inactive, verified/unverified)

#### Get User by ID
- **Endpoint:** `GET /users/:userId`
- **Description:** Get single user details
- **Auth Required:** Yes (Admin)

#### Update User
- **Endpoint:** `PUT /users/:userId`
- **Description:** Update user (admin only)
- **Auth Required:** Yes (Admin)

#### Delete User
- **Endpoint:** `DELETE /users/:userId`
- **Description:** Delete user (admin only)
- **Auth Required:** Yes (Admin)

#### Update User Status
- **Endpoint:** `PUT /users/:userId/status`
- **Description:** Activate/deactivate user account
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "isActive": "boolean",
    "roles": ["string"] // Optional
  }
  ```

#### Set User Admin Role
- **Endpoint:** `PUT /users/:userId/admin`
- **Description:** Set user as admin
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "isAdmin": "boolean"
  }
  ```

#### Get User Roles
- **Endpoint:** `GET /users/:userId/roles`
- **Description:** Get user's assigned roles
- **Auth Required:** Yes (Admin)

---

### Product Endpoints

**Base:** `/api/products`

#### Get All Products
- **Endpoint:** `GET /products`
- **Description:** Get all products (public - returns active only for non-admin)
- **Auth Required:** No (returns active only) / Yes (Admin - returns all)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by title/description
  - `category` - Filter by category
  - `collection` - Filter by collection
  - `status` - Filter by status (active/draft/archived)

#### Get Product by ID
- **Endpoint:** `GET /products/:id`
- **Description:** Get single product details with populated variants and categories
- **Auth Required:** No

#### Create Product
- **Endpoint:** `POST /products`
- **Description:** Create new product (admin only)
- **Auth Required:** Yes (Admin)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `title` (required) - Product title
  - `description` - Product description
  - `shortDescription` - Short description
  - `brand` - Brand ObjectId
  - `categories` - JSON array of Category ObjectIds
  - `collections` - JSON array of Collection ObjectIds
  - `tags` - JSON array of Tag ObjectIds
  - `basePrice` (required) - Base price
  - `comparePrice` - Compare price
  - `variants` - JSON array of Variant ObjectIds
  - `features` - JSON array of feature strings
  - `trackInventory` - Boolean
  - `weight` - Weight in grams
  - `images` - Image files (up to 10)

#### Update Product
- **Endpoint:** `PUT /products/:productId`
- **Description:** Update product (admin only)
- **Auth Required:** Yes (Admin)
- **Content-Type:** `multipart/form-data`
- **Request Body:** Same as create, plus:
  - `keepImagePublicIds` - JSON array of image public IDs to retain
  - `keepImageDocIds` - JSON array of image document IDs to retain

#### Delete Product
- **Endpoint:** `DELETE /products/:productId`
- **Description:** Delete product (admin only)
- **Auth Required:** Yes (Admin)

#### Generate SKUs
- **Endpoint:** `POST /products/:productId/generate-skus`
- **Description:** Regenerate SKUs for a product based on its variants
- **Auth Required:** Yes (Admin)

#### Update SKU
- **Endpoint:** `PATCH /products/:productId/skus/:skuId`
- **Description:** Update specific SKU details
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "price": "number",
    "stock": "number",
    "lowStockThreshold": "number"
  }
  ```

#### Delete SKU
- **Endpoint:** `DELETE /products/:productId/skus/:skuId`
- **Description:** Delete a specific SKU
- **Auth Required:** Yes (Admin)

#### Attach Variant
- **Endpoint:** `POST /products/:productId/attach-variant`
- **Description:** Attach a variant to a product and regenerate SKUs
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "variantId": "string"
  }
  ```

#### Detach Variant
- **Endpoint:** `POST /products/:productId/detach-variant`
- **Description:** Detach a variant from a product
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "variantId": "string"
  }
  ```

#### Upload Product Images
- **Endpoint:** `POST /products/:productId/images`
- **Description:** Upload additional images for a product
- **Auth Required:** Yes (Admin)
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `images` - Image files (up to 10)

#### Delete Product Image
- **Endpoint:** `DELETE /products/:productId/images/:imageId`
- **Description:** Delete a specific product image
- **Auth Required:** Yes (Admin)

#### Set Primary Image
- **Endpoint:** `PUT /products/:productId/images/:imageId/primary`
- **Description:** Set a specific image as the primary image
- **Auth Required:** Yes (Admin)

#### Get Optimized Images
- **Endpoint:** `GET /products/:productId/optimized-images`
- **Description:** Get URLs for optimized and responsive versions of product images
- **Auth Required:** No
- **Query Parameters:**
  - `width` - Image width (default: 800)
  - `height` - Image height (default: 800)

---

### Category Endpoints

**Base:** `/api/categories`

#### Get All Categories
- **Endpoint:** `GET /categories`
- **Description:** Get all categories
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by name
  - `status` - Filter by status (active/inactive)

#### Get Category Tree
- **Endpoint:** `GET /categories/tree`
- **Description:** Get category tree structure
- **Auth Required:** No

#### Get Category by ID
- **Endpoint:** `GET /categories/:id`
- **Description:** Get single category details
- **Auth Required:** No

#### Create Category
- **Endpoint:** `POST /categories`
- **Description:** Create new category (admin only)
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "isActive": "boolean"
  }
  ```

#### Update Category
- **Endpoint:** `PUT /categories/:categoryId`
- **Description:** Update category (admin only)
- **Auth Required:** Yes (Admin)

#### Delete Category
- **Endpoint:** `DELETE /categories/:categoryId`
- **Description:** Delete category (admin only)
- **Auth Required:** Yes (Admin)

#### Get Root Categories
- **Endpoint:** `GET /categories/root`
- **Description:** Get root categories
- **Auth Required:** No

---

### Brand Endpoints

**Base:** `/api/brands`

#### Get All Brands
- **Endpoint:** `GET /brands`
- **Description:** Get all brands
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by name
  - `active` - Filter by active status

#### Get Brand by ID
- **Endpoint:** `GET /brands/:id`
- **Description:** Get single brand details
- **Auth Required:** No

#### Get Popular Brands
- **Endpoint:** `GET /brands/popular`
- **Description:** Get popular brands
- **Auth Required:** No
- **Query Parameters:**
  - `limit` - Number of brands to return (default: 10)

#### Get Active Brands
- **Endpoint:** `GET /brands/active`
- **Description:** Get active brands
- **Auth Required:** No

#### Create Brand
- **Endpoint:** `POST /brands`
- **Description:** Create new brand (admin only)
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "logo": "string",
    "website": "string",
    "features": ["string"],
    "sortOrder": "number",
    "isActive": "boolean"
  }
  ```

#### Update Brand
- **Endpoint:** `PUT /brands/:brandId`
- **Description:** Update brand (admin only)
- **Auth Required:** Yes (Admin)

#### Delete Brand
- **Endpoint:** `DELETE /brands/:brandId`
- **Description:** Delete brand (admin only)
- **Auth Required:** Yes (Admin)

---

### Collection Endpoints

**Base:** `/api/collections`

#### Get All Collections
- **Endpoint:** `GET /collections`
- **Description:** Get all collections
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by name
  - `active` - Filter by active status

#### Get Collection by ID
- **Endpoint:** `GET /collections/:id`
- **Description:** Get single collection details
- **Auth Required:** No

#### Get Active Collections
- **Endpoint:** `GET /collections/active`
- **Description:** Get active collections
- **Auth Required:** No

#### Create Collection
- **Endpoint:** `POST /collections`
- **Description:** Create new collection (admin only)
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "isActive": "boolean"
  }
  ```

#### Update Collection
- **Endpoint:** `PUT /collections/:collectionId`
- **Description:** Update collection (admin only)
- **Auth Required:** Yes (Admin)

#### Delete Collection
- **Endpoint:** `DELETE /collections/:collectionId`
- **Description:** Delete collection (admin only)
- **Auth Required:** Yes (Admin)

---

### Tag Endpoints

**Base:** `/api/tags`

#### Get All Tags
- **Endpoint:** `GET /tags`
- **Description:** Get all tags
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by name
  - `active` - Filter by active status

#### Get Tag by ID
- **Endpoint:** `GET /tags/:id`
- **Description:** Get single tag details
- **Auth Required:** No

#### Get Popular Tags
- **Endpoint:** `GET /tags/popular`
- **Description:** Get popular tags
- **Auth Required:** No
- **Query Parameters:**
  - `limit` - Number of tags to return (default: 10)

#### Create Tag
- **Endpoint:** `POST /tags`
- **Description:** Create new tag (admin only)
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "isActive": "boolean"
  }
  ```

#### Update Tag
- **Endpoint:** `PUT /tags/:tagId`
- **Description:** Update tag (admin only)
- **Auth Required:** Yes (Admin)

#### Delete Tag
- **Endpoint:** `DELETE /tags/:tagId`
- **Description:** Delete tag (admin only)
- **Auth Required:** Yes (Admin)

---

### Cart Endpoints

**Base:** `/api/cart`

#### Get Cart
- **Endpoint:** `GET /cart`
- **Description:** Get current user's active cart
- **Auth Required:** Yes

#### Add to Cart
- **Endpoint:** `POST /cart`
- **Description:** Add item to cart
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "productId": "string",
    "skuId": "string",
    "quantity": "number",
    "variantOptions": {}
  }
  ```

#### Update Cart Item
- **Endpoint:** `PATCH /cart/:skuId`
- **Description:** Update cart item quantity
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "quantity": "number"
  }
  ```

#### Remove from Cart
- **Endpoint:** `DELETE /cart/:skuId`
- **Description:** Remove item from cart
- **Auth Required:** Yes

#### Clear Cart
- **Endpoint:** `DELETE /cart`
- **Description:** Clear all items from cart
- **Auth Required:** Yes

#### Validate Cart
- **Endpoint:** `POST /cart/validate`
- **Description:** Validate cart items (check stock, prices)
- **Auth Required:** Yes

---

### Order Endpoints

**Base:** `/api/orders`

#### Create Order
- **Endpoint:** `POST /orders`
- **Description:** Create a new order from cart
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "customerId": "string", // Optional, defaults to authenticated user
    "location": "in_shop" | "away",
    "type": "pickup" | "delivery",
    "timing": {
      "isScheduled": "boolean",
      "scheduledAt": "ISO8601 datetime" // Optional
    },
    "addressId": "string", // Required if type is "delivery"
    "paymentPreference": {
      "mode": "post_to_bill" | "pay_now" | "cash" | "cod",
      "method": "mpesa_stk" | "paystack_card" // Optional, if mode is "pay_now"
    },
    "packagingOptionId": "string", // Optional
    "couponCode": "string", // Optional
    "cartId": "string", // Optional, uses active cart if not provided
    "metadata": {}
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "string"
    }
  }
  ```

#### Get Orders
- **Endpoint:** `GET /orders`
- **Description:** Get all orders (paginated)
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `status` - Filter by status (PLACED, CONFIRMED, PACKED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, REFUNDED)
  - `paymentStatus` - Filter by payment status (UNPAID, PENDING, PAID, PARTIALLY_REFUNDED, REFUNDED)
  - `type` - Filter by type (pickup/delivery)
  - `location` - Filter by location (in_shop/away)
  - `q` - Search by invoice number

#### Get Order by ID
- **Endpoint:** `GET /orders/:id`
- **Description:** Get single order details
- **Auth Required:** Yes

#### Update Order Status
- **Endpoint:** `PATCH /orders/:id/status`
- **Description:** Update order fulfillment status
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "status": "string"
  }
  ```

#### Assign Rider
- **Endpoint:** `PATCH /orders/:id/assign-rider`
- **Description:** Assign rider to order (placeholder)
- **Auth Required:** Yes

#### Delete Order
- **Endpoint:** `DELETE /orders/:id`
- **Description:** Delete order
- **Auth Required:** Yes

---

### Payment Endpoints

**Base:** `/api/payments`

#### Pay Invoice
- **Endpoint:** `POST /payments/pay-invoice`
- **Description:** Pay for an invoice
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "invoiceId": "string",
    "paymentMethod": "mpesa_stk" | "paystack_card",
    "phoneNumber": "string", // Required for M-Pesa
    "email": "string" // Required for Paystack
  }
  ```

#### Get Payment by ID
- **Endpoint:** `GET /payments/:paymentId`
- **Description:** Get single payment details
- **Auth Required:** Yes

#### Query M-Pesa Status
- **Endpoint:** `GET /payments/status/:checkoutRequestId`
- **Description:** Query the status of an M-Pesa STK Push payment
- **Auth Required:** Yes

#### Query M-Pesa by Checkout ID
- **Endpoint:** `GET /payments/mpesa/:checkoutRequestId`
- **Description:** Query M-Pesa payment by checkout request ID
- **Auth Required:** Yes

---

### Address Endpoints

**Base:** `/api/addresses`

#### Get User Addresses
- **Endpoint:** `GET /addresses`
- **Description:** Get all addresses for current user
- **Auth Required:** Yes

#### Get Address by ID
- **Endpoint:** `GET /addresses/:addressId`
- **Description:** Get single address details
- **Auth Required:** Yes

#### Create Address
- **Endpoint:** `POST /addresses`
- **Description:** Create new address
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    },
    "regions": {
      "country": "string",
      "locality": "string",
      "sublocality": "string",
      "administrative_area_level_1": "string"
    },
    "address": "string",
    "details": "string",
    "isDefault": "boolean"
  }
  ```

#### Update Address
- **Endpoint:** `PUT /addresses/:addressId`
- **Description:** Update address
- **Auth Required:** Yes

#### Delete Address
- **Endpoint:** `DELETE /addresses/:addressId`
- **Description:** Delete address
- **Auth Required:** Yes

#### Set Default Address
- **Endpoint:** `PUT /addresses/:addressId/default`
- **Description:** Set address as default
- **Auth Required:** Yes

#### Get Default Address
- **Endpoint:** `GET /addresses/default`
- **Description:** Get user's default address
- **Auth Required:** Yes

---

### Review Endpoints

**Base:** `/api/reviews`

#### Get Product Reviews
- **Endpoint:** `GET /reviews/product/:productId`
- **Description:** Get all reviews for a product
- **Auth Required:** No
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `rating` - Filter by rating (1-5)

#### Create Review
- **Endpoint:** `POST /reviews`
- **Description:** Create a new review
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "product": "string",
    "rating": "number", // 1-5
    "comment": "string",
    "orderId": "string", // Optional
    "orderItemId": "string" // Optional
  }
  ```

#### Update Review
- **Endpoint:** `PUT /reviews/:reviewId`
- **Description:** Update own review
- **Auth Required:** Yes

#### Delete Review
- **Endpoint:** `DELETE /reviews/:reviewId`
- **Description:** Delete own review
- **Auth Required:** Yes

#### Get User Reviews
- **Endpoint:** `GET /reviews/user`
- **Description:** Get current user's reviews
- **Auth Required:** Yes

#### Get Review by ID
- **Endpoint:** `GET /reviews/:reviewId`
- **Description:** Get single review details
- **Auth Required:** No

---

### Coupon Endpoints

**Base:** `/api/coupons`

#### Validate Coupon
- **Endpoint:** `POST /coupons/validate`
- **Description:** Validate a coupon code
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "code": "string",
    "subtotal": "number"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "isValid": "boolean",
      "discountAmount": "number",
      "message": "string"
    }
  }
  ```

#### Apply Coupon
- **Endpoint:** `POST /coupons/apply`
- **Description:** Apply a coupon to an order (typically used during order creation)
- **Auth Required:** Yes
- **Note:** Coupons are typically applied during order creation via the `couponCode` field

---

### Packaging Option Endpoints

**Base:** `/api/packaging`

#### Get Packaging List
- **Endpoint:** `GET /packaging`
- **Description:** Get all packaging options (admin only)
- **Auth Required:** Yes (Admin)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `search` - Search by name
  - `active` - Filter by active status

#### Get Active Packaging
- **Endpoint:** `GET /packaging/active`
- **Description:** Get active packaging options
- **Auth Required:** No

#### Get Default Packaging
- **Endpoint:** `GET /packaging/default`
- **Description:** Get default packaging option
- **Auth Required:** No

#### Get Packaging by ID
- **Endpoint:** `GET /packaging/:packagingId`
- **Description:** Get single packaging option details
- **Auth Required:** No

---

### Notification Endpoints

**Base:** `/api/notifications`

#### Get Notifications
- **Endpoint:** `GET /notifications`
- **Description:** Get current user's notifications
- **Auth Required:** Yes
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `type` - Filter by type

#### Get Unread Count
- **Endpoint:** `GET /notifications/unread-count`
- **Description:** Get unread notification count
- **Auth Required:** Yes

#### Get Notification by ID
- **Endpoint:** `GET /notifications/:notificationId`
- **Description:** Get single notification details
- **Auth Required:** Yes

#### Mark as Read
- **Endpoint:** `PATCH /notifications/:notificationId/read`
- **Description:** Mark notification as read
- **Auth Required:** Yes

#### Mark All as Read
- **Endpoint:** `PATCH /notifications/read-all`
- **Description:** Mark all notifications as read
- **Auth Required:** Yes

#### Delete Notification
- **Endpoint:** `DELETE /notifications/:notificationId`
- **Description:** Delete notification
- **Auth Required:** Yes

---

### Contact Endpoints

**Base:** `/api/contact`

#### Submit Contact Message
- **Endpoint:** `POST /contact`
- **Description:** Submit contact form message (public, optional auth for auto-fill)
- **Auth Required:** No (optional)
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "subject": "string",
    "message": "string"
  }
  ```

#### Get All Messages
- **Endpoint:** `GET /contact`
- **Description:** Get all contact messages (admin only)
- **Auth Required:** Yes (Admin)
- **Query Parameters:**
  - `page` - Page number
  - `limit` - Items per page
  - `status` - Filter by status (new, read, replied, archived)

#### Get Message by ID
- **Endpoint:** `GET /contact/:contactId`
- **Description:** Get single contact message
- **Auth Required:** Yes (Admin)

#### Update Status
- **Endpoint:** `PATCH /contact/:contactId/status`
- **Description:** Update message status
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "status": "new" | "read" | "replied" | "archived"
  }
  ```

#### Reply to Message
- **Endpoint:** `POST /contact/:contactId/reply`
- **Description:** Reply to contact message
- **Auth Required:** Yes (Admin)
- **Request Body:**
  ```json
  {
    "reply": "string"
  }
  ```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Error Handling

The API client automatically handles:
- **401 Unauthorized** - Attempts to refresh the access token using the refresh token
- **Token Refresh** - Automatically retries the original request after token refresh
- **FormData** - Automatically handles file uploads with proper Content-Type headers

---

## Integrations

The API integration layer consists of two main files:

### `api/config.ts`

This file contains the Axios instance configuration with interceptors:

**Features:**
- Creates an Axios instance with base URL from `VITE_API_URL` environment variable
- **Request Interceptor:**
  - Automatically adds `Authorization: Bearer <accessToken>` header from localStorage
  - Handles FormData by removing Content-Type header (browser sets multipart boundary automatically)
- **Response Interceptor:**
  - Handles 401 Unauthorized responses
  - Automatically attempts token refresh using refresh token from localStorage
  - Retries the original request after successful token refresh
  - Rejects promise if token refresh fails

**Exports:**
- `api` - The configured Axios instance
- `API_BASE_URL` - The base URL constant

### `api/index.ts`

This file contains domain-specific API modules organized by resource:

**Structure:**
- Each resource has its own API module (e.g., `authAPI`, `userAPI`, `productAPI`)
- All modules use the shared `api` instance from `config.ts`
- Methods are organized logically by resource
- TypeScript types are imported from `../types/api.types` (to be created)

**Available API Modules:**
- `authAPI` - Authentication operations (register, login, OTP, OAuth, refresh)
- `userAPI` - User profile and management operations
- `productAPI` - Product CRUD and management operations
- `categoryAPI` - Category management operations
- `brandAPI` - Brand management operations
- `collectionAPI` - Collection management operations
- `tagAPI` - Tag management operations
- `cartAPI` - Shopping cart operations
- `orderAPI` - Order management operations
- `paymentAPI` - Payment processing operations
- `addressAPI` - Address management operations
- `reviewAPI` - Product review operations
- `couponAPI` - Coupon validation and application
- `packagingAPI` - Packaging option operations
- `notificationAPI` - Notification operations
- `contactAPI` - Contact form operations

**Usage:**
```typescript
import { authAPI, productAPI, cartAPI } from '@/api';

// Use the API modules
const response = await authAPI.login({ email, password });
const products = await productAPI.getAllProducts({ page: 1, limit: 10 });
const cart = await cartAPI.getCart();
```

---

## Usage Examples

```typescript
import { authAPI, productAPI, cartAPI, orderAPI } from '@/api';

// Register and verify OTP
const registerResponse = await authAPI.register({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+254712345678',
  password: 'password123'
});

await authAPI.verifyOTP({
  email: 'john@example.com',
  otp: '123456'
});

// Login
const loginResponse = await authAPI.login({
  email: 'john@example.com',
  password: 'password123'
});

// Get products
const products = await productAPI.getAllProducts({
  page: 1,
  limit: 10,
  search: 'sneaker',
  category: 'categoryId'
});

// Get single product
const product = await productAPI.getProductById('productId');

// Add to cart
await cartAPI.addToCart({
  productId: 'productId',
  skuId: 'skuId',
  quantity: 2,
  variantOptions: {}
});

// Get cart
const cart = await cartAPI.getCart();

// Create order
const order = await orderAPI.createOrder({
  location: 'away',
  type: 'delivery',
  addressId: 'addressId',
  paymentPreference: {
    mode: 'pay_now',
    method: 'mpesa_stk'
  },
  packagingOptionId: 'packagingId',
  couponCode: 'SUMMER25'
});
```

---

## Notes

- All dates should be in ISO 8601 format
- File uploads use `FormData` and are automatically handled by the API client
- Pagination parameters: `page` (default: 1), `limit` (default: 10)
- All ObjectId references should be valid MongoDB ObjectIds
- Phone numbers should include country code (e.g., +254712345678 for Kenya)
- Product images are uploaded to Cloudinary and optimized URLs are available
- SKUs are automatically generated based on product variants
- Cart items are validated for stock availability before adding
- Orders are created from active cart items
- Coupons are validated and applied during order creation

---

**Last Updated:** January 2025  
**Version:** 1.0.0
