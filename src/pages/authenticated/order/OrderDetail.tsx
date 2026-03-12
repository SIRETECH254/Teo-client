import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiCreditCard, FiMapPin, FiTruck, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useGetOrderById } from '../../../tanstack/useOrders';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useGetOrderById(orderId || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-700';
      case 'PLACED':
      case 'CONFIRMED':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container py-8 max-w-5xl mx-auto animate-pulse">
        {/* Back Navigation Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-32 mb-6" />

        {/* Header Card Skeleton */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 w-full md:w-auto">
              <div className="h-8 bg-gray-200 rounded w-64" />
              <div className="h-4 bg-gray-200 rounded w-40" />
            </div>
            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="h-6 bg-gray-200 rounded-full w-24" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <div className="h-6 bg-gray-200 rounded w-40" />
              </div>
              <div className="p-6 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="h-24 w-24 rounded-2xl bg-gray-200 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                        <div className="h-5 bg-gray-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-40" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
              </div>
              <div className="h-12 bg-gray-200 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-8">We couldn't retrieve the details for this order. It may have been removed or the ID is incorrect.</p>
        <button 
          onClick={() => navigate('/orders')} 
          className="btn-primary px-8 py-3"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="page-container py-8 max-w-5xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-semibold mb-6 transition-colors group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to My Orders</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
              Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <FiClock /> {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              Payment Status: <span className="text-brand-primary">{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items and Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="font-black text-gray-900 flex items-center gap-3">
                <FiPackage className="text-brand-primary" /> 
                Order Items ({order.items?.length || 0})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-50">
              {order.items?.map((item: any, idx: number) => {
                const productImage = item?.productId?.primaryImage || item?.productId?.images?.find((img: any) => img?.isPrimary)?.url || item?.productId?.images?.[0]?.url;
                return (
                  <div key={idx} className="p-6 flex gap-6 hover:bg-gray-50/50 transition-colors">
                    <div className="h-24 w-24 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {productImage ? (
                        <img src={productImage} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <FiPackage className="h-10 w-10 text-gray-200" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate mb-1">{item.title}</h4>
                      {item.variantOptions && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {Object.entries(item.variantOptions).map(([k, v]) => (
                            <span key={k} className="text-[10px] font-black uppercase bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                              {k}: {v as string}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-sm font-bold text-brand-primary">
                          {item.quantity} × KSh {item.unitPrice?.toLocaleString()}
                        </p>
                        <p className="font-black text-gray-900">
                          KSh {(item.unitPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiTruck className="text-brand-primary" /> Delivery Details
              </h3>
              <p className="text-sm font-bold text-gray-900 mb-1 capitalize">{order.type} Service</p>
              <p className="text-sm text-gray-500 mb-4">{order.location === 'in_shop' ? 'Pickup at Shop' : 'Doorstep Delivery'}</p>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiMapPin className="text-brand-primary" /> Address Information
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.addressId?.address || 'Standard Pickup Address'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-black text-gray-900 mb-6 flex items-center gap-3">
              <FiCreditCard className="text-brand-primary" /> 
              Payment Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-bold text-gray-900">KSh {order.pricing?.subtotal?.toLocaleString()}</span>
              </div>
              
              {order.pricing?.discounts > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Discounts</span>
                  <span className="font-bold text-green-600">- KSh {order.pricing?.discounts?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Delivery Fee</span>
                <span className="font-bold text-gray-900">KSh {order.pricing?.deliveryFee?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Packaging Fee</span>
                <span className="font-bold text-gray-900">KSh {order.pricing?.packagingFee?.toLocaleString()}</span>
              </div>

              {order.pricing?.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Tax</span>
                  <span className="font-bold text-gray-900">KSh {order.pricing?.tax?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="text-2xl font-black text-brand-primary">
                    KSh {order.pricing?.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED' && (
              <button 
                onClick={() => navigate(`/payment-status?orderId=${order._id}&invoiceId=${order.invoice?._id}`)}
                className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest"
              >
                Complete Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
