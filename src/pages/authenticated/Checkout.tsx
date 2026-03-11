import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPackaging } from '../../tanstack/usePackaging';
import { useGetCart } from '../../tanstack/useCart';
import { useCreateOrder } from '../../tanstack/useOrders';
import { usePayInvoice } from '../../tanstack/usePayments';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  FiEdit2,
  FiShoppingBag,
  FiClock,
  FiCreditCard,
  FiList,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiSmartphone,
  FiArrowLeft,
  FiArrowRight,
  FiInfo,
  FiCheck,
  FiLoader,
  FiMail,
  FiTag,
} from 'react-icons/fi';

// Interface for packaging options data
interface PackagingOption {
  _id: string;
  name: string;
  isDefault: boolean;
  price: number | string;
}

// Interface for individual cart items
interface CartItem {
  _id: string;
  productId: {
    title: string;
  };
  variantOptions: Record<string, string>;
  quantity: number;
  price: number;
}

// Interface for the complete cart object
interface Cart {
  items: CartItem[];
}

// Interface for order timing state
interface TimingState {
  isScheduled: boolean;
  scheduledAt: string | null;
}

// Configuration for all possible checkout steps (tabs)
const ALL_STEPS = [
  { key: 'location', label: 'Location' },
  { key: 'orderType', label: 'Order Type' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'timing', label: 'Timing' },
  { key: 'address', label: 'Address' },
  { key: 'payment', label: 'Payment' },
  { key: 'summary', label: 'Summary' },
];

