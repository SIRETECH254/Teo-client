// Loading skeleton component for product cards
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        {/* Price Skeleton */}
        <div className="flex items-center gap-2 mt-4">
          <div className="h-6 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
