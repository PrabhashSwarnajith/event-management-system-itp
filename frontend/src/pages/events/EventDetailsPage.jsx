import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon,
  ExternalLinkIcon, Clock, Share2, AlertCircle, CheckCircle,
  QrCode, Ticket
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LoadingSkeleton, MetaPill } from "../../components/events/EventDetailsComponents";
import { BookingPanel } from "../../components/events/BookingPanel";
import EventReviews from "../../components/events/EventReviews";
import PaymentModal from "../../components/ui/PaymentModal";
import QRCode from "react-qr-code";

const TICKET_PRICE_PER_SEAT = 250; // LKR

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, authFetch } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(""); // "" | "success" | error string
  const [isBooking, setIsBooking] = useState(false);

  // Payment gateway
  const [showPayment, setShowPayment] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  // QR ticket after booking
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showQR, setShowQR] = useState(false);

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

  // Step 1: Click "Book Now" → open payment modal
  const handleBookTicket = async () => {
    if (!user) {
      alert("Please log in to book tickets.");
      return;
    }
    setShowPayment(true);
    setPendingBooking({ ticketCount: parseInt(ticketCount), eventTitle: event.title });
  };

  // Step 2: Payment success → create booking → show QR
  const handlePaymentSuccess = async (paymentData) => {
    setShowPayment(false);
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
        throw new Error(errData.message || "Failed to confirm booking");
      }

      const booking = await res.json();
      setConfirmedBooking({
        ...booking,
        transactionId: paymentData.transactionId,
        eventTitle: event.title,
        venueName: event.venue?.name,
        eventDate: event.eventDate,
      });
      setBookingStatus("success");
      setShowQR(true);
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

  const bannerImg = event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80";
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
  const isPast = eventDateObj < new Date();
  const totalAmount = ticketCount * TICKET_PRICE_PER_SEAT;

  // QR ticket content
  const qrData = confirmedBooking
    ? JSON.stringify({
        bookingId: confirmedBooking.id,
        event: confirmedBooking.eventTitle,
        attendee: user?.name,
        tickets: confirmedBooking.ticketCount,
        txn: confirmedBooking.transactionId,
      })
    : "";

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
          <img src={bannerImg} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {event.category && (
              <span className="badge badge-indigo shadow-md">{event.category}</span>
            )}
            {isPast && <span className="badge badge-red shadow-md">Past Event</span>}
          </div>

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

          {/* Ticket price info */}
          {!isPast && (
            <div className="mb-6 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700">
                <Ticket className="w-4 h-4" />
                <span className="text-sm font-semibold">Ticket Price</span>
              </div>
              <span className="font-black text-indigo-700">LKR {TICKET_PRICE_PER_SEAT.toLocaleString()} / person</span>
            </div>
          )}

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

          {/* QR Ticket (post-booking) */}
          {showQR && confirmedBooking && (
            <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-emerald-800 text-lg">Booking Confirmed!</h3>
              </div>
              <p className="text-emerald-700 text-sm mb-5">
                Show this QR code at the event entrance. Your ticket is also saved in My Bookings.
              </p>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-md inline-block">
                  <QRCode value={qrData} size={160} />
                </div>
              </div>
              <div className="text-xs text-emerald-600 space-y-1">
                <p><strong>Booking ID:</strong> #{confirmedBooking.id}</p>
                <p><strong>Transaction:</strong> {confirmedBooking.transactionId}</p>
                <p><strong>Tickets:</strong> {confirmedBooking.ticketCount}</p>
              </div>
              <div className="mt-4 flex justify-center gap-3">
                <Link to="/bookings" className="btn-primary text-sm cursor-pointer">
                  <QrCode className="w-4 h-4" /> My Bookings
                </Link>
                <button
                  onClick={() => setShowQR(false)}
                  className="btn-ghost text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Booking panel */}
          {!showQR && (
            <BookingPanel
              user={user}
              isPast={isPast}
              event={event}
              bookingStatus={bookingStatus}
              ticketCount={ticketCount}
              isBooking={isBooking}
              onTicketCountChange={setTicketCount}
              onBook={handleBookTicket}
              totalAmount={totalAmount}
            />
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-7 md:p-10">
        <EventReviews eventId={id} />
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          booking={pendingBooking}
          amount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
          authFetch={authFetch}
        />
      )}
    </div>
  );
};

export default EventDetailsPage;
