import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountLayout from "../../components/account/AccountLayout";
import { CalendarIcon, TicketIcon, AlertCircle } from "lucide-react";
import { TicketModal } from "../../components/bookings/TicketModal";
import { InvoiceModal } from "../../components/bookings/InvoiceModal";
import { BookingCard } from "../../components/bookings/BookingCard";
import { BookingsTabBar } from "../../components/bookings/BookingsTabBar";
import { BookingsList } from "../../components/bookings/BookingsList";

const BookingsPage = () => {
  const { user, authFetch } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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

  const handleViewInvoice = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedInvoice(booking);
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
  const visibleBookings = bookings.filter((booking) => {
    const eventDate = new Date(booking.event?.eventDate);
    if (activeTab === "past") return eventDate < now;
    if (activeTab === "cancelled") return booking.status === "CANCELLED";
    return eventDate >= now && booking.status !== "CANCELLED";
  });

  const tabCounts = {
    upcoming: bookings.filter((b) => new Date(b.event?.eventDate) >= now && b.status !== "CANCELLED").length,
    past: bookings.filter((b) => new Date(b.event?.eventDate) < now).length,
    cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <AccountLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">My Bookings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track all your event reservations.</p>
          </div>
          <Link to="/events" className="btn-primary whitespace-nowrap" id="bookings-browse-more">
            <CalendarIcon className="w-4 h-4" /> Browse Events
          </Link>
        </div>

        {/* Tabs */}
        <BookingsTabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabCounts={tabCounts}
        />

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
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Bookings Yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't booked any events. Start exploring!</p>
            <Link to="/events" className="btn-primary" id="bookings-empty-cta">Browse Events</Link>
          </div>
        ) : visibleBookings.length === 0 ? (
          <div className="card border-dashed py-16 text-center animate-fade-up">
            <p className="text-slate-500 font-medium">No {activeTab} bookings to show.</p>
          </div>
        ) : (
          <BookingsList
            bookings={visibleBookings}
            onViewTicket={handleViewTicket}
            onViewInvoice={handleViewInvoice}
            onCancel={handleCancelBooking}
          />
        )}

        {/* Ticket modal */}
        {selectedTicket && (
          <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
        )}

        {/* Invoice modal */}
        {selectedInvoice && (
          <InvoiceModal booking={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        )}
      </div>
    </AccountLayout>
  );
};

export default BookingsPage;
