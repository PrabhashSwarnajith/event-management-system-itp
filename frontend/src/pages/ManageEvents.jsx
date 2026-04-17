import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon, Edit2Icon, LinkIcon, MapPinIcon, Trash2Icon, UsersIcon, XIcon } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  venueId: "",
  category: "",
  eventDate: "",
  bannerUrl: "",
  documentUrl: "",
  capacity: ""
};

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  return value.slice(0, 16);
};

// Primary dashboard view for organizers to create and manage their events
const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  
  // Very simple form mapping avoiding complex reducers for uni project
  const [formData, setFormData] = useState(emptyForm);

  const fetchMyEvents = async () => {
      if (!user?.id) return;
      const url = user.role === "ADMIN"
        ? "http://localhost:8080/api/events"
        : `http://localhost:8080/api/events?organizerId=${user.id}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
  };

  const fetchVenues = async () => {
      const res = await fetch("http://localhost:8080/api/venues");
      const data = await res.json();
      setVenues(data);
  };

  useEffect(() => { 
    fetchMyEvents(); 
    fetchVenues();
  }, [user?.id, user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user?.id) return alert("You must be logged in to create an event!");

    const payload = { ...formData, capacity: parseInt(formData.capacity), venueId: parseInt(formData.venueId), organizerId: user.id };
    const url = editingId
      ? `http://localhost:8080/api/events/${editingId}`
      : "http://localhost:8080/api/events";
    
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setMessage(editingId ? "Event updated successfully." : "Event published successfully.");
    setEditingId(null);
    setFormData(emptyForm);
    fetchMyEvents();
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setMessage("");
    setFormData({
      title: event.title || "",
      description: event.description || "",
      venueId: event.venue?.id?.toString() || "",
      category: event.category || "",
      eventDate: toDateTimeLocalValue(event.eventDate),
      bannerUrl: event.bannerUrl || "",
      documentUrl: event.documentUrl || "",
      capacity: event.capacity?.toString() || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMessage("");
    setFormData(emptyForm);
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm("Delete this event?");
    if (!confirmed) return;

    await fetch(`http://localhost:8080/api/events/${eventId}`, {
      method: "DELETE"
    });

    if (editingId === eventId) {
      handleCancelEdit();
    }
    setMessage("Event deleted successfully.");
    fetchMyEvents();
  };

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-500 mb-6">You must be an Organizer or Administrator to manage events.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Manage Your Events</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">{editingId ? "Edit Event" : "Create New Event"}</h2>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              <XIcon size={16} /> Cancel
            </button>
          )}
        </div>
        {message && (
          <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-700">Event Title</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Category</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Venue</label>
            <select required className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.venueId} onChange={e => setFormData({...formData, venueId: e.target.value})}>
              <option value="">Select a venue</option>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Date & Time</label>
            <input required type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Total Capacity</label>
            <input required type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
            <textarea required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 flex items-center gap-2"><LinkIcon size={14}/> Banner Image URL</label>
            <input placeholder="https://..." type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.bannerUrl} onChange={e => setFormData({...formData, bannerUrl: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 flex items-center gap-2"><LinkIcon size={14}/> Document/Schedule URL (Optional)</label>
            <input placeholder="https://..." type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-100" value={formData.documentUrl} onChange={e => setFormData({...formData, documentUrl: e.target.value})} />
          </div>
          <div className="col-span-1 md:col-span-2 pt-2">
            <button type="submit" className="bg-slate-900 text-white font-bold py-3 px-6 rounded-lg w-full hover:bg-indigo-600 transition">
              {editingId ? "Update Event" : "Publish Event"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Published Events</h2>
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            No events have been created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase text-indigo-700">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{event.description}</p>
                    <div className="mt-3 grid gap-2 text-sm font-medium text-slate-600 sm:grid-cols-3">
                      <span className="flex items-center gap-2"><CalendarIcon size={16} className="text-indigo-500" /> {new Date(event.eventDate).toLocaleString()}</span>
                      <span className="flex items-center gap-2"><MapPinIcon size={16} className="text-indigo-500" /> {event.venue?.name || "No Venue"}</span>
                      <span className="flex items-center gap-2"><UsersIcon size={16} className="text-indigo-500" /> {event.capacity} seats</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => handleEdit(event)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100">
                      <Edit2Icon size={16} /> Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(event.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100">
                      <Trash2Icon size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
