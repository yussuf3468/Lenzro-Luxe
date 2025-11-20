import { useState } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import type { Product } from "../types";

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-gradient-to-br from-black/40 via-purple-950/20 to-black/40 backdrop-blur-2xl rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 overflow-hidden border border-white/10 hover:border-purple-400/30 p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-xl transition-all duration-300 flex items-center justify-center ${
          isLiked
            ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl shadow-rose-500/50"
            : "bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10"
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      </button>

      {/* Product Image */}
      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 mb-4 h-48 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-110"
        />
        {/* Quick View Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-purple-950/40 to-transparent flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={() => onQuickView(product)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-2xl shadow-purple-500/50 flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-white text-sm line-clamp-2 mb-1 group-hover:text-purple-200 transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-purple-300/60 uppercase tracking-wide">
            {product.category}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            KES {product.selling_price.toLocaleString()}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-semibold py-3 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm">Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
