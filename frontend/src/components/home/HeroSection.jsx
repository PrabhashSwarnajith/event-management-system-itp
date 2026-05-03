import { Zap, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * HeroSection - Main hero banner with CTA buttons
 */
export const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white">
    {/* Background decorations */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-up">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span>Book tickets for upcoming university events</span>
      </div>

      {/* Headline */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        Discover Amazing
        <br />
        <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          Campus Events
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
        style={{ animationDelay: "160ms" }}
      >
        UniEvents connects students with lectures, workshops, concerts, sports, and
        more — all in one place. Find, register, and never miss a thing.
      </p>

      {/* CTA buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
        style={{ animationDelay: "240ms" }}
      >
        <Link
          to="/events"
          className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
          id="hero-browse-events"
        >
          <Calendar className="w-5 h-5" />
          Browse Events
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
        <Link
          to="/venues"
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200"
          id="hero-view-venues"
        >
          <MapPin className="w-5 h-5" />
          Explore Venues
        </Link>
      </div>

      {/* Stats */}
      <div
        className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up"
        style={{ animationDelay: "320ms" }}
      >
        {[
          { label: "Events", value: "50+" },
          { label: "Venues", value: "12+" },
          { label: "Students", value: "500+" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom fade */}
    <div className="h-12 bg-gradient-to-b from-transparent to-transparent" />
  </section>
);
