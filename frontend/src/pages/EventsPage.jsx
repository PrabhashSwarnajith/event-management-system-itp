import { useEffect, useState, useMemo } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Advanced filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchEvents = async (query = "") => {
    setLoading(true);
    try {
      const url = query 
        ? `http://localhost:8080/api/events?search=${query}` 
        : `http://localhost:8080/api/events`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
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

  // Extract unique categories and locations from the fetched events for the filter dropdowns
  const uniqueCategories = useMemo(() => {
    const cats = new Set(events.map(e => e.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [events]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set(events.map(e => e.location).filter(Boolean));
    return Array.from(locs).sort();
  }, [events]);

  // Apply frontend filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filterCategory && event.category !== filterCategory) return false;
      if (filterLocation && event.location !== filterLocation) return false;
      if (filterDate && !event.eventDate?.startsWith(filterDate)) return false;
      return true;
    });
  }, [events, filterCategory, filterLocation, filterDate]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Discover Events</h1>
          <p className="text-slate-500 mt-2 text-lg">Find the best university events happening right now.</p>
        </div>
        
        <div className="flex w-full lg:w-auto gap-3">
          <form onSubmit={handleSearch} className="relative w-full lg:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition shadow-sm"
            />
          </form>
          <Link to="/manage-events" className="hidden lg:flex rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 items-center whitespace-nowrap">
            Organizer Tools
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-700 font-bold px-2">
          <FilterIcon size={18} /> Filters
        </div>
        
        <select 
          className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input
          type="date"
          className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {(filterCategory || filterLocation || filterDate || searchQuery) && (
          <button 
            onClick={() => { setFilterCategory(""); setFilterLocation(""); setFilterDate(""); setSearchQuery(""); fetchEvents(""); }}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 ml-auto px-2 whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(skeleton => (
            <div key={skeleton} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
             <SearchIcon className="text-slate-400 w-8 h-8"/>
          </div>
          <h2 className="text-xl font-bold text-slate-800">No events found</h2>
          <p className="text-slate-500 mt-2">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
