const OrdersCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-4">
          {/* Icon Skeleton */}
          <div className="h-12 w-12 rounded-xl bg-gray-200 flex-shrink-0" />
          
          <div className="space-y-3">
            {/* Title and Badge Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded-full w-20" />
            </div>
            
            {/* Meta Skeletons */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
          <div className="text-right space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20 ml-auto" />
            <div className="h-6 bg-gray-200 rounded w-28 ml-auto" />
          </div>
          
          {/* Arrow Skeleton */}
          <div className="h-10 w-10 rounded-full bg-gray-200" />
        </div>

      </div>
    </div>
  );
};

export default OrdersCardSkeleton;
