import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import { Calendar, MapPin, Ticket, User, LayoutDashboard, Home, Menu, X, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ManageEvents from "./pages/ManageEvents";
import VenuesPage from "./pages/VenuesPage";
import ManageVenues from "./pages/ManageVenues";
import BookingsPage from "./pages/BookingsPage";
import HomePage from "./pages/HomePage";

// ─── Admin Dashboard placeholder ─────────────────────────────────────────────
const AdminDashboard = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 text-center">
    <div className="card p-12">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
        <LayoutDashboard className="w-8 h-8 text-indigo-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
      <p className="text-slate-500">Payments & analytics coming soon.</p>
    </div>
  </div>
);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150 ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-transparent"
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
            {user?.role === "ADMIN" && (
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4" /> Admin
              </NavLink>
            )}
          </nav>

          {/* Desktop user area */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl font-semibold text-sm hover:bg-slate-100 transition cursor-pointer"
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
                  <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl py-1 animate-fade-in z-50" role="menu">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{user.role}</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                      role="menuitem"
                    >
                      <User className="w-4 h-4 text-slate-400" /> View Profile
                    </Link>
                    {(user.role === "ORGANIZER" || user.role === "ADMIN") && (
                      <Link
                        to="/manage-events"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                        role="menuitem"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" /> Manage Events
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
                id="nav-login-btn"
              >
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
          {user?.role === "ADMIN" && <NavLink to="/dashboard" className={navLinkClass}><LayoutDashboard className="w-4 h-4" /> Admin</NavLink>}

          <div className="pt-3 border-t border-slate-100 mt-2">
            {user ? (
              <div className="space-y-1">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                  <User className="w-4 h-4" /> {user.name}
                </Link>
                {(user.role === "ORGANIZER" || user.role === "ADMIN") && (
                  <Link to="/manage-events" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                    <Calendar className="w-4 h-4" /> Manage Events
                  </Link>
                )}
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
  <footer className="bg-slate-900 text-slate-400 mt-auto">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl text-white">UniEvents</span>
          </div>
          <p className="text-sm leading-relaxed">
            The all-in-one platform for discovering, booking, and managing university events.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/events" className="hover:text-white transition">Browse Events</Link></li>
            <li><Link to="/venues" className="hover:text-white transition">Venues</Link></li>
            <li><Link to="/bookings" className="hover:text-white transition">My Bookings</Link></li>
          </ul>
        </div>

        {/* Organizers */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Organizers</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/manage-events" className="hover:text-white transition">Manage Events</Link></li>
            <li><Link to="/manage-venues" className="hover:text-white transition">Manage Venues</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} UniEvents — Group ITP Assignment</p>
        <p>Built with React + Spring Boot</p>
      </div>
    </div>
  </footer>
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
