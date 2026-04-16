import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2, MapPin, Users, Wifi, Search,
  SlidersHorizontal, X, ExternalLink, CheckCircle, XCircle
} from "lucide-react";

// ─── Skeleton card ────────────────────────────────────────────────────────────
const VenueSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-video w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  </div>
);

// ─── Venue Card ───────────────────────────────────────────────────────────────
const VenueCard = ({ venue }) => (
  <article className="card card-hover overflow-hidden animate-fade-up flex flex-col">
    {/* Image */}
    <div className="aspect-video bg-slate-100 overflow-hidden">
      {venue.imageUrl ? (
        <img
          src={venue.imageUrl}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-slate-300">
          <Building2 className="w-12 h-12" />
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-bold text-slate-900">{venue.name}</h3>
        <span
          className={`badge shrink-0 ${venue.available ? "badge-green" : "badge-red"}`}
          aria-label={venue.available ? "Available" : "Unavailable"}
        >
          {venue.available ? (
            <><CheckCircle className="w-3 h-3 mr-1" /> Available</>
          ) : (
            <><XCircle className="w-3 h-3 mr-1" /> Closed</>
          )}
        </span>
      </div>

      <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed flex-1">
        {venue.description || "No description provided."}
      </p>

      <ul className="space-y-1.5 text-sm font-medium text-slate-600" aria-label="Venue details">
        <li className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
          {venue.location}
        </li>
        <li className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
          {venue.capacity.toLocaleString()} capacity
        </li>
        {venue.amenities && (
          <li className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{venue.amenities}</span>
          </li>
        )}
      </ul>
    </div>
  </article>
);

// ─── Venues Page ──────────────────────────────────────────────────────────────
const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [amenity, setAmenity] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchVenues = async (params = {}) => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.location) searchParams.set("location", params.location);
    if (params.minCapacity) searchParams.set("minCapacity", params.minCapacity);
    if (params.amenity) searchParams.set("amenity", params.amenity);

    try {
      const url = `http://localhost:8080/api/venues${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to load venues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(venues.map((v) => v.location).filter(Boolean))).sort(),
    [venues]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVenues({ search, location, minCapacity, amenity });
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setMinCapacity("");
    setAmenity("");
    fetchVenues();
  };

  const hasFilters = search || location || minCapacity || amenity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 animate-fade-up">
        <div>
          <h1 className="text-4xl font-black text-slate-900">University Venues</h1>
          <p className="text-slate-500 mt-1.5 text-lg">
            Find halls, labs, and outdoor spaces for campus events.
          </p>
        </div>
        <Link
          to="/manage-venues"
          className="btn-primary whitespace-nowrap self-start md:self-auto"
          id="venues-manage-link"
        >
          Manage Venues
        </Link>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="card p-4 mb-8 flex flex-col sm:flex-row gap-3 animate-fade-up" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
          <input
            id="venues-search-input"
            type="search"
            placeholder="Search venues by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 pr-4 h-11"
            aria-label="Search venues"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost h-11 px-4 cursor-pointer ${showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-700" : ""}`}
            aria-expanded={showFilters}
            id="venues-filter-toggle"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
          </button>
          <button
            type="submit"
            className="btn-primary h-11 px-5 cursor-pointer"
            id="venues-search-btn"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-fade-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="venues-location-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Location
              </label>
              <select
                id="venues-location-filter"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field py-2.5"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="venues-capacity-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Min. Capacity
              </label>
              <input
                id="venues-capacity-filter"
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="input-field py-2.5"
              />
            </div>

            <div>
              <label htmlFor="venues-amenity-filter" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Amenity
              </label>
              <input
                id="venues-amenity-filter"
                type="text"
                placeholder="e.g. Projector, WiFi"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                className="input-field py-2.5"
              />
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-ghost text-indigo-600 border-indigo-200 mt-4 cursor-pointer"
              id="venues-clear-filters"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <VenueSkeleton key={i} />)}
        </div>
      ) : venues.length === 0 ? (
        <div className="card border-dashed py-24 text-center animate-fade-up">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No venues found</h2>
          <p className="text-slate-500 mb-5">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-primary cursor-pointer" id="venues-empty-clear">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-5 animate-fade-up">{venues.length} venue{venues.length !== 1 ? "s" : ""} found</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VenuesPage;
