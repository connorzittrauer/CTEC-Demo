import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import type { JSX } from "react";

/**
 * ProtectedRoute
 *
 * Guards routes that require authentication.
 *
 * IMPORTANT:
 * - Must be pure (no useEffect, no navigate())
 * - Uses <Navigate /> for safe redirection
 */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;