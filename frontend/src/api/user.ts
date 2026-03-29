/**
 * User API
 *
 * Handles authenticated user-related requests
 */

import { apiFetch } from "./client";

export async function getCurrentUser() {
  return apiFetch("/protected", {
    method: "GET",
    auth: true,
  });
}