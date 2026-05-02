import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Building2, Calendar, CheckCircle, Home, LayoutDashboard, LogOut, RefreshCw, Ticket, Users, X, FileText } from "lucide-react";
import { OverviewSection } from "../components/admin/sections/OverviewSection";
import { UsersSection } from "../components/admin/sections/UsersSection";
import { EventsSection } from "../components/admin/sections/EventsSection";
import { VenuesSection } from "../components/admin/sections/VenuesSection";
import { BookingsSection } from "../components/admin/sections/BookingsSection";
import { ReportsSection } from "../components/admin/sections/ReportsSection";
import { useAdminData, useUserOperations, useEventOperations, useVenueOperations, useBookingOperations } from "../hooks/useAdminData";
import { emptyForms, toDateTimeLocal } from "../utils/adminUtils";

const AdminDashboard = () => {
  const { user, authFetch, logout } = useAuth();
  const navigate = useNavigate();

  // State management
  const [active, setActive] = useState("overview");
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingVenueId, setEditingVenueId] = useState(null);

  const [userForm, setUserForm] = useState(emptyForms.user);
  const [eventForm, setEventForm] = useState(emptyForms.event);
  const [venueForm, setVenueForm] = useState(emptyForms.venue);
  const [bookingForm, setBookingForm] = useState(emptyForms.booking);

  // Use hooks
  const adminData = useAdminData(authFetch);
  const userOps = useUserOperations(authFetch, (msg) => {
    showMessage(msg);
    adminData.loadData();
  });
  const eventOps = useEventOperations(authFetch, user?.id, (msg) => {
    showMessage(msg);
    adminData.loadData();
  });
  const venueOps = useVenueOperations(authFetch, (msg) => {
    showMessage(msg);
    adminData.loadData();
  });
  const bookingOps = useBookingOperations(authFetch, (msg) => {
    showMessage(msg);
    adminData.loadData();
  });

  const stats = useMemo(() => ({
    users: adminData.users.length,
    events: adminData.events.length,
    venues: adminData.venues.length,
    bookings: adminData.bookings.length
  }), [adminData.users.length, adminData.events.length, adminData.venues.length, adminData.bookings.length]);

  // Effects
  useEffect(() => {
    if (user?.role === "ADMIN") {
      adminData.loadData();
    }
  }, [user?.role]);

  // Helper functions
  const showMessage = (text) => {
    setMessage(text);
    setError("");
  };

  const closeModal = () => {
    setModal(null);
    setEditingUserId(null);
    setEditingEventId(null);
    setEditingVenueId(null);
    setUserForm(emptyForms.user);
    setEventForm(emptyForms.event);
    setVenueForm(emptyForms.venue);
    setBookingForm(emptyForms.booking);
  };

  const openCreate = (type) => {
    setActive(type);
    closeModal();
    setModal(type);
  };

  // User operations
  const handleEditUser = (row) => {
    setActive("users");
    setEditingUserId(row.id);
    setUserForm({ name: row.name || "", email: row.email || "", password: "", role: row.role || "ATTENDEE" });
    setModal("users");
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await userOps.deleteUser(id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Event operations
  const handleEditEvent = (row) => {
    setActive("events");
    setEditingEventId(row.id);
    setEventForm({
      title: row.title || "",
      description: row.description || "",
      venueId: row.venue?.id?.toString() || "",
      category: row.category || "",
      eventDate: toDateTimeLocal(row.eventDate),
      bannerUrl: row.bannerUrl || "",
      documentUrl: row.documentUrl || "",
      capacity: row.capacity?.toString() || ""
    });
    setModal("events");
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await eventOps.deleteEvent(id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Venue operations
  const handleEditVenue = (row) => {
    setActive("venues");
    setEditingVenueId(row.id);
    setVenueForm({
      name: row.name || "",
      location: row.location || "",
      capacity: row.capacity?.toString() || "",
      description: row.description || "",
      amenities: row.amenities || "",
      imageUrl: row.imageUrl || "",
      available: row.available !== false
    });
    setModal("venues");
  };

  const handleDeleteVenue = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await venueOps.deleteVenue(id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Booking operations
  const handleCancelBooking = async (id) => {
    try {
      await bookingOps.cancelBooking(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await bookingOps.deleteBooking(id);
    } catch (err) {
      setError(err.message);
    }
  };

  // Access check
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-28 text-center">
        <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-12">
          <AlertCircle className="mx-auto mb-5 h-14 w-14 text-red-400" />
          <h2 className="mb-3 text-2xl font-bold text-slate-800">Access Denied</h2>
          <p className="text-slate-500">Only administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "venues", label: "Venues", icon: Building2 },
    { id: "bookings", label: "Bookings", icon: Ticket }
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="bg-white border-r border-slate-200 p-4 lg:sticky lg:top-0 lg:h-screen">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900">Admin System</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-1 py-4" aria-label="Admin sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  active === id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="space-y-1 border-t border-slate-100 pt-4">
            <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              <Home className="h-4 w-4" />
              Student View
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/auth");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">System Administration</h1>
              <p className="mt-1 text-sm text-slate-500">Tables and actions for the whole event system.</p>
            </div>
            <button onClick={adminData.loadData} className="btn-ghost bg-white cursor-pointer">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Info Banner */}
          {adminData.usingSampleData && !adminData.loading && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              Showing frontend sample rows because the database is empty.
            </div>
          )}

          {/* Message/Error Banner */}
          {(message || error) && (
            <div
              className={`mb-5 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${
                error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span className="flex items-center gap-2">
                {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                {error || message}
              </span>
              <button
                onClick={() => {
                  setMessage("");
                  setError("");
                }}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {adminData.loading ? (
            <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Users" value={stats.users} icon={Users} onClick={() => setActive("users")} />
                <StatCard label="Events" value={stats.events} icon={Calendar} onClick={() => setActive("events")} />
                <StatCard label="Venues" value={stats.venues} icon={Building2} onClick={() => setActive("venues")} />
                <StatCard label="Bookings" value={stats.bookings} icon={Ticket} onClick={() => setActive("bookings")} />
              </div>

              {/* Sections */}
              {active === "overview" && (
                <OverviewSection
                  users={adminData.users}
                  events={adminData.events}
                  venues={adminData.venues}
                  bookings={adminData.bookings}
                />
              )}

              {active === "users" && (
                <UsersSection
                  users={adminData.users}
                  modal={modal}
                  editingUserId={editingUserId}
                  userForm={userForm}
                  setUserForm={setUserForm}
                  usingSampleData={adminData.usingSampleData}
                  onOpenCreate={openCreate}
                  onCloseModal={closeModal}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  onSave={userOps.saveUser}
                  submitting={userOps.submitting}
                  error={error}
                  setError={setError}
                />
              )}

              {active === "events" && (
                <EventsSection
                  events={adminData.events}
                  venues={adminData.venues}
                  modal={modal}
                  editingEventId={editingEventId}
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                  usingSampleData={adminData.usingSampleData}
                  onOpenCreate={openCreate}
                  onCloseModal={closeModal}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onSave={eventOps.saveEvent}
                  submitting={eventOps.submitting}
                  error={error}
                  setError={setError}
                />
              )}

              {active === "venues" && (
                <VenuesSection
                  venues={adminData.venues}
                  modal={modal}
                  editingVenueId={editingVenueId}
                  venueForm={venueForm}
                  setVenueForm={setVenueForm}
                  usingSampleData={adminData.usingSampleData}
                  onOpenCreate={openCreate}
                  onCloseModal={closeModal}
                  onEdit={handleEditVenue}
                  onDelete={handleDeleteVenue}
                  onSave={venueOps.saveVenue}
                  submitting={venueOps.submitting}
                  error={error}
                  setError={setError}
                />
              )}

              {active === "bookings" && (
                <BookingsSection
                  bookings={adminData.bookings}
                  users={adminData.users}
                  events={adminData.events}
                  modal={modal}
                  bookingForm={bookingForm}
                  setBookingForm={setBookingForm}
                  usingSampleData={adminData.usingSampleData}
                  onOpenCreate={openCreate}
                  onCloseModal={closeModal}
                  onCreateBooking={bookingOps.createBooking}
                  onCancelBooking={handleCancelBooking}
                  onDeleteBooking={handleDeleteBooking}
                  submitting={bookingOps.submitting}
                  error={error}
                  setError={setError}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-slate-300 hover:shadow-sm cursor-pointer"
  >
    <div className="mb-4 flex items-center justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-xs font-bold uppercase text-slate-400">Open</span>
    </div>
    <p className="text-sm font-semibold text-slate-500">{label}</p>
    <p className="text-3xl font-black text-slate-900">{value}</p>
  </button>
);

export default AdminDashboard;
