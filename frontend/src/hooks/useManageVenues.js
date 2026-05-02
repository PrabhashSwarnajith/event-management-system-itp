import { useState, useEffect } from "react";

const emptyForm = {
  name: "", location: "", capacity: "", description: "",
  amenities: "", imageUrl: "", available: true,
};

/**
 * Hook for managing venues (create, edit, delete)
 */
export const useManageVenues = (authFetch) => {
  const [venues, setVenues] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/venues");
      setVenues(await res.json());
    } catch (err) {
      console.error("Failed to fetch venues", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...formData, capacity: parseInt(formData.capacity) };
    const url = editingId
      ? `http://localhost:8080/api/venues/${editingId}`
      : "http://localhost:8080/api/venues";

    try {
      await authFetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? "Venue updated successfully!" : "Venue created successfully!");
      setEditingId(null);
      setFormData(emptyForm);
      fetchVenues();
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      available: venue.available !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue? This action cannot be undone.")) return;
    await authFetch(`http://localhost:8080/api/venues/${id}`, { method: "DELETE" });
    setMessage("Venue deleted.");
    if (editingId === id) cancelEdit();
    fetchVenues();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
  };

  const set = (key) => (e) =>
    setFormData((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  return {
    venues,
    formData,
    setFormData,
    editingId,
    message,
    submitting,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    set,
  };
};
