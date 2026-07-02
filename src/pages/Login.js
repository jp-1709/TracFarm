import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./api";
import { Eye, EyeOff, Sprout, Shield, Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  getDashboardRoute,
  isAdminRole,
  isValidFrontendRole,
  FRONTEND_ROLE_OPTIONS,
} from "../constants/roles";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!role) {
      setFormError("Please select your role to continue.");
      return;
    }
    setLoading(true);

    try {
      const user = await loginUser(email, password, role);
      setUser(user);

      if (!user.role) {
        throw new Error("No role received from backend");
      }

      if (isAdminRole(user.role)) {
        navigate("/admin-dashboard");
        return;
      }

      if (!isValidFrontendRole(user.role)) {
        throw new Error(`Invalid user role: ${user.role}`);
      }

      const dashboardPath = getDashboardRoute(user.role);
      if (!dashboardPath) {
        throw new Error("Invalid user role - no dashboard found");
      }

      navigate(dashboardPath);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-[#080c14]" : "bg-[#f6f8fa]"}`}>
      
      {/* Left Side: Stunning Google-Style Banner (Hidden on Mobile) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 text-white"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(8, 12, 20, 0.9), rgba(6, 78, 59, 0.8)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')"
            : "linear-gradient(135deg, rgba(15, 157, 88, 0.95), rgba(6, 78, 59, 0.9)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay" />
        
        {/* Animated ambient light orb */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 border border-white/20 shadow-2xl backdrop-blur-md">
            <Sprout size={36} className="text-white" />
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            TracFarm
          </h1>
          <p className="text-xl text-emerald-100/90 mb-10 leading-relaxed font-light">
            AI-driven agricultural supply chain traceability network. Secure, transparent, and decentralized.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-glow" />
              <div>
                <h4 className="font-bold text-sm">Real-time Tracking</h4>
                <p className="text-xs text-emerald-100/70">From cultivation to consumption logs.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-glow" />
              <div>
                <h4 className="font-bold text-sm">AI Freshness Scanner</h4>
                <p className="text-xs text-emerald-100/70">Instant computer-vision analysis of crops.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-glow" />
              <div>
                <h4 className="font-bold text-sm">Role-Based Dashboard Integration</h4>
                <p className="text-xs text-emerald-100/70">Cohesive pipelines for Farmers, Distributors & Customers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sleek Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        {/* Ambient Blur Backgrounds */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative">
            
            {/* Theme & Branding Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
                  <Sprout size={28} className="text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to trace your supply chain.</p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-yellow-400 flex items-center justify-center cursor-pointer transition hover:scale-105"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Password */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  style={{
                    backgroundColor: isDark ? "#090d16" : "#ffffff",
                    color: isDark ? "#ffffff" : "#1a202c",
                  }}
                >
                  <option value="">Choose your workspace role</option>
                  {FRONTEND_ROLE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                  <option value="admin">Administrator (Governance Only)</option>
                </select>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs text-left font-medium">
                  {formError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
