import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { useState } from "react";
import { login, signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";
import {
    validateEmail,
    validatePassword,
    validateName,
} from "../utils/validation";

/**
 * AuthPage
 *
 * Handles authentication UI and logic for login and signup.
 *
 * Responsibilities:
 * - Manage auth mode (login/signup)
 * - Manage controlled form state
 * - Perform client-side validation
 * - Handle API requests (login/signup)
 * - Render UI via AuthLayout
 *
 * Notes:
 * - Validation is delegated to utils (validation.ts)
 * - API calls are handled via api/auth.ts
 * - UI remains declarative and readable
 */
function AuthPage() {
    // ------------------------
    // STATE
    // ------------------------
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        login: { email: "", password: "" },
        signup: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });



    // ------------------------
    // DERIVED STATE
    // ------------------------
    const currentErrors = errors[mode];

    const isFormValid =
        Object.values(currentErrors).every((e) => e === "") &&
        (mode === "login"
            ? form.email && form.password
            : form.firstName &&
            form.lastName &&
            form.email &&
            form.password);

    // ------------------------
    // HANDLERS
    // ------------------------

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
            [newMode]:
                newMode === "login"
                    ? { email: "", password: "" }
                    : {
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                    },
        }));

        setError("");
    };

    const handleChange = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        let error = "";

        if (field === "email") error = validateEmail(value);
        if (field === "password") error = validatePassword(value);

        if (mode === "signup") {
            if (field === "firstName")
                error = validateName(value, "First name");
            if (field === "lastName")
                error = validateName(value, "Last name");
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
        if (!isFormValid) return;

        setLoading(true);
        const start = Date.now();
        // Switch to dashboard immediately on success, but keep the spinner for at least 300ms to prevent jank
        try {
            if (mode === "login") {
                const data = await login(form.email, form.password);

                setToken(data.token);
                navigate("/dashboard", {
                    state: { toast: "login-success" },
                });
            } else {
                await signup(
                    form.firstName,
                    form.lastName,
                    form.email,
                    form.password
                );

                // After signup → switch to login
                setMode("login");
            }

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            const elapsed = Date.now() - start;
            const minDuration = 300;

            if (elapsed < minDuration) {
                setTimeout(() => setLoading(false), minDuration - elapsed);
            } else {
                setLoading(false);
            }
        }
    };

    // ------------------------
    // RENDER
    // ------------------------

    return (
        <AuthLayout mode={mode} setMode={handleModeChange}>
            <div
                key={mode}
                className="
          transition-all
          duration-300
          ease-in-out
          animate-fade-slide
        "
            >
                {/* HEADER */}
                <h1 className="text-2xl font-heading mb-6 text-text">
                    {mode === "login"
                        ? "Login to your workspace"
                        : "Sign up to start building with Fabrix."}
                </h1>

                {/* FORM */}
                <div className="space-y-4">
                    {mode === "signup" && (
                        <>
                            <Input
                                label="First name"
                                value={form.firstName}
                                onChange={(e) =>
                                    handleChange("firstName", e.target.value)
                                }
                                error={errors.signup.firstName}
                            />
                            <Input
                                label="Last name"
                                value={form.lastName}
                                onChange={(e) =>
                                    handleChange("lastName", e.target.value)
                                }
                                error={errors.signup.lastName}
                            />
                        </>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            handleChange("email", e.target.value)
                        }
                        error={currentErrors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={currentErrors.password}
                    />
                </div>

                {/* GLOBAL ERROR */}
                {error && (
                    <p className="text-red-500 text-sm mt-2 animate-fade-slide">
                        ⚠ {error}
                    </p>
                )}

                {/* SUBMIT */}
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
              w-full py-2
              bg-accent text-white
              rounded-md shadow-sm
              transition hover:bg-accent-hover
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
            "
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : mode === "login" ? (
                            "Login"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
}

export default AuthPage;