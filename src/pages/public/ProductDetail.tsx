import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductById } from '../../tanstack/useProducts';
import { useAddToCart } from '../../tanstack/useCart';
import {
  FiArrowLeft,
  FiShoppingCart,
  FiPackage,
  FiGrid,
  FiTag,
  FiLayers,
  FiDollarSign,
  FiImage,
  FiCheck,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import VariantSelector from '../../components/product/VariantSelector';
import CartSuccessModal from '../../components/cart/CartSuccessModal';
import ReviewsSection from '../../components/product/ReviewsSection';
import toast from 'react-hot-toast';

// Product detail page component
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  // Fetch product data (already populated with brand, categories, collections, tags)
  const { data: product, isLoading } = useGetProductById(id || '');

  // State for cart and variant selection
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedSKU, setSelectedSKU] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCartSuccessModal, setShowCartSuccessModal] = useState(false);

  // Use selectedVariantOptions instead of variants - only show selected options
  const getPopulatedVariants = useMemo(() => {
    if (!product?.selectedVariantOptions || !Array.isArray(product.selectedVariantOptions)) return [];
    
    // Transform selectedVariantOptions into variant-like objects with only selected options
    return product.selectedVariantOptions
      .filter((sel: any) => sel.variantId && typeof sel.variantId === 'object' && sel.variantId.name)
      .map((sel: any) => ({
        _id: sel.variantId._id,
        name: sel.variantId.name,
        // Only include options that are in optionIds (selected options)
        options: Array.isArray(sel.optionIds) 
          ? sel.optionIds.filter((opt: any) => typeof opt === 'object' && opt._id)
          : []
      }))
      .filter((v: any) => v.options.length > 0);
  }, [product?.selectedVariantOptions]);

  // Get available SKUs
  const getAvailableSKUs = useMemo(() => {
    if (!product?.skus) return [];
    return product.skus.filter((sku: any) => (sku.stock || 0) > 0);
  }, [product?.skus]);

  // Get total available stock
  const getTotalAvailableStock = useMemo(() => {
    return getAvailableSKUs.reduce((total: number, sku: any) => total + (sku.stock || 0), 0);
  }, [getAvailableSKUs]);

  // Handle variant change
  const handleVariantChange = useCallback((variantId: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: optionId,
    }));
  }, []);

  // Auto-select first variant option by default
  useEffect(() => {
    if (product) {
      const populatedVariants = getPopulatedVariants;
      const defaultSelections: Record<string, string> = {};

      populatedVariants.forEach((variant: any) => {
        if (variant.options && variant.options.length > 0) {
          // Select the first available option
          const firstAvailableOption = variant.options.find((option: any) => {
            const skuForOption = product.skus?.find((sku: any) =>
              sku.attributes?.some((attr: any) => {
                // Backend populates variantId and optionId as objects or IDs
                const attrVariantId = typeof attr.variantId === 'object' 
                  ? attr.variantId._id || attr.variantId 
                  : attr.variantId;
                const attrOptionId = typeof attr.optionId === 'object' 
                  ? attr.optionId._id || attr.optionId 
                  : attr.optionId;
                return attrVariantId?.toString() === variant._id?.toString() && 
                       attrOptionId?.toString() === option._id?.toString();
              })
            );
            return (skuForOption?.stock || 0) > 0;
          }) || variant.options[0];

          defaultSelections[variant._id] = firstAvailableOption._id;
        }
      });

      setSelectedVariants(defaultSelections);
    }
  }, [product, getPopulatedVariants]);

  // Find matching SKU based on selected variants
  useEffect(() => {
    if (product && product.skus && Object.keys(selectedVariants).length > 0) {
      const matchingSKU = product.skus.find((sku: any) => {
        return sku.attributes?.every((attr: any) => {
          // Backend populates variantId and optionId as objects or IDs
          const attrVariantId = typeof attr.variantId === 'object' 
            ? attr.variantId._id || attr.variantId 
            : attr.variantId;
          const attrOptionId = typeof attr.optionId === 'object' 
            ? attr.optionId._id || attr.optionId 
            : attr.optionId;
          return selectedVariants[attrVariantId?.toString()] === attrOptionId?.toString();
        });
      });
      setSelectedSKU(matchingSKU || null);
    } else {
      setSelectedSKU(null);
    }
  }, [selectedVariants, product]);

  // Check if all variants are selected
  const areAllVariantsSelected = () => {
    const populatedVariants = getPopulatedVariants;
    return (
      populatedVariants.length > 0 &&
      populatedVariants.every((variant: any) => selectedVariants[variant._id])
    );
  };

  // Check if selected combination has stock
  const hasSelectedCombinationStock = () => {
    return selectedSKU && (selectedSKU.stock || 0) > 0;
  };

  // Handle quantity change
  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      if (value > 0) {
        setQuantity(value);
      }
    },
    []
  );

  // Increase quantity
  const increaseQuantity = useCallback(() => {
    const populatedVariants = getPopulatedVariants;
    const maxStock =
      populatedVariants.length > 0
        ? selectedSKU?.stock || 0
        : getTotalAvailableStock;

    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  }, [selectedSKU?.stock, getTotalAvailableStock, quantity, getPopulatedVariants]);

  // Decrease quantity
  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  // Handle add to cart
  const handleAddToCart = async () => {
    const populatedVariants = getPopulatedVariants;

    // Check if variants exist and all are selected
    if (populatedVariants.length > 0 && !areAllVariantsSelected()) {
      toast.error('Please select all variant options');
      return;
    }

    // Check if selected combination has stock
    if (populatedVariants.length > 0 && !hasSelectedCombinationStock()) {
      toast.error('Selected combination is out of stock');
      return;
    }

    // Check quantity against available stock
    const maxStock =
      populatedVariants.length > 0
        ? selectedSKU?.stock || 0
        : getTotalAvailableStock;

    if (maxStock < quantity) {
      toast.error(`Only ${maxStock} items available in stock for the selected option`);
      return;
    }

    try {
      // Use selected SKU if variants exist, otherwise use first available SKU
      const skuId =
        populatedVariants.length > 0
          ? selectedSKU?._id
          : getAvailableSKUs[0]?._id;

      if (!skuId) {
        toast.error('No available SKU found');
        return;
      }

      // Prepare variant options for backend
      const variantOptions: Record<string, string> = {};
      if (populatedVariants.length > 0) {
        populatedVariants.forEach((variant: any) => {
          const selectedOptionId = selectedVariants[variant._id];
          if (selectedOptionId) {
            variantOptions[variant._id] = selectedOptionId;
          }
        });
      }

      // Add to cart
      await addToCart.mutateAsync({
        productId: product!._id,
        skuId: skuId,
        quantity: quantity,
        variantOptions: variantOptions,
      });

      // Show success toast with product name
      toast.success(`${product.title} added to cart`);

      // Show cart success modal
      setShowCartSuccessModal(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to add item to cart');
    }
  };

  // Handle continue shopping
  const handleContinueShopping = useCallback(() => {
    setShowCartSuccessModal(false);
  }, []);

  // Handle go to cart
  const handleGoToCart = useCallback(() => {
    setShowCartSuccessModal(false);
    navigate('/cart');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="page-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="page-container">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900">Product Not Found</h2>
            <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/products')} className="btn-primary mt-4">
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const populatedVariants = getPopulatedVariants;
  const totalStock = getTotalAvailableStock;

  return (
    <>
      <div className="min-h-screen bg-white py-8">
        <div className="page-container">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          </div>

          <div className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={
                        product.images[currentImageIndex]?.url || product.images[0]?.url
                      }
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {product.images.slice(0, 6).map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                          currentImageIndex === index
                            ? 'border-brand-primary bg-brand-tint ring-2 ring-brand-primary/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Title and Status */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
                  {product.slug && (
                    <span className="text-sm text-gray-500">/{product.slug}</span>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="h-5 w-5 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      KSh{' '}
                      {(
                        selectedSKU?.price ||
                        product.basePrice ||
                        0
                      ).toLocaleString()}
                    </span>
                    {product.comparePrice && (
                      <span className="text-lg text-gray-500 line-through">
                        KSh {product.comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    SKU: {selectedSKU?.skuCode || product.skuCode || 'N/A'}
                  </div>
                </div>

                {/* Classifications */}
                <div className="space-y-4">
                  {/* Brand */}
                  {product.brand && (
                    <div className="flex items-center space-x-2">
                      <FiPackage className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Brand:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {typeof product.brand === 'object' ? product.brand.name : 'Unknown Brand'}
                      </span>
                    </div>
                  )}

                  {/* Categories */}
                  {product.categories && product.categories.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <FiGrid className="h-4 w-4 text-gray-600 mt-0.5" />
                      <span className="text-sm text-gray-600">Categories:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.categories.map((c: any) => c.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Collections */}
                  {product.collections && product.collections.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <FiLayers className="h-4 w-4 text-gray-600 mt-0.5" />
                      <span className="text-sm text-gray-600">Collections:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.collections.map((c: any) => c.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <FiTag className="h-4 w-4 text-gray-600 mt-0.5" />
                      <span className="text-sm text-gray-600">Tags:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {product.tags.map((t: any) => t.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Variants */}
                {populatedVariants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Variants</h3>
                    <VariantSelector
                      variants={populatedVariants}
                      selectedOptions={selectedVariants}
                      onOptionSelect={handleVariantChange}
                    />
                  </div>
                )}

                {/* Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={
                          populatedVariants.length > 0
                            ? selectedSKU?.stock || 0
                            : totalStock || 999
                        }
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none"
                      />
                      <button
                        onClick={increaseQuantity}
                        disabled={
                          quantity >=
                          (populatedVariants.length > 0
                            ? selectedSKU?.stock || 0
                            : totalStock || 999)
                        }
                        className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      (populatedVariants.length > 0 && !areAllVariantsSelected()) ||
                      (populatedVariants.length > 0 &&
                        (!hasSelectedCombinationStock() ||
                          (selectedSKU?.stock || 0) < quantity)) ||
                      (populatedVariants.length === 0 && totalStock < quantity) ||
                      addToCart.isPending
                    }
                    className="w-full btn-primary inline-flex items-center justify-center"
                  >
                    {addToCart.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-200 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-gray-200 p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FiCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Cart Success Modal */}
        <CartSuccessModal
          isOpen={showCartSuccessModal}
          onClose={() => setShowCartSuccessModal(false)}
          onContinueShopping={handleContinueShopping}
          onGoToCart={handleGoToCart}
          itemName={product?.title || 'Product'}
        />

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewsSection productId={id || ''} />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
