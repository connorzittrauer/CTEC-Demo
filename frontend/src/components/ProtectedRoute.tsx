import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import type { JSX } from "react";

/** Redirects unauthenticated users away from protected routes. */
function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default ProtectedRoute;
