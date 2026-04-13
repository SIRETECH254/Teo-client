import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroImage from "../../assets/Hero.jpeg";
import { useGetAllProducts } from "../../tanstack/useProducts";
import { useGetAllCollections } from "../../tanstack/useCollections";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCardSkeleton";

const Home = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Fetch all collections to find IDs for specific slugs
  const { data: collectionsRes } = useGetAllCollections();
  const collections = collectionsRes?.collections || [];

  // Find collection IDs by slug
  const featuredId = collections.find((c: any) => c.slug === "featured")?._id;
  const newArrivalsId = collections.find((c: any) => c.slug === "new-arrivals")?._id;
  const bestSellersId = collections.find((c: any) => c.slug === "best-sellers")?._id;

  // Fetch products for each section
  const { data: featuredData, isLoading: isFeaturedLoading } = useGetAllProducts(
    { collection: featuredId, limit: 10 },
    { enabled: !!featuredId }
  );
  
  const { data: newArrivalsData, isLoading: isNewArrivalsLoading } = useGetAllProducts(
    { collection: newArrivalsId, limit: 10 },
    { enabled: !!newArrivalsId }
  );

  const { data: bestSellersData, isLoading: isBestSellersLoading } = useGetAllProducts(
    { collection: bestSellersId, limit: 10 },
    { enabled: !!bestSellersId }
  );

  const featuredProducts = featuredData?.products || [];
  const newArrivalsProducts = newArrivalsData?.products || [];
  const bestSellersProducts = bestSellersData?.products || [];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { width, height } = windowSize;

  // Calculate responsive hero height based on screen size
  // Mobile: ~50% of screen height, Tablet: ~60%, Desktop: ~70%
  const getHeroHeight = () => {
    if (width < 640) {
      // Mobile
      return height * 0.5;
    } else if (width < 1024) {
      // Tablet
      return height * 0.6;
    } else {
      // Desktop
      return height * 0.7;
    }
  };

  const heroHeight = getHeroHeight();

  return (
    
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section
        className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${HeroImage})`,
          height: `${heroHeight}px`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="w-full h-full flex items-center justify-start text-white">
          
          <div className="flex flex-col gap-y-2 md:pl-10 pl-5">

            <p className="text-3xl font-bold">
              TEO KICKS 
            </p>

            <p className="font-semibold">Browse a executive colletion of shoe and get premium experiance </p>

          </div>

        </div>

      </section>

      {/* Featured Section */}
      <section className="py-12 px-4 overflow-hidden">

        <div className="">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide">Featured</h2>
            <Link
              to={`/products?collection=${featuredId}`}
              className="text-brand-primary font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="relative">
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {isFeaturedLoading ? (
                [...Array(6)].map((_, index) => (
                  <div key={index} className="min-w-[280px] flex-shrink-0">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product: any) => (
                  <div key={product._id} className="min-w-[280px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No featured products available.
                </div>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* New Arrival Section */}
      <section className="py-12 px-4 overflow-hidden">

        <div className="">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide">New Arrival</h2>
            <Link
              to={`/products?collection=${newArrivalsId}`}
              className="text-brand-primary font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="relative">
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {isNewArrivalsLoading ? (
                [...Array(6)].map((_, index) => (
                  <div key={index} className="min-w-[280px] flex-shrink-0">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : newArrivalsProducts.length > 0 ? (
                newArrivalsProducts.map((product: any) => (
                  <div key={product._id} className="min-w-[280px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No new arrivals available.
                </div>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* Best Selling Section */}
      <section className="py-12 px-4 overflow-hidden">

        <div className="">

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide">Best Selling</h2>
            <Link
              to={`/products?collection=${bestSellersId}`}
              className="text-brand-primary font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="relative">
            <div
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {isBestSellersLoading ? (
                [...Array(6)].map((_, index) => (
                  <div key={index} className="min-w-[280px] flex-shrink-0">
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : bestSellersProducts.length > 0 ? (
                bestSellersProducts.map((product: any) => (
                  <div key={product._id} className="min-w-[280px] flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No best selling products available.
                </div>
              )}
            </div>
          </div>

        </div>

      </section>

    </div>

  );
};

export default Home;
