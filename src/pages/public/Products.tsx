import { useState } from 'react';
import { useGetAllProducts } from '../../tanstack/useProducts';
import { useGetAllCategories } from '../../tanstack/useCategories';
import { useGetAllCollections } from '../../tanstack/useCollections';
import { useGetAllBrands } from '../../tanstack/useBrands';
import { useGetAllTags } from '../../tanstack/useTags';
import ProductCard from '../../components/product/ProductCard';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';
import Pagination from '../../components/ui/Pagination';
import { FiPackage, FiSearch, FiFilter, FiX, FiTag, FiFolder, FiGrid, FiBarChart2, FiAward } from 'react-icons/fi';

// Products list page component with search and filtering
const Products = () => {
  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [collection, setCollection] = useState('');
  const [brand, setBrand] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Fetch products
  const { data, isLoading, isError, error } = useGetAllProducts({
    search: search || undefined,
    category: category || undefined,
    collection: collection || undefined,
    brand: brand || undefined,
    tag: tag || undefined,
    sort: sort || undefined,
    status: 'active', // Default to active for public view
    page,
    limit: 20,
  });

  // Fetch filter options
  const { data: categoriesRes } = useGetAllCategories();
  const { data: collectionsRes } = useGetAllCollections();
  const { data: brandsRes } = useGetAllBrands();
  const { data: tagsRes } = useGetAllTags();

  // Extract items based on the specific API response structure
  const categories = categoriesRes?.categories || [];
  const collections = collectionsRes?.collections || [];
  const brands = brandsRes?.brands || [];
  const tags = tagsRes?.tags || [];

  const products = data?.products || [];
  const pagination = data?.pagination;

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setCollection('');
    setBrand('');
    setTag('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters = search || category || collection || brand || tag || sort !== 'newest';

  return (
    <div className="min-h-screen bg-gray-50/50">

      <div className="page-container">

        <header className="mb-6">
        
          {/* title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        
          {/* Search Bar */}
          <div className="relative group mb-2">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
              <FiSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="input pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* product count and filters  */}
          <div className="flex flex-col gap-y-4">
              
              <div className="flex flex-col  items-start gap-4">

                {/* count */}
                <div className="">
                    <p className="text-sm text-gray-600">
                    {pagination ? `Showing ${products.length} of ${pagination.totalDocs || 0} products` : 'Browse our collection'}
                    </p>
                </div>

                {/* filters */}
                <div className="flex flex-wrap gap-2">
                    
                    {/* Category Filter */}
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <FiGrid className="w-4 h-4" />
                      </div>
                      <select
                        className="input pl-10 appearance-none bg-transparent"
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat: any) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Collection Filter */}
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <FiFolder className="w-4 h-4" />
                      </div>
                      <select
                        className="input pl-10 appearance-none bg-transparent"
                        value={collection}
                        onChange={(e) => {
                          setCollection(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Collections</option>
                        {collections.map((coll: any) => (
                          <option key={coll._id} value={coll._id}>
                            {coll.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand Filter */}
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <FiAward className="w-4 h-4" />
                      </div>
                      <select
                        className="input pl-10 appearance-none bg-transparent"
                        value={brand}
                        onChange={(e) => {
                          setBrand(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Brands</option>
                        {brands.map((b: any) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tag Filter */}
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <FiTag className="w-4 h-4" />
                      </div>
                      <select
                        className="input pl-10 appearance-none bg-transparent"
                        value={tag}
                        onChange={(e) => {
                          setTag(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="">All Tags</option>
                        {tags.map((t: any) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Order */}
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 group-focus-within:text-brand-primary transition-colors pointer-events-none">
                        <FiBarChart2 className="w-4 h-4" />
                      </div>
                      <select
                        className="input pl-10 appearance-none bg-transparent"
                        value={sort}
                        onChange={(e) => {
                          setSort(e.target.value);
                          setPage(1);
                        }}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A to Z</option>
                        <option value="name_desc">Name: Z to A</option>
                      </select>
                    </div>

                </div>

              </div>

              {/* Filter Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiFilter className="w-4 h-4" />
                  <span>Filters applied: {hasFilters ? 'Yes' : 'None'}</span>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-sm font-semibold text-brand-primary flex items-center gap-1 hover:text-brand-accent transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>

          </div>

        </header>
          
        <section className="section">

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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(p) => setPage(p)}
                    totalItems={pagination.totalDocs}
                    pageSize={20} // As set in the useGetAllProducts call
                    currentPageCount={products.length}
                  />
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
              <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
              <p className="text-gray-600 mb-6">We couldn't find any products matching your current filters.</p>
              <button
                onClick={handleClearFilters}
                className="btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>

      </div>

    </div>
  );
};

export default Products;
