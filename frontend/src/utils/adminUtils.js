// Format date for display
export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Convert date to datetime-local input format
export const toDateTimeLocal = (value) => (!value ? "" : value.slice(0, 16));

// Parse API error response
export const parseError = async (res, fallback) => {
  const data = await res.json().catch(() => ({}));
  return data.message || fallback;
};

// Default empty form states
export const emptyForms = {
  user:    { name: "", email: "", password: "", role: "ATTENDEE" },
  event:   { title: "", description: "", venueId: "", category: "", eventDate: "", bannerUrl: "", documentUrl: "", capacity: "", status: "PUBLISHED" },
  venue:   { name: "", location: "", capacity: "", description: "", amenities: "", imageUrl: "", available: true },
  booking: { userId: "", eventId: "", ticketCount: "1" },
};

// Form validation
export const validateUser = (form) => {
  if (!form.name.trim())  return "Name is required";
  if (!form.email.trim()) return "Email is required";
  return null;
};

export const validateEvent = (form) => {
  if (!form.title.trim())                           return "Event title is required";
  if (!form.category.trim())                        return "Category is required";
  if (!form.venueId)                                return "Venue is required";
  if (!form.eventDate)                              return "Date and time are required";
  if (!form.capacity || Number(form.capacity) < 1)  return "Capacity must be at least 1";
  if (!form.status)                                 return "Status is required";
  if (!form.description.trim())                     return "Description is required";
  return null;
};

export const validateVenue = (form) => {
  if (!form.name.trim())                           return "Venue name is required";
  if (!form.location.trim())                       return "Location is required";
  if (!form.capacity || Number(form.capacity) < 1) return "Capacity must be at least 1";
  return null;
};

export const validateBooking = (form) => {
  if (!form.userId)                                   return "User is required";
  if (!form.eventId)                                  return "Event is required";
  if (!form.ticketCount || Number(form.ticketCount) < 1) return "Ticket count must be at least 1";
  return null;
};

// ── CSV Export Utilities ──────────────────────────────────────────────────────

// Escape a cell value for CSV (handles commas, quotes, newlines)
const cell = (value) => {
  const str = String(value ?? "").replace(/"/g, '""');
  return /[",\n\r]/.test(str) ? `"${str}"` : str;
};

// Build and download a clean CSV file
const downloadCSV = (filename, title, headers, dataRows) => {
  const generated = new Date().toLocaleString("en-US", {
    dateStyle: "long", timeStyle: "short",
  });

  const lines = [
    // Report title block
    cell(`UniEvents — ${title}`),
    cell(`Generated: ${generated}`),
    cell(`Total Records: ${dataRows.length}`),
    "", // blank spacer
    // Column headers
    headers.map(cell).join(","),
    // Data rows
    ...dataRows.map((row) => row.map(cell).join(",")),
  ];

  // UTF-8 BOM + content so Excel opens it correctly
  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href     = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// ── Individual export functions ───────────────────────────────────────────────

export const exportUsersCSV = (users) => {
  const headers = ["ID", "Name", "Email", "Role", "Student ID", "Department"];
  const rows = users.map((u) => [
    u.id,
    u.name     || "",
    u.email    || "",
    u.role     || "ATTENDEE",
    u.studentId || "",
    u.department || "",
  ]);
  downloadCSV("unievents_users.csv", "Users Report", headers, rows);
};

export const exportEventsCSV = (events) => {
  const headers = ["ID", "Title", "Category", "Date & Time", "Capacity", "Venue", "Status"];
  const rows = events.map((e) => [
    e.id,
    e.title           || "",
    e.category        || "",
    formatDate(e.eventDate),
    e.capacity        || 0,
    e.venue?.name     || "No Venue",
    e.status          || "PUBLISHED",
  ]);
  downloadCSV("unievents_events.csv", "Events Report", headers, rows);
};

export const exportVenuesCSV = (venues) => {
  const headers = ["ID", "Name", "Location", "Capacity", "Available", "Amenities"];
  const rows = venues.map((v) => [
    v.id,
    v.name      || "",
    v.location  || "",
    v.capacity  || 0,
    v.available ? "Yes" : "No",
    v.amenities || "",
  ]);
  downloadCSV("unievents_venues.csv", "Venues Report", headers, rows);
};

export const exportBookingsCSV = (bookings, users, events) => {
  const headers = ["ID", "Student Name", "Email", "Event Title", "Tickets", "Status", "Booking Date"];
  const rows = bookings.map((b) => {
    const user  = users.find((u) => u.id === b.userId);
    const event = events.find((e) => e.id === b.eventId);
    return [
      b.id,
      user?.name        || "Unknown",
      user?.email       || "",
      event?.title      || "Unknown Event",
      b.ticketCount     || 1,
      b.status          || "CONFIRMED",
      formatDate(b.bookingDate || b.createdAt),
    ];
  });
  downloadCSV("unievents_bookings.csv", "Bookings Report", headers, rows);
};
