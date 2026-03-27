import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiCalendar } from 'react-icons/fi';
import type { IOrder } from '../../types/api.types';
import StatusBadge from '../ui/StatusBadge';

interface OrdersCardProps {
  order: IOrder;
}

const OrdersCard = ({ order }: OrdersCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 mb-4 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-brand-tint flex items-center justify-center flex-shrink-0">
            <FiPackage className="h-6 w-6 text-brand-primary" />
          </div>
          
          <div>
            <div className="mb-2">
              <h3 className="font-bold text-gray-900">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</h3>
            </div>
            
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400 min-w-[50px]">Order:</span>
                <StatusBadge status={order.status} type="order-status" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-400 min-w-[50px]">Payment:</span>
                <StatusBadge status={order.paymentStatus} type="payment-status" />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5 text-xs">
                <FiCalendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-0.5">Total Amount</p>
            <p className="text-lg font-black text-brand-primary">
              KSh {order.pricing?.total?.toLocaleString() || 0}
            </p>
          </div>
          
          <Link 
            to={`/orders/${order._id}`}
            className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrdersCard;
