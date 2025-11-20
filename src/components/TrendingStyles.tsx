import { memo } from "react";
import { TrendingUp, Sparkles, Star } from "lucide-react";

interface TrendingStylesProps {
  onExplore?: () => void;
}

const TrendingStyles = memo(({ onExplore }: TrendingStylesProps) => {
  const trendingStyles = [
    {
      id: 1,
      title: "Summer Vibes",
      subtitle: "Light & Breezy",
      description: "Perfect for warm weather",
      gradient: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30",
      icon: "☀️",
    },
    {
      id: 2,
      title: "Urban Street",
      subtitle: "Bold & Edgy",
      description: "Modern streetwear essentials",
      gradient: "from-slate-500/20 to-zinc-500/20",
      borderColor: "border-slate-500/30",
      icon: "🏙️",
    },
    {
      id: 3,
      title: "Classic Elegance",
      subtitle: "Timeless & Sophisticated",
      description: "For special occasions",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      icon: "✨",
    },
    {
      id: 4,
      title: "Sport Luxe",
      subtitle: "Comfort Meets Style",
      description: "Active lifestyle fashion",
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      icon: "⚡",
    },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl border border-white/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>What's Hot</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text mb-4">
            Trending Styles
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Discover the latest fashion trends and express your unique style
          </p>
        </div>

        {/* Trending Styles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {trendingStyles.map((style) => (
            <div
              key={style.id}
              className={`group relative bg-gradient-to-br ${style.gradient} backdrop-blur-xl rounded-2xl p-6 border ${style.borderColor} hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {style.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {style.title}
                </h3>
                <p className="text-sm text-purple-300 font-semibold mb-2">
                  {style.subtitle}
                </p>
                <p className="text-xs text-slate-400">{style.description}</p>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-sm text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Explore Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-purple-500/30 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>

          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Exclusive Offer
              </span>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white mb-4">
              New Season Collection
            </h3>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl mx-auto">
              Get up to <span className="text-pink-400 font-bold">50% OFF</span>{" "}
              on selected items from our latest collection
            </p>

            <button
              onClick={onExplore}
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative">Shop Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

TrendingStyles.displayName = "TrendingStyles";

export default TrendingStyles;
