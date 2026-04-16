import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, User, LayoutDashboard, Home } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";

import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ManageEvents from "./pages/ManageEvents";

// Placeholder Pages for Team Members
const HomePage = () => <div className="p-10 text-center text-slate-800"><h1>Welcome to Uni Events</h1><p className="mt-2 text-slate-500">Discover and book tickets for upcoming university events.</p></div>;
// Member 3
const VenuesPage = () => <div className="p-10 text-center"><h2>Venues Management (Member 3)</h2></div>;
// Member 4
const BookingsPage = () => <div className="p-10 text-center"><h2>My Bookings (Member 4)</h2></div>;
// Member 5
const AdminDashboard = () => <div className="p-10 text-center"><h2>Admin Dashboard & Payments (Member 5)</h2></div>;

const Navigation = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
        <Calendar className="w-6 h-6" />
        <span>UniEvents</span>
      </div>
      <div className="flex gap-6 text-sm font-medium text-slate-600">
        <Link to="/" className="hover:text-indigo-600 flex items-center gap-1"><Home className="w-4 h-4" /> Home</Link>
        <Link to="/events" className="hover:text-indigo-600 flex items-center gap-1"><Calendar className="w-4 h-4" /> Events</Link>
        <Link to="/venues" className="hover:text-indigo-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> Venues</Link>
        {user && <Link to="/bookings" className="hover:text-indigo-600 flex items-center gap-1"><Ticket className="w-4 h-4" /> Bookings</Link>}
        {user?.role === 'ADMIN' && <Link to="/dashboard" className="hover:text-indigo-600 flex items-center gap-1"><LayoutDashboard className="w-4 h-4" /> Admin</Link>}
      </div>
      <div>
        {user ? (
          <Link to="/profile" className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold hover:bg-indigo-100 transition flex items-center gap-2 text-sm border border-indigo-100">
            <User className="w-4 h-4" /> {user.name}
          </Link>
        ) : (
          <Link to="/auth" className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium">
            <User className="w-4 h-4" /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
          <Navigation />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/manage-events" element={<ManageEvents />} />
              <Route path="/venues/*" element={<VenuesPage />} />
              <Route path="/bookings/*" element={<BookingsPage />} />
              <Route path="/dashboard/*" element={<AdminDashboard />} />
            </Routes>
          </main>

          <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm mt-auto">
            <p>&copy; {new Date().getFullYear()} UniEvents - Group Assignment</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
