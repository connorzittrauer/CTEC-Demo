import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import type { JSX } from "react/jsx-dev-runtime";
/**
 * ProtectedRoute
 *
 * Prevents access to routes unless user is authenticated.
 */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;