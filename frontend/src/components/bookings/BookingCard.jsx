import { CalendarIcon, MapPinIcon, TicketIcon, XCircleIcon, ReceiptText, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * BookingCard - Individual booking card with actions
 */
export const BookingCard = ({ booking, onViewTicket, onCancel }) => {
  const STATUS_STYLES = {
    CONFIRMED: "badge-green",
    CANCELLED: "badge-red",
    PENDING: "badge-amber",
  };

  const eventDateObj = new Date(booking.event?.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const isPast = eventDateObj < new Date();

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

          {!isPast && booking.status === "CONFIRMED" && (
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
