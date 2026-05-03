import { Users, Heart, Shield, GraduationCap, MapPin, Calendar, Ticket, MessageCircle, Home } from "lucide-react";
import { Link } from "react-router-dom";

const team = [
  { name: "Prabhash Swarnajith", work: "Accounts, auth, home page, reports", icon: Users },
  { name: "Shehani03", work: "FAQ, help desk, about page", icon: MessageCircle },
  { name: "it23677296-ayesha", work: "Events, contact page, support flow", icon: Calendar },
  { name: "IT21012624", work: "Bookings, payments, QR tickets", icon: Ticket },
  { name: "PrabhashSwarnajith", work: "Venues, reviews, dark mode, legal pages", icon: MapPin },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="bg-slate-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-200">
              <GraduationCap className="h-3.5 w-3.5" />
              ITP student project
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              About UniEvents
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              UniEvents is a campus event management system made for students who need one place to discover events,
              book seats, manage tickets, and contact support without searching through notices and group chats.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn-primary">
                Browse Events
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200"
              alt="Students attending a campus event"
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Event discovery", value: "Fast", icon: Calendar },
            { label: "Campus venues", value: "Managed", icon: MapPin },
            { label: "Digital tickets", value: "QR ready", icon: Ticket },
            { label: "Student support", value: "Live", icon: MessageCircle },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <item.icon className="mb-4 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-600">Why we built it</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">A simple system for real campus work</h2>
          <p className="mt-5 leading-relaxed text-slate-600 dark:text-slate-400">
            The main idea is practical: students should be able to see what is happening on campus, organizers should
            be able to manage events, and support members should be able to respond when something goes wrong.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Student first</h3>
                <p className="text-sm text-slate-500">The screens are made for quick booking, checking tickets, and getting help.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Organized data</h3>
                <p className="text-sm text-slate-500">Users, events, venues, bookings, payments, and reviews are connected clearly.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Built for presentation</h3>
                <p className="text-sm text-slate-500">Each member has a clear CRUD, report, special feature, and static page area.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-600">Project members</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">Team contribution map</h2>
          <div className="mt-6 grid gap-3">
            {team.map((member) => (
              <div key={member.name} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <member.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.work}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
