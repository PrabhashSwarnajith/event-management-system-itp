import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon, MapPinIcon, TicketIcon, XCircleIcon, ReceiptTextIcon } from "lucide-react";

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
      const response = await authFetch("http://localhost:8080/api/bookings/my-bookings");
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCancelBooking = async (id) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      const response = await authFetch(`http://localhost:8080/api/bookings/${id}/cancel`, {
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }
      
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewTicket = async (id) => {
    setTicketError("");
    try {
      const response = await authFetch(`http://localhost:8080/api/bookings/${id}/ticket`);
      if (!response.ok) {
        throw new Error("Failed to load ticket");
      }
      setSelectedTicket(await response.json());
    } catch (err) {
      setTicketError(err.message);
    }
  };

  const now = new Date();
  const visibleBookings = bookings.filter((booking) => {
    const eventDate = new Date(booking.event?.eventDate);
    if (activeTab === "past") {
      return eventDate < now;
    }
    if (activeTab === "cancelled") {
      return booking.status === "CANCELLED";
    }
    return eventDate >= now && booking.status !== "CANCELLED";
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Please Log In</h2>
          <p className="text-slate-500 mb-6">You must be logged in to view your bookings.</p>
          <Link to="/auth" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">My Bookings</h1>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold capitalize rounded-md transition ${
                activeTab === tab ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6">
             <TicketIcon size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No Bookings Yet</h2>
          <p className="text-slate-500 mb-8">You haven't booked any events. Start exploring!</p>
          <Link to="/events" className="inline-flex rounded-lg bg-indigo-600 px-8 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
            Browse Events
          </Link>
        </div>
      ) : visibleBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-2">No {activeTab} bookings</h2>
          <p className="text-slate-500">Bookings in this section will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm">
              <div className="w-full md:w-48 h-48 md:h-auto bg-slate-100 shrink-0">
                 <img 
                   src={booking.event?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"} 
                   alt={booking.event?.title}
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{booking.event?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid gap-2 text-sm font-medium text-slate-600 mt-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={16} className="text-indigo-500" /> 
                      {new Date(booking.event?.eventDate).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon size={16} className="text-indigo-500" /> 
                      {booking.event?.venue?.name || "No Venue"}
                    </div>
                    <div className="flex items-center gap-2">
                      <TicketIcon size={16} className="text-indigo-500" /> 
                      {booking.ticketCount} {booking.ticketCount === 1 ? 'Ticket' : 'Tickets'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100">
                  <Link to={`/events/${booking.event?.id}`} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition text-center w-full md:w-auto">
                    View Event
                  </Link>
                  <button
                    onClick={() => handleViewTicket(booking.id)}
                    className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 transition flex justify-center items-center gap-2 w-full md:w-auto"
                  >
                    <ReceiptTextIcon size={16} /> Ticket
                  </button>
                  {booking.status === 'CONFIRMED' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-300 transition flex justify-center items-center gap-2 w-full md:w-auto"
                    >
                      <XCircleIcon size={16} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {ticketError && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {ticketError}
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Booking Ticket</p>
                <h2 className="text-2xl font-extrabold text-slate-900">{selectedTicket.eventTitle}</h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-slate-500">Code</span><strong>{selectedTicket.confirmationCode}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Attendee</span><strong>{selectedTicket.attendeeName}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Venue</span><strong>{selectedTicket.venueName}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Event Date</span><strong>{new Date(selectedTicket.eventDate).toLocaleString()}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Tickets</span><strong>{selectedTicket.ticketCount}</strong></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><strong>{selectedTicket.status}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
