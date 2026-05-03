import { Save, Loader2 } from "lucide-react";

// ── Shared primitives ──────────────────────────────────────────────────────────
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="form-label">{children}</label>
);

const inputCls  = "input-field h-10 text-sm";
const selectCls = "input-field h-10 text-sm";

const SubmitBtn = ({ editing, submitting, label }) => (
  <div className="col-span-full mt-1">
    <button
      type="submit"
      disabled={submitting}
      className="btn-primary w-full h-10 text-sm cursor-pointer"
    >
      {submitting ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
      ) : (
        <><Save className="h-4 w-4" /> {label || (editing ? "Update" : "Create")}</>
      )}
    </button>
  </div>
);

// ── User Form ─────────────────────────────────────────────────────────────────
export const UserForm = ({ form, setForm, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="uf-name">Full Name</Label>
      <input
        id="uf-name"
        className={inputCls}
        placeholder="John Doe"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="uf-email">Email Address</Label>
      <input
        id="uf-email"
        type="email"
        className={inputCls}
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="uf-pwd">{editing ? "New Password (optional)" : "Password"}</Label>
      <input
        id="uf-pwd"
        type="password"
        className={inputCls}
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required={!editing}
      />
    </div>

    <div>
      <Label htmlFor="uf-role">Role</Label>
      <select
        id="uf-role"
        className={selectCls}
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="ATTENDEE">Attendee</option>
        <option value="ORGANIZER">Organizer</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>

    <SubmitBtn editing={editing} submitting={submitting} />
  </form>
);

// ── Event Form ────────────────────────────────────────────────────────────────
export const EventForm = ({ form, setForm, venues, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="ef-title">Event Title</Label>
      <input
        id="ef-title"
        className={inputCls}
        placeholder="e.g. Tech Talk 2025"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="ef-cat">Category</Label>
      <input
        id="ef-cat"
        className={inputCls}
        placeholder="e.g. Workshop, Concert"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="ef-venue">Venue</Label>
      <select
        id="ef-venue"
        className={selectCls}
        value={form.venueId}
        onChange={(e) => setForm({ ...form, venueId: e.target.value })}
        required
      >
        <option value="">Select venue…</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>
    </div>

    <div>
      <Label htmlFor="ef-cap">Capacity (seats)</Label>
      <input
        id="ef-cap"
        type="number"
        min="1"
        className={inputCls}
        placeholder="100"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="ef-date">Date &amp; Time</Label>
      <input
        id="ef-date"
        type="datetime-local"
        className={inputCls}
        value={form.eventDate}
        onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="ef-status">Status</Label>
      <select
        id="ef-status"
        className={selectCls}
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <div>
      <Label htmlFor="ef-banner">Banner Image URL</Label>
      <input
        id="ef-banner"
        type="url"
        className={inputCls}
        placeholder="https://…"
        value={form.bannerUrl}
        onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
      />
    </div>

    <div>
      <Label htmlFor="ef-doc">Document URL</Label>
      <input
        id="ef-doc"
        type="url"
        className={inputCls}
        placeholder="https://…"
        value={form.documentUrl}
        onChange={(e) => setForm({ ...form, documentUrl: e.target.value })}
      />
    </div>

    <div className="col-span-full">
      <Label htmlFor="ef-desc">Description</Label>
      <textarea
        id="ef-desc"
        rows={3}
        className="input-field text-sm"
        placeholder="Describe the event…"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
    </div>

    <SubmitBtn editing={editing} submitting={submitting} />
  </form>
);

// ── Venue Form ────────────────────────────────────────────────────────────────
export const VenueForm = ({ form, setForm, onSubmit, submitting, editing }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="vf-name">Venue Name</Label>
      <input
        id="vf-name"
        className={inputCls}
        placeholder="e.g. Main Auditorium"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="vf-loc">Location</Label>
      <input
        id="vf-loc"
        className={inputCls}
        placeholder="e.g. SLIIT, Malabe"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="vf-cap">Capacity (seats)</Label>
      <input
        id="vf-cap"
        type="number"
        min="1"
        className={inputCls}
        placeholder="500"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        required
      />
    </div>

    <div>
      <Label htmlFor="vf-avail">Availability</Label>
      <select
        id="vf-avail"
        className={selectCls}
        value={form.available ? "true" : "false"}
        onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
      >
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>
    </div>

    <div>
      <Label htmlFor="vf-amenities">Amenities</Label>
      <input
        id="vf-amenities"
        className={inputCls}
        placeholder="e.g. Projector, AC, Parking"
        value={form.amenities}
        onChange={(e) => setForm({ ...form, amenities: e.target.value })}
      />
    </div>

    <div>
      <Label htmlFor="vf-img">Image URL</Label>
      <input
        id="vf-img"
        type="url"
        className={inputCls}
        placeholder="https://…"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
      />
    </div>

    <div className="col-span-full">
      <Label htmlFor="vf-desc">Description</Label>
      <textarea
        id="vf-desc"
        rows={3}
        className="input-field text-sm"
        placeholder="Describe the venue…"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </div>

    <SubmitBtn editing={editing} submitting={submitting} />
  </form>
);

// ── Booking Form ──────────────────────────────────────────────────────────────
export const BookingForm = ({ form, setForm, users, events, onSubmit, submitting }) => (
  <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
      <Label htmlFor="bf-user">Student / User</Label>
      <select
        id="bf-user"
        className={selectCls}
        value={form.userId}
        onChange={(e) => setForm({ ...form, userId: e.target.value })}
        required
      >
        <option value="">Select user…</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
        ))}
      </select>
    </div>

    <div>
      <Label htmlFor="bf-event">Event</Label>
      <select
        id="bf-event"
        className={selectCls}
        value={form.eventId}
        onChange={(e) => setForm({ ...form, eventId: e.target.value })}
        required
      >
        <option value="">Select event…</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>{e.title}</option>
        ))}
      </select>
    </div>

    <div>
      <Label htmlFor="bf-tickets">Tickets</Label>
      <input
        id="bf-tickets"
        type="number"
        min="1"
        max="10"
        className={inputCls}
        placeholder="1"
        value={form.ticketCount}
        onChange={(e) => setForm({ ...form, ticketCount: e.target.value })}
        required
      />
    </div>

    <SubmitBtn submitting={submitting} label="Create Booking" />
  </form>
);
