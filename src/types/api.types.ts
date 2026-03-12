// ============================================
// Auth Types
// ============================================
export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: string; // Optional, defaults to "customer"
}

export interface VerifyOTPPayload {
  email?: string;
  phone?: string; // Either email or phone required
  otp: string;
}

export interface ResendOTPPayload {
  email?: string;
  phone?: string; // Either email or phone required
}

export interface LoginPayload {
  email?: string;
  phone?: string; // Either email or phone required
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface GoogleAuthCallbackPayload {
  code: string;
}

export interface GoogleAuthMobilePayload {
  idToken: string;
}

// ============================================
// User Types
// ============================================

export interface IRole {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface IUser {
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

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string | null;
  country?: string;
  timezone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateNotificationPreferencesPayload {
  email?: boolean;
  sms?: boolean;
  inApp?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  stockAlerts?: boolean;
}

// ============================================
// Product Types
// ============================================
export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  collection?: string;
  status?: 'active' | 'draft' | 'archived';
}

export interface GetOptimizedImagesParams {
  width?: number;
  height?: number;
}

// ============================================
// Category Types
// ============================================
export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
}

// ============================================
// Brand Types
// ============================================
export interface GetBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export interface GetPopularBrandsParams {
  limit?: number;
}

// ============================================
// Collection Types
// ============================================
export interface GetCollectionsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

// ============================================
// Tag Types
// ============================================
export interface GetTagsParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export interface GetPopularTagsParams {
  limit?: number;
}

// ============================================
// Cart Types
// ============================================
export interface AddToCartPayload {
  productId: string;
  skuId: string;
  quantity: number;
  variantOptions?: Record<string, string>;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// ============================================
// Order Types
// ============================================
export interface IOrderItem {
  productId: {
    _id: string;
    title: string;
    primaryImage?: string;
    images?: Array<{ url: string; isPrimary: boolean }>;
  };
  title: string;
  quantity: number;
  unitPrice: number;
  variantOptions?: Record<string, string>;
  totalPrice: number;
}

export interface IOrderPricing {
  subtotal: number;
  discounts: number;
  packagingFee: number;
  schedulingFee: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface IInvoice {
  _id: string;
  number: string;
  status: 'UNPAID' | 'PAID' | 'PARTIALLY_PAID' | 'VOIDED';
  amount: number;
  dueDate: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerId: string | IUser;
  items: IOrderItem[];
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  pricing: IOrderPricing;
  type: 'pickup' | 'delivery';
  location: 'in_shop' | 'away';
  invoice?: {
    _id: string;
    number: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerId?: string; // Optional, defaults to authenticated user
  location: 'in_shop' | 'away';
  type: 'pickup' | 'delivery';
  timing?: {
    isScheduled: boolean;
    scheduledAt?: string | null; // ISO8601 datetime
  };
  addressId?: string | null; // Required if type is "delivery"
  paymentPreference: {
    mode: 'post_to_bill' | 'pay_now' | 'cash' | 'cod';
    method?: 'mpesa_stk' | 'paystack_card'; // Optional, if mode is "pay_now"
  };
  packagingOptionId?: string | null; // Optional packaging option
  couponCode?: string | null; // Optional coupon code
  cartId?: string | null; // Optional, uses active cart if not provided
  metadata?: Record<string, any>;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus?: 'UNPAID' | 'PENDING' | 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  type?: 'pickup' | 'delivery';
  location?: 'in_shop' | 'away';
  q?: string; // Search by invoice number
}

export interface GetMyOrdersParams extends GetOrdersParams {}

// ============================================
// Payment Types
// ============================================
export interface IPayment {
  _id: string;
  invoiceId: string;
  amount: number;
  method: 'mpesa_stk' | 'paystack_card';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PayInvoicePayload {
  invoiceId: string;
  method: 'mpesa_stk' | 'paystack_card';
  payerPhone?: string; // Required for M-Pesa
  payerEmail?: string; // Required for Paystack
}

// ============================================
// Address Types
// ============================================
export interface CreateAddressPayload {
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  regions: {
    country: string;
    locality?: string;
    sublocality?: string;
    sublocality_level_1?: string;
    administrative_area_level_1?: string;
    plus_code?: string;
    political?: string;
  };
  address: string;
  details?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  name?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  regions?: {
    country?: string;
    locality?: string;
    sublocality?: string;
    sublocality_level_1?: string;
    administrative_area_level_1?: string;
    plus_code?: string;
    political?: string;
  };
  address?: string;
  details?: string;
  isDefault?: boolean;
}

// ============================================
// Review Types
// ============================================
export interface CreateReviewPayload {
  product: string; // Product ObjectId
  rating: number; // 1-5
  comment: string;
  orderId?: string; // Optional Order ObjectId
  orderItemId?: string; // Optional
}

export interface UpdateReviewPayload {
  rating?: number; // 1-5
  comment?: string;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  rating?: number; // 1-5
}

// ============================================
// Coupon Types
// ============================================
export interface ValidateCouponPayload {
  code: string;
  subtotal: number;
}

// ============================================
// Notification Types
// ============================================
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: string;
}

// ============================================
// Contact Types
// ============================================
export interface SubmitContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// ============================================
// Common Types
// ============================================
export interface PaginationParams {
  page?: number;
  limit?: number;
}
