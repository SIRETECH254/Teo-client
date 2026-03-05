import { useGetAllProducts } from '../../tanstack/useProducts';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import { FiPackage } from 'react-icons/fi';

// Products list page component
const Products = () => {
  const { data, isLoading, isError, error } = useGetAllProducts({ limit: 100 });

  // Extract products and pagination from response
  const products = data?.products || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-white">
      <div className="page-container">
        <section className="section">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">
              {pagination ? `Showing ${products.length} of ${pagination.totalDocs || 0} products` : 'Browse our collection'}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16">
              <div className="text-red-600 mb-4">
                <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold">Error loading products</p>
                <p className="text-sm text-gray-600 mt-2">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary mt-4"
              >
                Retry
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-16">
              <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
              <p className="text-gray-600">There are no products available at the moment.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;
