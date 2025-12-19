import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Filter, Star, Package, ShoppingCart, Heart } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../lib/supabase";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { ProductSkeleton } from "./LoadingSkeletons";
import { useDebounceValue } from "../hooks/usePerformance";
import Navbar from "./Navbar";
import HeroSection from "./HeroSectionNew";
import TrendingStyles from "./TrendingStyles";
import CartSidebar from "./CartSidebar";
import AuthModal from "./AuthModal";
import ProductQuickView from "./ProductQuickView";
import CheckoutModal from "./CheckoutModal";
import OptimizedImage from "./OptimizedImage";
import compactToast from "../utils/compactToast";
import type { Product } from "../types";
import type { Database } from "../lib/database.types";

type Order = Database["public"]["Tables"]["orders"]["Row"];

interface CustomerStoreProps {
  onCheckout?: () => void;
  onAdminClick?: () => void;
}

const ProductCard = memo(
  ({
    product,
    onAddToCart,
    onQuickView,
    index = 0,
  }: {
    product: Product;
    onAddToCart: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    index?: number;
  }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = useCallback(async () => {
      setIsAddingToCart(true);

      // Simulate a slight delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      onAddToCart(product);
      setIsAddingToCart(false);
    }, [product, onAddToCart]);

    const toggleLike = useCallback(() => {
      setIsLiked((prev) => !prev);
      if (!isLiked) {
        compactToast.addToWishlist();
      }
    }, [isLiked]);

    const handleQuickView = useCallback(() => {
      onQuickView?.(product);
    }, [onQuickView, product]);

    return (
      <div
        data-product-id={product.id}
        className="bg-gradient-to-br from-slate-900/90 via-slate-800/40 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-400 overflow-hidden group border border-white/20 ring-highlight-target"
      >
        {/* Product Image */}
        <div
          className="relative overflow-hidden cursor-pointer bg-gradient-to-br from-amber-950/20 to-rose-950/20"
          onClick={handleQuickView}
        >
          <OptimizedImage
            src={product.image_url}
            alt={product.name}
            className="w-full h-56 sm:h-60 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            fallbackClassName="w-full h-56 sm:h-60 md:h-64"
            onClick={handleQuickView}
            priority={index < 3}
            preload={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Elegant Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickView();
              }}
              className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white px-8 py-3 rounded-full font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-400 shadow-lg shadow-amber-500/50 hover:shadow-xl border border-white/20"
            >
              Quick View
            </button>
          </div>

          {/* Refined Wishlist Button */}
          <button
            onClick={toggleLike}
            className={`absolute top-4 right-4 w-11 h-11 rounded-full backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-lg ${
              isLiked
                ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/50 scale-110"
                : "bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500 hover:scale-110"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>

          {/* Minimal Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Featured</span>
            </div>
          )}

          {/* Subtle Low Stock Warning */}
          {product.quantity_in_stock <= product.reorder_level && (
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-orange-500/30">
              Only {product.quantity_in_stock} left
            </div>
          )}
        </div>

        {/* Elegant Product Info */}
        <div className="p-5 sm:p-6">
          {/* Category Tag */}
          <div className="mb-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-950/30 px-3 py-1 rounded-full border border-amber-500/30">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-white text-lg sm:text-xl mb-3 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:to-rose-300 transition-all duration-300">
            {product.name}
          </h3>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price & Stock Info */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-rose-400 mb-1">
                KES {product.selling_price.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 flex items-center">
                <Package className="w-3.5 h-3.5 mr-1.5" />
                {product.quantity_in_stock} in stock
              </p>
            </div>
          </div>

          {/* Refined Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantity_in_stock === 0 || isAddingToCart}
            className={`w-full py-4 px-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
              product.quantity_in_stock === 0
                ? "bg-slate-700/50 text-slate-400 cursor-not-allowed border border-white/10"
                : isAddingToCart
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-500/50 scale-105"
                : "bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white hover:from-amber-700 hover:via-rose-700 hover:to-rose-800 hover:shadow-xl hover:shadow-amber-500/50 active:scale-95"
            }`}
          >
            <ShoppingCart
              className={`w-5 h-5 ${isAddingToCart ? "animate-pulse" : ""}`}
            />
            <span>
              {product.quantity_in_stock === 0
                ? "Out of Stock"
                : isAddingToCart
                ? "Adding..."
                : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default function CustomerStore({
  onCheckout,
  onAdminClick,
}: CustomerStoreProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  // Pagination constants
  const PRODUCTS_PER_PAGE = 12;

  // Debounced search term for performance
  const debouncedSearchTerm = useDebounceValue(searchTerm, 300);

  const cart = useCart();
  const { user } = useAuth();

  const categories = useMemo(
    () => [
      "all",
      "Men's Fashion",
      "Women's Fashion",
      "Kids Fashion",
      "Accessories",
      "Shoes",
      "Bags",
      "Jewelry",
      "Watches",
      "Sportswear",
      "Formal Wear",
      "Casual Wear",
    ],
    []
  );

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .gt("quantity_in_stock", 0)
        .order("featured", { ascending: false })
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term (using debounced value)
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    return filtered;
  }, [products, debouncedSearchTerm, selectedCategory]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, PRODUCTS_PER_PAGE]);

  // Total pages
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handleAddToCart = useCallback(
    (product: Product) => {
      cart.addItem(product);

      // Show success toast notification with feedback
      compactToast.addToCart(product.name);
    },
    [cart]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  }, []);

  const handleCartClick = useCallback(() => {
    setShowCart(true);
  }, []);

  const handleAuthClick = useCallback(() => {
    setShowAuth(true);
  }, []);

  const handleShopNowClick = useCallback(() => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleQuickViewMain = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    // This will trigger the highlighting in Navbar through the data-product-id attribute
    console.log("Product selected:", product.name);
  }, []);

  const handleCheckoutClick = useCallback(() => {
    setShowCart(false);
    setShowCheckout(true);
  }, []);

  const handleCloseCheckout = useCallback(() => {
    setShowCheckout(false);
  }, []);

  const handleOrderComplete = useCallback(
    (order: Order) => {
      console.log("Order completed:", order.order_number);
      compactToast.orderSuccess(order.order_number);
      onCheckout?.();
    },
    [onCheckout]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navbar Skeleton */}
        <div className="bg-white/10 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-lg w-48"></div>
              <div className="h-10 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-lg w-64"></div>
              <div className="flex space-x-4">
                <div className="h-10 w-10 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-full"></div>
                <div className="h-10 w-20 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="h-12 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gradient-to-r from-white/20 via-white/10 to-white/20 bg-[length:200%_100%] animate-shimmer rounded-lg w-64 mx-auto mb-8"></div>
          </div>

          {/* Products Skeleton */}
          <ProductSkeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onCartClick={handleCartClick}
        onAuthClick={handleAuthClick}
        onAdminClick={user ? onAdminClick : undefined}
        products={products}
        onProductSelect={handleProductSelect}
      />

      {/* Hero Section */}
      <HeroSection
        onShopNowClick={handleShopNowClick}
        onAddToCart={handleAddToCart}
        onQuickView={handleQuickViewMain}
      />

      {/* Trending Styles Section */}
      <TrendingStyles onExplore={handleShopNowClick} />

      {/* Products Section */}
      <section
        id="products-section"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16"
      >
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-amber-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Premium Fashion Collection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-gradient-to-r from-white via-amber-200 to-rose-200 bg-clip-text mb-3 sm:mb-4">
            Our Collections
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto px-4">
            Discover our carefully curated collection of premium fashion items.
            Quality guaranteed, style unmatched.
          </p>
        </div>
        {/* Category Filter */}
        <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {/* Mobile Filter Design */}
          <div className="block lg:hidden">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-amber-300 mr-2 flex-shrink-0" />
                <span className="text-lg font-bold text-white">
                  Filter by Category
                </span>
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                <div className="flex gap-2 pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white shadow-lg shadow-amber-500/50"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/20"
                      }`}
                    >
                      {category === "all" ? "All Products" : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Filter Design */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto scrollbar-hide pb-4">
              <div className="flex items-center justify-center space-x-3 min-w-max mx-auto">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full p-1 shadow-lg border border-white/20">
                  <Filter className="w-5 h-5 text-amber-300 ml-3 flex-shrink-0" />
                  <div className="flex space-x-1 pr-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-xl transform scale-105"
                            : "text-slate-300 hover:bg-white/10 hover:text-white hover:scale-105"
                        }`}
                      >
                        {category === "all" ? "All" : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <Package className="w-20 h-20 text-slate-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">
                No products found
              </h3>
              <p className="text-slate-300 mb-6">
                Try adjusting your search or filters to find what you're looking
                for
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleCategoryChange("all");
                }}
                className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-rose-700 transition-all duration-300 font-semibold"
              >
                Show All Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile: Vertical Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickViewMain}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-12 px-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto min-w-[100px] px-5 py-3 border border-white/20 bg-white/10 backdrop-blur-xl rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
            >
              Previous
            </button>

            {/* Smart Pagination - Shows limited pages */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full px-2">
              {/* First page */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="flex-shrink-0 min-w-[44px] h-11 px-4 py-2 rounded-xl transition-all font-semibold bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white shadow-md"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="flex-shrink-0 text-slate-400 px-2">
                      ...
                    </span>
                  )}
                </>
              )}

              {/* Pages around current */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const distance = Math.abs(page - currentPage);
                  return distance <= 2 || page === 1 || page === totalPages;
                })
                .map((page) => {
                  // Skip if already shown
                  if (
                    (page === 1 && currentPage > 3) ||
                    (page === totalPages && currentPage < totalPages - 2)
                  ) {
                    return null;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex-shrink-0 min-w-[44px] h-11 px-4 py-2 rounded-xl transition-all font-semibold shadow-md ${
                        page === currentPage
                          ? "bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white shadow-lg shadow-amber-500/50 scale-110"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white hover:scale-105"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              {/* Last page */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="flex-shrink-0 text-slate-400 px-2">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="flex-shrink-0 min-w-[44px] h-11 px-4 py-2 rounded-xl transition-all font-semibold bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white shadow-md"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto min-w-[100px] px-5 py-3 border border-white/20 bg-white/10 backdrop-blur-xl rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LENZRO LUXE</h3>
              <p className="text-slate-300">
                Your trusted partner for books, stationery, and more. Quality
                products, fast delivery, best prices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact / Xiriir</h4>
              <div className="space-y-2 text-slate-300">
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <a
                    href="tel:+254722979547"
                    className="hover:text-white transition-colors"
                  >
                    +254 722 261 776
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📧</span>
                  <a
                    href="mailto:Yussufh080@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    yussufh080@gmail.com
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Nairobi, Kenya</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>Made with ❤️ by Lenzro</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Collections</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <p>👔 Men's Fashion</p>
                <p>👗 Women's Style</p>
                <p>👶 Kids Collection</p>
                <p>👜 Accessories</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-sm">
              <p className="text-slate-400 text-center sm:text-left">
                &copy; {new Date().getFullYear()} LENZRO LUXE. All rights
                reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Powered by</span>
                <a
                  href="https://lenzro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600/30 to-rose-600/30 hover:from-amber-600/40 hover:to-rose-600/40 border border-amber-500/40 hover:border-amber-400/60 rounded-lg transition-all hover:scale-105 font-bold text-amber-300 hover:text-amber-200 shadow-xl"
                >
                  <span className="text-lg">⚡</span>
                  <span>Lenzro</span>
                  <span className="text-xs text-amber-400">Digital Agency</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckoutClick}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        onOrderComplete={handleOrderComplete}
      />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseQuickView}
        onAddToCart={handleAddToCart}
      />

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        className="!z-50"
        toastClassName="!rounded-lg !shadow-lg !min-h-12 !text-sm !p-2"
        progressClassName="!bg-gradient-to-r !from-amber-500 !to-rose-500"
        style={{
          fontSize: "14px",
        }}
      />
    </div>
  );
}
