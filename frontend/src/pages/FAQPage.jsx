import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const faqs = [
    {
      q: "How do I create an account?",
      a: "Click the 'Get Started' button and enter your name, email, and password. You'll get instant access to browse and book events.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes! You can cancel upcoming event bookings from your Bookings page. Past events cannot be cancelled.",
    },
    {
      q: "What is the QR code for?",
      a: "The QR code in your digital ticket is used to verify your booking at event check-in. Save it or take a screenshot!",
    },
    {
      q: "How do I create an event?",
      a: "Only event organizers and admins can create events. If you're an organizer, go to 'Manage Events' in your dashboard.",
    },
    {
      q: "Are there any fees?",
      a: "No! UniEvents is completely free for students. Booking events costs nothing.",
    },
    {
      q: "How do I reset my password?",
      a: "Use the 'Forgot Password' link on the login page. You'll receive an email with reset instructions.",
    },
    {
      q: "Can I attend events without creating an account?",
      a: "You need an account to book tickets. Creating one takes just 30 seconds!",
    },
    {
      q: "Where can I find venue details?",
      a: "Visit the 'Explore Venues' page to see all campus venues with maps, capacity, and amenities.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-100 items-center justify-center mb-4">
          <HelpCircle className="w-7 h-7 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-lg">Find answers to common questions about UniEvents.</p>
      </div>

      {/* FAQs */}
      <div className="space-y-4 mb-12">
        {faqs.map((faq, i) => (
          <details key={i} className="card p-6 cursor-pointer group">
            <summary className="flex items-center justify-between font-bold text-slate-900 text-lg">
              {faq.q}
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <p className="text-slate-600 mt-4 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="card bg-indigo-50 border-indigo-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Still have questions?</h2>
        <p className="text-slate-600 mb-6">
          Can't find the answer you're looking for? Feel free to reach out!
        </p>
        <Link to="/contact" className="btn-primary">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default FAQPage;
