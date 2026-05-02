import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const bannerImg = event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col mb-4">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 rounded mb-4 overflow-hidden relative">
        <img
          src={bannerImg}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.category && (
          <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
          {event.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span>{new Date(event.eventDate).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-blue-500" />
            <span className="truncate">{event.venue?.name || "No Venue"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-blue-500" />
            <span>{event.capacity} seats</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/events/${event.id}`}
          className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
