/** Shared fetch wrapper for frontend API requests. */

import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8080";

type RequestOptions = RequestInit & {
    auth?: boolean;
};

export async function apiFetch(
    endpoint: string,
    options: RequestOptions = {}
) {
    const { auth = false, headers, ...rest } = options;
    // Normalize headers once so callers can pass plain objects or Headers instances.
    const finalHeaders = new Headers(headers || {});
    finalHeaders.set("Content-Type", "application/json");
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
        } catch {
            message = res.statusText || message;
        }

        throw new Error(message);
    }

    return res.json();
}
