import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "./api";
import { Sprout, Tractor, Truck, Store, User, Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { FRONTEND_ROLE_OPTIONS } from "../constants/roles";

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const roles = FRONTEND_ROLE_OPTIONS.map((role) => ({
    id: role.id,
    label: role.label,
    icon:
      role.id === "farmer"
        ? Tractor
        : role.id === "distributor"
        ? Truck
        : role.id === "retailer"
        ? Store
        : User,
    color:
      role.id === "farmer"
        ? "from-amber-500 to-orange-600"
        : role.id === "distributor"
        ? "from-blue-500 to-cyan-600"
        : role.id === "retailer"
        ? "from-purple-500 to-pink-600"
        : "from-emerald-500 to-teal-600",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && formData.password !== value) {
        setPasswordError("Passwords do not match!");
      } else if (name === "password" && formData.confirmPassword && formData.confirmPassword !== value) {
        setPasswordError("Passwords do not match!");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    if (!formData.role) {
      setFormError("Please select your role.");
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    setLoading(true);
    try {
      const result = await registerUser(userData);
      alert(result.message || "Registration Successful!");
      navigate("/login");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-[#080c14]" : "bg-[#f6f8fa]"}`}>
      
      {/* Left Side: Stunning Google-Style Banner (Hidden on Mobile) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16 text-white"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(8, 12, 20, 0.9), rgba(6, 78, 59, 0.8)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80')"
            : "linear-gradient(135deg, rgba(15, 157, 88, 0.95), rgba(6, 78, 59, 0.9)), url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay" />
        
        {/* Animated ambient light orb */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-8 border border-white/20 shadow-2xl backdrop-blur-md">
            <Sprout size={36} className="text-white" />
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            Join TracFarm
          </h1>
          <p className="text-xl text-emerald-100/90 mb-10 leading-relaxed font-light">
            Create an account to participate in a sustainable and transparent agricultural network.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-glow" />
              <div>
                <h4 className="font-bold text-sm">Grow and Track</h4>
                <p className="text-xs text-emerald-100/70">Farmers upload harvests with automatic QR tagging.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg transform hover:translate-x-2 transition-transform duration-300">
              <div className="w-3 h-3 bg-emerald-300 rounded-full shadow-glow" />
              <div>
                <h4 className="font-bold text-sm">Optimize Logistics</h4>
                <p className="text-xs text-emerald-100/70">Distributors and retailers manage inventories seamlessly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sleek Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative overflow-y-auto">
        {/* Ambient Blur Backgrounds */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

        <div className="w-full max-w-lg z-10 py-8">
          <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative">
            
            {/* Theme & Branding Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
                  <Sprout size={28} className="text-white" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Create Account</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select your role and begin.</p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-yellow-400 flex items-center justify-center cursor-pointer transition hover:scale-105"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  minLength="6"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Confirm Password */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 dark:border-slate-700 focus:ring-emerald-500"
                  }`}
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {passwordError}</p>
                )}
              </div>

              {/* Role Picker */}
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const IconComp = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r.id })}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          formData.role === r.id
                            ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20"
                            : "border-gray-200 dark:border-slate-800 bg-transparent hover:border-gray-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center shadow-md mb-2`}>
                          <IconComp size={18} className="text-white" />
                        </div>
                        <span className="text-xs font-bold">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
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
                disabled={loading || !formData.role}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
