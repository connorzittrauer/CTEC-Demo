/**
 * API Client
 *
 * Centralized wrapper for HTTP requests.
 * Handles:
 * - Base URL
 * - JSON headers
 * - Optional JWT attachment
 * - Consistent error handling
 */

import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8080";

type RequestOptions = RequestInit & {
    auth?: boolean; // include JWT if true
};

export async function apiFetch(
    endpoint: string,
    options: RequestOptions = {}
) {
    const { auth = false, headers, ...rest } = options;

    /**
     * Normalize headers safely using the Headers API
     */
    const finalHeaders = new Headers(headers || {});

    // Always set JSON header
    finalHeaders.set("Content-Type", "application/json");

    // Attach JWT if needed
    if (auth) {
        const token = getToken();

        if (token) {
            finalHeaders.set("Authorization", `Bearer ${token}`);
        }
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: finalHeaders,
    });

    if (!res.ok) {
        let message = "Request failed";

        try {
            const err = await res.json();
            message = err.error || message;
        } catch { }

        throw new Error(message);
    }

    return res.json();
}