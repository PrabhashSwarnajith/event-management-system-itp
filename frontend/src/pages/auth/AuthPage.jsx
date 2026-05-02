import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Mail, Sparkles, Eye, EyeOff, BookOpen, GraduationCap } from "lucide-react";

const API = "http://localhost:8080";

// Google OAuth Simulation — Realistic-looking popup with SLIIT student accounts
const GOOGLE_DEMO_ACCOUNTS = [
  { email: "ashan@unievents.lk", name: "Ashan Perera", dept: "Information Technology", initials: "AP", color: "#6366f1" },
  { email: "dilhani@unievents.lk", name: "Dilhani Fernando", dept: "Software Engineering", initials: "DF", color: "#0ea5e9" },
  { email: "kasun@unievents.lk", name: "Kasun Rajapaksa", dept: "Computer Science", initials: "KR", color: "#059669" },
  { email: "admin@unievents.lk", name: "Admin User", dept: "Administrator", initials: "AU", color: "#dc2626" },
];

const simulateGoogleLogin = () => {
  return new Promise((resolve) => {
    const accounts = GOOGLE_DEMO_ACCOUNTS;
    const popup = window.open("", "google-auth", "width=480,height=580,left=200,top=100");
    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Sign in - Google Accounts</title>
            <meta charset="UTF-8">
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body {
                font-family: 'Google Sans', 'Roboto', Arial, sans-serif;
                background: #f8f9fa;
                display: flex; align-items: center; justify-content: center;
                min-height: 100vh; padding: 20px;
              }
              .card {
                background: white; border-radius: 28px; padding: 40px 32px;
                width: 100%; max-width: 420px;
                box-shadow: 0 2px 6px 2px rgba(60,64,67,.15), 0 1px 2px rgba(60,64,67,.3);
              }
              .google-logo { display: flex; justify-content: center; margin-bottom: 24px; }
              .google-logo svg { width: 75px; height: 24px; }
              h1 { color: #202124; font-size: 24px; font-weight: 400; text-align: center; margin-bottom: 8px; }
              .subtitle { color: #5f6368; font-size: 16px; text-align: center; margin-bottom: 28px; }
              .account-list { list-style: none; }
              .account-item {
                display: flex; align-items: center; gap: 16px;
                padding: 14px 16px; border-radius: 12px;
                cursor: pointer; transition: background 0.15s;
                margin-bottom: 4px;
              }
              .account-item:hover { background: #f8f9fa; }
              .avatar {
                width: 44px; height: 44px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: white; font-weight: 700; font-size: 16px;
                flex-shrink: 0;
              }
              .account-info { flex: 1; min-width: 0; }
              .account-name { color: #202124; font-size: 15px; font-weight: 500; }
              .account-email { color: #5f6368; font-size: 13px; margin-top: 2px; }
              .account-dept { color: #1a73e8; font-size: 11px; margin-top: 2px; font-weight: 500; }
              .divider { height: 1px; background: #e8eaed; margin: 20px 0; }
              .footer { text-align: center; }
              .footer p { color: #5f6368; font-size: 12px; line-height: 1.5; }
              .footer a { color: #1a73e8; text-decoration: none; }
              .arrow { color: #5f6368; opacity: 0.6; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="google-logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 272 92">
                  <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                  <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                  <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                  <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                  <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.70-8.23-4.70-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                  <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.46.36 15.03 16.32-.5 35.29-.5c10.49 0 17.96 4.12 23.54 9.41l-6.62 6.62c-4.01-3.78-9.44-6.72-16.92-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.08z" fill="#4285F4"/>
                </svg>
              </div>
              <h1>Sign in</h1>
              <p class="subtitle">Choose a UniEvents account</p>
              <ul class="account-list">
                ${accounts.map(a => `
                  <li class="account-item" onclick="selectUser('${a.email}','${a.name}')">
                    <div class="avatar" style="background:${a.color}">${a.initials}</div>
                    <div class="account-info">
                      <div class="account-name">${a.name}</div>
                      <div class="account-email">${a.email}</div>
                      <div class="account-dept">${a.dept}</div>
                    </div>
                    <span class="arrow">›</span>
                  </li>
                `).join("")}
              </ul>
              <div class="divider"></div>
              <div class="footer">
                <p>
                  <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
                </p>
                <p style="margin-top:8px">UniEvents · SLIIT ITP Demo</p>
              </div>
            </div>
            <script>
              function selectUser(email, name) {
                window.opener.postMessage({ email, name }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }

    const handleMessage = (event) => {
      if (event.data?.email) {
        window.removeEventListener("message", handleMessage);
        resolve(event.data);
      }
    };
    window.addEventListener("message", handleMessage);

    setTimeout(() => {
      window.removeEventListener("message", handleMessage);
      resolve(null);
    }, 60000);
  });
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", studentId: "", department: "", role: "ATTENDEE"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Authentication failed");

      login(data);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const googleUser = await simulateGoogleLogin();
      if (!googleUser) { setGoogleLoading(false); return; }

      // Determine password based on account (demo accounts have predictable passwords)
      const passwordMap = {
        "admin@unievents.lk": "Admin@12345",
        "ashan@unievents.lk": "Ashan@12345",
        "dilhani@unievents.lk": "Student@12345",
        "kasun@unievents.lk": "Student@12345",
      };
      const password = passwordMap[googleUser.email] || "Student@12345";

      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleUser.email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google account not linked. Please sign in with email first.");

      login(data);
      navigate(data.role === "ADMIN" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "", studentId: "", department: "", role: "ATTENDEE" });
  };

  const DEPARTMENTS = [
    "Information Technology",
    "Computer Science",
    "Software Engineering",
    "Information Systems",
    "Computer Engineering",
    "Business IT",
    "Data Science",
  ];

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
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm mb-6 animate-fade-in" role="alert">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-200 rounded-xl py-2.5 text-slate-700 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition mb-4 cursor-pointer disabled:opacity-60"
            id="google-auth-btn"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name — signup only */}
            {!isLogin && (
              <div className="animate-fade-up">
                <label htmlFor="auth-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
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

            {/* Student ID — signup only */}
            {!isLogin && (
              <div className="animate-fade-up grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-student-id" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Student ID
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="auth-student-id"
                      type="text"
                      className="input-field pl-9"
                      placeholder="IT21XXX"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="auth-dept" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>
                  <select
                    id="auth-dept"
                    className="input-field"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
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

          {/* Demo credentials hint */}
          {isLogin && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
              <p className="font-bold text-slate-700 mb-1">Demo Credentials:</p>
              <p>🔑 Admin: <strong>admin@unievents.lk</strong> / <strong>Admin@12345</strong></p>
              <p>👤 Student: <strong>ashan@unievents.lk</strong> / <strong>Ashan@12345</strong></p>
            </div>
          )}

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

        <p className="text-center text-xs text-slate-400 mt-4">
          UniEvents — University Event Management System · ITP Group Project
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
