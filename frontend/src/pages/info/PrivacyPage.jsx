import { Shield, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl animate-fade-up">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Last updated: May 2026</p>
          
          <div className="space-y-8 text-slate-600 dark:text-slate-300">
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Data Collection</h2>
              <p className="leading-relaxed">We only collect your student name, email, and ID for event registration purposes. No external tracking is used.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Data Security</h2>
              <p className="leading-relaxed">Your data is stored securely and is only accessible by the UniEvents administrative team.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Cookie Policy</h2>
              <p className="leading-relaxed">We use essential cookies to maintain your login session and dark mode preferences.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
