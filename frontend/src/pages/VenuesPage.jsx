import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Search, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { VenueSkeleton, VenueCard } from "../components/venues/VenueCard";

const VenuesPage = () => {
  const { user } = useAuth();
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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">University Venues</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Find halls, labs, and outdoor spaces for campus events.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Venues
          </Link>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded p-4 mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            id="venues-search-input"
            type="search"
            placeholder="Search venues by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Filters {hasFilters && "(*)"}
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Min. Capacity
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 100"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Amenity
              </label>
              <input
                type="text"
                placeholder="e.g. Projector, WiFi"
                value={amenity}
                onChange={(e) => setAmenity(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-red-600 hover:text-red-800 font-semibold text-sm"
            >
              Clear all filters
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
