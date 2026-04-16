import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, ArrowRight, Star, Users, Zap, Shield } from "lucide-react";
import EventCard from "../components/EventCard";

// ─── Hero Section ─────────────────────────────────────────────────────────────
const HeroSection = () => (
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

    {/* Bottom wave */}
    <div className="h-16 bg-gradient-to-b from-transparent to-slate-50/10" />
  </section>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="card p-7 flex flex-col gap-4 animate-fade-up">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

// ─── Event Skeleton ───────────────────────────────────────────────────────────
const EventSkeleton = () => (
  <div className="card overflow-hidden animate-fade-up">
    <div className="skeleton h-44 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-10 w-full mt-4" />
    </div>
  </div>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/events");
        const data = await res.json();
        // Show first 3 upcoming events
        const sorted = data
          .filter((e) => new Date(e.eventDate) >= new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 3);
        setUpcomingEvents(sorted);
      } catch {
        // silently fail – show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Everything you need
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From discovering events to managing your bookings, UniEvents has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          <FeatureCard
            icon={Calendar}
            title="Discover Events"
            description="Browse lectures, workshops, sports, concerts, and cultural events across campus."
            color="bg-indigo-50 text-indigo-600"
          />
          <FeatureCard
            icon={Ticket}
            title="Instant Booking"
            description="Secure your spot in seconds. Get a digital ticket with a unique confirmation code."
            color="bg-violet-50 text-violet-600"
          />
          <FeatureCard
            icon={MapPin}
            title="Venue Details"
            description="Explore all campus venues — halls, labs, and outdoor spaces with capacity info."
            color="bg-emerald-50 text-emerald-600"
          />
          <FeatureCard
            icon={Shield}
            title="Easy Management"
            description="Organizers can create, edit, and track their events and seat reservations easily."
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Upcoming Events</h2>
              <p className="text-slate-500 mt-1">Don't miss what's happening next on campus.</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition group"
              id="home-see-all-events"
            >
              See all events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="card border-dashed p-16 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No upcoming events</h3>
              <p className="text-slate-400 text-sm mb-6">Check back soon for new events!</p>
              <Link to="/events" className="btn-primary">Browse All Events</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-12 md:p-16 text-white text-center">
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              Join thousands of students
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Ready to book your next<br className="hidden md:block" /> campus experience?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg max-w-lg mx-auto">
              Create an account for free and start discovering events that match your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-7 py-3.5 rounded-xl hover:bg-indigo-50 transition shadow-xl"
                id="home-cta-signup"
              >
                <Users className="w-5 h-5" />
                Get Started Free
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 font-bold px-7 py-3.5 rounded-xl hover:bg-white/20 transition"
              >
                <Calendar className="w-5 h-5" />
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
