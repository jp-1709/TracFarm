import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "./api";
import { useTheme } from "../context/ThemeContext";
import { Sprout, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const isValidEmail = (val) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(val);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setMessage("If this email is registered, a reset link has been sent.");
      if (res?.resetLink) setDevLink(res.resetLink);
    } catch (e) {
      setMessage("If this email is registered, a reset link has been sent.");
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
              We'll send you a link to restore access.
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {error && (
              <p className="text-red-500 text-xs mt-2" role="alert">
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            {!loading && <Send size={16} />}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-left text-emerald-600 dark:text-emerald-400">
            <p className="font-semibold">Request Processed</p>
            <p className="text-xs mt-1">{message}</p>
            {devLink && (
              <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs break-all">
                <span className="font-bold">Dev link: </span>
                <a className="underline text-emerald-500" href={devLink}>
                  Open Reset Page
                </a>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-6 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
