import { Building2, Edit2Icon, Trash2Icon, MapPin, Users, Wifi, CheckCircle } from "lucide-react";

/**
 * VenueForm - Form for creating/editing venues
 */
export const VenueForm = ({
  formData,
  setFormData,
  editingId,
  message,
  submitting,
  onSubmit,
  onCancel,
  set,
}) => {
  const inputClass = "input-field";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="card p-7 mb-8 animate-fade-up">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${editingId ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
            {editingId ? <Edit2Icon className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {editingId ? "Edit Venue" : "Add New Venue"}
          </h2>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost cursor-pointer"
            id="manage-venues-cancel-edit"
          >
            ✕ Cancel
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

      <form onSubmit={onSubmit} id="manage-venues-form" className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="venue-name" className={labelClass}>Venue Name *</label>
          <input
            id="venue-name"
            required
            maxLength="100"
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
            maxLength="200"
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
  );
};

/**
 * VenuesList - List of all venues
 */
export const VenuesList = ({ venues, editingId, onEdit, onDelete }) => {
  return (
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
                    onClick={() => onEdit(venue)}
                    className="btn-ghost text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-sm py-1.5 px-3 cursor-pointer"
                    id={`manage-venues-edit-${venue.id}`}
                  >
                    <Edit2Icon className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(venue.id)}
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
  );
};
