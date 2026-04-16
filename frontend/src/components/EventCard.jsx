import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  // Use a default banner if none is provided via the URL
  const bannerImg = event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 transition duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={bannerImg}
          alt={event.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700 backdrop-blur-sm uppercase tracking-wider">
          {event.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{event.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-500" />
            <span>{new Date(event.eventDate).toLocaleDateString()} at {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-indigo-500" />
            <span className="truncate">{event.venue?.name || "No Venue"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-indigo-500" />
            <span>{event.capacity} Capacity</span>
          </div>
        </div>

        <Link to={`/events/${event.id}`} className="mt-5 block w-full rounded-lg bg-indigo-50 py-2.5 text-center text-sm font-bold text-indigo-700 transition hover:bg-indigo-600 hover:text-white">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
