import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

/**
 * AuthPage
 *
 * Top-level authentication page that manages:
 * - Login vs Signup mode state
 * - Conditional rendering of form fields
 * - Animated transitions between modes
 *
 * Responsibilities:
 * - Holds UI state (mode)
 * - Passes control to AuthLayout (presentation layer)
 * - Renders form inputs based on current mode
 *
 * Notes:
 * - No API calls yet (added in next step)
 * - Inputs are currently uncontrolled (will be refactored soon)
 * - Animation is triggered via React key + Tailwind classes
 */
function AuthPage() {
  // Controls whether we are in login or signup mode
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <AuthLayout mode={mode} setMode={setMode}>
      
      {/* 
        Animated container:
        - key={mode} forces React to re-render on mode change
        - Enables smooth transition between login/signup states
      */}
      <div
        key={mode}
        className="
          transition-all
          duration-300
          ease-in-out
          animate-fade-slide
        "
      >
        
        {/* HEADER TEXT */}
        <h1 className="text-2xl font-heading mb-6 text-text">
          {mode === "login"
            ? "Login with e-mail and password"
            : "Sign up to start building with Fabrix."}
        </h1>

        {/* FORM FIELDS */}
        <div className="space-y-4">
          
          {/* Signup-only fields */}
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="First name"
                className="
                  h-10
                  w-full
                  px-3
                  bg-surface
                  rounded-md
                  placeholder:text-gray-400
                  focus:outline-none
                "
              />
              <input
                type="text"
                placeholder="Last name"
                className="
                  h-10
                  w-full
                  px-3
                  bg-surface
                  rounded-md
                  placeholder:text-gray-400
                  focus:outline-none
                "
              />
            </>
          )}

          {/* Shared fields */}
          <input
            type="email"
            placeholder="Email"
            className="
              h-10
              w-full
              px-3
              bg-surface
              rounded-md
              placeholder:text-gray-400
              focus:outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            className="
              h-10
              w-full
              px-3
              bg-surface
              rounded-md
              placeholder:text-gray-400
              focus:outline-none
            "
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className="
            mt-6
            w-full
            py-2
            bg-accent
            text-white
            rounded-md
            shadow-sm
            transition
            hover:bg-accent-hover
          "
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>

      </div>

    </AuthLayout>
  );
}

export default AuthPage;