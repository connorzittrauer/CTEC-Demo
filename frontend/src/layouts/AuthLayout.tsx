import type{ ReactNode } from "react";

// Define props type: this layout will wrap page content
type AuthLayoutProps = {
  children: ReactNode; 
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Full screen container
    <div className="min-h-screen flex bg-background">
      
      {/* LEFT SIDE — Form Area */}
      <div className="w-1/2 flex items-center justify-center">
        
        {/* Inner container controls width + spacing */}
        <div className="w-full max-w-md p-8">
          {children}
        </div>
      </div>

      {/* RIGHT SIDE — Branding Panel */}
      <div className="w-1/2 bg-surface border-l border-border flex items-center justify-center">
        
        {/* Placeholder for branding (we’ll enhance later) */}
        <div className="text-center">
          <h2 className="font-heading text-xl text-secondary">
            Fabrix
          </h2>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;