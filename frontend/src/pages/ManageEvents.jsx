import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  CalendarIcon, Edit2Icon, Link2, MapPinIcon, Trash2Icon,
  UsersIcon, XIcon, PlusCircle, CheckCircle, AlertCircle, Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const emptyForm = {
  title: "", description: "", venueId: "", category: "",
  eventDate: "", bannerUrl: "", documentUrl: "", capacity: ""
};

const toDateTimeLocalValue = (value) => (!value ? "" : value.slice(0, 16));

const ManageEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyEvents = async () => {
    if (!user?.id) return;
    const url =
      user.role === "ADMIN"
        ? "http://localhost:8080/api/events"
        : `http://localhost:8080/api/events?organizerId=${user.id}`;
    try {
      const res = await fetch(url);
      setEvents(await res.json());
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/venues");
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
    fetchVenues();
  }, [user?.id, user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return alert("You must be logged in.");
    setSubmitting(true);

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      venueId: parseInt(formData.venueId),
      organizerId: user.id,
    };

    const url = editingId
      ? `http://localhost:8080/api/events/${editingId}`
      : "http://localhost:8080/api/events";

    try {
      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? "Event updated successfully!" : "Event published successfully!");
      setEditingId(null);
      setFormData(emptyForm);
      fetchMyEvents();
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      capacity: event.capacity?.toString() || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMessage("");
    setFormData(emptyForm);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await fetch(`http://localhost:8080/api/events/${eventId}`, { method: "DELETE" });
    if (editingId === eventId) handleCancelEdit();
    setMessage("Event deleted successfully.");
    fetchMyEvents();
  };

  const set = (key) => (e) => setFormData((f) => ({ ...f, [key]: e.target.value }));

  // Access guard
  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-500 mb-6">You must be an Organizer or Admin to manage events.</p>
          <Link to="/" className="btn-primary" id="manage-events-access-denied-back">Return to Home</Link>
        </div>
      </div>
    );
  }

  const inputClass = "input-field";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-black text-slate-900">Manage Events</h1>
        <p className="text-slate-500 mt-1.5">Create, edit, and publish events for your attendees.</p>
      </div>

      {/* Form card */}
      <div className="card p-7 mb-8 animate-fade-up">
        {/* Form header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editingId ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
              {editingId ? <Edit2Icon className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Event" : "Create New Event"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-ghost cursor-pointer"
              id="manage-events-cancel-edit"
            >
              <XIcon className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {/* Success/error message */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold mb-6 animate-fade-in border ${
              message.includes("error") || message.includes("failed")
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
            role="status"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} id="manage-events-form" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="event-title" className={labelClass}>Event Title *</label>
            <input
              id="event-title"
              required
              type="text"
              className={inputClass}
              placeholder="e.g. Annual Tech Summit 2026"
              value={formData.title}
              onChange={set("title")}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="event-category" className={labelClass}>Category *</label>
            <input
              id="event-category"
              required
              type="text"
              className={inputClass}
              placeholder="e.g. Academic, Sports, Music"
              value={formData.category}
              onChange={set("category")}
            />
          </div>

          {/* Venue */}
          <div>
            <label htmlFor="event-venue" className={labelClass}>Venue *</label>
            <select
              id="event-venue"
              required
              className={inputClass}
              value={formData.venueId}
              onChange={set("venueId")}
            >
              <option value="">Select a venue...</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Cap: {v.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label htmlFor="event-date" className={labelClass}>Date &amp; Time *</label>
            <input
              id="event-date"
              required
              type="datetime-local"
              className={inputClass}
              value={formData.eventDate}
              onChange={set("eventDate")}
            />
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="event-capacity" className={labelClass}>Total Capacity *</label>
            <input
              id="event-capacity"
              required
              type="number"
              min="1"
              className={inputClass}
              placeholder="e.g. 200"
              value={formData.capacity}
              onChange={set("capacity")}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="event-description" className={labelClass}>Description *</label>
            <textarea
              id="event-description"
              required
              rows="4"
              className={inputClass}
              placeholder="Describe your event — agenda, speakers, what to bring..."
              value={formData.description}
              onChange={set("description")}
            />
          </div>

          {/* Banner URL */}
          <div>
            <label htmlFor="event-banner" className={`${labelClass} flex items-center gap-1.5`}>
              <Link2 className="w-3.5 h-3.5 text-slate-400" /> Banner Image URL
            </label>
            <input
              id="event-banner"
              type="url"
              className={inputClass}
              placeholder="https://..."
              value={formData.bannerUrl}
              onChange={set("bannerUrl")}
            />
            {formData.bannerUrl && (
              <img
                src={formData.bannerUrl}
                alt="Banner preview"
                className="mt-2 rounded-lg w-full h-28 object-cover border border-slate-200"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>

          {/* Document URL */}
          <div>
            <label htmlFor="event-document" className={`${labelClass} flex items-center gap-1.5`}>
              <Link2 className="w-3.5 h-3.5 text-slate-400" /> Schedule / Document URL
            </label>
            <input
              id="event-document"
              type="url"
              className={inputClass}
              placeholder="https://... (optional)"
              value={formData.documentUrl}
              onChange={set("documentUrl")}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-12 text-base cursor-pointer"
              id="manage-events-submit-btn"
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {editingId ? "Updating..." : "Publishing..."}
                </>
              ) : (
                editingId ? "Update Event" : "Publish Event"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Events list */}
      <div className="card p-7 animate-fade-up">
        <h2 className="text-xl font-bold text-slate-900 mb-5">
          Published Events
          {events.length > 0 && (
            <span className="ml-2 badge badge-indigo">{events.length}</span>
          )}
        </h2>

        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No events created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl border p-4 transition-colors ${
                  editingId === event.id
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">{event.title}</h3>
                      {event.category && (
                        <span className="badge badge-indigo">{event.category}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                        {new Date(event.eventDate).toLocaleString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                          hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 text-indigo-400" />
                        {event.venue?.name || "No Venue"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UsersIcon className="w-3.5 h-3.5 text-indigo-400" />
                        {event.capacity} seats
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 flex-wrap">
                    <Link
                      to={`/events/${event.id}`}
                      className="btn-ghost text-sm py-1.5 px-3 cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`manage-events-view-${event.id}`}
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      className="btn-ghost text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-sm py-1.5 px-3 cursor-pointer"
                      id={`manage-events-edit-${event.id}`}
                    >
                      <Edit2Icon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event.id)}
                      className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 text-sm py-1.5 px-3 cursor-pointer"
                      id={`manage-events-delete-${event.id}`}
                    >
                      <Trash2Icon className="w-4 h-4" /> Delete
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
