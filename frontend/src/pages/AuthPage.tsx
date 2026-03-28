import { useState } from "react";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import { login, signup } from "../api/auth";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({
        login: {
            email: "",
            password: "",
        },
        signup: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    // Form state
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    // Validate the email format using a simple regex
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Handle switching between login/signup
    const handleModeChange = (newMode: "login" | "signup") => {
        setMode(newMode);

        setForm({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });

        setErrors((prev) => ({
            ...prev,
            [newMode]: {
                ...(newMode === "login"
                    ? { email: "", password: "" }
                    : {
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                    }),
            },
        }));

        setError("");
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

        // Validation
        let error = "";

        if (field === "email") {
            if (!value) {
                error = "Email is required";
            } else if (!validateEmail(value)) {
                error = "Please enter a valid email";
            }
        }

        if (field === "password") {
            if (!value) {
                error = "Password is required";
            }
        }

        if (field === "firstName" && mode === "signup") {
            if (!value) error = "First name is required";
        }

        if (field === "lastName" && mode === "signup") {
            if (!value) error = "Last name is required";
        }

        setErrors((prev) => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [field]: error,
            },
        }));
    };

    const handleSubmit = async () => {
        // Validation (unchanged)
        if (!form.email || !form.password) {
            setError("Email and password are required");
            return;
        }

        if (
            mode === "signup" &&
            (!form.firstName || !form.lastName)
        ) {
            setError("All fields are required");
            return;
        }

        setLoading(true);

        const start = Date.now();

        try {
            let data;

            if (mode === "login") {
                data = await login(form.email, form.password);
            } else {
                data = await signup(
                    form.firstName,
                    form.lastName,
                    form.email,
                    form.password
                );
            }

            setError("");
            localStorage.setItem("token", data.token);

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            const elapsed = Date.now() - start;
            const minDuration = 300;

            // Ensure loading lasts at least 300ms
            if (elapsed < minDuration) {
                setTimeout(() => setLoading(false), minDuration - elapsed);
            } else {
                setLoading(false);
            }
        }
    };

    const currentErrors = errors[mode];

    const isFormValid =
        Object.values(currentErrors).every((e) => e === "") &&
        (
            mode === "login"
                ? form.email && form.password
                : form.firstName &&
                form.lastName &&
                form.email &&
                form.password
        );

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
                                label="First name"
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                error={errors.signup.firstName}
                            />

                            <Input
                                label="Last name"
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                error={errors.signup.lastName}
                            />
                        </>
                    )}

                    {/* Shared fields */}
                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={currentErrors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        error={currentErrors.password}
                    />
                </div>

                {/* Error tooltip */}
                <div className="mt-2">
                    {error && (
                        <p
                            className="
                text-red-500 text-sm
                animate-fade-slide
                            "
                        >
                            ⚠ {error}
                        </p>
                    )}
                </div>

                {/* SUBMIT BUTTON */}
                <div
                    className={`
                    mt-2
                    transition-all duration-300 ease-in-out
                    ${error && !loading ? "translate-y-2" : "translate-y-0"}
                    `}
                >
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isFormValid}
                        className="
                            w-full
                            py-2
                            bg-accent
                            text-white
                            rounded-md
                            shadow-sm
                            transition
                            hover:bg-accent-hover
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            flex items-center justify-center
                            "
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            mode === "login" ? "Login" : "Create Account"
                        )}
                    </button>
                </div>

            </div>

        </AuthLayout>
    );
}

export default AuthPage;