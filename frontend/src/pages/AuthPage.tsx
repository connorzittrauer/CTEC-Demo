import { useState } from 'react';

function AuthPage() {
    // This state controls whether we're showing the login form or the signup form
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Temporary placeholder content */}
                <div className="text-center">

                    {/* Heading dynamically changes based on mode */}
                    <h1 className="text-2xl font-heading mb-4">
                        {mode === "login" ? "Login" : "Create Account"}
                    </h1>

                    {/* Toggle button switches between login and signup modes */}
                    <button
                        onClick={() =>
                            // If currently login → switch to signup
                            // If currently signup → switch back to login
                            setMode(mode === "login" ? "signup" : "login")
                        }
                        className="text-accent underline"
                    >
                        Switch to {mode === "login" ? "Signup" : "Login"}
                    </button>
                </div>
            </div>
        );
    }
}

export default AuthPage;
