/**
 * Auth API
 *
 * Handles all authentication-related HTTP requests.
 * Keeps API logic separate from UI components.
 */

const BASE_URL = "http://localhost:8080"; // adjust if needed

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {  
    const err= await res.json();
    throw new Error(err.error);
  }

  return res.json(); // expected: { token: "..." }
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  return res.json();
}