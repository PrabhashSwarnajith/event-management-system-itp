import { Mail, MessageCircle, AlertCircle, Send, MapPin, Phone, Clock, Users } from "lucide-react";
import { useState } from "react";

const supportMembers = [
  "Prabhash Swarnajith",
  "Shehani03",
  "it23677296-ayesha",
  "IT21012624",
  "PrabhashSwarnajith",
];

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
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-200">
            <MessageCircle className="h-3.5 w-3.5" />
            Contact Us
          </div>
          <h1 className="text-4xl font-black text-white md:text-6xl">Student Support Portal</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Send a message about bookings, events, venues, payments, or account issues. The right member can follow up
            from the support queue.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Email</h3>
            <p className="mt-2 text-sm text-slate-500">For official project and support messages.</p>
            <a href="mailto:support@unievents.lk" className="mt-3 inline-block font-bold text-indigo-600 hover:underline">
              support@unievents.lk
            </a>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Campus</h3>
            <p className="mt-2 text-sm text-slate-500">SLIIT Malabe Campus, IT faculty project workspace.</p>
            <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">Mon - Fri, 8.30 AM - 5.00 PM</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Phone</h3>
            <p className="mt-2 text-sm text-slate-500">Use for urgent event-day support.</p>
            <p className="mt-3 font-bold text-amber-700">+94 11 234 5678</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Team</h3>
            </div>
            <div className="space-y-2">
              {supportMembers.map((member) => (
                <p key={member} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {member}
                </p>
              ))}
            </div>
          </div>
        </aside>

        <main>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
            {submitted ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <Send className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Message sent</h3>
                <p className="mx-auto mt-3 max-w-md text-slate-500">
                  Thanks. Your message is ready for the UniEvents support team.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost mt-8"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Send Us a Message</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Keep it short and include a booking ID or event name if you have one.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</span>
                      <input
                        type="text"
                        name="name"
                        placeholder="Prabhash Swarnajith"
                        className="input-field h-12"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="student@sliit.lk"
                        className="input-field h-12"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Booking issue, event question, payment help..."
                      className="input-field h-12"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-300">Message</span>
                    <textarea
                      name="message"
                      placeholder="Tell us what happened and what page you were using."
                      className="input-field h-40 resize-none pt-3"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary h-12 w-full"
                  >
                    {sending ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex gap-4 rounded-lg border border-indigo-100 bg-indigo-50 p-5 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200">
              <Clock className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">
                <span className="mb-1 block font-bold">Response time</span>
                Normal messages are checked within one working day.
              </p>
            </div>
            <div className="flex gap-4 rounded-lg border border-amber-100 bg-amber-50 p-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">
                <span className="mb-1 block font-bold">Need quick help?</span>
                Open Live Support from the bottom corner during event time.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
