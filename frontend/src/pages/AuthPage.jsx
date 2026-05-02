import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "ATTENDEE" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "", role: "ATTENDEE" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-slate-500 text-sm">
            {isLogin
              ? "Sign in to manage your event bookings"
              : "Join UniEvents and discover campus life"}
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-xl shadow-slate-200/50">
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm mb-6 animate-fade-in"
              role="alert"
            >
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name field — signup only */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label htmlFor="auth-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    className="input-field pl-10"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Role — signup only */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label htmlFor="auth-role" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  I am an...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["ATTENDEE"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                        formData.role === role
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                      aria-pressed={formData.role === role}
                    >
                      <User className="w-4 h-4" />
                      Attendee
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder="you@university.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="input-field pl-10 pr-11"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 h-11 text-base cursor-pointer"
              id="auth-submit-btn"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
              id="auth-toggle-mode"
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </div>

        {/* Demo note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          UniEvents — University Event Management System
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
