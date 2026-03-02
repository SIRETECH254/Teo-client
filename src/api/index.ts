import { api } from './config';
import type {
  // Auth types
  RegisterPayload,
  LoginPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RefreshTokenPayload,
  GoogleAuthCallbackPayload,
  GoogleAuthMobilePayload,
  // User types
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateNotificationPreferencesPayload,
  // Product types
  GetProductsParams,
  GetOptimizedImagesParams,
  // Category types
  GetCategoriesParams,
  // Brand types
  GetBrandsParams,
  GetPopularBrandsParams,
  // Collection types
  GetCollectionsParams,
  // Tag types
  GetTagsParams,
  GetPopularTagsParams,
  // Cart types
  AddToCartPayload,
  UpdateCartItemPayload,
  // Order types
  CreateOrderPayload,
  GetOrdersParams,
  // Payment types
  PayInvoicePayload,
  // Address types
  CreateAddressPayload,
  UpdateAddressPayload,
  // Review types
  CreateReviewPayload,
  UpdateReviewPayload,
  GetReviewsParams,
  // Coupon types
  ValidateCouponPayload,
  // Notification types
  GetNotificationsParams,
  // Contact types
  SubmitContactPayload,
} from '../types/api.types';

// ============================================
// Auth API
// ============================================
export const authAPI = {
  // Register a new user account.
  register: (userData: RegisterPayload) => api.post('/api/auth/register', userData),

  // Verify a one-time password (OTP) for authentication.
  verifyOTP: (otpData: VerifyOTPPayload) => api.post('/api/auth/verify-otp', otpData),

  // Request a new OTP for verification.
  resendOTP: (emailData: ResendOTPPayload) => api.post('/api/auth/resend-otp', emailData),

  // Login with credentials and receive tokens.
  login: (credentials: LoginPayload) => api.post('/api/auth/login', credentials),

  // Logout the current session.
  logout: () => api.post('/api/auth/logout'),

  // Request a password reset email.
  forgotPassword: (data: ForgotPasswordPayload) => api.post('/api/auth/forgot-password', data),

  // Reset password using a token link.
  resetPassword: (token: string, data: ResetPasswordPayload) => api.post(`/api/auth/reset-password/${token}`, data),

  // Refresh access token using a refresh token.
  refreshToken: (data: RefreshTokenPayload) => api.post('/api/auth/refresh-token', data),

  // Fetch the current authenticated user profile.
  getMe: () => api.get('/api/auth/me'),

  // Initiate Google OAuth login.
  googleAuth: () => api.get('/api/auth/google'),

  // Handle Google OAuth callback.
  googleAuthCallback: (data: GoogleAuthCallbackPayload) => api.post('/api/auth/google/callback', data),

  // Google OAuth for mobile apps using ID token.
  googleAuthMobile: (data: GoogleAuthMobilePayload) => api.post('/api/auth/google/mobile', data),
};

