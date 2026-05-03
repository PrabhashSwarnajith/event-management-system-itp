import { HelpCircle, ChevronDown, Sparkles, MessageCircle, Ticket, Calendar, Shield, CreditCard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    {
      name: "General",
      icon: HelpCircle,
      faqs: [
        {
          q: "What is UniEvents?",
          a: "UniEvents is SLIIT's official event management platform, designed to help students discover, book, and manage campus events in real-time.",
        },
        {
          q: "How do I create an account?",
          a: "Simply click the 'Sign In' button on the navigation bar, choose 'Create Account', and fill in your student details. You can also use Google Auth for instant access.",
        },
      ]
    },
    {
      name: "Bookings",
      icon: Ticket,
      faqs: [
        {
          q: "How do I book an event?",
          a: "Browse the 'Events' page, click on an event you like, and hit 'Book Now'. Once booked, your digital ticket will appear in 'My Bookings'.",
        },
        {
          q: "Can I cancel my booking?",
          a: "Yes, you can cancel any upcoming booking from your 'My Bookings' page. Please note that some events may have cancellation deadlines set by organizers.",
        },
        {
          q: "Where do I find my ticket?",
          a: "Your tickets are stored digitally in the 'My Bookings' section. Each ticket includes a unique QR code for event check-in.",
        }
      ]
    },
    {
      name: "Payments",
      icon: CreditCard,
      faqs: [
        {
          q: "Is it free to use?",
          a: "UniEvents is completely free to use. While most student events are free, some premium workshops or concerts may require a ticket fee which can be paid securely via our platform.",
        },
        {
          q: "What payment methods are supported?",
          a: "We support all major Credit/Debit cards (Visa, Mastercard) and direct Bank Transfers for larger event fees.",
        }
      ]
    },
    {
      name: "Security",
      icon: Shield,
      faqs: [
        {
          q: "Is my data secure?",
          a: "Absolutely. We use industry-standard SSL encryption and never store your sensitive payment details on our servers.",
        }
      ]
    }
  ];

  // Flatten FAQs for the accordion
  const allFaqs = categories.flatMap(cat => cat.faqs);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[40%] h-[100%] bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <HelpCircle className="w-3 h-3" />
            Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 animate-fade-up">
            How can we <span className="gradient-text">help you?</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Find quick answers to common questions about bookings, payments, and account management.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-20">
        
        {/* Search Suggestion */}
        <div className="mb-12 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
          {["Booking", "QR Code", "Refunds", "Account"].map((tag) => (
            <button key={tag} className="px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer">
              {tag}
            </button>
          ))}
        </div>

        {/* Categories & FAQs */}
        <div className="space-y-12">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="animate-fade-up" style={{ animationDelay: `${catIdx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <category.icon className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{category.name}</h2>
              </div>
              
              <div className="space-y-4">
                {category.faqs.map((faq, i) => {
                  const globalIdx = allFaqs.findIndex(f => f.q === faq.q);
                  const isOpen = openIndex === globalIdx;
                  
                  return (
                    <div 
                      key={i} 
                      className={`bg-white dark:bg-slate-900 border transition-all duration-300 rounded-[1.5rem] overflow-hidden ${
                        isOpen 
                          ? "border-indigo-500/50 shadow-xl shadow-indigo-500/5" 
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? -1 : globalIdx)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                      >
                        <span className={`font-bold text-lg transition-colors ${isOpen ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                          {faq.q}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`} />
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-4" />
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Support CTA */}
        <div className="mt-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden animate-fade-up">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black mb-4 leading-tight">Still have questions?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-lg mx-auto">
            Our support team is online and ready to help you with anything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-black hover:bg-indigo-50 transition shadow-xl shadow-slate-900/20">
              Contact Support
            </Link>
            <button
              onClick={() => document.getElementById('chatbot-trigger-btn')?.click()}
              className="bg-indigo-500 px-8 py-4 rounded-xl font-black hover:bg-indigo-400 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Ask Help Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
