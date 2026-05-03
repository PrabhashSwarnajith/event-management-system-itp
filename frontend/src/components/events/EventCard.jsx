import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const bannerImg = event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "TBA";

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/60 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={bannerImg}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {event.category && (
          <span className="absolute top-3 right-3 rounded-full bg-indigo-600/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400 mt-auto">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{event.venue?.name || "No Venue"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{event.capacity} seats</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/events/${event.id}`}
          className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors duration-200 group/btn"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
