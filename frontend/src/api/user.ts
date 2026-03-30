/** User API helpers for authenticated requests. */

import { apiFetch } from "./client";

export async function getCurrentUser() {
  return apiFetch("/me", {
    method: "GET",
    auth: true,
  });
}
