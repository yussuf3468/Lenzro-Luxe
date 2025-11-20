import { useState, memo, useCallback } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Package,
  Flame,
  TrendingUp,
} from "lucide-react";
import compactToast from "../utils/compactToast";
import { useFeaturedProducts } from "../hooks/useSupabaseQuery";
import OptimizedImage from "./OptimizedImage";
import type { Product } from "../types";

interface FeaturedProductsProps {
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onViewAllProducts?: () => void;
}

const FeaturedProducts = memo(
  ({ onAddToCart, onQuickView, onViewAllProducts }: FeaturedProductsProps) => {
    const { data: featuredProducts = [], isLoading } = useFeaturedProducts(8);

    const badges = [
      "#1 Best Seller",
      "Hot Sale",
      "Customer Favorite",
      "Trending",
      "Limited Edition",
      "Award Winner",
      "New Arrival",
      "Premium Choice",
    ];

    const handleAddToCart = useCallback(
      (product: Product) => {
        if (onAddToCart) onAddToCart(product);
      },
      [onAddToCart]
    );

    const handleQuickView = useCallback(
      (product: Product) => {
        if (onQuickView) onQuickView(product);
      },
      [onQuickView]
    );

    const handleViewAllProducts = useCallback(() => {
      if (onViewAllProducts) {
        onViewAllProducts();
      } else {
        const productsSection = document.getElementById("products-section");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }, [onViewAllProducts]);

    const FeaturedProductCard = memo(
      ({ product, index }: { product: Product; index: number }) => {
        const [isLiked, setIsLiked] = useState(false);
        const [isAddingToCart, setIsAddingToCart] = useState(false);

        const toggleLike = useCallback(() => {
          setIsLiked((prev) => !prev);
          if (!isLiked) compactToast.addToWishlist();
        }, [isLiked]);

        const handleAddToCartClick = useCallback(async () => {
          setIsAddingToCart(true);
          await new Promise((resolve) => setTimeout(resolve, 250));
          handleAddToCart(product);
          setIsAddingToCart(false);
        }, [product, handleAddToCart]);

        const handleQuickViewClick = useCallback(() => {
          handleQuickView(product);
        }, [product, handleQuickView]);

        return (
          <div
            key={product.id}
            className="group relative bg-gradient-to-br from-black/40 via-purple-950/20 to-black/40 backdrop-blur-2xl rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border border-white/10 hover:border-purple-400/30"
          >
            {/* Premium Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-amber-500/50">
                {badges[index % badges.length]}
              </div>
            </div>

            {/* Subtle Stock Badge */}
            {product.quantity_in_stock < 10 && (
              <div className="absolute top-4 right-16 z-10">
                <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                  Only {product.quantity_in_stock} left
                </div>
              </div>
            )}

            {/* Premium Wishlist Button */}
            <button
              onClick={toggleLike}
              className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
                isLiked
                  ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/50 scale-110"
                  : "bg-white/5 text-purple-300 hover:bg-white/10 hover:text-rose-400 hover:shadow-lg border border-white/10 hover:border-rose-400/50"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>

            {/* Elegant Product Image */}
            <div
              className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-white/5 to-white/10"
              onClick={handleQuickViewClick}
            >
              <OptimizedImage
                src={product.image_url}
                alt={product.name}
                className="w-full h-44 sm:h-48 md:h-52 object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-105"
                fallbackClassName="w-full h-44 sm:h-48 md:h-52"
                onClick={handleQuickViewClick}
                priority={index < 2}
                preload={index < 4}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Premium Quick View Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-purple-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickViewClick();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-xl text-white px-8 py-3 rounded-full font-semibold text-sm transform translate-y-8 group-hover:translate-y-0 transition-all duration-400 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 border border-white/20 hover:scale-105"
                >
                  Quick View
                </button>
              </div>
            </div>

            {/* Elegant Product Info */}
            <div className="p-5 space-y-4">
              {/* Category Tag */}
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h4 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-tight group-hover:text-slate-200 transition-colors duration-300">
                {product.name}
              </h4>

              {/* Product Description */}
              {product.description && (
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Refined Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">(4.9)</span>
              </div>

              {/* Price & Stock Info */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-lg sm:text-xl font-light text-white">
                    KES {product.selling_price?.toLocaleString()}
                  </div>
                  {product.buying_price &&
                    product.buying_price < product.selling_price && (
                      <div className="text-xs text-slate-400 line-through">
                        KES {product.buying_price.toLocaleString()}
                      </div>
                    )}
                  <div className="text-xs text-slate-400 flex items-center mt-1">
                    <Package className="w-3 h-3 mr-1.5" />
                    {product.quantity_in_stock} in stock
                  </div>
                </div>
              </div>

              {/* Premium Add to Cart Button */}
              <button
                onClick={handleAddToCartClick}
                disabled={isAddingToCart}
                className={`w-full font-semibold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 ${
                  isAddingToCart
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/50"
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95"
                }`}
              >
                <ShoppingCart
                  className={`w-5 h-5 ${isAddingToCart ? "animate-pulse" : ""}`}
                />
                <span className="text-sm">{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
              </button>
            </div>
          </div>
        );
      }
    );

    if (isLoading) {
      return (
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg shadow border border-white/20 p-4 sm:p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-xl rounded shadow border border-white/20 p-4"
                  >
                    <div className="h-32 bg-white/20 rounded mb-3" />
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-6 bg-white/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="bg-gradient-to-br from-black/40 via-purple-950/20 to-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 lg:p-12">
          <div className="mb-8 lg:mb-12">
            <div className="block lg:hidden text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-3 rounded-full border border-purple-400/30">
                  <Flame className="w-6 h-6 text-purple-400" />
                </div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-4 py-2 rounded-full text-sm font-semibold border border-purple-400/40 shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-4 h-4" />
                  <span>Hot Deals</span>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Curated Collections
              </h3>
              <p className="text-sm text-purple-300/80">
                Handpicked luxury • Limited editions • Exclusive designs
              </p>
            </div>

            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-4 rounded-2xl border border-purple-400/30 shadow-xl shadow-purple-500/10">
                  <Flame className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Curated Collections
                  </h3>
                  <p className="text-sm text-purple-300/80">
                    Handpicked luxury • Limited editions • Exclusive designs
                  </p>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-200 px-6 py-3 rounded-full text-sm font-semibold border border-purple-400/40 shadow-lg shadow-purple-500/20">
                  <TrendingUp className="w-5 h-5" />
                  <span>Hot Deals</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredProducts.map((product: Product, index: number) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={handleViewAllProducts}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold py-4 px-10 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              <span className="text-sm uppercase tracking-wider">Explore All Collections</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

FeaturedProducts.displayName = "FeaturedProducts";

export default FeaturedProducts;
