import { Users, Heart, Zap, Shield, Sparkles, GraduationCap, MapPin, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-28 md:py-40">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            Empowering Campus Life
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-8 animate-fade-up">
            Redefining <span className="gradient-text">Campus Events</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            UniEvents is the heartbeat of SLIIT, connecting students with unforgettable experiences through seamless discovery and instant booking.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white text-sm">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>5,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white text-sm">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>200+ Annual Events</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Metrics */}
      <section className="relative -mt-12 z-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Users", val: "12K+", icon: Users },
            { label: "Venues", val: "25+", icon: MapPin },
            { label: "Total Bookings", val: "45K+", icon: Zap },
            { label: "Departments", val: "08", icon: GraduationCap },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl shadow-indigo-500/5 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <stat.icon className="w-5 h-5 text-indigo-500 mb-3" />
              <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Our Vision for the <span className="text-indigo-600">Future of Education</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              We believe university life is more than just lectures and exams. It's about the people you meet, the skills you discover, and the communities you build through shared experiences.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              UniEvents provides a robust, real-time ecosystem where student organizers can launch events in minutes and attendees can find their tribe with a single tap. Our mission is to eliminate the friction in campus engagement.
            </p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Seamless Sync</h4>
                  <p className="text-sm text-slate-500">Real-time availability for all campus venues.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Secure Tickets</h4>
                  <p className="text-sm text-slate-500">Blockchain-ready QR verification system.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] rotate-3 opacity-10" />
            <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-slate-200 dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200" 
                alt="Students at event" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Live Now</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">Career Fair 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values with Bento Grid Style */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-16">The Pillars of <span className="text-indigo-600">Our Culture</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Student-Centric Excellence</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                We don't just build software; we build tools for humans. Every feature in UniEvents is inspired by actual student feedback, ensuring that we solve real pain points for campus communities.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] text-left text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-4">Ultra-Fast Booking</h3>
                <p className="text-indigo-100">
                  From discovery to digital ticket in under 3 taps. Performance is our obsession.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-6">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">Inclusive Design</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Making sure every student—regardless of accessibility needs—can navigate and enjoy campus events.
              </p>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 text-left relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-16 -mb-16" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Privacy & Integrity</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl">
                Your data stays yours. We implement industry-leading encryption to keep your university profile and booking history private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-indigo-950 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-gradient-to-l from-indigo-500/20 to-transparent" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10 leading-tight">
            The Hub for Your <br /><span className="text-indigo-400">Campus Journey</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join the 12,000+ students already using UniEvents to make the most of their university experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/auth" className="btn-primary h-14 px-10 text-lg shadow-xl shadow-indigo-500/30">
              Join UniEvents Today
            </Link>
            <Link to="/contact" className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/5 transition">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Re-using the Calendar icon if not already imported
const Calendar = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

export default AboutPage;
