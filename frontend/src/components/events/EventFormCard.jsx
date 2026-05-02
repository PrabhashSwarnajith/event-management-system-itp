import { Edit2Icon, PlusCircle, XIcon, CheckCircle, Link2 } from "lucide-react";

const EventFormCard = ({ 
  editingId, 
  message, 
  formData, 
  setFormData,
  venues,
  submitting, 
  onSubmit, 
  onCancel 
}) => {
  const set = (key) => (e) => setFormData((f) => ({ ...f, [key]: e.target.value }));
  const inputClass = "input-field";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const isErrorMessage = message && ["error", "failed", "could not", "already"].some((term) =>
    message.toLowerCase().includes(term)
  );

  return (
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
            onClick={onCancel}
            className="btn-ghost cursor-pointer"
          >
            <XIcon className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {/* Success/error message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-semibold mb-6 animate-fade-in border ${
            isErrorMessage
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
          role="status"
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          {message}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            min={new Date().toISOString().slice(0, 16)}
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

        {/* Status */}
        <div>
          <label htmlFor="event-status" className={labelClass}>Status *</label>
          <select
            id="event-status"
            required
            className={inputClass}
            value={formData.status}
            onChange={set("status")}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
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
  );
};

export default EventFormCard;
