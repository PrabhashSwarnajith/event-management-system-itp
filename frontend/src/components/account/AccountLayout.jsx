import { Link, NavLink, useNavigate } from "react-router-dom";
import { Calendar, LogOut, Ticket, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AccountLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
          <aside className="bg-white border border-slate-200 rounded-lg p-4 h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 truncate">{user?.name || "Account"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1" aria-label="Account navigation">
              <NavLink to="/profile" className={linkClass}>
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Profile</span>
              </NavLink>
              <NavLink to="/bookings" className={linkClass}>
                <Ticket className="w-4 h-4 flex-shrink-0" />
                <span>My Bookings</span>
              </NavLink>
              <Link to="/events" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>Browse Events</span>
              </Link>
            </nav>

            <div className="border-t border-slate-100 mt-4 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