const Checkout = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user } = useAuth(); // Access user context for pre-filling data

  const [currentStep, setCurrentStep] = useState(0); // Tracking the active step index
  const { data: cartData, isLoading: loading } = useGetCart() as any; // Fetching current cart items
  const cart = cartData as Cart | undefined; // Casting cart data for type safety
  const createOrderMutation = useCreateOrder(); // Mutation hook for creating orders
  const payInvoice = usePayInvoice(); // Mutation hook for processing payments
  const [creating, setCreating] = useState(false); // Local state for order creation progress
  const [paying, setPaying] = useState(false); // Local state for payment processing progress

  // Form state variables for checkout details
  const [location, setLocation] = useState<'in_shop' | 'away'>('in_shop'); // Location selection (In Shop vs Away)
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup'); // Order fulfillment type (Pickup vs Delivery)
  const [timing, setTiming] = useState<TimingState>({ isScheduled: false, scheduledAt: null }); // Timing preferences for the order
  const [addressId, setAddressId] = useState<string | null>(null); // Delivery address identifier
  const [paymentMode, setPaymentMode] = useState<'post_to_bill' | 'pay_now'>('post_to_bill'); // Payment mode selection
  const [paymentMethod, setPaymentMethod] = useState<'mpesa_stk' | 'paystack_card' | 'cash' | null>(null); // Specific payment provider selection

  // Loading applied coupon from persistent storage if available
  const [coupon, setCoupon] = useState<{ code: string; discountAmount: number } | null>(() => {
    try {
      const raw = localStorage.getItem('appliedCoupon');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Helper function to sanitize phone numbers for M-Pesa STK push
  const formatPhoneForMpesa = (phone: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return '254' + digits.substring(1);
    }
    if (digits.startsWith('254')) {
      return digits;
    }
    if (digits.length === 9) {
      return '254' + digits;
    }
    return digits;
  };

  const [payerPhone, setPayerPhone] = useState(''); // Tracking phone number for payment notifications
  const [payerEmail, setPayerEmail] = useState(''); // Tracking email for payment receipts

  const [orderId, setOrderId] = useState<string | null>(null); // Storing ID of the created order
  const [invoiceId, setInvoiceId] = useState<string | null>(null); // Storing ID of the generated invoice

  const canShowAddress = orderType === 'delivery'; // Logic to determine if address step is relevant
  const { data: packagingPublic } = useGetPackaging() as any; // Fetching available packaging options

  // Memoizing packaging options to stabilize dependencies
  const packagingOptions = useMemo<PackagingOption[]>(() => {
    const data = packagingPublic?.data?.packaging || packagingPublic?.packaging || packagingPublic?.data || packagingPublic || [];
    return Array.isArray(data) ? data : [];
  }, [packagingPublic]);

  const canShowPackaging = packagingOptions.length > 0; // Checking if any packaging options exist

  const [selectedPackagingId, setSelectedPackagingId] = useState<string | null>(null); // ID of the chosen packaging

  // Effect to clean up coupons if the cart becomes empty
  useEffect(() => {
    const items = cart?.items || [];
    if (!items || items.length === 0) {
      try {
        localStorage.removeItem('appliedCoupon');
      } catch (err) {
        console.error('Storage error:', err);
      }
      setCoupon(null);
    }
  }, [cart]);

  // Effect to pre-populate contact info from authenticated user profile
  useEffect(() => {
    if (user) {
      if (user.phone) {
        setPayerPhone(formatPhoneForMpesa(user.phone));
      }
      if (user.email) {
        setPayerEmail(user.email);
      }
    }
  }, [user]);

  // Effect to auto-select a default packaging option once loaded
  useEffect(() => {
    if (!canShowPackaging) return;
    if (selectedPackagingId) return;
    const def = packagingOptions.find((p) => p.isDefault) || packagingOptions[0];
    if (def) setSelectedPackagingId(def._id);
  }, [canShowPackaging, packagingOptions, selectedPackagingId]);

  // Memoized calculation for order totals including subtotal, fees, and discounts
  const totals = useMemo(() => {
    const items = cart?.items || [];
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const packagingFee = canShowPackaging
      ? Number(packagingOptions.find((p) => p._id === selectedPackagingId)?.price || 0)
      : 0;
    const discount = Math.min(subtotal, Math.max(0, Number(coupon?.discountAmount || 0)));
    const total = subtotal + packagingFee - discount;
    return { subtotal, packagingFee, discount, total };
  }, [cart, canShowPackaging, packagingOptions, selectedPackagingId, coupon]);

  // Helper function to stringify product variant details for the UI
  const formatVariantOptions = (variantOptions: Record<string, string>) => {
    if (!variantOptions || Object.keys(variantOptions).length === 0) return null;
    return Object.entries(variantOptions)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  };

  // Helper function to jump to a specific checkout step by key
  const gotoStep = (key: string) => {
    const idx = activeSteps.findIndex((s) => s.key === key);
    if (idx >= 0) setCurrentStep(idx);
  };

  // Memoized list of steps filtered based on order type (e.g., skip address for pickup)
  const activeSteps = useMemo(() => {
    const isPickup = orderType === 'pickup';
    if (isPickup) {
      return ALL_STEPS.filter((s) => s.key !== 'address');
    }
    return ALL_STEPS;
  }, [orderType]);

  const currentStepKey = activeSteps[currentStep]?.key; // Key of the currently active step

  // Function to render the multi-step progress bar and icons
  const renderStepHeader = () => {
    const progress = ((currentStep + 1) / activeSteps.length) * 100;

    return (
      <div className="space-y-4 p-3">
        <div className="flex-row items-center justify-between flex">
          <div className="flex-row items-center gap-x-2 flex">
            <div className="h-5 w-5 rounded-full items-center justify-center bg-brand-primary text-white text-xs font-bold flex">
              {currentStep + 1}
            </div>
            <span className="text-sm font-semibold text-brand-primary">{activeSteps[currentStep]?.label}</span>
          </div>

          <div className="flex-row items-center gap-x-2 md:gap-x-4 lg:gap-x-6 flex">
            {activeSteps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = index === currentStep;
              const isCompleted = currentStep > index;

              return (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(index)}
                  className="flex-1 items-center flex flex-col"
                  type="button"
                >
                  <div className="items-center flex flex-col">
                    <div
                      className={`h-6 w-6 rounded-full items-center justify-center flex ${
                        isActive ? 'bg-brand-primary' : isCompleted ? 'bg-brand-primary/30' : 'bg-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                          {stepNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // Navigation: Advance to the next step
  const next = () => {
    setCurrentStep((s) => Math.min(s + 1, activeSteps.length - 1));
  };

  // Navigation: Go back to the previous step
  const back = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  // Effect to ensure currentStep stays within valid bounds when activeSteps change
  useEffect(() => {
    if (currentStep >= activeSteps.length) {
      setCurrentStep(Math.max(0, activeSteps.length - 1));
    }
  }, [activeSteps, currentStep]);

  // Core logic to handle order creation via API
  const createOrder = async () => {
    try {
      setCreating(true);

      const payload = {
        location,
        type: orderType,
        timing,
        addressId: canShowAddress ? addressId : null,
        paymentPreference: {
          mode: paymentMode,
          method: paymentMode === 'pay_now' ? (paymentMethod as any) : null,
        },
        packagingOptionId: canShowPackaging ? selectedPackagingId : null,
        couponCode: coupon?.code || null,
        cartId: null,
        metadata: {},
      };

      const res = (await createOrderMutation.mutateAsync(payload as any)) as any;
      const createdOrderId = res?.orderId;
      const createdInvoiceId = res?.invoiceId;

      setOrderId(createdOrderId);
      setInvoiceId(createdInvoiceId);

      try {
        localStorage.removeItem('appliedCoupon');
      } catch (e) {
        console.warn('Failed to clear applied coupon:', e);
      }

      return { orderId: createdOrderId, invoiceId: createdInvoiceId };
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to create order');
      throw e;
    } finally {
      setCreating(false);
    }
  };

  // Logic to initiate digital payment workflows (M-Pesa / Paystack)
  const payInvoiceNow = async (explicitInvoiceId?: string, explicitOrderId?: string) => {
    const targetInvoiceId = explicitInvoiceId || invoiceId;
    const targetOrderId = explicitOrderId || orderId;
    if (!targetInvoiceId) return;
    try {
      setPaying(true);
      if (paymentMethod === 'mpesa_stk') {
        if (!payerPhone) return toast.error('Phone required');
        const res = (await payInvoice.mutateAsync({
          invoiceId: targetInvoiceId,
          method: 'mpesa_stk',
          amount: totals.total,
          payerPhone: payerPhone,
        } as any)) as any;
        if (res) {
          const paymentId = res?.paymentId;
          const checkoutRequestId = res?.daraja?.checkoutRequestId;

          const params = new URLSearchParams({
            method: 'mpesa',
            paymentId: paymentId || '',
            orderId: targetOrderId || '',
            provider: 'mpesa',
            checkoutRequestId: checkoutRequestId || '',
            invoiceId: targetInvoiceId,
            payerPhone: payerPhone,
          });
          navigate(`/payment-status?${params.toString()}`);
          toast.success('STK push sent. Complete on your phone.');
        }
      } else if (paymentMethod === 'paystack_card') {
        if (!payerEmail) return toast.error('Email required');
        const res = (await payInvoice.mutateAsync({
          invoiceId: targetInvoiceId,
          method: 'paystack_card',
          amount: totals.total,
          payerEmail: payerEmail,
        } as any)) as any;
        const paymentId = res?.paymentId;
        const reference = res?.reference;

        const params = new URLSearchParams({
          method: 'paystack',
          paymentId: paymentId || '',
          orderId: targetOrderId || '',
          provider: 'paystack',
          reference: reference || '',
          invoiceId: targetInvoiceId,
          payerEmail: payerEmail,
        });
        navigate(`/payment-status?${params.toString()}`);

        const url = res?.authorizationUrl;
        if (url) window.open(url, '_blank');
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to initiate payment');
      throw e;
    } finally {
      setPaying(false);
    }
  };

  // Orchestrator for the final "Complete Order" action
  const handleCompleteOrder = async () => {
    // Handling direct payment methods (Post to Bill / Cash)
    if (paymentMode === 'post_to_bill' || (paymentMode === 'pay_now' && paymentMethod === 'cash')) {
      try {
        setCreating(true);

        const payload = {
          location,
          type: orderType,
          timing,
          addressId: canShowAddress ? addressId : null,
          paymentPreference: {
            mode: paymentMode,
            method: paymentMode === 'pay_now' ? paymentMethod : null,
          },
          packagingOptionId: canShowPackaging ? selectedPackagingId : null,
          couponCode: coupon?.code || null,
          cartId: null,
          metadata: {},
        };

        try {
          localStorage.setItem(
            'checkoutData',
            JSON.stringify({
              payload,
              method: paymentMode === 'post_to_bill' ? 'post_to_bill' : 'cash',
            }),
          );
        } catch (e) {
          console.warn('Failed to save checkout data:', e);
        }

        const res = (await createOrderMutation.mutateAsync(payload as any)) as any;
        const createdOrderId = res?.orderId;
        const createdInvoiceId = res?.invoiceId;

        try {
          localStorage.removeItem('appliedCoupon');
        } catch (e) {
          console.warn('Failed to clear applied coupon:', e);
        }

        const method = paymentMode === 'post_to_bill' ? 'post_to_bill' : 'cash';
        const params = new URLSearchParams({
          method: method,
          orderId: createdOrderId || '',
          invoiceId: createdInvoiceId || '',
        });
        navigate(`/payment-status?${params.toString()}`);
      } catch (error: any) {
        const method = paymentMode === 'post_to_bill' ? 'post_to_bill' : 'cash';
        const params = new URLSearchParams({
          method: method,
          error: error?.response?.data?.message || 'Failed to create order',
        });
        navigate(`/payment-status?${params.toString()}`);
      } finally {
        setCreating(false);
      }
      return;
    }

    // Handling digital payment methods (M-Pesa / Card)
    if (paymentMode === 'pay_now' && (paymentMethod === 'mpesa_stk' || paymentMethod === 'paystack_card')) {
      let ensuredOrderId = orderId;
      let ensuredInvoiceId = invoiceId;

      try {
        if (!ensuredOrderId || !ensuredInvoiceId) {
          const created = await createOrder();
          ensuredOrderId = created?.orderId || null;
          ensuredInvoiceId = created?.invoiceId || null;
        }

        if (ensuredInvoiceId) {
          await payInvoiceNow(ensuredInvoiceId, ensuredOrderId || undefined);
        }
      } catch (error) {
        console.error('Checkout failed:', error);
        if (ensuredOrderId) {
          navigate(`/orders/${ensuredOrderId}`);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      
      <div className="max-w-4xl mx-auto">

        {/* Page Title and step counter */}
        <div className="flex flex-row items-center justify-between mb-6">
          <h1 className="title3">Checkout</h1>
          <span className="text-sm font-semibold text-brand-primary mt-2 sm:mt-0">
            Step {currentStep + 1} of {activeSteps.length}
          </span>
        </div>

        {/* Tab-like progress indicator */}
        <div className="mb-6">{renderStepHeader()}</div>

        <div className="">
          {/* TAB 1: Location Selection */}
          {currentStepKey === 'location' && (
            <div className="space-y-4">
              {/* Prompt user for their current ordering location */}
              <h3 className="text-lg font-semibold text-gray-800">Where are you ordering from?</h3>
              <div className="flex flex-col gap-3">
                {/* Button to select 'In Shop' location */}
                <button
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    location === 'in_shop'
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setLocation('in_shop')}
                >
                  {/* Selected checkmark indicator for In Shop */}
                  {location === 'in_shop' && <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />}
                  <div className="flex gap-x-4">
                    {/* Icon for In Shop location */}
                    <div className={`text-2xl mb-2 ${location === 'in_shop' ? 'text-brand-primary' : 'text-gray-500'}`}>
                      <FiMapPin />
                    </div>
                    {/* Label and description for In Shop */}
                    <div className="flex flex-col items-start">
                      <div className="font-medium">In Shop</div>
                      <div className="text-sm text-gray-500">Ordering while you are inside the store</div>
                    </div>
                  </div>
                </button>
                {/* Button to select 'Away' location */}
                <button
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    location === 'away'
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setLocation('away')}
                >
                  {/* Selected checkmark indicator for Away */}
                  {location === 'away' && <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />}
                  <div className="flex gap-x-4">
                    {/* Icon for Away location */}
                    <div className={`text-2xl mb-2 ${location === 'away' ? 'text-brand-primary' : 'text-gray-500'}`}>
                      <FiHome />
                    </div>
                    {/* Label and description for Away */}
                    <div className="flex flex-col items-start">
                      <div className="font-medium">Away</div>
                      <div className="text-sm text-gray-500">Ordering from home, office, or another location</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Fulfillment Method */}
          {currentStepKey === 'orderType' && (
            <div className="space-y-4">
              {/* Choice between picking up at store or home delivery */}
              <h3 className="text-lg font-semibold text-gray-800">How would you like to receive your order?</h3>
              <div className="flex flex-col gap-3">
                {/* Button to select 'Pickup' fulfillment */}
                <button
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    orderType === 'pickup'
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOrderType('pickup')}
                >
                  {/* Selected checkmark indicator for Pickup */}
                  {orderType === 'pickup' && <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />}
                  <div className="flex gap-x-4">
                    {/* Icon for Pickup method */}
                    <div className={`text-2xl mb-2 ${orderType === 'pickup' ? 'text-brand-primary' : 'text-gray-500'}`}>
                      <FiPackage />
                    </div>
                    {/* Label and description for Pickup */}
                    <div className="flex flex-col items-start">
                      <div className="font-medium">Pickup</div>
                      <div className="text-sm text-gray-500">Collect your order from the store</div>
                    </div>
                  </div>
                </button>
                {/* Button to select 'Delivery' fulfillment */}
                <button
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    orderType === 'delivery'
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setOrderType('delivery')}
                >
                  {/* Selected checkmark indicator for Delivery */}
                  {orderType === 'delivery' && <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />}
                  <div className="flex gap-x-4">
                    {/* Icon for Delivery method */}
                    <div className={`text-2xl mb-2 ${orderType === 'delivery' ? 'text-brand-primary' : 'text-gray-500'}`}>
                      <FiTruck />
                    </div>
                    {/* Label and description for Delivery */}
                    <div className="flex flex-col items-start">
                      <div className="font-medium">Delivery</div>
                      <div className="text-sm text-gray-500">Have your order delivered to you</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Packaging Selection */}
          {currentStepKey === 'packaging' && canShowPackaging && (
            <div className="space-y-4">
              {/* Selection of available packaging types and their prices */}
              <h3 className="text-lg font-semibold text-gray-800">Packaging Options</h3>
              <div className="space-y-3">
                {/* Loop through all available packaging options fetched from API */}
                {packagingOptions.map((opt) => (
                  <label
                    key={opt._id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${
                      selectedPackagingId === opt._id ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio input for choosing a specific packaging */}
                      <input
                        type="radio"
                        name="packaging"
                        checked={selectedPackagingId === opt._id}
                        onChange={() => setSelectedPackagingId(opt._id)}
                      />
                      <div>
                        {/* Name of the packaging option and 'Default' tag if applicable */}
                        <div className="font-medium text-gray-900">
                          {opt.name}{' '}
                          {opt.isDefault && (
                            <span className="ml-2 inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                              Default
                            </span>
                          )}
                        </div>
                        {/* Price display for the packaging option */}
                        <div className="text-sm text-gray-600">KES {Number(opt.price).toFixed(0)}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Delivery/Pickup Timing */}
          {currentStepKey === 'timing' && (
            <div className="space-y-4">
              {/* Option to order immediately or schedule for a future date/time */}
              <h3 className="text-lg font-semibold text-gray-800">When would you like your order?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* Radio input for 'Order Now' timing */}
                  <input
                    type="radio"
                    id="now"
                    name="timing"
                    checked={!timing.isScheduled}
                    onChange={() => setTiming({ isScheduled: false, scheduledAt: null })}
                    className="w-4 h-4 text-brand-primary"
                  />
                  {/* Label for immediate fulfillment timing */}
                  <label htmlFor="now" className="flex-1">
                    <div className="font-medium">Order now (30-45 mins)</div>
                    <div className="text-sm text-gray-500">Ready for immediate pickup/delivery</div>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  {/* Radio input for 'Schedule for later' timing */}
                  <input
                    type="radio"
                    id="schedule"
                    name="timing"
                    checked={timing.isScheduled}
                    onChange={() =>
                      setTiming({ isScheduled: true, scheduledAt: new Date().toISOString().slice(0, 16) })
                    }
                    className="w-4 h-4 text-brand-primary"
                  />
                  {/* Label for scheduled fulfillment timing */}
                  <label htmlFor="schedule" className="flex-1">
                    <div className="font-medium">Schedule for later</div>
                    <div className="text-sm text-gray-500">Choose a specific date and time</div>
                  </label>
                </div>

                {/* Conditional datetime-local input for selecting schedule date/time */}
                {timing.isScheduled && (
                  <div className="ml-7">
                    <input
                      type="datetime-local"
                      className="input "
                      value={timing.scheduledAt || ''}
                      onChange={(e) => setTiming({ ...timing, scheduledAt: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Address Input (Fulfillment dependent) */}
          {currentStepKey === 'address' && (
            <div className="space-y-4">
              {/* Collection of delivery destination details */}
              <h3 className="text-lg font-semibold text-gray-800">Delivery Address</h3>
              {/* Conditional rendering for delivery-specific inputs */}
              {canShowAddress ? (
                <div className="space-y-3">
                  {/* Text input for entering the delivery address manually */}
                  <input
                    className="input"
                    placeholder="Enter your delivery address"
                    value={addressId || ''}
                    onChange={(e) => setAddressId(e.target.value)}
                  />
                  {/* Helpful hint for the address input */}
                  <p className="text-sm text-gray-500">Enter the full address where you'd like your order delivered.</p>
                </div>
              ) : (
                /* Information notice when Pickup is selected instead of Delivery */
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiInfo className="w-5 h-5" />
                    <span className="font-medium">Pickup Selected</span>
                  </div>
                  {/* Explanation that no address is needed for pickup */}
                  <p className="text-sm text-gray-500 mt-1">No delivery address required for pickup orders.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Payment Details */}
          {currentStepKey === 'payment' && (
            <div className="space-y-6">
              {/* Configuration of payment strategy and specific provider details */}
              <h3 className="text-lg font-semibold text-gray-800">Payment Method</h3>

              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  {/* Button to select 'Post to Bill' payment strategy */}
                  <button
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      paymentMode === 'post_to_bill'
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMode('post_to_bill')}
                  >
                    {/* Selected checkmark indicator for Post to Bill */}
                    {paymentMode === 'post_to_bill' && (
                      <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />
                    )}
                    <div className="flex gap-x-4">
                      {/* Icon for Post to Bill strategy */}
                      <div className={`text-2xl mb-2 ${paymentMode === 'post_to_bill' ? 'text-brand-primary' : 'text-gray-500'}`}>
                        <FiList />
                      </div>
                      {/* Label and description for Post to Bill */}
                      <div className="flex flex-col items-start">
                        <div className="font-medium">Post to Bill</div>
                        <div className="text-sm text-gray-500">Add to your bill and pay later</div>
                      </div>
                    </div>
                  </button>

                  {/* Button to select 'Pay Now' payment strategy */}
                  <button
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      paymentMode === 'pay_now'
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMode('pay_now')}
                  >
                    {/* Selected checkmark indicator for Pay Now */}
                    {paymentMode === 'pay_now' && <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-brand-primary" />}
                    <div className="flex gap-x-4">
                      {/* Icon for Pay Now strategy */}
                      <div className={`text-2xl mb-2 ${paymentMode === 'pay_now' ? 'text-brand-primary' : 'text-gray-500'}`}>
                        <FiCreditCard />
                      </div>
                      {/* Label and description for Pay Now */}
                      <div className="flex flex-col items-start">
                        <div className="font-medium">Pay Now</div>
                        <div className="text-sm text-gray-500">Complete payment immediately</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Sub-selection for specific payment methods when 'Pay Now' is active */}
                {paymentMode === 'pay_now' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {/* Header for provider selection section */}
                    <h4 className="font-medium text-blue-800 mb-3">Choose Payment Method</h4>
                    <div className="space-y-3">
                      {/* Button to choose 'Cash' payment */}
                      <button
                        className={`relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                          paymentMethod === 'cash'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        {/* Selected checkmark for Cash method */}
                        {paymentMethod === 'cash' && (
                          <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-green-600" />
                        )}
                        <div className="flex gap-x-4">
                          {/* Icon for Cash provider */}
                          <div
                            className={`text-2xl mb-2 ${paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-500'}`}
                          >
                            <FiDollarSign />
                          </div>
                          {/* Label and description for Cash */}
                          <div className="flex flex-col items-start">
                            <div className="font-medium">Cash</div>
                            <div className="text-sm text-gray-500">Pay cash on delivery or pickup</div>
                          </div>
                        </div>
                        {/* Dynamic informative note when Cash is selected */}
                        {paymentMethod === 'cash' && (
                          <div className="mt-3 text-sm text-gray-600">
                            You&apos;ll pay the rider or cashier when you receive your order.
                          </div>
                        )}
                      </button>

                      {/* Button to choose 'M-Pesa STK' payment */}
                      <button
                        className={`relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                          paymentMethod === 'mpesa_stk'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('mpesa_stk')}
                      >
                        {/* Selected checkmark for M-Pesa method */}
                        {paymentMethod === 'mpesa_stk' && (
                          <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-green-600" />
                        )}
                        <div className="flex gap-x-4">
                          {/* Icon for M-Pesa provider */}
                          <div
                            className={`text-2xl mb-2 ${
                              paymentMethod === 'mpesa_stk' ? 'text-green-600' : 'text-gray-500'
                            }`}
                          >
                            <FiSmartphone />
                          </div>
                          {/* Label and description for M-Pesa */}
                          <div className="flex flex-col items-start">
                            <div className="font-medium">M-Pesa STK</div>
                            <div className="text-sm text-gray-500">Prompt sent to your phone</div>
                          </div>
                        </div>
                        {/* Conditional phone number field specifically for M-Pesa STK Push */}
                        {paymentMethod === 'mpesa_stk' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                              className="input "
                              placeholder="2547XXXXXXXX"
                              value={payerPhone}
                              onChange={(e) => setPayerPhone(e.target.value)}
                            />
                          </div>
                        )}
                      </button>

                      {/* Button to choose 'Paystack Card' payment */}
                      <button
                        className={`relative w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                          paymentMethod === 'paystack_card'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setPaymentMethod('paystack_card')}
                      >
                        {/* Selected checkmark for Card method */}
                        {paymentMethod === 'paystack_card' && (
                          <FiCheckCircle className="absolute top-3 right-3 h-4 w-4 text-blue-600" />
                        )}
                        <div className="flex gap-x-4">
                          {/* Icon for Credit/Debit card provider */}
                          <div
                            className={`text-2xl mb-2 ${
                              paymentMethod === 'paystack_card' ? 'text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            <FiCreditCard />
                          </div>
                          {/* Label and description for Card payment */}
                          <div className="flex flex-col items-start">
                            <div className="font-medium">Card</div>
                            <div className="text-sm text-gray-500">Secure online card payment</div>
                          </div>
                        </div>
                        {/* Conditional email field specifically for Card payment receipts */}
                        {paymentMethod === 'paystack_card' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                              className="input "
                              placeholder="email@example.com"
                              value={payerEmail}
                              onChange={(e) => setPayerEmail(e.target.value)}
                            />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Order Summary & Review */}
          {currentStepKey === 'summary' && (
            <div className="space-y-4">
              {/* Final review of items, fulfillment, timing, and price breakdown */}
              <div className="flex items-center gap-2 mb-2">
                {/* Header icon for the Summary section */}
                <FiList className="text-brand-primary" />
                {/* Main title for order review */}
                <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              </div>

              {/* Display card for Order Items breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Sub-header for the list of products in cart */}
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <FiList className="text-brand-primary" /> Order Items
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {/* Loop through each item in the cart to show title, variants, and subtotal */}
                  {(cart?.items || []).map((it) => (
                    <div key={it._id} className="flex items-start justify-between text-sm">
                      <div className="min-w-0">
                        {/* Product title */}
                        <div className="font-medium text-gray-900 truncate">{it.productId?.title || 'Product'}</div>
                        {/* Formatted variant options like Size/Color */}
                        {formatVariantOptions(it.variantOptions) && (
                          <div className="text-gray-500">{formatVariantOptions(it.variantOptions)}</div>
                        )}
                        {/* Quantity ordered */}
                        <div className="text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      {/* Subtotal for this specific line item */}
                      <div className="font-medium text-gray-900">KES {(it.price * it.quantity).toFixed(0)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display card for fulfillment method (Pickup/Delivery) review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Header for Fulfillment strategy */}
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <FiShoppingBag className="text-brand-primary" /> Fulfillment
                    </span>
                  </div>
                  {/* Shortcut button to jump back to fulfillment step */}
                  <button onClick={() => gotoStep('orderType')} className="text-gray-400 hover:text-gray-600">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Specific display of selected fulfillment icon and label */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {orderType === 'delivery' ? (
                    <FiTruck className="text-brand-primary h-4 w-4" />
                  ) : (
                    <FiPackage className="text-brand-primary h-4 w-4" />
                  )}
                  <span>
                    Method: <span className="font-medium capitalize">{orderType}</span>
                  </span>
                </div>
              </div>

              {/* Display card for order timing review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Header for Timing preferences */}
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <FiClock className="text-brand-primary" /> Timing
                    </span>
                  </div>
                  {/* Shortcut button to jump back to timing step */}
                  <button onClick={() => gotoStep('timing')} className="text-gray-400 hover:text-gray-600">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Visual indicator and text description of fulfillment time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiClock className="h-4 w-4 text-brand-primary" />
                  <span>
                    When:{' '}
                    <span className="font-medium">
                      {timing.isScheduled
                        ? `Scheduled for ${new Date(timing.scheduledAt!).toLocaleString()}`
                        : 'Order now (30-45 mins)'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Conditional packaging review card (only shown if packaging exists) */}
              {canShowPackaging && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* Header for selected Packaging option */}
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <FiPackage className="text-brand-primary" /> Packaging
                      </span>
                    </div>
                    {/* Shortcut button to jump back to packaging selection */}
                    <button onClick={() => gotoStep('packaging')} className="text-gray-400 hover:text-gray-600">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Detailed label of the chosen packaging */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiPackage className="h-4 w-4 text-brand-primary" />
                    <span>
                      Selected:{' '}
                      <span className="font-medium">
                        {packagingOptions.find((p) => p._id === selectedPackagingId)?.name || 'Standard'}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {/* Display card for selected Payment strategy review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Header for Payment method details */}
                    <span className="font-medium text-gray-800 flex items-center gap-2">
                      <FiCreditCard className="text-brand-primary" /> Payment Method
                    </span>
                  </div>
                  {/* Shortcut button to jump back to payment method step */}
                  <button onClick={() => gotoStep('payment')} className="text-gray-400 hover:text-gray-600">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Specific display of chosen payment strategy and provider */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCreditCard className="h-4 w-4 text-brand-primary" />
                  <span>
                    Method:{' '}
                    <span className="font-medium capitalize">
                      {paymentMode === 'post_to_bill'
                        ? 'Post to Bill'
                        : paymentMode === 'pay_now'
                          ? paymentMethod === 'cash'
                            ? 'Cash'
                            : paymentMethod === 'mpesa_stk'
                              ? 'M-Pesa'
                              : paymentMethod === 'paystack_card'
                                ? 'Card'
                                : 'Not selected'
                          : 'Not selected'}
                    </span>
                  </span>
                </div>
                {/* Conditional review of payer phone number for M-Pesa transactions */}
                {paymentMode === 'pay_now' && paymentMethod === 'mpesa_stk' && payerPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FiSmartphone className="h-4 w-4 text-brand-primary" />
                    <span>
                      Phone: <span className="font-medium">{payerPhone}</span>
                    </span>
                  </div>
                )}
                {/* Conditional review of payer email address for Card transactions */}
                {paymentMode === 'pay_now' && paymentMethod === 'paystack_card' && payerEmail && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FiMail className="h-4 w-4 text-brand-primary" />
                    <span>
                      Email: <span className="font-medium">{payerEmail}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Comprehensive Price Breakdown card showing all totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Header for financial breakdown */}
                    <FiDollarSign className="text-brand-primary" />
                    <span className="font-medium text-gray-800">Price Breakdown</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {/* Line item for the items subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <FiList className="h-3 w-3 text-gray-500" /> Subtotal:
                    </span>
                    <span className="font-medium">KES {totals.subtotal.toFixed(0)}</span>
                  </div>
                  {/* Visual divider */}
                  <hr className="my-2" />
                  {/* Conditional line item for packaging fees */}
                  {canShowPackaging && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiPackage className="h-3 w-3 text-gray-500" /> Packaging:
                      </span>
                      <span className="font-medium">KES {Number(totals.packagingFee || 0).toFixed(0)}</span>
                    </div>
                  )}
                  {/* Conditional line item for discount from applied coupons */}
                  {coupon?.code && (
                    <div className="flex justify-between text-sm text-green-700">
                      <span className="flex items-center gap-1">
                        <FiTag className="h-3 w-3" /> Coupon ({coupon.code}):
                      </span>
                      <span>- KES {Number(totals.discount || 0).toFixed(0)}</span>
                    </div>
                  )}
                  {/* Final grand total calculation */}
                  <div className="flex justify-between text-base font-semibold mt-2">
                    <span className="flex items-center gap-1">
                      <FiDollarSign className="h-4 w-4 text-brand-primary" /> Total:
                    </span>
                    <span>KES {totals.total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation buttons */}
        <div className="flex items-center justify-between mt-10">
          {/* Back button: navigates to cart on first step, otherwise goes back one step */}
          <button
            className="btn-outline flex items-center gap-2"
            onClick={() => (currentStep === 0 ? navigate('/cart') : back())}
          >
            <FiArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Conditional rendering for 'Next' vs 'Complete Order' button */}
          {currentStep < activeSteps.length - 1 ? (
            /* Next button to advance through the wizard */
            <button className="btn-primary flex items-center gap-2" onClick={next}>
              Next
              <FiArrowRight className="w-4 h-4" />
            </button>
          ) : (
            /* Final action button to submit the order and initiate payment */
            <button
              className="btn-primary flex items-center gap-2"
              onClick={handleCompleteOrder}
              disabled={creating || paying || createOrderMutation.isPending || payInvoice.isPending}
            >
              {/* Conditional loading state within the button during API calls */}
              {creating || paying || createOrderMutation.isPending || payInvoice.isPending ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  Complete Order
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default Checkout;
