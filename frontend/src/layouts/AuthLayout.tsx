import type { ReactNode } from "react";
import FabrixLogo from "../components/FabrixLogo";

/**
 * AuthLayout
 *
 * Layout component for authentication views (login / signup).
 *
 * Responsibilities:
 * - Provide a centered, bounded container for auth UI
 * - Split layout into two panes:
 *    • Left: form content (injected via children)
 *    • Right: branding + mode toggle
 * - Handle visual switching between login and signup modes
 *
 * Design Notes:
 * - Purely presentational (no business logic)
 * - Controlled externally via props (mode, setMode)
 * - Optimized for reuse across auth-related pages
 *
 * Structure:
 * - Outer container: full-screen centering
 * - Inner card: fixed-width split layout
 * - Left pane: form injection point
 * - Right pane: branding + navigation toggle
 *
 */
type AuthLayoutProps = {
  children: ReactNode;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
};

function AuthLayout({ children, mode, setMode }: AuthLayoutProps) {
  return (
    // Full-screen container (centers auth card)
    <div className="min-h-screen bg-background flex items-center justify-center p-6">

      {/* Auth card */}
      <div
        className="
          w-full
          max-w-5xl
          h-[600px]
          bg-background
          rounded-2xl
          shadow-lg
          flex
        "
      >
        
        {/* LEFT PANE — FORM */}
        <div className="w-1/2 flex items-center justify-center bg-secondary">
          <div className="w-full max-w-sm px-8">
            {children}
          </div>
        </div>

        {/* RIGHT PANE — BRANDING + TOGGLE */}
        <div
          className="
            w-1/2
            bg-surface
            border-l
            border-border
            relative
            flex
            items-center
            justify-center
          "
        >

          {/* MODE TOGGLE */}
          <div className="absolute top-6 right-6">
            <div className="flex bg-surface text-lg rounded-md p-1 gap-2">

              <button
                onClick={() => setMode("login")}
                className={`
                  px-4 py-1.5 rounded-md
                  transition-colors duration-200
                  ${
                    mode === "login"
                      ? "bg-accent hover:bg-accent-hover text-white"
                      : "text-text hover:bg-gray-100"
                  }
                `}
              >
                Login
              </button>

              <button
                onClick={() => setMode("signup")}
                className={`
                  px-4 py-1.5 rounded-md
                  transition-colors duration-200
                  ${
                    mode === "signup"
                      ? "bg-accent hover:bg-accent-hover text-white"
                      : "text-text hover:bg-gray-100"
                  }
                `}
              >
                Signup
              </button>

            </div>
          </div>

          {/* BRANDING */}
          <div className="flex flex-col items-center justify-center text-center px-6">
            <FabrixLogo />

            <h2 className="font-heading text-2xl text-gray-500 font-medium tracking-wide">
              F A B R I X
            </h2>

            <p className="mt-4 text-lg text-gray-400 italic">
              3D print your dream home. Bit by bit.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;