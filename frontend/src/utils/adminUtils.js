// Format date for display
export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Convert date to datetime-local format
export const toDateTimeLocal = (value) => (!value ? "" : value.slice(0, 16));

// Parse error response
export const parseError = async (res, fallback) => {
  const data = await res.json().catch(() => ({}));
  return data.message || fallback;
};

// Empty form states
export const emptyForms = {
  user: { name: "", email: "", password: "", role: "ATTENDEE" },
  event: { title: "", description: "", venueId: "", category: "", eventDate: "", bannerUrl: "", documentUrl: "", capacity: "", status: "PUBLISHED" },
  venue: { name: "", location: "", capacity: "", description: "", amenities: "", imageUrl: "", available: true },
  booking: { userId: "", eventId: "", ticketCount: "1" }
};

// Validation functions
export const validateUser = (form) => {
  if (!form.name.trim()) return "Name is required";
  if (!form.email.trim()) return "Email is required";
  return null;
};

export const validateEvent = (form) => {
  if (!form.title.trim()) return "Event title is required";
  if (!form.category.trim()) return "Category is required";
  if (!form.venueId) return "Venue is required";
  if (!form.eventDate) return "Date and time are required";
  if (!form.capacity || Number(form.capacity) < 1) return "Capacity must be at least 1";
  if (!form.status) return "Status is required";
  if (!form.description.trim()) return "Description is required";
  return null;
};

export const validateVenue = (form) => {
  if (!form.name.trim()) return "Venue name is required";
  if (!form.location.trim()) return "Location is required";
  if (!form.capacity || Number(form.capacity) < 1) return "Capacity must be at least 1";
  return null;
};

export const validateBooking = (form) => {
  if (!form.userId) return "User is required";
  if (!form.eventId) return "Event is required";
  if (!form.ticketCount || Number(form.ticketCount) < 1) return "Ticket count must be at least 1";
  return null;
};

// CSV Export Utilities
const downloadCSV = (filename, rows) => {
  const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportUsersCSV = (users) => {
  const headers = ["ID", "Name", "Email", "Role", "Student ID", "Department"];
  const rows = [headers.join(",")];
  users.forEach((u) => {
    rows.push([
      u.id, 
      `"${u.name || ""}"`, 
      `"${u.email || ""}"`, 
      u.role || "ATTENDEE",
      `"${u.studentId || ""}"`,
      `"${u.department || ""}"`
    ].join(","));
  });
  downloadCSV("admin_users_report.csv", rows);
};

export const exportEventsCSV = (events) => {
  const headers = ["ID", "Title", "Category", "Date", "Capacity", "Venue Name", "Status"];
  const rows = [headers.join(",")];
  events.forEach((e) => {
    rows.push([
      e.id, 
      `"${e.title?.replace(/"/g, '""') || ""}"`, 
      `"${e.category || ""}"`, 
      e.eventDate, 
      e.capacity, 
      `"${e.venue?.name || "No Venue"}"`,
      e.status || "PUBLISHED"
    ].join(","));
  });
  downloadCSV("admin_events_report.csv", rows);
};

export const exportVenuesCSV = (venues) => {
  const headers = ["ID", "Name", "Location", "Capacity", "Available", "Amenities"];
  const rows = [headers.join(",")];
  venues.forEach((v) => {
    rows.push([
      v.id,
      `"${v.name?.replace(/"/g, '""') || ""}"`,
      `"${v.location?.replace(/"/g, '""') || ""}"`,
      v.capacity,
      v.available ? "Yes" : "No",
      `"${v.amenities?.replace(/"/g, '""') || ""}"`
    ].join(","));
  });
  downloadCSV("admin_venues_report.csv", rows);
};

export const exportBookingsCSV = (bookings, users, events) => {
  const headers = ["ID", "User Name", "User Email", "Event Title", "Tickets", "Booking Date"];
  const rows = [headers.join(",")];
  bookings.forEach((b) => {
    const user = users.find(u => u.id === b.userId);
    const event = events.find(e => e.id === b.eventId);
    rows.push([
      b.id,
      `"${user?.name || "Unknown User"}"`,
      `"${user?.email || ""}"`,
      `"${event?.title?.replace(/"/g, '""') || "Unknown Event"}"`,
      b.ticketCount || 1,
      formatDate(b.bookingDate || b.createdAt)
    ].join(","));
  });
  downloadCSV("admin_bookings_report.csv", rows);
};
