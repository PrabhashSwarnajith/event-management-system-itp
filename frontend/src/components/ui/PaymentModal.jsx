import { useState } from "react";
import { CreditCard, Lock, CheckCircle, AlertCircle, X, Loader2, Shield } from "lucide-react";

const API = "http://localhost:8080/api";

/**
 * PaymentModal — Stripe-like payment gateway UI.
 * Member 4 feature: simulated card payment flow.
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
  const [invoice, setInvoice] = useState(null);

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

    // For cash at gate, mark as pending - payment on arrival
    if (form.paymentMethod === "CASH_AT_GATE") {
      await new Promise((r) => setTimeout(r, 800));
      
      const invoiceData = {
        success: true,
        paymentMethod: "CASH_AT_GATE",
        amount: amount,
        ticketCount: booking?.ticketCount,
        eventTitle: booking?.eventTitle,
        status: "PENDING_PAYMENT",
        transactionId: "CASH-" + Date.now(),
        invoiceNumber: "INV-" + booking?.eventTitle?.substring(0, 3).toUpperCase() + "-" + Date.now().toString().slice(-6),
        message: "Reservation confirmed. Please pay at the event gate before entry."
      };
      
      setInvoice(invoiceData);
      setStep("success");
      setTimeout(() => onSuccess && onSuccess(invoiceData), 2500);
      return;
    }

    // Simulate network delay for card/bank transfer
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

      setInvoice({
        ...data,
        invoiceNumber: "INV-" + booking?.eventTitle?.substring(0, 3).toUpperCase() + "-" + Date.now().toString().slice(-6),
      });
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
            <p className="font-black text-slate-900 text-xl">
              {form.paymentMethod === "CASH_AT_GATE" ? "Reservation Confirmed!" : "Payment Successful!"}
            </p>
            <p className="text-sm text-slate-500 text-center">
              {form.paymentMethod === "CASH_AT_GATE" 
                ? "Your booking is reserved. Please pay LKR " + (amount || 0).toLocaleString() + " at the event gate before entry."
                : "Your booking is confirmed. A QR ticket has been generated for your event."}
            </p>
            <div className={`w-full ${form.paymentMethod === "CASH_AT_GATE" ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"} rounded-xl p-4 text-center border`}>
              <p className={`text-xs font-semibold ${form.paymentMethod === "CASH_AT_GATE" ? "text-amber-700" : "text-emerald-700"}`}>
                {form.paymentMethod === "CASH_AT_GATE" 
                  ? "✓ Show your booking confirmation at the gate"
                  : "✓ Check My Bookings to view your QR ticket"}
              </p>
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
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "CARD", label: "💳 Card" },
                { id: "CASH_AT_GATE", label: "💰 Cash at Gate" },
                { id: "BANK_TRANSFER", label: "🏦 Bank Transfer" }
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method.id })}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-semibold transition cursor-pointer ${
                    form.paymentMethod === method.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {method.label}
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

            {form.paymentMethod === "CASH_AT_GATE" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-bold mb-2">💰 Pay at Event Gate</p>
                <ul className="space-y-1 text-xs leading-relaxed">
                  <li>✓ Present your booking confirmation on event day</li>
                  <li>✓ Payment must be made at the gate before entry</li>
                  <li>✓ Accepted: Cash only</li>
                  <li>✓ Your QR ticket will be activated once payment is received</li>
                </ul>
                <p className="mt-3 font-semibold text-amber-900">Amount to pay at gate: LKR {(amount || 0).toLocaleString()}</p>
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
                      required={form.paymentMethod === "CARD"}
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
                    required={form.paymentMethod === "CARD"}
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
                      required={form.paymentMethod === "CARD"}
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
                      required={form.paymentMethod === "CARD"}
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
              {form.paymentMethod === "CASH_AT_GATE" 
                ? "Reserve for Cash at Gate →"
                : form.paymentMethod === "BANK_TRANSFER"
                ? "Proceed with Bank Transfer →"
                : "Pay LKR " + (amount || 0).toLocaleString() + " →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
