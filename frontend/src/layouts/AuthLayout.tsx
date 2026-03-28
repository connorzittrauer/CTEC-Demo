import type { ReactNode } from "react";
import FabrixLogo from "../components/FabrixLogo";

type AuthLayoutProps = {
  children: ReactNode;
  mode: "login" | "signup";
  setMode: (mode: "login" | "signup") => void;
};

function AuthLayout({ children, mode, setMode }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      
      <div className="
        w-full 
        max-w-5xl 
        h-[600px] 
        bg-background
        rounded-2xl 
        shadow-lg 
        overflow-hidden 
        flex
      ">
        
        {/* LEFT SIDE — FORM */}
        <div className="w-1/2 flex items-center justify-center bg-secondary">
          <div className="w-full max-w-sm px-8">
            {children}
          </div>
        </div>

        {/* RIGHT SIDE — BRANDING + TOGGLE */}
        <div className="
          w-1/2 
          bg-surface 
          border-l 
          border-border 
          relative 
          flex 
          items-center 
          justify-center
        ">


        {/* TOP RIGHT TOGGLE */}
        <div className="absolute top-6 right-6">
        
        <div className="flex bg-white border border-border rounded-md overflow-hidden text-sm shadow-sm ">
            
            {/* LOGIN */}
            <button
            onClick={() => setMode("login")}
            className={`
                px-4 py-1.5 transition-all duration-200 
                ${mode === "login"
                ? "bg-accent hover:bg-accent-hover  text-white "
                : "text-text hover:bg-gray-100 " }
            `}
            >
            Login
            </button>

            {/* SIGNUP */}
            <button
            onClick={() => setMode("signup")}
            className={`
                px-4 py-1.5 transition-all duration-200
                ${mode === "signup"
                ? "bg-accent text-white hover:bg-accent-hover "
                : "text-text hover:bg-gray-100"}
            `}
            >
            Signup
            </button>

        </div>

        </div>

          {/* LOGO GOES HERE */}
          <div className="text-center">
            <FabrixLogo />
            <h2 className="font-heading text-xl text-gray-500 font-medium tracking-wide">
              F A B R I X
            </h2>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;