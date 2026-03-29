import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * ToastAlert
 *
 * Displays a temporary toast notification based on navigation state.
 *
 * Responsibilities:
 * - Reads navigation state (location.state.toast)
 * - Persists toast type locally (prevents race condition)
 * - Displays toast when triggered
 * - Auto-dismisses after a delay
 * - Clears navigation state to prevent repeat triggers
 */

function ToastAlert() {
  const location = useLocation();
  const navigate = useNavigate();

  // Incoming (ephemeral) navigation state
  const incomingToast = location.state?.toast;

  // Persistent state (fixes your bug)
  const [toastType, setToastType] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false); // ✅ this was already needed

  useEffect(() => {
    if (!incomingToast) return;

    // Persist the value and start the auto-dismiss timer. We intentionally
    // clear the navigation state only after the timer fires so that the
    // effect's cleanup (which runs when location.state changes) does not
    // cancel the timer prematurely.
    setToastType(incomingToast);
    setShowToast(true);

    const timer = setTimeout(() => {
      setShowToast(false);
      setToastType(null); // cleanup
      // Clear navigation state after the toast has been dismissed
      navigate(".", { replace: true, state: {} });
    }, 2500);

    return () => clearTimeout(timer);
  }, [incomingToast, navigate]);

  if (!showToast) return null;

  return (
    <div
      className="
        fixed top-6 right-6
        bg-green-200
        border border-border
        text-text
        px-4 py-2
        rounded-md
        shadow-md
        text-base
        animate-fade-slide
      "
    >
      {toastType === "login-success" && "✔ Logged in successfully"}
    </div>
  );
}

export default ToastAlert;