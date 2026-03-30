/** Auth API helpers for signup, login, and logout. */

import { apiFetch } from "./client";

export async function login(email: string, password: string) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  return apiFetch("/signup", {
    method: "POST",
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }),
  });
}

export async function logout() {
  return apiFetch("/logout", {
    method: "POST",
  });
}
