import { useState, useCallback, useEffect } from "react";
import { emptyForm, toDateTimeLocalValue } from "../utils/eventManagementUtils";

const API = "http://localhost:8080/api";

export const useManageEvents = (authFetch, user) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Fetch events
  const fetchMyEvents = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/events`);
      setEvents(await res.json());
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  }, [user?.id]);

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    try {
      const res = await fetch(`${API}/venues`);
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  }, []);

  useEffect(() => {
    fetchMyEvents();
    fetchVenues();
  }, [user?.id]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!user?.id) return alert("You must be logged in.");
    setSubmitting(true);

    const payload = {
      ...formData,
      capacity: parseInt(formData.capacity),
      venueId: parseInt(formData.venueId),
      organizerId: user.id,
    };

    const url = editingId
      ? `${API}/events/${editingId}`
      : `${API}/events`;

    try {
      const res = await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Could not save event");
      }
      setMessage(editingId ? "Event updated successfully!" : "Event published successfully!");
      setEditingId(null);
      setFormData(emptyForm);
      fetchMyEvents();
    } catch (err) {
      setMessage(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingId, user?.id, authFetch, fetchMyEvents]);

  // Handle edit
  const handleEdit = useCallback((event) => {
    setEditingId(event.id);
    setMessage("");
    setFormData({
      title: event.title || "",
      description: event.description || "",
      venueId: event.venue?.id?.toString() || "",
      category: event.category || "",
      eventDate: toDateTimeLocalValue(event.eventDate),
      bannerUrl: event.bannerUrl || "",
      documentUrl: event.documentUrl || "",
      capacity: event.capacity?.toString() || "",
      status: event.status || "PUBLISHED",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setMessage("");
    setFormData(emptyForm);
  }, []);

  // Handle delete
  const handleDelete = useCallback(async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    await authFetch(`${API}/events/${eventId}`, { method: "DELETE" });
    if (editingId === eventId) handleCancelEdit();
    setMessage("Event deleted successfully.");
    fetchMyEvents();
  }, [editingId, handleCancelEdit, authFetch, fetchMyEvents]);

  return {
    events,
    venues,
    editingId,
    message,
    formData,
    submitting,
    setMessage,
    setFormData,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    handleDelete,
  };
};
