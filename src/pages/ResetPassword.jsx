import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "./api";
import { useTheme } from "../context/ThemeContext";
import { Sprout, Check, ShieldAlert } from "lucide-react";

const passwordValid = (pwd) => {
  const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\][|;:'",.<>/?]).{8,}$/;
  return re.test(pwd);
};

const ResetPassword = () => {
  const { isDark } = useTheme();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token missing.");
      return;
    }
    if (!passwordValid(password)) {
      setError(
        "Password must be 8+ characters, including at least one uppercase letter, one digit, and one special character."
      );
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      alert("Password updated successfully. Please sign in with your new credentials.");
      navigate("/login");
    } catch (e) {
      setError(e.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? "bg-[#080c14]" : "bg-[#f6f8fa]"}`}>
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      
      <div className="w-full max-w-md glass-panel p-8 shadow-2xl relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-emerald-500 to-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Sprout className="text-white" size={28} />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">Reset Password</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your new credentials below.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs text-left font-medium flex gap-2 items-start">
              <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
            {!loading && <Check size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
