import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Search, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { VenueSkeleton, VenueCard } from "../../components/venues/VenueCard";

const VenuesPage = () => {
  const { user, authFetch } = useAuth();
  const [venues, setVenues]         = useState([]);
  const [search, setSearch]         = useState("");
  const [location, setLocation]     = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [amenity, setAmenity]       = useState("");
  const [loading, setLoading]       = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchVenues = async (params = {}) => {
    setLoading(true);
    const sp = new URLSearchParams();
    if (params.search)      sp.set("search", params.search);
    if (params.location)    sp.set("location", params.location);
    if (params.minCapacity) sp.set("minCapacity", params.minCapacity);
    if (params.amenity)     sp.set("amenity", params.amenity);
    try {
      const url = `http://localhost:8080/api/venues${sp.toString() ? `?${sp}` : ""}`;
      const res = await fetch(url);
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to load venues", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVenues(); }, []);

  const locations = useMemo(
    () => [...new Set(venues.map((v) => v.location).filter(Boolean))].sort(),
    [venues]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVenues({ search, location, minCapacity, amenity });
  };

  const clearFilters = () => {
    setSearch(""); setLocation(""); setMinCapacity(""); setAmenity("");
    fetchVenues();
  };

  const hasFilters = search || location || minCapacity || amenity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 animate-fade-up">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">University Venues</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">
            Find halls, labs, and outdoor spaces for campus events.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Link to="/dashboard" className="btn-primary whitespace-nowrap">
            Manage Venues
          </Link>
        )}
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm animate-fade-up"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            id="venues-search-input"
            type="search"
            placeholder="Search venues by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 h-10 text-sm"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost h-10 px-3 text-sm flex items-center gap-2 ${hasFilters ? "border-indigo-400 text-indigo-600 dark:text-indigo-400" : ""}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />}
          </button>
          <button type="submit" className="btn-primary h-10 px-4 text-sm">
            Search
          </button>
        </div>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field h-10 text-sm"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Min. Capacity</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="input-field h-10 text-sm"
              />
            </div>
            <div>
              <label className="form-label">Amenity</label>
              <input
                type="text"
                placeholder="e.g. Projector, WiFi"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                className="input-field h-10 text-sm"
              />
            </div>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition cursor-pointer"
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
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No venues found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Try adjusting your search or filters.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-primary cursor-pointer" id="venues-empty-clear">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 animate-fade-up">
            {venues.length} venue{venues.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 stagger">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} user={user} authFetch={authFetch} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VenuesPage;
