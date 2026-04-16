import { useEffect, useState } from "react";
import { Building2, Edit2Icon, Trash2Icon, XIcon, PlusCircle, CheckCircle, AlertCircle, MapPin, Users, Wifi } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "", location: "", capacity: "", description: "",
  amenities: "", imageUrl: "", available: true,
};

const ManageVenues = () => {
  const { user, authFetch } = useAuth();
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canManage = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/venues");
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...formData, capacity: parseInt(formData.capacity) };
    const url = editingId
      ? `http://localhost:8080/api/venues/${editingId}`
      : "http://localhost:8080/api/venues";

    try {
      await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? "Venue updated successfully!" : "Venue created successfully!");
      setEditingId(null);
      setFormData(emptyForm);
      fetchVenues();
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingId(venue.id);
    setMessage("");
    setFormData({
      name: venue.name || "",
      location: venue.location || "",
      capacity: venue.capacity?.toString() || "",
      description: venue.description || "",
      amenities: venue.amenities || "",
      imageUrl: venue.imageUrl || "",
      available: venue.available !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue? This action cannot be undone.")) return;
    await authFetch(`http://localhost:8080/api/venues/${id}`, { method: "DELETE" });
    setMessage("Venue deleted.");
    if (editingId === id) cancelEdit();
    fetchVenues();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
  };

  const set = (key) => (e) =>
    setFormData((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  if (!canManage) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-500">Only organizers and admins can manage venues.</p>
        </div>
      </div>
    );
  }

  const inputClass = "input-field";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-black text-slate-900">Manage Venues</h1>
        <p className="text-slate-500 mt-1.5">Add and maintain university event venues.</p>
      </div>

      {/* Form card */}
      <div className="card p-7 mb-8 animate-fade-up">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editingId ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
              {editingId ? <Edit2Icon className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? "Edit Venue" : "Add New Venue"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="btn-ghost cursor-pointer"
              id="manage-venues-cancel-edit"
            >
              <XIcon className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold mb-5 animate-fade-in border ${
              message.includes("error") || message.includes("failed")
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
            role="status"
          >
            <CheckCircle className="w-5 h-5 shrink-0" /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} id="manage-venues-form" className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="venue-name" className={labelClass}>Venue Name *</label>
            <input
              id="venue-name"
              required
              placeholder="e.g. Main Auditorium"
              value={formData.name}
              onChange={set("name")}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="venue-location" className={labelClass}>Location *</label>
            <input
              id="venue-location"
              required
              placeholder="e.g. Block A, Ground Floor"
              value={formData.location}
              onChange={set("location")}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="venue-capacity" className={labelClass}>Capacity *</label>
            <input
              id="venue-capacity"
              required
              type="number"
              min="1"
              placeholder="e.g. 300"
              value={formData.capacity}
              onChange={set("capacity")}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="venue-amenities" className={labelClass}>Amenities</label>
            <input
              id="venue-amenities"
              placeholder="e.g. Projector, AC, WiFi, Stage"
              value={formData.amenities}
              onChange={set("amenities")}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="venue-image" className={labelClass}>Image URL</label>
            <input
              id="venue-image"
              type="url"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={set("imageUrl")}
              className={inputClass}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Venue preview"
                className="mt-2 rounded-lg w-full h-28 object-cover border border-slate-200"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="venue-description" className={labelClass}>Description *</label>
            <textarea
              id="venue-description"
              required
              rows="3"
              placeholder="Describe the venue — size, equipment, access..."
              value={formData.description}
              onChange={set("description")}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <div className="relative">
                <input
                  id="venue-available"
                  type="checkbox"
                  checked={formData.available}
                  onChange={set("available")}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-indigo-600 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Available for booking</span>
            </label>
          </div>

          <div className="md:col-span-2 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full h-12 text-base cursor-pointer"
              id="manage-venues-submit-btn"
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {editingId ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingId ? "Update Venue" : "Create Venue"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Venues list */}
      <div className="card p-7 animate-fade-up">
        <h2 className="text-xl font-bold text-slate-900 mb-5">
          All Venues
          {venues.length > 0 && (
            <span className="ml-2 badge badge-indigo">{venues.length}</span>
          )}
        </h2>

        {venues.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-medium">No venues added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className={`rounded-xl border p-4 transition-colors ${
                  editingId === venue.id
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Icon / image thumbnail */}
                    {venue.imageUrl ? (
                      <img
                        src={venue.imageUrl}
                        alt={venue.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Building2 className="w-7 h-7" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-900">{venue.name}</h3>
                        <span className={`badge ${venue.available ? "badge-green" : "badge-red"}`}>
                          {venue.available ? "Available" : "Closed"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {venue.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-400" /> {venue.capacity} capacity
                        </span>
                        {venue.amenities && (
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5 text-indigo-400" /> {venue.amenities}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap sm:shrink-0">
                    <button
                      onClick={() => handleEdit(venue)}
                      className="btn-ghost text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-sm py-1.5 px-3 cursor-pointer"
                      id={`manage-venues-edit-${venue.id}`}
                    >
                      <Edit2Icon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(venue.id)}
                      className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 text-sm py-1.5 px-3 cursor-pointer"
                      id={`manage-venues-delete-${venue.id}`}
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

export default ManageVenues;
