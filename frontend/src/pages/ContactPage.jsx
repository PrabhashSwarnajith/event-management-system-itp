import { Mail, MessageCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-indigo-100 items-center justify-center mb-4">
          <Mail className="w-7 h-7 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-3">Get in Touch</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Have feedback, a bug report, or just want to say hello? We'd love to hear from you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Chat with us</h3>
            <p className="text-sm text-slate-600">
              Have a quick question? Our team typically responds within a few hours.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Email us</h3>
            <a href="mailto:support@unievents.com" className="text-sm text-indigo-600 hover:text-indigo-800">
              support@unievents.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="card p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Thanks for reaching out!</h3>
                <p className="text-slate-600 mb-6">
                  We've received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className="input-field w-full"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="input-field w-full"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    className="input-field w-full"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="input-field w-full h-32 resize-none"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full py-3 cursor-pointer"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card bg-blue-50 border-blue-200 p-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Reporting a bug?</p>
          <p>
            Please include as much detail as possible, including the page where the bug occurred and steps to reproduce it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
