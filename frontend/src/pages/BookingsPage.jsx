import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon, MapPinIcon, TicketIcon,
  XCircleIcon, ReceiptText, ArrowRight,
  Clock, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

// Status badge colour map
const STATUS_STYLES = {
  CONFIRMED: "badge-green",
  CANCELLED: "badge-red",
  PENDING:   "badge-amber",
};

// ─── Ticket Modal ────────────────────────────────────────────────────────────
const TicketModal = ({ ticket, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in"
    role="dialog"
    aria-modal="true"
    aria-label="Booking ticket"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-md animate-fade-up">
      {/* Ticket header */}
      <div className="rounded-t-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <TicketIcon className="w-5 h-5 opacity-70" />
            <span className="text-sm font-bold uppercase tracking-wider opacity-70">Event Ticket</span>
          </div>
          <h2 className="text-2xl font-black leading-snug">{ticket.eventTitle}</h2>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="flex items-center bg-white border-x border-slate-200">
        <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 -translate-x-2.5" />
        <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-1" />
        <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 translate-x-2.5" />
      </div>

      {/* Ticket body */}
      <div className="rounded-b-2xl bg-white border border-t-0 border-slate-200 shadow-2xl p-6">
        <dl className="grid gap-3 text-sm">
          {[
            { label: "Confirmation Code", value: ticket.confirmationCode, mono: true },
            { label: "Attendee", value: ticket.attendeeName },
            { label: "Venue", value: ticket.venueName },
            {
              label: "Event Date",
              value: new Date(ticket.eventDate).toLocaleString("en-US", {
                weekday: "short", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit",
              }),
            },
            { label: "Tickets", value: ticket.ticketCount },
            { label: "Status", value: ticket.status, badge: STATUS_STYLES[ticket.status] || "badge-slate" },
          ].map(({ label, value, mono, badge }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <dt className="text-slate-400 font-medium shrink-0">{label}</dt>
              <dd className={`font-bold text-slate-900 text-right ${mono ? "font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded" : ""}`}>
                {badge ? <span className={`badge ${badge}`}>{value}</span> : value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          onClick={onClose}
          className="btn-ghost w-full justify-center mt-6 cursor-pointer"
          id="ticket-modal-close"
        >
          Close Ticket
        </button>
      </div>
    </div>
  </div>
);

// ─── Booking Card ────────────────────────────────────────────────────────────
const BookingCard = ({ booking, onViewTicket, onCancel }) => {
  const eventDateObj = new Date(booking.event?.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <article className="card overflow-hidden flex flex-col sm:flex-row animate-fade-up group">
      {/* Image */}
      <div className="w-full sm:w-40 h-40 sm:h-auto bg-slate-100 shrink-0 overflow-hidden">
        <img
          src={booking.event?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"}
          alt={booking.event?.title || "Event"}
          loading="lazy"
          className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
              {booking.event?.title}
            </h3>
            <span className={`badge ${STATUS_STYLES[booking.status] || "badge-slate"} shrink-0`}>
              {booking.status}
            </span>
          </div>

          <ul className="space-y-1.5 text-sm text-slate-600 mb-4">
            <li className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              {formattedDate}
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formattedTime}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              {booking.event?.venue?.name || "No Venue"}
            </li>
            <li className="flex items-center gap-2">
              <TicketIcon className="w-4 h-4 text-indigo-400 shrink-0" />
              {booking.ticketCount} {booking.ticketCount === 1 ? "Ticket" : "Tickets"}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          <Link
            to={`/events/${booking.event?.id}`}
            className="btn-ghost text-sm py-2 px-3 cursor-pointer"
            id={`booking-view-event-${booking.id}`}
          >
            View Event <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => onViewTicket(booking.id)}
            className="btn-ghost text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-sm py-2 px-3 cursor-pointer"
            id={`booking-view-ticket-${booking.id}`}
          >
            <ReceiptText className="w-4 h-4" /> View Ticket
          </button>

          {booking.status === "CONFIRMED" && (
            <button
              onClick={() => onCancel(booking.id)}
              className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 text-sm py-2 px-3 cursor-pointer"
              id={`booking-cancel-${booking.id}`}
            >
              <XCircleIcon className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

// ─── Bookings Page ────────────────────────────────────────────────────────────
const BookingsPage = () => {
  const { user, authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketError, setTicketError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/bookings/my-bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      setBookings(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
    else setLoading(false);
  }, [user]);

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await authFetch(`http://localhost:8080/api/bookings/${id}/cancel`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to cancel booking");
      fetchBookings();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewTicket = async (id) => {
    setTicketError("");
    try {
      const res = await authFetch(`http://localhost:8080/api/bookings/${id}/ticket`);
      if (!res.ok) throw new Error("Failed to load ticket");
      setSelectedTicket(await res.json());
    } catch (err) {
      setTicketError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <TicketIcon className="w-14 h-14 text-slate-300 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Please Log In</h2>
          <p className="text-slate-500 mb-6">You must be logged in to view your bookings.</p>
          <Link to="/auth" className="btn-primary" id="bookings-login-cta">Log In Now</Link>
        </div>
      </div>
    );
  }

  const now = new Date();
  const tabs = ["upcoming", "past", "cancelled"];

  const visibleBookings = bookings.filter((booking) => {
    const eventDate = new Date(booking.event?.eventDate);
    if (activeTab === "past") return eventDate < now;
    if (activeTab === "cancelled") return booking.status === "CANCELLED";
    return eventDate >= now && booking.status !== "CANCELLED";
  });

  // Tab counts
  const tabCounts = {
    upcoming: bookings.filter((b) => new Date(b.event?.eventDate) >= now && b.status !== "CANCELLED").length,
    past: bookings.filter((b) => new Date(b.event?.eventDate) < now).length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
        <div>
          <h1 className="text-4xl font-black text-slate-900">My Bookings</h1>
          <p className="text-slate-500 mt-1">Track all your event reservations.</p>
        </div>
        <Link to="/events" className="btn-primary whitespace-nowrap" id="bookings-browse-more">
          <CalendarIcon className="w-4 h-4" /> Browse Events
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-8 animate-fade-up" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            id={`bookings-tab-${tab}`}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold capitalize rounded-lg transition-all duration-150 cursor-pointer ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
            {tabCounts[tab] > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {tabCounts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Ticket error */}
      {ticketError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold mb-6 animate-fade-in" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0" /> {ticketError}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card border-dashed py-24 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <TicketIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Bookings Yet</h2>
          <p className="text-slate-500 mb-6">You haven't booked any events. Start exploring!</p>
          <Link to="/events" className="btn-primary" id="bookings-empty-cta">Browse Events</Link>
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="card border-dashed py-16 text-center animate-fade-up">
          <p className="text-slate-500 font-medium">No {activeTab} bookings to show.</p>
        </div>
      ) : (
        <div className="space-y-5 stagger">
          {visibleBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewTicket={handleViewTicket}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}

      {/* Ticket modal */}
      {selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default BookingsPage;
