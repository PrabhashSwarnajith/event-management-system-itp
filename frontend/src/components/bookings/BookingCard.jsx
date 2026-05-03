import { CalendarIcon, MapPinIcon, TicketIcon, XCircleIcon, ReceiptText, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const BookingCard = ({ booking, onViewTicket, onViewInvoice, onCancel }) => {
  const STATUS_STYLES = {
    CONFIRMED: "badge-green",
    CANCELLED: "badge-red",
    PENDING:   "badge-amber",
  };

  const eventDateObj  = new Date(booking.event?.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isPast        = eventDateObj < new Date();

  return (
    <article className="flex flex-col sm:flex-row rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-black/30 transition-shadow duration-200 animate-fade-up group">

      {/* Image */}
      <div className="w-full sm:w-40 h-44 sm:h-auto bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
        <img
          src={booking.event?.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"}
          alt={booking.event?.title || "Event"}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between min-w-0">
        <div>
          {/* Title + badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {booking.event?.title}
            </h3>
            <span className={`badge ${STATUS_STYLES[booking.status] || "badge-slate"} shrink-0`}>
              {booking.status}
            </span>
          </div>

          {/* Meta */}
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mb-4">
            <li className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {formattedDate}
              <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                <Clock className="w-3 h-3" /> {formattedTime}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {booking.event?.venue?.name || "No Venue"}
            </li>
            <li className="flex items-center gap-2">
              <TicketIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              {booking.ticketCount} {booking.ticketCount === 1 ? "Ticket" : "Tickets"}
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={`/events/${booking.event?.id}`}
            className="btn-ghost text-xs py-1.5 px-3"
            id={`booking-view-event-${booking.id}`}
          >
            View Event <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => onViewTicket(booking.id)}
            className="btn-ghost text-xs py-1.5 px-3 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
            id={`booking-view-ticket-${booking.id}`}
          >
            <ReceiptText className="w-3.5 h-3.5" /> View Ticket
          </button>

          <button
            onClick={() => onViewInvoice(booking.id)}
            className="btn-ghost text-xs py-1.5 px-3 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
            id={`booking-view-invoice-${booking.id}`}
          >
            <ReceiptText className="w-3.5 h-3.5" /> Invoice
          </button>

          {!isPast && booking.status === "CONFIRMED" && (
            <button
              onClick={() => onCancel(booking.id)}
              className="btn-ghost text-xs py-1.5 px-3 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
              id={`booking-cancel-${booking.id}`}
            >
              <XCircleIcon className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
