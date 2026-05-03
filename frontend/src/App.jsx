import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import { Calendar, MapPin, User, Home, Menu, X, LogOut, ChevronDown, Sparkles, Ticket, Moon, Sun, Mail, MessageCircle } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DarkModeProvider, useDarkMode } from "./context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/user/ProfilePage";
import EventsPage from "./pages/events/EventsPage";
import EventDetailsPage from "./pages/events/EventDetailsPage";
import ManageEvents from "./pages/admin/ManageEvents";
import VenuesPage from "./pages/events/VenuesPage";
import ManageVenues from "./pages/admin/ManageVenues";
import BookingsPage from "./pages/user/BookingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AboutPage from "./pages/info/AboutPage";
import FAQPage from "./pages/info/FAQPage";
import ContactPage from "./pages/info/ContactPage";
import TermsPage from "./pages/info/TermsPage";
import PrivacyPage from "./pages/info/PrivacyPage";
import SmartHelp from "./components/chat/SmartHelp";
import LiveChat from "./components/chat/LiveChat";
import EventCountdown from "./components/events/EventCountdown";

// ─── Navigation ───────────────────────────────────────────────────────────────
const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
        : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 dark:shadow-none border-b border-slate-200/50 dark:border-slate-800/50 py-2"
          : "bg-white dark:bg-slate-950 border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-xl text-slate-900 hover:opacity-85 transition-opacity"
            aria-label="UniEvents home"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">UniEvents</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>
              <Home className="w-4 h-4" /> Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              <Calendar className="w-4 h-4" /> Events
            </NavLink>
            <NavLink to="/venues" className={navLinkClass}>
              <MapPin className="w-4 h-4" /> Venues
            </NavLink>
            {user && (
              <NavLink to="/bookings" className={navLinkClass}>
                <Ticket className="w-4 h-4" /> My Bookings
              </NavLink>
            )}
          </nav>

          {/* Desktop user area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode toggle */}
            <DarkModeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl font-bold text-sm hover:border-indigo-500 transition-all duration-200 cursor-pointer group shadow-sm"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-2xl py-2 animate-fade-up z-50 overflow-hidden" role="menu">
                    <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">{user.role}</span>
                      </div>
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200"
                        role="menuitem"
                      >
                        <User className="w-4 h-4" /> View Profile
                      </Link>
                      <Link
                        to="/bookings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all duration-200"
                        role="menuitem"
                      >
                        <Ticket className="w-4 h-4" /> My Bookings
                      </Link>
                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 cursor-pointer"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="btn-primary" id="nav-login-btn">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white animate-fade-in px-4 pb-4 pt-2 space-y-1">
          <NavLink to="/" end className={navLinkClass}><Home className="w-4 h-4" /> Home</NavLink>
          <NavLink to="/events" className={navLinkClass}><Calendar className="w-4 h-4" /> Events</NavLink>
          <NavLink to="/venues" className={navLinkClass}><MapPin className="w-4 h-4" /> Venues</NavLink>
          {user && <NavLink to="/bookings" className={navLinkClass}><Ticket className="w-4 h-4" /> My Bookings</NavLink>}

          <div className="pt-3 border-t border-slate-100 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                  {user.name} - <span className="text-slate-400 text-xs">{user.role}</span>
                </div>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary w-full justify-center">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="bg-slate-900 dark:bg-black text-slate-400 border-t border-slate-800 mt-auto relative overflow-hidden">
    {/* Abstract background glow */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
    
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl text-white tracking-tight">UniEvents</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 mb-8 max-w-sm">
            Empowering the next generation of campus organizers. Discover, book, and enjoy the best events SLIIT has to offer with our seamless management platform.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Prabhash", "Shehani03", "Ayesha", "IT21012624", "ITP 2026"].map((tag) => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-700/50">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Column */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Platform</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Browse Events</Link></li>
            <li><Link to="/venues" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Campus Venues</Link></li>
            <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Our Story</Link></li>
            <li><Link to="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-200">Support Center</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-violet-400 mb-6">Connect</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <span>support@unievents.lk</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-slate-400" />
              </div>
              <Link to="/contact" className="hover:text-white transition">Contact team</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-slate-500">
          Copyright {new Date().getFullYear()} UniEvents Management System. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link to="/terms" className="text-xs text-slate-500 hover:text-indigo-400 transition">Terms</Link>
          <Link to="/privacy" className="text-xs text-slate-500 hover:text-indigo-400 transition">Privacy</Link>
          <div className="w-px h-4 bg-slate-800" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">ITP student project</p>
        </div>
      </div>
    </div>
  </footer>
);

// ─── App Shell ────────────────────────────────────────────────────────────────
const AppShell = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminDashboard && <Navigation />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/manage-venues" element={<ManageVenues />} />
          <Route path="/bookings/*" element={<BookingsPage />} />
          <Route path="/dashboard/*" element={<AdminDashboard />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>
      {!isAdminDashboard && <Footer />}

      {/* Global widgets — only visible to logged-in users */}
      {!isAdminDashboard && user && (
        <>
          <SmartHelp />
          <LiveChat />
          <EventCountdown />
        </>
      )}
    </div>
  );
};

// ─── Dark Mode Toggle ─────────────────────────────────────────────────────────
const DarkModeToggle = () => {
  const { dark, toggle } = useDarkMode();
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition cursor-pointer"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      id="dark-mode-toggle"
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <DarkModeProvider>
        <AuthProvider>
          <Router>
            <AppShell />
          </Router>
        </AuthProvider>
      </DarkModeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
