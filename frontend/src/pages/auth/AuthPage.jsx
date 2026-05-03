import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Mail, Sparkles, Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const API = "http://localhost:8080";


// ─── Validation ───────────────────────────────────────────────────────────────
const validateLogin = ({ email, password }) => {
  const errs = {};
  if (!email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
  if (!password) errs.password = "Password is required.";
  else if (password.length < 6) errs.password = "Password must be at least 6 characters.";
  return errs;
};

const validateSignup = ({ name, email, password, studentId }) => {
  const errs = {};
  if (!name.trim()) errs.name = "Full name is required.";
  else if (name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
  if (!email.trim()) errs.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";
  if (studentId && !/^[A-Za-z]{1,3}\d{5,8}$/.test(studentId))
    errs.studentId = "Format: IT21XXXXX (letters + numbers).";
  if (!password) errs.password = "Password is required.";
  else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
  else if (!/[A-Z]/.test(password)) errs.password = "Must contain at least one uppercase letter.";
  else if (!/\d/.test(password)) errs.password = "Must contain at least one number.";
  return errs;
};

// ─── Field Component ─────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
    {children}
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 animate-fade-in">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ─── Password Strength ────────────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-500"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score-1] : "bg-slate-200 dark:bg-slate-700"}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">{labels[score-1] || "Too weak"}</p>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "Information Technology",
  "Computer Science",
  "Software Engineering",
  "Information Systems",
  "Computer Engineering",
  "Business IT",
  "Data Science",
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", studentId: "", department: "", role: "ATTENDEE" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const errs = isLogin ? validateLogin(formData) : validateSignup(formData);
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed. Please check your credentials.");

      if (!isLogin) {
        setSuccess("Account created! Signing you in...");
        await new Promise(r => setTimeout(r, 800));
      }
      login(data);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/");
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Real Google OAuth via @react-oauth/google ────────────────────────────────
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setServerError("");
      try {
        // Fetch the user's profile from Google
        const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await profileRes.json();
        if (!profile.email) throw new Error("Could not retrieve email from Google.");

        // Send the Google token to our backend for verification and login
        const res = await fetch(`${API}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email:     profile.email,
            name:      profile.name,
            googleId:  profile.sub,
            imageUrl:  profile.picture,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Google sign-in failed. Please try email/password.");
        login(data);
        navigate(data.role === "ADMIN" ? "/dashboard" : "/");
      } catch (err) {
        setServerError(err.message);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setServerError("Google sign-in was cancelled or failed. Please try again.");
      setGoogleLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    setServerError("");
    setGoogleLoading(true);
    googleLogin();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setServerError("");
    setSuccess("");
    setFieldErrors({});
    setFormData({ name: "", email: "", password: "", studentId: "", department: "", role: "ATTENDEE" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="w-full max-w-md animate-fade-up">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
            {isLogin ? "Welcome back 👋" : "Join UniEvents 🎓"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Sign in to your student account" : "Create your account and discover campus life"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 p-7">

          {/* Server Error */}
          {serverError && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-sm mb-5 animate-fade-in" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl text-sm mb-5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition mb-4 cursor-pointer disabled:opacity-60"
            id="google-auth-btn"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name — signup only */}
            {!isLogin && (
              <Field label="Full Name" error={fieldErrors.name}>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  <input
                    id="auth-name"
                    type="text"
                    autoComplete="name"
                    className={`input-field !pl-10 ${fieldErrors.name ? "error" : ""}`}
                    placeholder="Prabhash Swarnajith"
                    value={formData.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
              </Field>
            )}

            {/* Student ID + Department — signup only */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Student ID" error={fieldErrors.studentId}>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                    <input
                      id="auth-student-id"
                      type="text"
                      className={`input-field !pl-9 ${fieldErrors.studentId ? "error" : ""}`}
                      placeholder="IT21XXXXX"
                      value={formData.studentId}
                      onChange={(e) => update("studentId", e.target.value.toUpperCase())}
                    />
                  </div>
                </Field>
                <Field label="Department" error={fieldErrors.department}>
                  <select
                    id="auth-dept"
                    className="input-field"
                    value={formData.department}
                    onChange={(e) => update("department", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {/* Email */}
            <Field label="Email Address" error={fieldErrors.email}>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  className={`input-field !pl-10 ${fieldErrors.email ? "error" : ""}`}
                  placeholder={isLogin ? "you@unievents.lk" : "your.studentid@sliit.lk"}
                  value={formData.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
            </Field>

            {/* Password */}
            <Field label="Password" error={fieldErrors.password}>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className={`input-field !pl-10 !pr-11 ${fieldErrors.password ? "error" : ""}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => update("password", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isLogin && <PasswordStrength password={formData.password} />}
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1 h-11 text-base cursor-pointer"
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

          {/* Demo credentials */}
          {isLogin && (
            <div className="mt-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-xl p-3 text-xs">
              <p className="font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Demo student login
              </p>
              <p className="text-indigo-600 dark:text-indigo-400">
                <span className="font-mono bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">shehani03@unievents.lk</span>
                {" / "}
                <span className="font-mono bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded">Student@12345</span>
              </p>
            </div>
          )}

          {/* Switch mode */}
          <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer"
              id="auth-toggle-mode"
            >
              {isLogin ? "Sign up here" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-5">
          UniEvents · University Event Management System · SLIIT ITP Group Project
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
