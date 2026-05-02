import { Shield, Lock, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl animate-fade-up">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
            <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Last updated: May 2026</p>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">By accessing UniEvents, you agree to comply with our academic conduct policies and event guidelines.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Booking Policy</h2>
              <p className="leading-relaxed">Tickets are non-transferable. Cancellations made 24 hours before the event are eligible for a 100% refund.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. User Conduct</h2>
              <p className="leading-relaxed">Users must provide valid student credentials. Any misuse of the booking system may lead to account suspension.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
