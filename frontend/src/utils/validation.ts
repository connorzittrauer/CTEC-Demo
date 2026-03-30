/** Client-side validators for auth form fields. */

export const validateEmail = (email: string) => {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email";
  }
  return "";
};

export const validatePassword = (password: string, isSignup: boolean = false) => {
  if (!password) return "Password is required";
  if (!isSignup) return "";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  return "";
};

export const validateName = (value: string, field: string) => {
  if (!value) return `${field} is required`;
  return "";
};
