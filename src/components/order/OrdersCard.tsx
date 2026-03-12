import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiCalendar, FiClock } from 'react-icons/fi';
import type { IOrder } from '../../types/api.types';

interface OrdersCardProps {
  order: IOrder;
}

const OrdersCard = ({ order }: OrdersCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 mb-4 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-brand-tint flex items-center justify-center flex-shrink-0">
            <FiPackage className="h-6 w-6 text-brand-primary" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-3.5 h-3.5" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock className="w-3.5 h-3.5" />
                <span>{order.items?.length || 0} {order.items?.length === 1 ? 'Item' : 'Items'}</span>
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
