import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <AuthLayout mode={mode} setMode={setMode}>

            {/* ANIMATED CONTENT WRAPPER */}
            <div
                key={mode}
                className="transition-all duration-200 ease-in-out"
            >
                <h1 className="text-2xl font-heading mb-6 text-text">
                    {mode === "login"
                        ? "Login with e-mail and password"
                        : "Sign up to start building with Fabrix."}
                </h1>

                {/* Signup Input fields */}
                <div className="space-y-4">

                    {mode === "signup" && (
                        <>
                            <div className="h-10 bg-surface rounded-md" /> {/* First Name */}
                            <div className="h-10 bg-surface rounded-md" /> {/* Last Name */}
                        </>
                    )}

                    <div className="h-10 bg-surface rounded-md" /> {/* Email */}
                    <div className="h-10 bg-surface rounded-md" /> {/* Password */}

                </div>

                <button className="mt-6 w-full bg-accent text-white py-2 rounded-md shadow-sm hover:bg-accent-hover transition">
                    {mode === "login" ? "Login" : "Signup"}
                </button>
            </div>

        </AuthLayout>
    );
}

export default AuthPage;