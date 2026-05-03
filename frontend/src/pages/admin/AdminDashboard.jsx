import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, Building2, Calendar, CheckCircle, Home, LayoutDashboard, LogOut, RefreshCw, Ticket, Users, X, FileText, MessageCircle } from "lucide-react";
import LiveChatPanel from "../../components/admin/LiveChatPanel";
import { OverviewSection } from "../../components/admin/sections/OverviewSection";
import { UsersSection } from "../../components/admin/sections/UsersSection";
import { EventsSection } from "../../components/admin/sections/EventsSection";
import { VenuesSection } from "../../components/admin/sections/VenuesSection";
import { BookingsSection } from "../../components/admin/sections/BookingsSection";
import { ReportsSection } from "../../components/admin/sections/ReportsSection";
import { useAdminData, useUserOperations, useEventOperations, useVenueOperations, useBookingOperations } from "../../hooks/useAdminData";
import { emptyForms, toDateTimeLocal } from "../../utils/adminUtils";

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

  const stats = useMemo(() => {
    const publishedEvents = adminData.events.filter((event) => event.status !== "DRAFT" && event.status !== "CANCELLED").length;
    const availableVenues = adminData.venues.filter((venue) => venue.available !== false).length;
    const confirmedBookings = adminData.bookings.filter((booking) => booking.status !== "CANCELLED").length;
    const totalCapacity = adminData.venues.reduce((sum, venue) => sum + Number(venue.capacity || 0), 0);

    return {
      users: adminData.users.length,
      events: adminData.events.length,
      venues: adminData.venues.length,
      bookings: adminData.bookings.length,
      publishedEvents,
      availableVenues,
      confirmedBookings,
      totalCapacity
    };
  }, [adminData.users, adminData.events, adminData.venues, adminData.bookings]);

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
      capacity: row.capacity?.toString() || "",
      status: row.status || "PUBLISHED"
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
    { id: "overview", label: "Overview", icon: LayoutDashboard, description: "Charts, quick stats, and recent records for project review." },
    { id: "users", label: "Users", icon: Users, description: "Admin CRUD for student accounts, roles, and login access." },
    { id: "events", label: "Events", icon: Calendar, description: "Create, edit, publish, and remove campus event records." },
    { id: "venues", label: "Venues", icon: Building2, description: "Manage venue capacity, availability, amenities, and review-ready data." },
    { id: "bookings", label: "Bookings", icon: Ticket, description: "Create admin bookings, cancel reservations, and check ticket counts." },
    { id: "reports", label: "Reports", icon: FileText, description: "Download CSV reports for users, events, venues, bookings, and summary metrics." },
    { id: "livechat", label: "Live Support", icon: MessageCircle, description: "Monitor live support messages from students.", badge: true },
  ];
  const activeSection = sections.find((section) => section.id === active) || sections[0];
  const dataNotice = adminData.error
    ? `Backend data could not be loaded (${adminData.error}). Showing sample rows so the dashboard can still be reviewed.`
    : adminData.usingSampleData
      ? "Showing frontend sample rows because the database is empty."
      : "";

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
            {sections.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
                  active === id ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {badge && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
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
        <main className="min-w-0 flex flex-col p-4 sm:p-6 lg:p-8" style={{ minHeight: "100vh" }}>
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-wide text-indigo-600">Admin Dashboard</p>
                <h1 className="text-3xl font-black text-slate-900">{activeSection.label}</h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">{activeSection.description}</p>
              </div>
              <button onClick={adminData.loadData} className="btn-ghost bg-white cursor-pointer">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Info Banner */}
          {dataNotice && !adminData.loading && (
            <div
              className={`mb-5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold ${
                adminData.error ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-700"
              }`}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{dataNotice}</span>
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
              {/* Stats Grid — hidden on livechat page */}
              {active !== "livechat" && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="Users"
                    value={stats.users}
                    description="Registered accounts"
                    icon={Users}
                    tone="indigo"
                    onClick={() => setActive("users")}
                  />
                  <StatCard
                    label="Events"
                    value={stats.events}
                    description={`${stats.publishedEvents} published`}
                    icon={Calendar}
                    tone="cyan"
                    onClick={() => setActive("events")}
                  />
                  <StatCard
                    label="Venues"
                    value={stats.venues}
                    description={`${stats.availableVenues} available / ${stats.totalCapacity} seats`}
                    icon={Building2}
                    tone="emerald"
                    onClick={() => setActive("venues")}
                  />
                  <StatCard
                    label="Bookings"
                    value={stats.bookings}
                    description={`${stats.confirmedBookings} confirmed`}
                    icon={Ticket}
                    tone="amber"
                    onClick={() => setActive("bookings")}
                  />
                </div>
              )}

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
              {active === "reports" && (
                <ReportsSection
                  users={adminData.users}
                  events={adminData.events}
                  venues={adminData.venues}
                  bookings={adminData.bookings}
                />
              )}

              {active === "livechat" && (
                <div className="flex-1 min-h-0" style={{ height: "calc(100vh - 220px)" }}>
                  <LiveChatPanel adminName={user.name || "Admin"} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, description, icon: Icon, tone, onClick }) => {
  const tones = {
    indigo:  { wrap: "bg-indigo-50 border-indigo-200",  icon: "bg-indigo-600 text-white",   val: "text-indigo-700", hover: "hover:border-indigo-400" },
    cyan:    { wrap: "bg-sky-50 border-sky-200",         icon: "bg-sky-600 text-white",      val: "text-sky-700",    hover: "hover:border-sky-400" },
    emerald: { wrap: "bg-emerald-50 border-emerald-200", icon: "bg-emerald-600 text-white",  val: "text-emerald-700",hover: "hover:border-emerald-400" },
    amber:   { wrap: "bg-amber-50 border-amber-200",     icon: "bg-amber-500 text-white",    val: "text-amber-700",  hover: "hover:border-amber-400" },
  };
  const t = tones[tone] || tones.indigo;

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-xl border ${t.wrap} ${t.hover} p-5 text-left transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.icon} shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-3xl font-black ${t.val}`}>{value}</span>
      </div>
      <p className="text-sm font-bold text-slate-700">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Open →</span>
      </div>
    </button>
  );
};

export default AdminDashboard;
