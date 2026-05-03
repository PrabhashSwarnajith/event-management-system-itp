import { useState } from "react";
import { Building2, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import PaymentModal from "./PaymentModal";
import { InvoiceModal } from "../bookings/InvoiceModal";

/**
 * VenueBookingModal - Venue booking flow with payment
 */
export const VenueBookingModal = ({ venue, user, authFetch, onClose }) => {
  const [step, setStep] = useState("details"); // details | payment | success
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    purpose: "",
    expectedGuests: 50,
  });
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const venueRent = 5000; // LKR per day
  const daysBooked = bookingData.startDate && bookingData.endDate 
    ? Math.max(1, Math.ceil((new Date(bookingData.endDate) - new Date(bookingData.startDate)) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalAmount = daysBooked * venueRent;

  const handleBooking = async () => {
    setError("");
    
    if (!bookingData.startDate || !bookingData.endDate) {
      setError("Please select booking dates");
      return;
    }

    if (new Date(bookingData.endDate) <= new Date(bookingData.startDate)) {
      setError("End date must be after start date");
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setShowPayment(false);
    setIsBooking(true);

    try {
      // Create a venue booking record
      const bookingRecord = {
        venueName: venue.name,
        venueLocation: venue.location,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        purpose: bookingData.purpose,
        expectedGuests: bookingData.expectedGuests,
        totalAmount: totalAmount,
        daysBooked: daysBooked,
        status: paymentData.paymentMethod === "CASH_AT_GATE" ? "PENDING_PAYMENT" : "CONFIRMED",
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId || `VENUE-${Date.now()}`,
        bookingDate: new Date().toISOString(),
        id: Date.now(), // Simple ID for demo
      };

      setConfirmedBooking(bookingRecord);
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5" />
              <p className="text-sm font-bold uppercase tracking-wider opacity-70">Venue Booking</p>
            </div>
            <h2 className="text-xl font-black">{venue.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/20 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {step === "details" && (
          <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {/* Venue info */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Capacity</p>
              <p className="font-black text-lg text-slate-900">{venue.capacity} people</p>
              <p className="text-xs text-slate-600 mt-1">{venue.location}</p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Check-in Date *
              </label>
              <input
                type="date"
                required
                value={bookingData.startDate}
                onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Check-out Date *
              </label>
              <input
                type="date"
                required
                value={bookingData.endDate}
                onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                min={bookingData.startDate || new Date().toISOString().split("T")[0]}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>

            {/* Expected Guests */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Expected Guests
              </label>
              <input
                type="number"
                min="1"
                max={venue.capacity}
                value={bookingData.expectedGuests}
                onChange={(e) => setBookingData({ ...bookingData, expectedGuests: parseInt(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Event Purpose
              </label>
              <select
                value={bookingData.purpose}
                onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              >
                <option value="">Select purpose...</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="party">Party/Celebration</option>
                <option value="meeting">Meeting</option>
                <option value="seminar">Seminar</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Cost Summary */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-700 uppercase mb-3">Pricing</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700">LKR {venueRent.toLocaleString()} × {daysBooked} day{daysBooked > 1 ? "s" : ""}</span>
                  <span className="font-bold text-emerald-700">LKR {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-lg text-emerald-900 pt-2 border-t border-emerald-200">
                  <span>Total:</span>
                  <span>LKR {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-white text-base transition cursor-pointer"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              Proceed to Payment →
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="font-black text-slate-900 text-xl">Booking Confirmed!</p>
            <p className="text-sm text-slate-500 text-center">
              Your venue booking for {daysBooked} day{daysBooked > 1 ? "s" : ""} is confirmed.
            </p>
            <div className="w-full bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold">✓ Booking reference generated</p>
            </div>
            <button
              onClick={onClose}
              className="w-full btn-primary cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          booking={{ ticketCount: daysBooked, eventTitle: venue.name }}
          amount={totalAmount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
          authFetch={authFetch}
        />
      )}
    </div>
  );
};
