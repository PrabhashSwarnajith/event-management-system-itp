import { useEffect, useState, useMemo } from "react";
import { Search, Filter, X, Calendar, SlidersHorizontal } from "lucide-react";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ─── Skeleton loader card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-44 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-10 w-full mt-3" />
    </div>
  </div>
);

// ─── Events Page ──────────────────────────────────────────────────────────────
const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `http://localhost:8080/api/events?search=${encodeURIComponent(query)}`
        : `http://localhost:8080/api/events`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch events", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(searchQuery);
  };

  // Derived unique filter options
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.category).filter(Boolean))).sort();
  }, [events]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.venue?.name).filter(Boolean))).sort();
  }, [events]);

  // Apply client-side filters
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (filterCategory && event.category !== filterCategory) return false;
      if (filterLocation && event.venue?.name !== filterLocation) return false;
      if (filterDate && !event.eventDate?.startsWith(filterDate)) return false;
      return true;
    });
  }, [events, filterCategory, filterLocation, filterDate]);

  const hasActiveFilters = filterCategory || filterLocation || filterDate || searchQuery;

  const clearAll = () => {
    setFilterCategory("");
    setFilterLocation("");
    setFilterDate("");
    setSearchQuery("");
    fetchEvents("");
  };

  const activeFilterCount = [filterCategory, filterLocation, filterDate].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div className="animate-fade-up">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Discover Events
          </h1>
          <p className="text-slate-500 mt-1.5 text-lg">
            Find the best university events happening right now.
          </p>
        </div>

        <div className="flex items-center gap-3 animate-fade-up">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="relative flex-1 lg:w-80"
            role="search"
            aria-label="Search events"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
            <input
              type="search"
              id="events-search-input"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 pr-10 h-11"
              aria-label="Search events by keyword"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); fetchEvents(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost h-11 px-4 relative cursor-pointer ${showFilters ? "bg-indigo-50 text-indigo-700 border-indigo-200" : ""}`}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            id="events-filter-toggle"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Organizer link */}
          {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
            <Link
              to="/manage-events"
              className="btn-primary h-11 hidden lg:flex whitespace-nowrap"
              id="events-organizer-tools"
            >
              + New Event
            </Link>
          )}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="card p-5 mb-8 animate-fade-up"
          role="group"
          aria-label="Filter options"
        >
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex items-center gap-2 text-slate-700 font-bold mr-2">
              <Filter className="w-4 h-4 text-indigo-500" aria-hidden="true" />
              <span className="text-sm">Filter by:</span>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-category" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Category
              </label>
              <select
                id="filter-category"
                className="input-field py-2 min-w-[150px]"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-location" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Venue
              </label>
              <select
                id="filter-location"
                className="input-field py-2 min-w-[150px]"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="">All Venues</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label htmlFor="filter-date" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Date
              </label>
              <input
                id="filter-date"
                type="date"
                className="input-field py-2"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="btn-ghost text-indigo-600 border-indigo-200 hover:bg-indigo-50 mt-auto cursor-pointer"
                id="events-clear-filters"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-slate-500 mb-6 animate-fade-up">
          {hasActiveFilters
            ? `Showing ${filteredEvents.length} of ${events.length} events`
            : `${events.length} events available`}
        </p>
      )}

      {/* Event grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card border-dashed py-24 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No events found</h2>
          <p className="text-slate-500 mb-6">Try adjusting your search or filters.</p>
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="btn-primary cursor-pointer"
              id="events-empty-clear"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
