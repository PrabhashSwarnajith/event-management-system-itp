import { Building2, MapPin, Users, Wifi, ExternalLink, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { VenueBookingModal } from "../ui/VenueBookingModal";

export const VenueSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded p-4 mb-4">
    <div className="bg-gray-200 h-48 w-full mb-4"></div>
    <div className="h-5 bg-gray-200 w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-200 w-full mb-2"></div>
  </div>
);

export const VenueCard = ({ venue, user, authFetch }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mb-4 overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="w-full h-48 bg-gray-100 relative">
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Building2 className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded ${venue.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {venue.available ? "Available" : "Closed"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 flex-1">
          {venue.description || "No description provided."}
        </p>

        <div className="text-sm text-gray-700 mb-4 space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            {venue.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            {venue.capacity} capacity
          </div>
          {venue.amenities && (
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-500" />
              <span className="truncate">{venue.amenities}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-semibold inline-flex items-center justify-center gap-1 py-2 rounded hover:bg-blue-50 transition"
          >
            <MapPin className="w-4 h-4" /> View Map
          </a>
          {venue.available && (
            user ? (
              <button 
                onClick={() => setShowBookingModal(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <BookOpen className="w-4 h-4" /> Book Venue
              </button>
            ) : (
              <Link to="/auth" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center justify-center gap-2 transition">
                <BookOpen className="w-4 h-4" /> Sign In
              </Link>
            )
          )}
        </div>
      </div>

      {/* Booking Modal */}
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
