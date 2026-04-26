import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

// Category colour map
const CATEGORY_COLORS = {
  Music:       "badge-indigo",
  Sports:      "badge-green",
  Academic:    "badge-amber",
  Workshop:    "badge-slate",
  Cultural:    "badge-indigo",
  Tech:        "badge-indigo",
  Arts:        "badge-amber",
  Health:      "badge-green",
};

const getCategoryBadge = (cat) => CATEGORY_COLORS[cat] || "badge-slate";

const EventCard = ({ event }) => {
  const bannerImg =
    event.bannerUrl ||
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = new Date(event.eventDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group card card-hover overflow-hidden flex flex-col animate-fade-up">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={bannerImg}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        {event.category && (
          <div className="absolute top-3 right-3">
            <span className={`badge ${getCategoryBadge(event.category)} shadow-sm`}>
              {event.category}
            </span>
          </div>
        )}
        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-2 leading-snug">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
          {event.description}
        </p>

        {/* Meta */}
        <ul className="space-y-1.5 text-sm text-slate-600 mb-5" aria-label="Event details">
          <li className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-500 shrink-0" aria-hidden="true" />
            <span>
              {formattedDate} <span className="font-semibold">at {formattedTime}</span>
            </span>
          </li>
          <li className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-indigo-500 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.venue?.name || "No Venue"}</span>
          </li>
          <li className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-indigo-500 shrink-0" aria-hidden="true" />
            <span>{event.capacity} seats</span>
          </li>
        </ul>

        {/* CTA */}
        <Link
          to={`/events/${event.id}`}
          className="group/btn flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-50 py-2.5 text-sm font-bold text-indigo-700 transition-all duration-200 hover:bg-indigo-600 hover:text-white"
          aria-label={`View details for ${event.title}`}
          id={`event-card-${event.id}`}
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
