import { useState, useCallback, memo } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import SearchSuggestions from "./SearchSuggestions";
import type { Product } from "../types";

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCartClick: () => void;
  onAuthClick: () => void;
  onAdminClick?: () => void;
  products?: Product[];
  onProductSelect?: (product: Product) => void;
}

const Navbar = memo(
  ({
    searchTerm,
    onSearchChange,
    onCartClick,
    onAuthClick,
    onAdminClick,
    products = [],
    onProductSelect,
  }: NavbarProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const cart = useCart();
    const { user, signOut } = useAuth();

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange(value);

        // If user is searching, automatically scroll to products section
        if (value.trim()) {
          setTimeout(() => {
            const productsSection = document.getElementById("products-section");
            if (productsSection) {
              productsSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      },
      [onSearchChange]
    );

    // Function to highlight product and scroll to it
    const highlightProduct = useCallback((productId: string) => {
      setTimeout(() => {
        const productElement = document.querySelector(
          `[data-product-id="${productId}"]`
        );
        if (productElement) {
          productElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Add highlight class
          productElement.classList.add("ring-highlight");

          // Remove highlight after 2 seconds
          setTimeout(() => {
            productElement.classList.remove("ring-highlight");
          }, 2000);
        }
      }, 300);
    }, []);
    const handleSignOut = useCallback(async () => {
      try {
        await signOut();
        setIsUserMenuOpen(false);
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }, [signOut]);

    const toggleMobileMenu = useCallback(() => {
      setIsMobileMenuOpen((prev) => !prev);
    }, []);

    const toggleUserMenu = useCallback(() => {
      setIsUserMenuOpen((prev) => !prev);
    }, []);

    return (
      <header className="bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 group cursor-pointer">
                <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                  LENZRO LUXE
                </h1>
                <p className="text-[10px] text-purple-300/80 hidden sm:block tracking-[0.3em] uppercase font-light">
                  Redefine Elegance
                </p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-lg mx-4 lg:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-purple-400/60 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  placeholder="Search luxury collections..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchSuggestions(false), 200)
                  }
                  className="w-full pl-10 lg:pl-12 pr-4 lg:pr-6 py-2.5 lg:py-3 bg-white/5 border border-white/10 text-white placeholder-purple-300/40 rounded-full focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/10 text-sm transition-all duration-300"
                />

                {/* Search Suggestions */}
                <SearchSuggestions
                  searchTerm={searchTerm}
                  products={products}
                  onSelectProduct={(product) => {
                    onProductSelect?.(product);
                    highlightProduct(product.id);
                    setShowSearchSuggestions(false);
                  }}
                  onSelectSearch={(term) => {
                    onSearchChange(term);
                    setShowSearchSuggestions(false);
                  }}
                  isVisible={showSearchSuggestions}
                  onClose={() => setShowSearchSuggestions(false)}
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-3 text-white/90 hover:text-white transition-all duration-300 group"
                aria-label={`Shopping cart with ${cart.totalItems} items`}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  {cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg shadow-purple-500/50 animate-pulse">
                      {cart.totalItems > 99 ? "99+" : cart.totalItems}
                    </span>
                  )}
                </div>
              </button>

              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 p-2 text-slate-300 hover:text-purple-300 transition-colors"
                    >
                      <User className="w-6 h-6" />
                      <span className="text-sm font-medium">
                        {user.email?.split("@")[0]}
                      </span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-white/20">
                          <p className="text-sm font-medium text-white">
                            Welcome back!
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        {onAdminClick && (
                          <button
                            onClick={() => {
                              onAdminClick();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-purple-300 transition-all flex items-center space-x-3 group"
                          >
                            <div className="p-1 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                              <Settings className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <span className="font-medium">Admin Panel</span>
                              <p className="text-xs text-slate-500">
                                Manage store
                              </p>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/10 hover:text-red-300 transition-all flex items-center space-x-3 group"
                        >
                          <div className="p-1 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                            <LogOut className="w-4 h-4 text-red-400" />
                          </div>
                          <div>
                            <span className="font-medium">Sign Out</span>
                            <p className="text-xs text-slate-500">
                              Logout safely
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={onAuthClick}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-6 py-3 rounded-full hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center space-x-2 font-medium group"
                  >
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-slate-300 hover:text-purple-300 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {/* Cart */}
              <button
                onClick={() => {
                  onCartClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-slate-300" />
                  <span className="font-medium text-white">Shopping Cart</span>
                </div>
                {cart.totalItems > 0 && (
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium shadow-lg">
                    {cart.totalItems}
                  </span>
                )}
              </button>

              {/* Auth/User Actions */}
              {user ? (
                <div className="space-y-2">
                  <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-sm font-medium text-purple-300">
                      Signed in as {user.email?.split("@")[0]}
                    </p>
                  </div>
                  {onAdminClick && (
                    <button
                      onClick={() => {
                        onAdminClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-slate-300" />
                      <span className="font-medium text-white">
                        Admin Panel
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-slate-300" />
                    <span className="font-medium text-white">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
);

Navbar.displayName = "Navbar";

export default Navbar;
