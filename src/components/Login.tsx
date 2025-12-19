import { useState } from "react";
import { Eye, EyeOff, ShoppingBag, Lock, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../contexts/LanguageContext";

interface LoginProps {
  onLogin: (user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError(t.auth.invalidCredentials);
        } else {
          setError(t.auth.networkError + ": " + error.message);
        }
        return;
      }

      if (data.user) {
        onLogin(data.user);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(t.auth.networkError);
    } finally {
      setLoading(false);
    }
  }

  //   const staffAccounts = [
  //     { name: "Hassan (Owner)", role: "Manager", email: "hassan@bookshop.ke" },
  //     { name: "Zakaria", role: "Staff", email: "zakaria@bookshop.ke" },
  //     { name: "Khaled", role: "Staff", email: "khaled@bookshop.ke" },
  //   ];

  return (
    <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 overflow-auto">
      {/* Floating Background Elements - Hidden on mobile for performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="hidden sm:block absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div
          className="hidden sm:block absolute top-3/4 right-1/4 w-36 sm:w-72 h-36 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="hidden sm:block absolute bottom-1/4 left-1/3 w-40 sm:w-80 h-40 sm:h-80 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Main Login Card */}
        <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 animate-scaleIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-rose-500 to-rose-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-br from-amber-600 via-rose-600 to-rose-700 rounded-xl p-4 shadow-lg shadow-amber-500/50">
                <ShoppingBag className="w-12 h-12 text-white mx-auto" />
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-amber-200 to-rose-200 bg-clip-text text-transparent">
              LENZRO LUXE
            </h1>
            <p className="text-amber-300/80 font-medium mt-2">
              {t.auth.staffLogin}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                📧 {t.auth.emailAddress}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 text-white placeholder-amber-300/40"
                  placeholder="Enter your email..."
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-white">
                🔒 {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-300/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-300 text-white placeholder-amber-300/40"
                  placeholder="Enter your password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white font-bold py-4 rounded-xl hover:from-amber-700 hover:via-rose-700 hover:to-rose-800 transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.messages.loggingIn}</span>
                </div>
              ) : (
                t.auth.login
              )}
            </button>
          </form>
        </div>

        {/* Staff Accounts Info */}
        {/* <div className="mt-6 bg-white/60 backdrop-blur-lg rounded-xl border border-white/20 p-6 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
            👥 Staff Accounts - Akoonada Shaqaalaha
          </h3>
          <div className="space-y-3">
            {staffAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/40 rounded-lg border border-white/30"
              >
                <div>
                  <p className="font-semibold text-slate-800">{account.name}</p>
                  <p className="text-sm text-slate-600">{account.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-slate-700">
                    {account.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-slate-600">
            <p>📱 Contact Zakaria for password details</p>
            <p className="text-xs mt-1">
              La xiriir Zakaria si aad u hesho furaha sirta ah
            </p>
          </div>
        </div> */}

        {/* Professional Credit Footer */}
        <div className="mt-8 pt-6 border-t border-white/20 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
            <span>Crafted with excellence by</span>
            <a
              href="https://lenzro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-600/20 to-rose-600/20 hover:from-amber-600/30 hover:to-rose-600/30 border border-amber-500/30 hover:border-amber-500/50 rounded-md transition-all hover:scale-105 font-bold text-amber-700 hover:text-amber-600"
            >
              <span>⚡</span>
              <span>Lenzro</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
