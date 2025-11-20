import { memo, useCallback } from "react";
import { Star, Truck, Shield, ArrowRight, Sparkles } from "lucide-react";
import FeaturedProducts from "./FeaturedProducts";
import type { Product } from "../types";

interface HeroSectionProps {
  onShopNowClick: () => void;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const HeroSection = memo(
  ({ onShopNowClick, onAddToCart, onQuickView }: HeroSectionProps) => {
    const handleShopNowClick = useCallback(() => {
      onShopNowClick();
    }, [onShopNowClick]);

    const scrollToProducts = useCallback(() => {
      const productsSection = document.getElementById("products-section");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, []);

    return (
      <>
        {/* Professional Fashion Hero Section */}
        <section className="relative min-h-screen overflow-hidden bg-black">
          {/* Professional Fashion Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            >
              <source
                src="https://videos.pexels.com/video-files/3373353/3373353-uhd_2560_1440_25fps.mp4"
                type="video/mp4"
              />
            </video>

            {/* Elegant Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30"></div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="relative z-10 min-h-screen flex items-center py-24 sm:py-28 md:py-32 lg:py-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
                {/* Left Column - Compact Headline & CTAs */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs sm:text-sm font-semibold text-white tracking-widest">
                      NEW COLLECTION 2025
                    </span>
                  </div>

                  {/* Elegant Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                    Where Fashion
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Meets Elegance
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-300 max-w-md leading-relaxed">
                    Discover premium fashion pieces curated for the modern
                    trendsetter. Elevate your style with our exclusive
                    collection.
                  </p>

                  {/* Call to Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <button
                      onClick={handleShopNowClick}
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl font-bold text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                        <span>Shop Now</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={scrollToProducts}
                      className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl border-2 border-white/30 hover:border-white font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span>New Arrivals</span>
                      </div>
                    </button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-6 pt-6">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 backdrop-blur-xl border border-emerald-400/50 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-emerald-300" />
                      </div>
                      <span className="font-medium">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-xl border border-blue-400/50 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-300" />
                      </div>
                      <span className="font-medium">100% Authentic</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-purple-400/50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-300" />
                      </div>
                      <span className="font-medium">Premium Quality</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Product Showcase Grid */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Product Showcase Items */}
                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop"
                        alt="Fashion showcase 1"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white font-bold text-lg">
                          Premium Collection
                        </div>
                        <div className="text-white/70 text-sm">
                          Women's Fashion
                        </div>
                      </div>
                    </div>

                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-rose-600/20"></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      <img
                        src="https://images.unsplash.com/photo-1445384763658-0400939829cd?w=400&h=400&fit=crop"
                        alt="Fashion showcase 2"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white font-bold text-lg">
                          Exclusive Pieces
                        </div>
                        <div className="text-white/70 text-sm">
                          New Arrivals
                        </div>
                      </div>
                    </div>

                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop"
                        alt="Fashion showcase 3"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white font-bold text-lg">
                          Designer Selection
                        </div>
                        <div className="text-white/70 text-sm">Accessories</div>
                      </div>
                    </div>

                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20"></div>
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                      <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop"
                        alt="Fashion showcase 4"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white font-bold text-lg">
                          Trending Now
                        </div>
                        <div className="text-white/70 text-sm">
                          Best Sellers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Features Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
                <button
                  onClick={scrollToProducts}
                  className="group py-5 px-4 hover:bg-white/5 transition-all duration-300 text-center"
                >
                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    Men's
                  </div>
                  <div className="text-xs text-slate-400">Shop Collection</div>
                </button>

                <button
                  onClick={scrollToProducts}
                  className="group py-5 px-4 hover:bg-white/5 transition-all duration-300 text-center"
                >
                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-pink-400 transition-colors">
                    Women's
                  </div>
                  <div className="text-xs text-slate-400">Shop Collection</div>
                </button>

                <button
                  onClick={scrollToProducts}
                  className="group py-5 px-4 hover:bg-white/5 transition-all duration-300 text-center"
                >
                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-rose-400 transition-colors">
                    Accessories
                  </div>
                  <div className="text-xs text-slate-400">Shop Collection</div>
                </button>

                <button
                  onClick={scrollToProducts}
                  className="group py-5 px-4 hover:bg-white/5 transition-all duration-300 text-center"
                >
                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Exclusive
                  </div>
                  <div className="text-xs text-slate-400">Limited Edition</div>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <div
          id="products-section"
          className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        >
          <div className="py-16">
            <FeaturedProducts
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          </div>
        </div>
      </>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
