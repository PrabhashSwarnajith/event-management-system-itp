import { Building2, MapPin, Users, Wifi, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { VenueBookingModal } from "../ui/VenueBookingModal";

// ── Skeleton ───────────────────────────────────────────────────────────────────
export const VenueSkeleton = () => (
  <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-up">
    <div className="skeleton h-48 w-full" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-2/3" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-10 w-full rounded-xl mt-2" />
    </div>
  </div>
);

// ── Card ───────────────────────────────────────────────────────────────────────
export const VenueCard = ({ venue, user, authFetch }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 overflow-hidden">

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 dark:text-slate-600">
            <Building2 className="w-14 h-14" />
          </div>
        )}

        {/* Availability badge on image */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          venue.available
            ? "bg-emerald-500/90 text-white"
            : "bg-red-500/90 text-white"
        }`}>
          {venue.available ? "Available" : "Closed"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-1">
          {venue.name}
        </h3>

        {venue.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {venue.description}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-auto">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{venue.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{venue.capacity} seats</span>
          </div>
          {venue.amenities && (
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{venue.amenities}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <MapPin className="w-3.5 h-3.5" /> Map
          </a>

          {venue.available && (
            user ? (
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white text-sm font-bold py-2 hover:bg-indigo-700 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Book
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white text-sm font-bold py-2 hover:bg-indigo-700 transition"
              >
                <BookOpen className="w-3.5 h-3.5" /> Sign In
              </Link>
            )
          )}
        </div>
      </div>

      {showBookingModal && (
        <VenueBookingModal
          venue={venue}
          user={user}
          authFetch={authFetch}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};
