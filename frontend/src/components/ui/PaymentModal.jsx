import { useState } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle, X, Loader2, Shield } from "lucide-react";

const API = "http://localhost:8080/api";

/**
 * PaymentModal — Stripe-like payment gateway UI.
 * Member 4 (Ruwan) unique feature: Simulated card payment flow.
 */
const PaymentModal = ({ booking, amount, onSuccess, onClose, authFetch }) => {
  const [step, setStep] = useState("form"); // form | processing | success | error
  const [form, setForm] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "CARD",
  });
  const [error, setError] = useState("");

  // Format card number with spaces every 4 digits
  const formatCardNumber = (val) => {
    return val
      .replace(/\D/g, "")
      .substring(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Format expiry MM/YY
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 2) return digits.substring(0, 2) + "/" + digits.substring(2);
    return digits;
  };

  const getCardBrand = (num) => {
    const n = num.replace(/\s/g, "");
    if (n.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(n)) return "Mastercard";
    if (n.startsWith("37") || n.startsWith("34")) return "Amex";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStep("processing");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));

    try {
      const res = await authFetch(`${API}/payments/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking?.id,
          amount: amount,
          cardNumber: form.cardNumber.replace(/\s/g, ""),
          cardHolderName: form.cardHolderName,
          expiryDate: form.expiryDate,
          cvv: form.cvv,
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Payment failed. Please try again.");
        setStep("error");
        return;
      }

      setStep("success");
      setTimeout(() => onSuccess && onSuccess(data), 2500);
    } catch (err) {
      setError("Connection error. Please check your network and try again.");
      setStep("error");
    }
  };

  const brand = getCardBrand(form.cardNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">Secure Payment</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Lock className="w-3 h-3" /> SSL encrypted
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Amount */}
        <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-indigo-700">Total Amount</span>
            <span className="text-2xl font-black text-indigo-700">LKR {(amount || 0).toLocaleString()}</span>
          </div>
          {booking && (
            <p className="text-xs text-indigo-600 mt-1">
              {booking.ticketCount} ticket{booking.ticketCount !== 1 ? "s" : ""} — {booking.eventTitle || "Event"}
            </p>
          )}
        </div>

        {/* States */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <p className="font-bold text-slate-900">Processing Payment...</p>
            <p className="text-sm text-slate-500">Please don't close this window</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="font-black text-slate-900 text-xl">Payment Successful!</p>
            <p className="text-sm text-slate-500 text-center">
              Your booking is confirmed. A QR ticket has been generated for your event.
            </p>
            <div className="w-full bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold">Check My Bookings to view your QR ticket</p>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-10 gap-4 px-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="font-black text-slate-900 text-lg">Payment Failed</p>
            <p className="text-sm text-red-600 text-center bg-red-50 px-4 py-3 rounded-xl border border-red-200">
              {error}
            </p>
            <button
              onClick={() => { setStep("form"); setError(""); }}
              className="btn-primary cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Payment method tabs */}
            <div className="grid grid-cols-2 gap-2">
              {["CARD", "BANK_TRANSFER"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method })}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition cursor-pointer ${
                    form.paymentMethod === method
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {method === "CARD" ? "💳 Card" : "🏦 Bank Transfer"}
                </button>
              ))}
            </div>

            {form.paymentMethod === "BANK_TRANSFER" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-bold mb-1">Bank Transfer Details:</p>
                <p>Bank: Commercial Bank of Ceylon</p>
                <p>Account: 8001234567890</p>
                <p>Reference: Your Student ID</p>
                <p className="mt-2 text-xs text-blue-600">Allow 1-2 business days for confirmation.</p>
              </div>
            )}

            {form.paymentMethod === "CARD" && (
              <>
                {/* Card number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-16 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                      id="payment-card-number"
                    />
                    {brand && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {brand}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Test: 4242 4242 4242 4242 (success) | 4000 0000 0000 0002 (decline)
                  </p>
                </div>

                {/* Cardholder name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="As printed on card"
                    value={form.cardHolderName}
                    onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                    id="payment-cardholder-name"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={form.expiryDate}
                      onChange={(e) =>
                        setForm({ ...form, expiryDate: formatExpiry(e.target.value) })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                      id="payment-expiry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={form.cvv}
                      onChange={(e) =>
                        setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").substring(0, 4) })
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                      id="payment-cvv"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Security notice */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-200">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                Your payment details are encrypted and never stored on our servers.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-white text-base transition cursor-pointer"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              id="payment-submit-btn"
            >
              Pay LKR {(amount || 0).toLocaleString()} →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
