/**
 * Profile utilities for formatting and validation
 */

/**
 * Get user initials from name
 * @param {string} name - User's full name
 * @returns {string} Two letter initials in uppercase
 */
export const getInitials = (name) => {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
};

/**
 * Role color mapping for badges
 */
export const ROLE_COLORS = {
  ADMIN: "badge-red",
  ORGANIZER: "badge-indigo",
  ATTENDEE: "badge-green",
};

/**
 * Validate profile form data
 * @param {object} formData - Profile form data
 * @returns {object} Validation result { isValid, errors }
 */
export const validateProfileForm = (formData) => {
  const errors = {};
  
  if (!formData.name?.trim()) {
    errors.name = "Name is required";
  }
  
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email address";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Parse error message from API response
 * @param {Error|Response} error - Error object
 * @returns {string} Error message
 */
export const parseProfileError = (error) => {
  if (typeof error === "string") return error;
  return error?.message || "An error occurred";
};
