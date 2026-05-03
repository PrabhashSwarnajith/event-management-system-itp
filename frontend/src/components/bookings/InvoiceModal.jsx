import { X, Printer, Download } from "lucide-react";

/**
 * InvoiceModal - Display and print booking invoice
 */
export const InvoiceModal = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = booking?.bookingDate 
    ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const eventDate = booking?.event?.eventDate 
    ? new Date(booking.event.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBA";

  const confirmationCode = `BK-${booking?.id}-${new Date(booking?.bookingDate).toISOString().split("T")[0].replace(/-/g, "")}`;
  const pricePerTicket = 500; // LKR
  const totalAmount = (booking?.ticketCount || 1) * pricePerTicket;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 print:bg-white print:backdrop-blur-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Invoice"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up max-h-[90vh] overflow-y-auto print:rounded-none print:shadow-none print:max-h-full">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-violet-700 p-6 text-white flex items-center justify-between print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-900">
          <div>
            <h2 className="text-2xl font-black">BOOKING INVOICE</h2>
            <p className="text-sm opacity-90 print:text-slate-600">UniEvents Ticket Management System</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/20 transition cursor-pointer print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 print:p-0">
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-slate-200 print:border-slate-900">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Invoice Number</p>
              <p className="text-lg font-black text-slate-900">{confirmationCode}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Invoice Date</p>
              <p className="text-lg font-black text-slate-900">{invoiceDate}</p>
            </div>
          </div>

          {/* Billto */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-slate-200 print:border-slate-900">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Bill To</p>
              <div className="space-y-1">
                <p className="font-black text-slate-900">{booking?.event?.user?.name || booking?.attendeeName || "Student"}</p>
                <p className="text-sm text-slate-600">{booking?.event?.user?.email || booking?.attendeeEmail || "N/A"}</p>
                <p className="text-sm text-slate-600">Student ID: {booking?.event?.user?.studentId || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Event Details</p>
              <div className="space-y-1">
                <p className="font-black text-slate-900">{booking?.event?.title || "Event"}</p>
                <p className="text-sm text-slate-600">📅 {eventDate}</p>
                <p className="text-sm text-slate-600">📍 {booking?.event?.venue?.name || "TBA"}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="text-left py-3 px-2 font-black text-slate-900">Description</th>
                  <th className="text-center py-3 px-2 font-black text-slate-900">Qty</th>
                  <th className="text-right py-3 px-2 font-black text-slate-900">Unit Price</th>
                  <th className="text-right py-3 px-2 font-black text-slate-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 print:border-slate-900">
                  <td className="py-4 px-2 font-semibold text-slate-900">
                    Event Ticket(s) - {booking?.event?.title || "Event"}
                  </td>
                  <td className="text-center py-4 px-2 text-slate-900">{booking?.ticketCount || 1}</td>
                  <td className="text-right py-4 px-2 text-slate-900">LKR {pricePerTicket.toLocaleString()}</td>
                  <td className="text-right py-4 px-2 font-bold text-slate-900">
                    LKR {((booking?.ticketCount || 1) * pricePerTicket).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-600 py-2">
                <span>Subtotal:</span>
                <span>LKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 py-2">
                <span>Tax (0%):</span>
                <span>LKR 0.00</span>
              </div>
              <div className="flex justify-between items-center text-lg font-black text-slate-900 py-3 border-t-2 border-slate-900">
                <span>Total Due:</span>
                <span>LKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={`rounded-xl p-4 mb-8 ${
            booking?.status === "CONFIRMED" 
              ? "bg-emerald-50 border border-emerald-200" 
              : "bg-amber-50 border border-amber-200"
          }`}>
            <p className={`text-sm font-bold ${
              booking?.status === "CONFIRMED"
                ? "text-emerald-700"
                : "text-amber-700"
            }`}>
              ✓ Status: {booking?.status === "CONFIRMED" ? "CONFIRMED" : booking?.status || "PENDING"}
            </p>
          </div>

          {/* Confirmation Code */}
          <div className="bg-slate-50 rounded-xl p-4 mb-8 border-2 border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Confirmation Code</p>
            <p className="font-mono font-black text-lg text-slate-900">{confirmationCode}</p>
            <p className="text-xs text-slate-600 mt-2">Keep this code for your records. Show it at event entry.</p>
          </div>

          {/* Notes */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs font-bold text-blue-900 mb-2">📝 Important Notes:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>✓ This is a digital booking confirmation</li>
              <li>✓ Your QR ticket will be available in "My Bookings"</li>
              <li>✓ Present either this invoice or your QR code at event entry</li>
              <li>✓ For cancellation requests, contact support at least 48 hours before the event</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 print:border-slate-900 flex gap-3 justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="btn-primary flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="btn-ghost cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
