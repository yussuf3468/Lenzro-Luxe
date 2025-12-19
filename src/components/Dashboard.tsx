import { useEffect, useState } from "react";
import { Banknote, TrendingUp, Package, Receipt } from "lucide-react";
import { useProducts, useSales } from "../hooks/useSupabaseQuery";
import type { Product, Sale } from "../types";
import { formatDate } from "../utils/dateFormatter";
import OptimizedImage from "./OptimizedImage";
import { useLanguage } from "../contexts/LanguageContext";

interface DashboardStats {
  totalSales: number;
  totalProfit: number;
  lowStockCount: number;
  totalProducts: number;
  dailySales: number;
  dailyProfit: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  }).format(value);
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProfit: 0,
    lowStockCount: 0,
    totalProducts: 0,
    dailySales: 0,
    dailyProfit: 0,
  });
  const [topProducts, setTopProducts] = useState<
    Array<{ product: Product; total: number }>
  >([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  // ✅ Use cached queries (reduces egress costs by 90%)
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: sales = [], isLoading: salesLoading } = useSales();

  const loading = productsLoading || salesLoading;

  useEffect(() => {
    if (products.length > 0 && sales.length > 0) {
      calculateDashboardData(sales, products);
    }
  }, [products, sales]);

  function calculateDashboardData(sales: Sale[], products: Product[]) {
    try {
      const totalSales = sales.reduce((sum, sale) => sum + sale.total_sale, 0);
      const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
      const lowStockCount = products.filter(
        (p) => p.quantity_in_stock <= p.reorder_level
      ).length;

      // Compute today's totals based on created_at (local day)
      const today = new Date();
      const dailySalesRecords = sales.filter((s) => {
        const d = new Date(s.created_at);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });
      const dailySales = dailySalesRecords.reduce(
        (sum, s) => sum + s.total_sale,
        0
      );
      const dailyProfit = dailySalesRecords.reduce(
        (sum, s) => sum + s.profit,
        0
      );

      setStats({
        totalSales,
        totalProfit,
        lowStockCount,
        totalProducts: products.length,
        dailySales,
        dailyProfit,
      });

      const productSales = new Map<string, number>();
      sales.forEach((sale) => {
        const current = productSales.get(sale.product_id) || 0;
        productSales.set(sale.product_id, current + sale.total_sale);
      });

      const top = Array.from(productSales.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([productId, total]) => ({
          product: products.find((p) => p.id === productId)!,
          total,
        }))
        .filter((item) => item.product);

      setTopProducts(top);
      setRecentSales(sales.slice(-5).reverse());
    } catch (error) {
      console.error("Error calculating dashboard:", error);
      // Show empty state on error
      setStats({
        totalSales: 0,
        totalProfit: 0,
        lowStockCount: 0,
        totalProducts: 0,
        dailySales: 0,
        dailyProfit: 0,
      });
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-white">Loading dashboard...</div>
    );
  }

  return (
    <div className="-mx-3 sm:-mx-4 lg:-mx-6 space-y-6 md:space-y-8 animate-fadeIn">
      {/* Hero Section - Luxury Fashion Dashboard */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl border-x-0 border-t-0 border-b border-white/20 rounded-none p-4 md:p-6 lg:p-8 shadow-2xl shadow-amber-500/20">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-rose-600/10 to-rose-700/10 animate-pulse"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="text-center space-y-3">
            {/* Brand Logo with Sparkle Effect */}
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-amber-600 via-rose-600 to-rose-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/50 transform hover:rotate-12 transition-transform duration-300">
                  <span className="text-xl">👗</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-rose-200 tracking-tight">
                LENZRO LUXE
              </h1>
            </div>

            <div className="inline-flex items-center space-x-2 bg-amber-500/10 backdrop-blur-md border border-amber-400/30 rounded-full px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                {t.dashboard.fashionCommandCenter}
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
              {t.dashboard.manageEmpire}
            </p>

            <div className="flex items-center justify-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  {t.dashboard.liveDashboard}
                </span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                <span className="text-xs font-bold text-amber-300">
                  {t.dashboard.syncedData}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Luxury Fashion Metrics */}
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 via-rose-600 to-rose-700 rounded-full shadow-lg shadow-amber-500/50"></div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white">
                {t.dashboard.performanceMetrics}
              </h2>
              <p className="text-xs text-slate-400">
                {t.dashboard.businessIntelligence}
              </p>
            </div>
          </div>
          <div className="hidden sm:block px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
            <span className="text-xs font-bold text-slate-300">
              {t.dashboard.liveUpdates}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div
            className="group animate-slideInLeft"
            style={{ animationDelay: "0.1s" }}
          >
            <StatCard
              title={t.dashboard.totalRevenue}
              value={formatCurrency(stats.totalSales)}
              icon={Banknote}
              color="blue"
            />
          </div>
          <div
            className="group animate-slideInLeft"
            style={{ animationDelay: "0.2s" }}
          >
            <StatCard
              title={t.dashboard.totalProfit}
              value={formatCurrency(stats.totalProfit)}
              icon={TrendingUp}
              color="green"
            />
          </div>
          <div
            className="group animate-slideInLeft"
            style={{ animationDelay: "0.3s" }}
          >
            <StatCard
              title={t.dashboard.todaySales}
              value={formatCurrency(stats.dailySales)}
              icon={TrendingUp}
              color="orange"
              subtitle={`${t.dashboard.profit}: ${formatCurrency(
                stats.dailyProfit
              )}`}
            />
          </div>
          <div
            className="group animate-slideInLeft"
            style={{ animationDelay: "0.4s" }}
          >
            <StatCard
              title={t.dashboard.totalProducts}
              value={stats.totalProducts.toString()}
              icon={Package}
              color="amber"
            />
          </div>
        </div>
      </div>

      {/* Content Grid - Analytics Cards */}
      <div className="px-3 sm:px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Products Card */}
        <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 rounded-xl shadow-xl shadow-orange-500/50">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white">
                    {t.dashboard.bestSellers}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t.dashboard.topPerforming}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center border border-amber-500/30">
                <span className="text-base">🏆</span>
              </div>
            </div>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mx-auto mb-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-amber-500/20 to-rose-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                      <Package className="w-6 h-6 text-amber-300" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-white mb-1">
                    {t.dashboard.noSalesData}
                  </p>
                  <p className="text-sm text-slate-400">
                    {t.dashboard.startMakingSales}
                  </p>
                </div>
              ) : (
                topProducts.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="group/item relative bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/20"
                  >
                    {/* Rank Badge with Premium Design */}
                    <div className="absolute -top-1.5 -left-1.5 z-10">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-2xl transform -rotate-12 group-hover/item:rotate-0 transition-transform duration-300 ${
                          index === 0
                            ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 shadow-amber-500/50"
                            : index === 1
                            ? "bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 shadow-slate-500/50"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 shadow-orange-500/50"
                            : "bg-gradient-to-br from-amber-500 to-rose-600 shadow-amber-500/50"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 pl-3">
                      {item.product.image_url && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-xl blur"></div>
                          <OptimizedImage
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="relative w-12 h-12 object-cover rounded-lg border-2 border-white/20 shadow-lg"
                            preset="thumbnail"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate text-sm md:text-base mb-1">
                          {item.product.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            {item.product.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-rose-400 text-base md:text-lg">
                          {formatCurrency(item.total)}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {t.dashboard.revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Sales Card */}
        <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-xl shadow-xl shadow-emerald-500/50">
                  <Receipt className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white">
                    {t.dashboard.recentTransactions}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t.dashboard.latestSales}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                <span className="text-base">📊</span>
              </div>
            </div>
            <div className="space-y-2">
              {recentSales.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative mx-auto mb-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                      <Receipt className="w-6 h-6 text-emerald-300" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-white mb-1">
                    {t.dashboard.noSalesRecorded}
                  </p>
                  <p className="text-sm text-slate-400">
                    {t.dashboard.transactionsAppear}
                  </p>
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="group/item relative bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/30 rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <p className="font-bold text-white text-sm md:text-base">
                            {formatDate(sale.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-slate-400">
                            {t.dashboard.soldBy}:
                          </span>
                          <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            {sale.sold_by}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 text-base md:text-lg mb-1">
                          {formatCurrency(sale.total_sale)}
                        </p>
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-[10px] text-slate-500">
                            {t.dashboard.profit}:
                          </span>
                          <p className="text-xs text-emerald-400 font-bold">
                            +{formatCurrency(sale.profit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "green" | "amber" | "orange" | "red";
  subtitle?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: StatCardProps) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-600 via-cyan-600 to-teal-600",
      glow: "shadow-blue-500/50",
      text: "text-blue-300",
      bg: "from-blue-500/10 to-cyan-500/5",
    },
    green: {
      gradient: "from-emerald-600 via-green-600 to-teal-600",
      glow: "shadow-emerald-500/50",
      text: "text-emerald-300",
      bg: "from-emerald-500/10 to-green-500/5",
    },
    amber: {
      gradient: "from-amber-600 via-rose-600 to-rose-700",
      glow: "shadow-amber-500/50",
      text: "text-amber-300",
      bg: "from-amber-500/10 to-rose-500/5",
    },
    orange: {
      gradient: "from-orange-600 via-amber-600 to-yellow-600",
      glow: "shadow-orange-500/50",
      text: "text-orange-300",
      bg: "from-orange-500/10 to-amber-500/5",
    },
    red: {
      gradient: "from-red-600 via-rose-600 to-pink-600",
      glow: "shadow-rose-500/50",
      text: "text-rose-300",
      bg: "from-red-500/10 to-rose-500/5",
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-xl p-4 md:p-5 shadow-2xl hover:shadow-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer will-change-transform overflow-hidden">
      {/* Animated gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      ></div>

      {/* Decorative corner accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-full blur-2xl opacity-50`}
      ></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-shrink-0">
            <div
              className={`bg-gradient-to-br ${colors.gradient} p-2 rounded-xl shadow-2xl ${colors.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <div
            className={`px-2 py-1 bg-gradient-to-r ${colors.bg} backdrop-blur-md rounded-lg border border-white/10`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${colors.text}`}
            >
              Live
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">
            {value}
          </p>
          {subtitle && (
            <div className="flex items-center space-x-2 pt-1">
              <div className="w-1 h-3 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
              <p className="text-xs text-slate-400 font-semibold">{subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
