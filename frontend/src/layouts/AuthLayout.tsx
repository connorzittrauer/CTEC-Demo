import type { ReactNode } from "react";
import FabrixLogo from "../components/FabrixLogo";

/**
 * AuthLayout
 *
 * Layout wrapper for authentication views (login / signup).
 *
 * Responsibilities:
 * - Provides centered, bounded card layout
 * - Splits UI into two panes:
 *    • Left: form content (children)
 *    • Right: branding + mode toggle
 * - Controls visual state of login/signup toggle
 *
 * Notes:
 * - Layout is presentation-focused (no business logic)
 * - Mode state is passed in from parent (AuthPage)
 * - Designed to be reusable for all auth-related views
 */
type AuthLayoutProps = {
    children: ReactNode; // Injected form content (login/signup)
    mode: "login" | "signup"; // Current auth mode
    setMode: (mode: "login" | "signup") => void; // Toggle handler
};

function AuthLayout({ children, mode, setMode }: AuthLayoutProps) {
    return (
        // Full-page container (centers card)
        <div className="min-h-screen bg-background flex items-center justify-center p-6">

            {/* Main auth card container */}
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

                {/* LEFT PANE — FORM CONTENT */}
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

                    {/* TOP-RIGHT MODE TOGGLE */}
                    <div className="absolute top-6 right-6">
                        <div className="flex bg-surface text-lg rounded-md p-1 gap-2">

                            {/* LOGIN BUTTON */}
                            <button
                                onClick={() => setMode("login")}
                                className={`px-4 py-1.5 transition-colors duration-200 rounded-md ${mode === "login"
                                    ? "bg-accent hover:bg-accent-hover text-white"
                                    : "text-text bg-transparent hover:bg-gray-100"
                                    }`}
                            >
                                Login
                            </button>

                            {/* SIGNUP BUTTON */}
                            <button
                                onClick={() => setMode("signup")}
                                className={`px-4 py-1.5 transition-colors duration-200 rounded-md ${mode === "signup"
                                    ? "bg-accent hover:bg-accent-hover text-white"
                                    : "text-text bg-transparent hover:bg-gray-100"
                                    }`}
                            >
                                Signup
                            </button>

                        </div>
                    </div>

                    {/* BRANDING CONTENT */}
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