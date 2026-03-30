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
 * AuthPage handles the login and signup flows.
 */

type AuthMode = "login" | "signup";

type AuthForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type AuthErrors = {
    login: Pick<AuthForm, "email" | "password">;
    signup: AuthForm;
};

const EMPTY_FORM: AuthForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
};

const EMPTY_ERRORS: AuthErrors = {
    login: { email: "", password: "" },
    signup: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    },
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong";
}

function getFieldError(mode: AuthMode, field: keyof AuthForm, value: string) {
    if (field === "email") return validateEmail(value);
    if (field === "password") return validatePassword(value, mode === "signup");
    if (mode === "signup" && field === "firstName") return validateName(value, "First name");
    if (mode === "signup" && field === "lastName") return validateName(value, "Last name");
    return "";
}

function AuthPage() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState<AuthForm>(EMPTY_FORM);
    const [errors, setErrors] = useState<AuthErrors>(EMPTY_ERRORS);

    const currentErrors = errors[mode];
    const isFormValid =
        Object.values(currentErrors).every((e) => e === "") &&
        (mode === "login"
            ? form.email && form.password
            : form.firstName &&
            form.lastName &&
            form.email &&
            form.password);

    const resetForm = (nextForm: AuthForm = EMPTY_FORM) => {
        setForm(nextForm);
    };

    const resetErrors = (nextMode: AuthMode) => {
        setErrors((prev) => ({
            ...prev,
            [nextMode]: EMPTY_ERRORS[nextMode],
        }));
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        setSuccessMessage("");
        resetForm();
        resetErrors(newMode);
        setError("");
    };

    const handleChange = (field: keyof AuthForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [mode]: {
                ...prev[mode],
                [field]: getFieldError(mode, field, value),
            },
        }));
    };

    const handleLogin = async () => {
        const data = await login(form.email, form.password);

        setToken(data.token);

        setTimeout(() => {
            navigate("/dashboard", {
                state: { toast: "login-success" },
            });
        }, 200);
    };

    const handleSignup = async () => {
        await signup(
            form.firstName,
            form.lastName,
            form.email,
            form.password
        );

        setMode("login");
        resetForm({
            ...EMPTY_FORM,
            email: form.email,
        });
        setSuccessMessage("Account created. Please log in.");
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        const start = Date.now();

        try {
            if (mode === "login") {
                await handleLogin();
            } else {
                await handleSignup();
            }
        } catch (error: unknown) {
            setError(getErrorMessage(error));
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
                        ? "Login to your homespace."
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
                        value={form.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        error={currentErrors.password}
                        isPassword={true}
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                </div>

                {/* GLOBAL ERROR */}
                {error && (
                    <p className="text-red-500 text-sm mt-2 animate-fade-slide">
                        ⚠ {error}
                    </p>
                )}

                {/* SUCCESS MESSAGE */}
                {successMessage && (
                    <p className="text-green-600 text-sm mt-2 animate-fade-slide">
                        ✔ {successMessage}
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
