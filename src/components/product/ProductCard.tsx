import { Link } from 'react-router-dom';
import { FiShoppingCart, FiImage } from 'react-icons/fi';

// Product card component for displaying product information
interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    images?: Array<{ url: string; isPrimary?: boolean }>;
    basePrice?: number;
    comparePrice?: number;
    skus?: Array<{ price?: number; stock?: number }>;
    slug?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Get product image - prefer primary image, fallback to first image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary === true);
      return primaryImage?.url || product.images[0]?.url;
    }
    return null;
  };

  // Get product price - use first SKU price if available, otherwise base price
  const getProductPrice = () => {
    if (product.skus && product.skus.length > 0 && product.skus[0]?.price) {
      return product.skus[0].price;
    }
    return product.basePrice || 0;
  };

  // Check if product has stock
  const hasStock = () => {
    if (product.skus && product.skus.length > 0) {
      return product.skus.some(sku => (sku.stock || 0) > 0);
    }
    return true; // Assume in stock if no SKU info
  };

  const productImage = getProductImage();
  const productPrice = getProductPrice();
  const inStock = hasStock();

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden h-48 md:h-56">
        {productImage ? (
          <img
            src={productImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.nextSibling) {
                (target.nextSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div
          className={`w-full h-full items-center justify-center ${productImage ? 'hidden' : 'flex'}`}
        >
          <FiImage className="w-16 h-16 text-gray-400" />
        </div>

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Quick Add Button - Hidden by default, shown on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            KSh {productPrice.toLocaleString()}
          </span>
          {product.comparePrice && product.comparePrice > productPrice && (
            <span className="text-sm text-gray-500 line-through">
              KSh {product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
