/**
 * validation.ts
 *
 * Utility functions for client-side form validation.
 *
 * Responsibilities:
 * - Provide reusable validation logic for auth-related fields
 * - Return user-friendly error messages for invalid inputs
 * - Keep validation concerns separate from UI components
 *
 * Design Notes:
 * - Each validator returns an empty string ("") when valid
 * - Returns a descriptive error message when invalid
 * - Pure functions (no side effects)
 *
 * Usage:
 * - Consumed by form handlers (e.g., AuthPage)
 * - Can be reused across other forms in the application
 *
 */

export const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email";
  }
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  return "";
};

export const validateName = (value: string, field: string) => {
  if (!value) return `${field} is required`;
  return "";
};