// ============================================
// User API
// ============================================
export const userAPI = {
  // Get current user profile.
  getProfile: () => api.get('/api/users/profile'),

  // Update current user profile.
  updateProfile: (profileData: UpdateProfilePayload | FormData) =>
    profileData instanceof FormData
      ? api.put('/api/users/profile', profileData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.put('/api/users/profile', profileData),

  // Change user password.
  changePassword: (passwordData: ChangePasswordPayload) => api.put('/api/users/change-password', passwordData),

  // Get notification preferences.
  getNotificationPreferences: () => api.get('/api/users/notifications'),

  // Update notification preferences.
  updateNotificationPreferences: (preferences: UpdateNotificationPreferencesPayload) => api.put('/api/users/notifications', preferences),
};

// ============================================
// Product API
// ============================================
export const productAPI = {
  // Get all products with optional filtering and pagination.
  getAllProducts: (params?: GetProductsParams) => api.get('/api/products', { params }),

  // Get single product details by ID.
  getProductById: (productId: string) => api.get(`/api/products/${productId}`),

  // Get optimized and responsive image URLs for a product.
  getOptimizedImages: (productId: string, params?: GetOptimizedImagesParams) => api.get(`/api/products/${productId}/optimized-images`, { params }),
};

// ============================================
// Category API
// ============================================
export const categoryAPI = {
  // Get all categories with optional filtering and pagination.
  getAllCategories: (params?: GetCategoriesParams) => api.get('/api/categories', { params }),

  // Get category tree structure.
  getCategoryTree: () => api.get('/api/categories/tree'),

  // Get single category details by ID.
  getCategoryById: (categoryId: string) => api.get(`/api/categories/${categoryId}`),

  // Get root categories.
  getRootCategories: () => api.get('/api/categories/root'),
};

// ============================================
// Brand API
// ============================================
export const brandAPI = {
  // Get all brands with optional filtering and pagination.
  getAllBrands: (params?: GetBrandsParams) => api.get('/api/brands', { params }),

  // Get single brand details by ID.
  getBrandById: (brandId: string) => api.get(`/api/brands/${brandId}`),

  // Get popular brands.
  getPopularBrands: (params?: GetPopularBrandsParams) => api.get('/api/brands/popular', { params }),

  // Get active brands.
  getActiveBrands: () => api.get('/api/brands/active'),
};

// ============================================
// Collection API
// ============================================
export const collectionAPI = {
  // Get all collections with optional filtering and pagination.
  getAllCollections: (params?: GetCollectionsParams) => api.get('/api/collections', { params }),

  // Get single collection details by ID.
  getCollectionById: (collectionId: string) => api.get(`/api/collections/${collectionId}`),

  // Get active collections.
  getActiveCollections: () => api.get('/api/collections/active'),
};

// ============================================
// Tag API
// ============================================
export const tagAPI = {
  // Get all tags with optional filtering and pagination.
  getAllTags: (params?: GetTagsParams) => api.get('/api/tags', { params }),

  // Get single tag details by ID.
  getTagById: (tagId: string) => api.get(`/api/tags/${tagId}`),

  // Get popular tags.
  getPopularTags: (params?: GetPopularTagsParams) => api.get('/api/tags/popular', { params }),
};

// ============================================
// Cart API
// ============================================
export const cartAPI = {
  // Get current user's active cart.
  getCart: () => api.get('/api/cart'),

  // Add item to cart.
  addToCart: (cartData: AddToCartPayload) => api.post('/api/cart', cartData),

  // Update cart item quantity.
  updateCartItem: (skuId: string, updateData: UpdateCartItemPayload) => api.patch(`/api/cart/${skuId}`, updateData),

  // Remove item from cart.
  removeFromCart: (skuId: string) => api.delete(`/api/cart/${skuId}`),

  // Clear all items from cart.
  clearCart: () => api.delete('/api/cart'),

  // Validate cart items (check stock, prices).
  validateCart: () => api.post('/api/cart/validate'),
};

// ============================================
// Order API
// ============================================
export const orderAPI = {
  // Create a new order from cart.
  createOrder: (orderData: CreateOrderPayload) => api.post('/api/orders', orderData),

  // Get all orders with optional filtering and pagination.
  getOrders: (params?: GetOrdersParams) => api.get('/api/orders', { params }),

  // Get single order details by ID.
  getOrderById: (orderId: string) => api.get(`/api/orders/${orderId}`),
};

// ============================================
// Payment API
// ============================================
export const paymentAPI = {
  // Pay for an invoice.
  payInvoice: (paymentData: PayInvoicePayload) => api.post('/api/payments/pay-invoice', paymentData),

  // Get single payment details by ID.
  getPaymentById: (paymentId: string) => api.get(`/api/payments/${paymentId}`),

  // Query the status of an M-Pesa STK Push payment.
  queryMpesaStatus: (checkoutRequestId: string) => api.get(`/api/payments/status/${checkoutRequestId}`),

  // Query M-Pesa payment by checkout request ID.
  queryMpesaByCheckoutId: (checkoutRequestId: string) => api.get(`/api/payments/mpesa/${checkoutRequestId}`),
};

// ============================================
// Address API
// ============================================
export const addressAPI = {
  // Get all addresses for current user.
  getUserAddresses: () => api.get('/api/addresses'),

  // Get single address details by ID.
  getAddressById: (addressId: string) => api.get(`/api/addresses/${addressId}`),

  // Create new address.
  createAddress: (addressData: CreateAddressPayload) => api.post('/api/addresses', addressData),

  // Update address.
  updateAddress: (addressId: string, addressData: UpdateAddressPayload) => api.put(`/api/addresses/${addressId}`, addressData),

  // Delete address.
  deleteAddress: (addressId: string) => api.delete(`/api/addresses/${addressId}`),

  // Set address as default.
  setDefaultAddress: (addressId: string) => api.put(`/api/addresses/${addressId}/default`),

  // Get user's default address.
  getDefaultAddress: () => api.get('/api/addresses/default'),
};

// ============================================
// Review API
// ============================================
export const reviewAPI = {
  // Get all reviews for a product.
  getProductReviews: (productId: string, params?: GetReviewsParams) => api.get(`/api/reviews/product/${productId}`, { params }),

  // Create a new review.
  createReview: (reviewData: CreateReviewPayload) => api.post('/api/reviews', reviewData),

  // Update own review.
  updateReview: (reviewId: string, reviewData: UpdateReviewPayload) => api.put(`/api/reviews/${reviewId}`, reviewData),

  // Delete own review.
  deleteReview: (reviewId: string) => api.delete(`/api/reviews/${reviewId}`),

  // Get current user's reviews.
  getUserReviews: (params?: GetReviewsParams) => api.get('/api/reviews/user', { params }),

  // Get single review details by ID.
  getReviewById: (reviewId: string) => api.get(`/api/reviews/${reviewId}`),
};

// ============================================
// Coupon API
// ============================================
export const couponAPI = {
  // Validate a coupon code.
  validateCoupon: (couponData: ValidateCouponPayload) => api.post('/api/coupons/validate', couponData),

  // Apply a coupon to an order (typically used during order creation).
  applyCoupon: (couponData: ValidateCouponPayload) => api.post('/api/coupons/apply', couponData),
};

// ============================================
// Packaging API
// ============================================
export const packagingAPI = {
  // Get active packaging options.
  getActivePackaging: () => api.get('/api/packaging/active'),

  // Get default packaging option.
  getDefaultPackaging: () => api.get('/api/packaging/default'),

  // Get single packaging option details by ID.
  getPackagingById: (packagingId: string) => api.get(`/api/packaging/${packagingId}`),
};

// ============================================
// Notification API
// ============================================
export const notificationAPI = {
  // Get current user's notifications.
  getNotifications: (params?: GetNotificationsParams) => api.get('/api/notifications', { params }),

  // Get unread notification count.
  getUnreadCount: () => api.get('/api/notifications/unread-count'),

  // Get single notification details by ID.
  getNotification: (notificationId: string) => api.get(`/api/notifications/${notificationId}`),

  // Mark notification as read.
  markAsRead: (notificationId: string) => api.patch(`/api/notifications/${notificationId}/read`),

  // Mark all notifications as read.
  markAllAsRead: () => api.patch('/api/notifications/read-all'),

  // Delete notification.
  deleteNotification: (notificationId: string) => api.delete(`/api/notifications/${notificationId}`),
};

// ============================================
// Contact API
// ============================================
export const contactAPI = {
  // Submit contact form message.
  submitMessage: (messageData: SubmitContactPayload) => api.post('/api/contact', messageData),
};

// Export the api instance for custom requests
export { api };
export default api;
