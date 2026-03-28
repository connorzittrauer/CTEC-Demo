import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

function AuthPage() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    return (
        <AuthLayout mode={mode} setMode={setMode}>

            {/* This animates our modal content when switching between login and signup */}
            <div
                key={mode}
                className="
                    transition-all duration-300 ease-in-out
                    animate-fade-slide
                    "
            >
                {/* Modal render login/sign up header text */}
                <h1 className="text-2xl font-heading mb-6 text-text">
                    {mode === "login"
                        ? "Login with e-mail and password"
                        : "Sign up to start building with Fabrix."}
                </h1>

                {/* Modal Signup/Login input fields */}
                <div className="space-y-4">
                    {mode === "signup" && (
                        <>
                            <input
                                type="text"
                                placeholder="First name"
                                className="h-10 bg-surface rounded-md px-3 placeholder:text-gray-400 w-full focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                className="h-10 bg-surface rounded-md px-3 placeholder:text-gray-400 w-full focus:outline-none"
                            />
                        </>
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        className="h-10 bg-surface rounded-md px-3 placeholder:text-gray-400 w-full focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="h-10 bg-surface rounded-md px-3 placeholder:text-gray-400 w-full focus:outline-none"
                    />
                </div>

                {/* Signup Button */}
                <button className="mt-6 w-full bg-accent text-white py-2 rounded-md shadow-sm hover:bg-accent-hover transition">
                    {mode === "login" ? "Login" : "Create Account"}
                </button>
            </div>

        </AuthLayout>
    );
}

export default AuthPage;