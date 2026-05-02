import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Ticket, MapPin, Shield, Star, Users, ArrowRight } from "lucide-react";
import EventCard from "../components/EventCard";
import { HeroSection } from "../components/home/HeroSection";
import { FeatureCard } from "../components/home/FeatureCard";
import { EventSkeleton } from "../components/home/EventSkeleton";

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/events");
        const data = await res.json();
        const sorted = data
          .filter((e) => new Date(e.eventDate) >= new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 3);
        setUpcomingEvents(sorted);
      } catch {
        // silently fail
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="card border-dashed p-16 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">No upcoming events</h3>
              <p className="text-slate-400 text-sm mb-6">Check back soon for new events!</p>
              <Link to="/events" className="btn-primary">Browse All Events</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
