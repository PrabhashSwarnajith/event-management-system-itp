import { TicketIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * BookingPanel - Booking form and status panel
 */
export const BookingPanel = ({
  user,
  isPast,
  event,
  bookingStatus,
  ticketCount,
  isBooking,
  onTicketCountChange,
  onBook,
  totalAmount,
}) => {
  return (
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
                onChange={(e) => onTicketCountChange(e.target.value)}
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
                onClick={onBook}
                disabled={isBooking}
                className="btn-primary flex-1 md:flex-none whitespace-nowrap mt-auto cursor-pointer"
                id="event-details-book-btn"
                aria-busy={isBooking}
              >
                <TicketIcon className="w-4 h-4" />
                {isBooking ? "Processing..." : totalAmount ? `Pay LKR ${totalAmount.toLocaleString()} →` : "Book Now"}
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
      </div>
    </div>
  );
};
