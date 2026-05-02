import { Mail, MessageCircle, AlertCircle, Send, MapPin, Phone, Clock, Sparkles } from "lucide-react";
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header / Hero */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-up">
            Let's <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Whether you have a question about events, need technical support, or just want to share some feedback—we're here to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Sidebar: Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-up">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-slate-500 text-sm mb-4">Direct message our support desk for official inquiries.</p>
              <a href="mailto:support@unievents.lk" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                support@unievents.lk
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Campus Office</h3>
              <p className="text-slate-500 text-sm mb-4">SLIIT Malabe Campus, Block A, Level 4.</p>
              <p className="font-bold text-slate-700 dark:text-slate-300">Mon - Fri: 8:30 AM - 5:00 PM</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Call Center</h3>
              <p className="text-slate-500 text-sm mb-4">Urgent matters? Give us a call during office hours.</p>
              <p className="font-bold text-emerald-600 dark:text-emerald-400">+94 11 234 5678</p>
            </div>
          </div>

          {/* Main: Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none animate-fade-up">
              {submitted ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Send className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Message Sent!</h3>
                  <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
                    Thank you for reaching out. A UniEvents representative will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost px-8 py-3 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          placeholder="E.g. Ashan Perera"
                          className="input-field w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          placeholder="ashan@sliit.lk"
                          className="input-field w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-subject" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        name="subject"
                        placeholder="How can we help you?"
                        className="input-field w-full h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        placeholder="Describe your inquiry in detail..."
                        className="input-field w-full h-40 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 resize-none pt-3"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={sending}
                        className="btn-primary w-full h-14 text-lg font-black shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
                      >
                        {sending ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
            
            {/* Quick Tips */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 p-5 rounded-2xl flex gap-4">
                <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold block mb-1">Response Time</span>
                  We aim to reply to all inquiries within 24 business hours.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 p-5 rounded-2xl flex gap-4">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-1">Emergency?</span>
                  Please use the Live Chat widget for immediate support during events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
