import { Link, NavLink, useNavigate } from "react-router-dom";
import { Calendar, LogOut, Ticket, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AccountLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLink = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
    }`;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6">

          {/* Sidebar */}
          <aside className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 h-fit lg:sticky lg:top-24">
            {/* User info */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate text-sm">{user?.name || "Account"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              <NavLink to="/profile" className={navLink}>
                <User className="w-4 h-4 shrink-0" />
                Profile
              </NavLink>
              <NavLink to="/bookings" className={navLink}>
                <Ticket className="w-4 h-4 shrink-0" />
                My Bookings
              </NavLink>
              <Link
                to="/events"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              >
                <Calendar className="w-4 h-4 shrink-0" />
                Browse Events
              </Link>
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
