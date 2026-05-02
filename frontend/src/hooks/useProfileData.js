import { useState, useEffect } from "react";
import { validateProfileForm } from "../utils/profileUtils";

/**
 * Hook for managing user profile data and operations
 */
export const useProfileData = (user, authFetch, updateUser) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ bookings: 0 });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        studentId: user.studentId || "",
        department: user.department || "",
      });
      fetchStats();
    }
  }, [user]);

  /**
   * Fetch user statistics (booking count)
   */
  const fetchStats = async () => {
    try {
      const res = await authFetch("http://localhost:8080/api/bookings/my-bookings");
      if (res.ok) {
        const data = await res.json();
        setStats({ bookings: Array.isArray(data) ? data.length : 0 });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  /**
   * Update user profile
   */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update profile");

      updateUser(data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete user account
   */
  const handleDeleteAccount = async (authFetch, logout, navigate) => {
    try {
      const res = await authFetch(`http://localhost:8080/api/auth/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not delete account");
      }

      logout();
      navigate("/");
    } catch (err) {
      throw err;
    }
  };

  return {
    formData,
    setFormData,
    message,
    error,
    saving,
    stats,
    handleSaveProfile,
    handleDeleteAccount,
  };
};
