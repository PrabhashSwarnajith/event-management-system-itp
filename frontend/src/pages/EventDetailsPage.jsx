import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon,
  ExternalLinkIcon, TicketIcon, CheckCircle2, AlertCircle,
  Clock, Share2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─── Loading skeleton ────────────────────────────────────────────────────────
const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
    <div className="skeleton h-5 w-32 mb-6" />
    <div className="card overflow-hidden">
      <div className="skeleton h-72 w-full" />
      <div className="p-10 space-y-4">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  </div>
);

// ─── Meta pill ───────────────────────────────────────────────────────────────
const MetaPill = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
    <Icon className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
    <div className="text-sm text-slate-700 leading-snug">{children}</div>
  </div>
);

// ─── Event Details Page ──────────────────────────────────────────────────────
const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, authFetch } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ticketCount, setTicketCount] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(""); // "" | "success" | error message
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        setEvent(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    if (!user) {
      alert("Please log in to book tickets.");
      return;
    }
    setIsBooking(true);
    setBookingStatus("");
    try {
      const res = await authFetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, ticketCount: parseInt(ticketCount) }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to book tickets");
      }
      setBookingStatus("success");
    } catch (err) {
      setBookingStatus(err.message);
    } finally {
      setIsBooking(false);
    }
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Event Not Found</h2>
          <p className="text-slate-500 mb-8">{error || "This event no longer exists."}</p>
          <Link to="/events" className="btn-primary" id="event-details-back-error">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const bannerImg =
    event.bannerUrl ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80";

  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
  const isPast = eventDateObj < new Date();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-slate-500 font-semibold text-sm hover:text-slate-800 mb-6 transition group"
        id="event-details-back-btn"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Events
      </Link>

      <div className="card overflow-hidden mb-8">
        {/* Banner */}
        <div className="relative aspect-[16/7] overflow-hidden bg-slate-100">
          <img
            src={bannerImg}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Floating badges */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {event.category && (
              <span className="badge badge-indigo shadow-md">
                {event.category}
              </span>
            )}
            {isPast && (
              <span className="badge badge-red shadow-md">Past Event</span>
            )}
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="absolute top-4 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition shadow-md cursor-pointer"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 md:p-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
            {event.title}
          </h1>

          {/* Meta pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <MetaPill icon={CalendarIcon}>
              <span className="block font-semibold text-slate-900">{formattedDate}</span>
              <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" /> {formattedTime}
              </span>
            </MetaPill>
            <MetaPill icon={MapPinIcon}>
              <span className="block font-semibold text-slate-900">
                {event.venue?.name || "No Venue Assigned"}
              </span>
              {event.venue?.location && (
                <span className="text-slate-500">{event.venue.location}</span>
              )}
            </MetaPill>
            <MetaPill icon={UsersIcon}>
              <span className="block font-semibold text-slate-900">{event.capacity} seats</span>
              <span className="text-slate-500">total capacity</span>
            </MetaPill>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">About this Event</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
              {event.description}
            </p>
          </div>

          {/* Document link */}
          {event.documentUrl && (
            <div className="mb-8">
              <a
                href={event.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition text-sm"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                View Event Schedule / Document
              </a>
            </div>
          )}


          {/* Booking panel */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {bookingStatus === "success" ? "You're registered! 🎉" : "Reserve Your Spot"}
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  {bookingStatus === "success"
                    ? "Check your bookings to view your ticket."
                    : "Secure your seat before tickets run out."}
                </p>

                {/* Status messages */}
                {bookingStatus === "success" ? (
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-2.5 font-semibold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    Booked! &nbsp;
                    <Link to="/bookings" className="underline underline-offset-2 font-bold">
                      View Ticket →
                    </Link>
                  </div>
                ) : bookingStatus ? (
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-2.5 font-semibold text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {bookingStatus}
                  </div>
                ) : null}
              </div>

              {/* Ticket count + button */}
              {!isPast && bookingStatus !== "success" && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex flex-col gap-1 flex-1 md:flex-none">
                    <label htmlFor="ticket-count" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Tickets
                    </label>
                    <select
                      id="ticket-count"
                      className="input-field py-2.5 font-bold text-slate-700 cursor-pointer"
                      value={ticketCount}
                      onChange={(e) => setTicketCount(e.target.value)}
                      disabled={isBooking}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Ticket" : "Tickets"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {user ? (
                    <button
                      onClick={handleBookTicket}
                      disabled={isBooking}
                      className="btn-primary flex-1 md:flex-none whitespace-nowrap mt-auto cursor-pointer"
                      id="event-details-book-btn"
                      aria-busy={isBooking}
                    >
                      <TicketIcon className="w-4 h-4" />
                      {isBooking ? "Booking..." : "Book Now"}
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="btn-primary flex-1 md:flex-none whitespace-nowrap mt-auto"
                      id="event-details-login-to-book"
                    >
                      Log in to Book
                    </Link>
                  )}
                </div>
              )}

              {isPast && (
                <div className="badge badge-red text-sm px-4 py-2 self-start">
                  This event has ended
                </div>
              )}
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
