import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * ToastAlert
 *
 * Displays a temporary toast notification based on navigation state.
 *
 * Responsibilities:
 * - Reads navigation state (location.state.toast)
 * - Displays toast when triggered
 * - Auto-dismisses after a delay
 * - Clears navigation state to prevent repeat triggers
 */

function ToastAlert() {
  const location = useLocation();
  const navigate = useNavigate();

  // Incoming (ephemeral) navigation state
  const incomingToast = location.state?.toast;

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!incomingToast) return;

    const showTimer = window.setTimeout(() => {
      setShowToast(true);
    }, 150);

    const hideTimer = window.setTimeout(() => {
      setShowToast(false);
      // Clear navigation state after the toast has been dismissed
      navigate(".", { replace: true, state: {} });
    }, 2900);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [incomingToast, navigate]);

  if (!showToast || !incomingToast) return null;
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
        bg-green-200
        border border-border
        text-text
        px-4 py-2
        rounded-md
        shadow-md
        text-base
        animate-page-in
      "
      >
        {incomingToast === "login-success" && "Logged in successfully"}
        {incomingToast === "signup-success" && "Signup successful. Please log in."}
      </div>
    </div>
  );
}

export default ToastAlert;
