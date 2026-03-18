import { useState } from 'react';
import { FiSearch, FiPackage, FiFilter } from 'react-icons/fi';
import { useGetMyOrders } from '../../../tanstack/useOrders';
import OrdersCard from '../../../components/order/OrdersCard';
import OrdersCardSkeleton from '../../../components/order/OrdersCardSkeleton';
import Pagination from '../../../components/ui/Pagination';
import type { IOrder } from '../../../types/api.types';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetMyOrders({
    q: searchTerm || undefined,
    status: (statusFilter as any) || undefined,
    page,
    limit: 10,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="page-container py-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-500">Track and manage your order history</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by invoice..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
              />
            </div>
            
            <div className="relative group">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders List Section */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <OrdersCardSkeleton key={idx} />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold mb-2">Oops! Something went wrong.</p>
            <p className="text-red-500/80 text-sm">We couldn't fetch your orders at this time. Please try again later.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              {searchTerm || statusFilter 
                ? "We couldn't find any orders matching your current filters."
                : "You haven't placed any orders yet. Start shopping to see your history here!"}
            </p>
            {(searchTerm || statusFilter) && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter(''); }}
                className="text-brand-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: IOrder) => (
              <OrdersCard key={order._id} order={order} />
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setPage(p)}
                  totalItems={pagination.totalDocs}
                  pageSize={10}
                  currentPageCount={orders.length}
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
