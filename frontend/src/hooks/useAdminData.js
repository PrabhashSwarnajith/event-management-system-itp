import { useState, useCallback } from "react";
import { parseError } from "../utils/adminUtils";
import { adminSampleBookings, adminSampleEvents, adminSampleUsers, adminSampleVenues } from "../data/adminSampleData";

const API = "http://localhost:8080/api";

export const useAdminData = (authFetch) => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, eventsRes, venuesRes, bookingsRes] = await Promise.all([
        authFetch(`${API}/admin/users`),
        authFetch(`${API}/events`),
        authFetch(`${API}/venues`),
        authFetch(`${API}/admin/bookings`)
      ]);

      if (!usersRes.ok || !eventsRes.ok || !venuesRes.ok || !bookingsRes.ok) {
        throw new Error("Could not load admin data");
      }

      setUsers(await usersRes.json());
      setEvents(await eventsRes.json());
      setVenues(await venuesRes.json());
      setBookings(await bookingsRes.json());
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const displayUsers = users.length ? users : adminSampleUsers;
  const displayEvents = events.length ? events : adminSampleEvents;
  const displayVenues = venues.length ? venues : adminSampleVenues;
  const displayBookings = bookings.length ? bookings : adminSampleBookings;
  const usingSampleData = !users.length && !events.length && !venues.length && !bookings.length;

  return {
    users: displayUsers,
    events: displayEvents,
    venues: displayVenues,
    bookings: displayBookings,
    usingSampleData,
    loading,
    error,
    setError,
    loadData,
    setUsers,
    setEvents,
    setVenues,
    setBookings
  };
};

export const useUserOperations = (authFetch, onSuccess) => {
  const [submitting, setSubmitting] = useState(false);

  const saveUser = async (form, isEditing, editingId) => {
    setSubmitting(true);
    try {
      const res = await authFetch(
        isEditing ? `${API}/admin/users/${editingId}` : `${API}/admin/users`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, password: form.password.trim() })
        }
      );
      if (!res.ok) throw new Error(await parseError(res, "Could not save user"));
      onSuccess(isEditing ? "User updated successfully" : "User created successfully");
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await authFetch(`${API}/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseError(res, "Could not delete user"));
      onSuccess("User deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  return { saveUser, deleteUser, submitting };
};

export const useEventOperations = (authFetch, userId, onSuccess) => {
  const [submitting, setSubmitting] = useState(false);

  const saveEvent = async (form, isEditing, editingId) => {
    setSubmitting(true);
    try {
      const payload = { ...form, venueId: Number(form.venueId), capacity: Number(form.capacity), organizerId: userId };
      const res = await authFetch(
        isEditing ? `${API}/events/${editingId}` : `${API}/events`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      if (!res.ok) throw new Error(await parseError(res, "Could not save event"));
      onSuccess(isEditing ? "Event updated successfully" : "Event created successfully");
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await authFetch(`${API}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseError(res, "Could not delete event"));
      onSuccess("Event deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  return { saveEvent, deleteEvent, submitting };
};

export const useVenueOperations = (authFetch, onSuccess) => {
  const [submitting, setSubmitting] = useState(false);

  const saveVenue = async (form, isEditing, editingId) => {
    setSubmitting(true);
    try {
      const res = await authFetch(
        isEditing ? `${API}/venues/${editingId}` : `${API}/venues`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, capacity: Number(form.capacity) })
        }
      );
      if (!res.ok) throw new Error(await parseError(res, "Could not save venue"));
      onSuccess(isEditing ? "Venue updated successfully" : "Venue created successfully");
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteVenue = async (id) => {
    try {
      const res = await authFetch(`${API}/venues/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseError(res, "Could not delete venue"));
      onSuccess("Venue deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  return { saveVenue, deleteVenue, submitting };
};

export const useBookingOperations = (authFetch, onSuccess) => {
  const [submitting, setSubmitting] = useState(false);

  const createBooking = async (form) => {
    setSubmitting(true);
    try {
      const res = await authFetch(`${API}/admin/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(form.userId),
          eventId: Number(form.eventId),
          ticketCount: Number(form.ticketCount)
        })
      });
      if (!res.ok) throw new Error(await parseError(res, "Could not create booking"));
      onSuccess("Booking created successfully");
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      const res = await authFetch(`${API}/admin/bookings/${id}/cancel`, { method: "PUT" });
      if (!res.ok) throw new Error(await parseError(res, "Could not cancel booking"));
      onSuccess("Booking cancelled successfully");
    } catch (err) {
      throw err;
    }
  };

  const deleteBooking = async (id) => {
    try {
      const res = await authFetch(`${API}/admin/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await parseError(res, "Could not delete booking"));
      onSuccess("Booking deleted successfully");
    } catch (err) {
      throw err;
    }
  };

  return { createBooking, cancelBooking, deleteBooking, submitting };
};
