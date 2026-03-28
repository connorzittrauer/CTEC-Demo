import { useState } from "react";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

/**
 * AuthPage
 *
 * Top-level authentication page that manages:
 * - Login vs Signup mode state
 * - Controlled form state
 * - Conditional rendering of form fields
 * - Animated transitions between modes
 *
 * Responsibilities:
 * - Holds UI state (mode + form data)
 * - Passes control to AuthLayout (presentation layer)
 * - Renders form inputs based on current mode
 *
 * Notes:
 * - No API calls yet (added in next step)
 * - Inputs are controlled via React state
 * - Animation is triggered via React key + Tailwind classes
 */
function AuthPage() {
  // Auth mode state
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Handle switching between login/signup
  const handleModeChange = (newMode: "login" | "signup") => {
    setMode(newMode);

    // Reset form when switching modes
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  // Strongly-typed field updates
  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AuthLayout mode={mode} setMode={handleModeChange}>
      
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
              <Input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) =>
                  handleChange("firstName", e.target.value)
                }
              />

              <Input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) =>
                  handleChange("lastName", e.target.value)
                }
              />
            </>
          )}

          {/* Shared fields */}
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
          />

          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
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