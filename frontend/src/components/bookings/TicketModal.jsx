import { TicketIcon, XCircleIcon } from "lucide-react";
import QRCode from "react-qr-code";

/**
 * TicketModal - Displays booking ticket with QR code
 */
export const TicketModal = ({ ticket, onClose }) => {
  const STATUS_STYLES = {
    CONFIRMED: "badge-green",
    CANCELLED: "badge-red",
    PENDING: "badge-amber",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Booking ticket"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
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

        {/* Body */}
        <div className="rounded-b-2xl bg-white border border-t-0 border-slate-200 shadow-2xl p-6">
          {/* QR Code */}
          <div className="flex flex-col items-center justify-center mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200">
              <QRCode
                value={`CONFIRMATION:${ticket.confirmationCode}|EVENT:${ticket.eventTitle}|TICKETS:${ticket.ticketCount}`}
                size={120}
                level="M"
              />
            </div>
            <p className="text-xs text-slate-400 mt-3 font-semibold uppercase tracking-widest">Scan to verify</p>
          </div>

          {/* Details */}
          <dl className="grid gap-3 text-sm mb-6">
            {[
              { label: "Confirmation Code", value: ticket.confirmationCode, mono: true },
              { label: "Attendee", value: ticket.attendeeName },
              { label: "Venue", value: ticket.venueName },
              {
                label: "Event Date",
                value: new Date(ticket.eventDate).toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
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
            className="btn-ghost w-full justify-center cursor-pointer"
            id="ticket-modal-close"
          >
            Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
