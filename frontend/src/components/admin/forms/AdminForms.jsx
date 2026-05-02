import { Plus } from "lucide-react";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

const inputClass = "input-field h-10 text-sm";

const SubmitButton = ({ editing, submitting }) => (
  <div className="md:col-span-full">
    <button disabled={submitting} className="btn-primary h-10 w-full cursor-pointer">
      <Plus className="h-4 w-4" />
      {submitting ? "Saving..." : editing ? "Update" : "Create"}
    </button>
  </div>
);

export const UserForm = ({ form, setForm, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <Field label="Name">
      <input
        className={inputClass}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </Field>
    <Field label="Email">
      <input
        type="email"
        className={inputClass}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
    </Field>
    <Field label={editing ? "New Password" : "Password"}>
      <input
        type="password"
        className={inputClass}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required={!editing}
      />
    </Field>
    <Field label="Role">
      <select
        className={inputClass}
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="ATTENDEE">Attendee</option>
        <option value="ORGANIZER">Organizer</option>
        <option value="ADMIN">Admin</option>
      </select>
    </Field>
    <SubmitButton editing={editing} submitting={submitting} />
  </form>
);

export const EventForm = ({ form, setForm, venues, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <Field label="Title">
      <input
        className={inputClass}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
    </Field>
    <Field label="Category">
      <input
        className={inputClass}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      />
    </Field>
    <Field label="Venue">
      <select
        className={inputClass}
        value={form.venueId}
        onChange={(e) => setForm({ ...form, venueId: e.target.value })}
        required
      >
        <option value="">Select venue</option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Capacity">
      <input
        type="number"
        min="1"
        className={inputClass}
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        required
      />
    </Field>
    <Field label="Date and Time">
      <input
        type="datetime-local"
        className={inputClass}
        value={form.eventDate}
        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
        required
      />
    </Field>
    <Field label="Status">
      <select
        className={inputClass}
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </Field>
    <Field label="Banner URL">
      <input
        type="url"
        className={inputClass}
        value={form.bannerUrl}
        onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
      />
    </Field>
    <Field label="Document URL">
      <input
        type="url"
        className={inputClass}
        value={form.documentUrl}
        onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
      />
    </Field>
    <div className="md:col-span-2">
      <Field label="Description">
        <textarea
          rows="3"
          className="input-field text-sm"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </Field>
    </div>
    <SubmitButton editing={editing} submitting={submitting} />
  </form>
);

export const VenueForm = ({ form, setForm, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <Field label="Name">
      <input
        className={inputClass}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </Field>
    <Field label="Location">
      <input
        className={inputClass}
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />
    </Field>
    <Field label="Capacity">
      <input
        type="number"
        min="1"
        className={inputClass}
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        required
      />
    </Field>
    <Field label="Available">
      <select
        className={inputClass}
        value={form.available ? "true" : "false"}
        onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
      >
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </Field>
    <Field label="Amenities">
      <input
        className={inputClass}
        value={form.amenities}
        onChange={(e) => setForm({ ...form, amenities: e.target.value })}
      />
    </Field>
    <Field label="Image URL">
      <input
        type="url"
        className={inputClass}
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      />
    </Field>
    <div className="md:col-span-2">
      <Field label="Description">
        <textarea
          rows="3"
          className="input-field text-sm"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </Field>
    </div>
    <SubmitButton editing={editing} submitting={submitting} />
  </form>
);

export const BookingForm = ({ form, setForm, users, events, onSubmit, submitting }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <Field label="User">
      <select
        className={inputClass}
        value={form.userId}
        onChange={(e) => setForm({ ...form, userId: e.target.value })}
        required
      >
        <option value="">Select user</option>
        {users.map((row) => (
          <option key={row.id} value={row.id}>
            {row.name} - {row.email}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Event">
      <select
        className={inputClass}
        value={form.eventId}
        onChange={(e) => setForm({ ...form, eventId: e.target.value })}
        required
      >
        <option value="">Select event</option>
        {events.map((row) => (
          <option key={row.id} value={row.id}>
            {row.title}
          </option>
        ))}
      </select>
    </Field>
    <Field label="Tickets">
      <input
        type="number"
        min="1"
        className={inputClass}
        value={form.ticketCount}
        onChange={(e) => setForm({ ...form, ticketCount: e.target.value })}
        required
      />
    </Field>
    <SubmitButton submitting={submitting} />
  </form>
);
