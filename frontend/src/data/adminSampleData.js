export const adminSampleUsers = [
  { id: 101, name: "Sample Student", email: "student@unievents.local", role: "ATTENDEE", createdAt: new Date().toISOString() },
  { id: 102, name: "Sample Admin", email: "admin@unievents.local", role: "ADMIN", createdAt: new Date().toISOString() }
];

export const adminSampleVenues = [
  { id: 201, name: "Main Auditorium", location: "Block A", capacity: 350, available: true },
  { id: 202, name: "Computer Lab 2", location: "IT Building", capacity: 80, available: true }
];

export const adminSampleEvents = [
  {
    id: 301,
    title: "Tech Talk Demo",
    category: "Academic",
    eventDate: new Date().toISOString(),
    capacity: 120,
    venue: adminSampleVenues[0]
  }
];

export const adminSampleBookings = [
  {
    id: 401,
    eventTitle: "Tech Talk Demo",
    userName: "Sample Student",
    userEmail: "student@unievents.local",
    ticketCount: 1,
    status: "CONFIRMED",
    bookingDate: new Date().toISOString()
  }
];
