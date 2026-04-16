import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2Icon, MapPinIcon, SearchIcon, UsersIcon, WifiIcon } from "lucide-react";

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [amenity, setAmenity] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchVenues = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (minCapacity) params.set("minCapacity", minCapacity);
    if (amenity) params.set("amenity", amenity);

    try {
      const url = `http://localhost:8080/api/venues${params.toString() ? `?${params}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error("Failed to load venues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const locations = useMemo(() => {
    return Array.from(new Set(venues.map((venue) => venue.location).filter(Boolean))).sort();
  }, [venues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchVenues();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setMinCapacity("");
    setAmenity("");
    setTimeout(fetchVenues, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">University Venues</h1>
          <p className="mt-2 text-slate-500">Find halls, labs, and outdoor spaces for events.</p>
        </div>
        <Link to="/manage-venues" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600">
          Manage Venues
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search venue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>
        <select value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500">
          <option value="">All Locations</option>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Min capacity"
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Amenity"
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white hover:bg-indigo-700">Go</button>
        </div>
        {(search || location || minCapacity || amenity) && (
          <button type="button" onClick={clearFilters} className="text-left text-sm font-semibold text-indigo-600 md:col-span-5">
            Clear filters
          </button>
        )}
      </form>

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-xl bg-slate-200" />)}
        </div>
      ) : venues.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
          No venues found.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div key={venue.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-video bg-slate-100">
                {venue.imageUrl ? (
                  <img src={venue.imageUrl} alt={venue.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Building2Icon size={44} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">{venue.name}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${venue.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {venue.available ? "Available" : "Closed"}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-slate-500">{venue.description || "No description added."}</p>
                <div className="mt-4 space-y-2 text-sm font-medium text-slate-600">
                  <p className="flex items-center gap-2"><MapPinIcon size={16} className="text-indigo-500" /> {venue.location}</p>
                  <p className="flex items-center gap-2"><UsersIcon size={16} className="text-indigo-500" /> {venue.capacity} capacity</p>
                  <p className="flex items-center gap-2"><WifiIcon size={16} className="text-indigo-500" /> {venue.amenities || "Basic facilities"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenuesPage;
