import { useEffect, useState } from "react";
import { Building2Icon, Edit2Icon, Trash2Icon, XIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  location: "",
  capacity: "",
  description: "",
  amenities: "",
  imageUrl: "",
  available: true
};

const ManageVenues = () => {
  const { user, authFetch } = useAuth();
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const canManage = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  const fetchVenues = async () => {
    const response = await fetch("http://localhost:8080/api/venues");
    const data = await response.json();
    setVenues(data);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity)
    };
    const url = editingId
      ? `http://localhost:8080/api/venues/${editingId}`
      : "http://localhost:8080/api/venues";

    await authFetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setMessage(editingId ? "Venue updated." : "Venue created.");
    setEditingId(null);
    setFormData(emptyForm);
    fetchVenues();
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
      available: venue.available !== false
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    await authFetch(`http://localhost:8080/api/venues/${id}`, { method: "DELETE" });
    setMessage("Venue deleted.");
    fetchVenues();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
  };

  if (!canManage) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="mt-2 text-slate-500">Only organizers and admins can manage venues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900">Manage Venues</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold">{editingId ? "Edit Venue" : "Add Venue"}</h2>
          {editingId && (
            <button onClick={cancelEdit} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <XIcon size={16} /> Cancel
            </button>
          )}
        </div>

        {message && <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">{message}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input required placeholder="Venue name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500" />
          <input required placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500" />
          <input required type="number" min="1" placeholder="Capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500" />
          <input placeholder="Amenities" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500" />
          <input type="url" placeholder="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500 md:col-span-2" />
          <textarea required rows="3" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 outline-none focus:border-indigo-500 md:col-span-2" />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} />
            Available for booking
          </label>
          <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 md:col-span-2">
            {editingId ? "Update Venue" : "Create Venue"}
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Venue List</h2>
        {venues.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No venues added yet.</p>
        ) : (
          <div className="space-y-3">
            {venues.map((venue) => (
              <div key={venue.id} className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600"><Building2Icon size={22} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900">{venue.name}</h3>
                    <p className="text-sm text-slate-500">{venue.location} - {venue.capacity} capacity</p>
                    <p className="mt-1 text-sm text-slate-500">{venue.amenities || "No amenities listed"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(venue)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100">
                    <Edit2Icon size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(venue.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100">
                    <Trash2Icon size={16} /> Delete
                  </button>
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
