import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  FileText,
  LogOut,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { translations } from "../utils/translations";
import { useLanguage } from "../contexts/LanguageContext";
import { usePendingOrdersCount } from "../hooks/useSupabaseQuery";

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({
  children,
  activeTab,
  onTabChange,
}: LayoutProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(true);

  // ✅ Use cached query for pending orders count (reduces egress costs)
  const { data: pendingOrdersCount = 0 } = usePendingOrdersCount();

  // Check if current user is admin or staff (mutually exclusive)
  const isAdmin = user?.email === "galiyowabi@gmail.com";
  const isStaff = user?.email === "khalid123@gmail.com";

  // Dynamic tabs based on user role
  const baseTabs = [
    // Only show one dashboard tab per role
    ...(isAdmin
      ? [
          {
            id: "dashboard",
            label: translations.navigation.dashboard,
            icon: LayoutDashboard,
            color: "from-amber-600 to-rose-600",
          },
        ]
      : []),
    ...(isStaff
      ? [
          {
            id: "staff-dashboard",
            label: translations.navigation.mySales,
            icon: TrendingUp,
            color: "from-emerald-600 to-cyan-600",
          },
        ]
      : []),
    {
      id: "inventory",
      label: translations.navigation.inventory,
      icon: Package,
      color: "from-blue-600 to-cyan-600",
    },
    // {
    //   id: "cyber-services",
    //   label: "Adeegyada Cyber-ka",
    //   icon: Monitor,
    //   color: "from-cyan-600 to-blue-600",
    // },
    {
      id: "sales",
      label: translations.navigation.sales,
      icon: ShoppingCart,
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: "returns",
      label: translations.navigation.returns,
      icon: RotateCcw,
      color: "from-rose-600 to-red-600",
    },
    // {
    //   id: "search",
    //   label: translations.navigation.search,
    //   icon: Search,
    //   color: "from-amber-600 to-rose-600",
    // },
    // {
    //   id: "customer-credit",
    //   label: translations.navigation.customerCredit,
    //   icon: CreditCard,
    //   color: "from-teal-600 to-cyan-600",
    // },
  ];

  const adminTabs = [
    // {
    //   id: "orders",
    //   label: translations.navigation.orders,
    //   icon: ClipboardList,
    //   color: "from-orange-600 to-amber-600",
    // },
    // {
    //   id: "financial-dashboard",
    //   label: translations.navigation.financialDashboard,
    //   icon: LayoutDashboard,
    //   color: "from-cyan-600 to-blue-600",
    // },
    // {
    //   id: "expenses",
    //   label: translations.navigation.expenses,
    //   icon: DollarSign,
    //   color: "from-red-600 to-rose-600",
    // },
    // {
    //   id: "investments",
    //   label: translations.navigation.investments,
    //   icon: PiggyBank,
    //   color: "from-green-600 to-emerald-600",
    // },
    // {
    //   id: "debts",
    //   label: translations.navigation.debts,
    //   icon: Banknote,
    //   color: "from-amber-600 to-yellow-600",
    // },
    {
      id: "reports",
      label: translations.navigation.reports,
      icon: FileText,
      color: "from-indigo-600 to-blue-600",
    },
    // {
    //   id: "user-activity",
    //   label: "Staff Activity",
    //   icon: Activity,
    //   color: "from-rose-600 to-pink-600",
    // },
  ];

  const tabs = isAdmin ? [...baseTabs, ...adminTabs] : baseTabs;

  // ✅ Real-time subscription is handled inside usePendingOrdersCount hook
  // No need for manual fetching - React Query auto-refetches every 2 minutes

  const getStaffName = (email: string) => {
    if (email.includes("galiyowabi") || email.includes("admin"))
      return "Yussuf Muse (Admin)";
    if (email.includes("khaled")) return "Khaled";
    return email.split("@")[0];
  };

  const handleLogout = async () => {
    if (confirm(translations.auth.confirmLogout)) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements - Luxury */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-500/30 to-rose-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-full blur-3xl"
          style={{ animation: "pulse 8s ease-in-out infinite" }}
        ></div>
      </div>

      {/* Desktop Sidebar - Modern Elegant Design with Collapse */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${
          isDesktopSidebarCollapsed ? "w-20" : "w-72 xl:w-80"
        }`}
      >
        <div className="h-full bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-r border-white/20 shadow-2xl overflow-y-auto scrollbar-hide relative">
          {/* Collapse Toggle Button - Enhanced Visibility */}
          <button
            onClick={() =>
              setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)
            }
            className="fixed bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 p-2 rounded-full shadow-2xl shadow-amber-500/50 hover:shadow-amber-400/70 hover:scale-125 transition-all duration-200 z-50 ring-2 ring-white/30 hover:ring-white/50"
            style={{
              top: isDesktopSidebarCollapsed ? "50%" : "24px",
              left: isDesktopSidebarCollapsed ? "68px" : "calc(18rem - 12px)",
              transform: isDesktopSidebarCollapsed
                ? "translateY(-50%)"
                : "none",
            }}
            aria-label={
              isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {isDesktopSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white drop-shadow-lg" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white drop-shadow-lg" />
            )}
          </button>

          {/* Brand Header */}
          <div className="p-6 border-b border-white/10">
            {!isDesktopSidebarCollapsed ? (
              <>
                <div className="hidden lg:flex items-center justify-center mb-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-rose-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-amber-600 to-rose-600 p-3 rounded-2xl shadow-xl">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-black text-white">
                      LENZRO LUXE
                    </h1>
                    <p className="text-xs text-amber-300 font-medium">
                      Fashion & Luxury
                    </p>
                  </div>
                </div>

                {/* User Info Card */}
                {user && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-75"></div>
                        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-full border-2 border-white/20">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {getStaffName(user.email || "")}
                        </p>
                        <p className="text-xs text-amber-300">
                          {isAdmin ? "Administrator" : "Staff"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center">
                <div className="relative bg-gradient-to-br from-amber-600 to-rose-600 p-3 rounded-2xl shadow-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const showBadge = tab.id === "orders" && pendingOrdersCount > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    group w-full flex items-center ${
                      isDesktopSidebarCollapsed
                        ? "justify-center"
                        : "justify-between"
                    } px-4 py-3 rounded-xl font-semibold text-sm
                    transition-all duration-300 relative overflow-hidden
                    ${
                      isActive
                        ? "text-white shadow-xl"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                  title={isDesktopSidebarCollapsed ? tab.label : undefined}
                >
                  {/* Active Background Gradient */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100`}
                    ></div>
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>

                  {/* Content */}
                  <div
                    className={`relative flex items-center ${
                      isDesktopSidebarCollapsed ? "" : "space-x-3"
                    }`}
                  >
                    <div
                      className={`${
                        isActive
                          ? "bg-white/20"
                          : "bg-white/10 group-hover:bg-white/15"
                      } p-2 rounded-lg transition-colors duration-300 relative`}
                    >
                      <Icon className="w-4 h-4" />
                      {/* Notification Badge */}
                      {showBadge && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg animate-pulse">
                          {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                        </span>
                      )}
                    </div>
                    {!isDesktopSidebarCollapsed && <span>{tab.label}</span>}
                  </div>

                  {/* Badge for expanded sidebar */}
                  {!isDesktopSidebarCollapsed && showBadge && (
                    <div className="relative">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                        {pendingOrdersCount}
                      </span>
                    </div>
                  )}

                  {/* Arrow Indicator */}
                  {isActive && !isDesktopSidebarCollapsed && (
                    <ChevronRight className="relative w-4 h-4 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <button
              onClick={handleLogout}
              className={`w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-rose-500/50 flex items-center ${
                isDesktopSidebarCollapsed
                  ? "justify-center"
                  : "justify-center space-x-2"
              }`}
              title={isDesktopSidebarCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!isDesktopSidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar (fixed on scroll) */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/70">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo, Brand & Mobile Language Selector */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 p-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="flex items-center space-x-2 min-w-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-rose-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gradient-to-br from-amber-600 to-rose-600 p-2 rounded-xl shadow-xl">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-sm font-black text-white truncate max-w-[160px]">
                    LENZRO LUXE
                  </h1>
                  <p className="text-xs text-amber-300 font-medium">
                    Fashion System
                  </p>
                </div>
              </div>

              {/* Mobile Language Toggle - with navigation */}
              <div className="inline-flex items-center gap-1 bg-slate-900/80 border border-white/30 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-slate-100 ml-1">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    language === "en"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("so")}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    language === "so"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  SO
                </button>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  {/* Order Notification Badge - Mobile Navbar */}
                  {pendingOrdersCount > 0 && (
                    <div className="relative">
                      <button
                        onClick={() => onTabChange("orders")}
                        className="relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 p-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
                      >
                        <ClipboardList className="w-4 h-4 text-white" />
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                          {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                        </span>
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-75"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-2 rounded-full border-2 border-white/20">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-xl"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar - Glassmorphic */}
      <div
        className={`
          fixed top-16 bottom-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar Content */}
        <div className="relative h-full bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-r border-white/20 shadow-2xl overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
            {/* User Info in Sidebar */}
            {user && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-75"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-full border-2 border-white/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {getStaffName(user.email || "")}
                    </p>
                    <p className="text-xs text-amber-300">
                      {isAdmin ? "Administrator" : "Staff"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
                Navigation
              </p>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const showBadge = tab.id === "orders" && pendingOrdersCount > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm
                      transition-all duration-300 relative
                      ${
                        isActive
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-xl`
                          : "text-slate-200 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Icon className="w-5 h-5" />
                        {/* Notification Badge for mobile */}
                        {showBadge && (
                          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg animate-pulse">
                            {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                          </span>
                        )}
                      </div>
                      <span>{tab.label}</span>
                      {showBadge && (
                        <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse ml-auto">
                          {pendingOrdersCount}
                        </span>
                      )}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main
        className={`relative transition-all duration-300 ${
          isDesktopSidebarCollapsed ? "lg:ml-20" : "lg:ml-72 xl:ml-80"
        } ${
          // Mobile-first top padding (4rem on mobile, 5rem on md+)
          "pt-16 md:pt-20"
        }`}
      >
        {/* Desktop Top Navbar (fixed on scroll) */}
        <div
          className={`hidden lg:block fixed top-0 right-0 z-40 transition-all duration-300 bg-slate-900/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/70 ${
            isDesktopSidebarCollapsed ? "left-20" : "left-72 xl:left-80"
          }`}
        >
          <div className="flex items-center justify-between px-8 h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-rose-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-br from-amber-600 to-rose-600 p-2 rounded-xl shadow-xl">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-lg font-black text-white tracking-wide">
                LENZRO LUXE
              </h1>
              <span className="text-xs text-amber-300 font-medium ml-2">
                Fashion & Luxury
              </span>
            </div>
            {/* Desktop Language Selector - subtle */}
            <div className="inline-flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm hover:bg-white/10 transition-all">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === "en"
                    ? "bg-white/20 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("so")}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  language === "so"
                    ? "bg-white/20 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                SO
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-screen flex flex-col">
          <div className="flex-1 px-3 sm:px-4 lg:px-6 py-3 md:py-4 lg:py-6 max-w-[1600px] mx-auto w-full">
            {/* Desktop Top Bar with Language Selector */}
            <div className="hidden lg:flex items-center justify-end mb-4">
              <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-1 py-0.5 text-[11px] font-semibold text-slate-100">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-0.5 rounded-full transition-all ${
                    language === "en"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("so")}
                  className={`px-3 py-0.5 rounded-full transition-all ${
                    language === "so"
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-200 hover:bg-white/10"
                  }`}
                >
                  SO
                </button>
              </div>
            </div>

            {children}
          </div>

          {/* Professional Footer Credit */}
          <footer className="mt-auto py-4 border-t border-white/10 backdrop-blur-xl bg-white/5">
            <div className="px-3 sm:px-4 lg:px-6 max-w-[1600px] mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 text-xs sm:text-sm text-slate-300">
                <p className="text-center sm:text-left">
                  {translations.footer.allRightsReserved}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {translations.footer.designedBy}
                  </span>
                  <a
                    href="https://lenzro.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600/20 to-rose-600/20 hover:from-amber-600/30 hover:to-rose-600/30 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition-all hover:scale-105 font-semibold text-amber-300 hover:text-amber-200 shadow-lg"
                  >
                    <span className="text-lg">⚡</span>
                    <span>Lenzro</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
