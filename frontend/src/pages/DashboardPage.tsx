import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/user";
import { logout } from "../api/auth";
import ToastAlert from "../components/ToastAlert";
import BuildProgressCard from "../components/BuildProgressCard";

/**
 * Dashboard renders the authenticated landing page and verifies the session on load.
 */
function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      removeToken();
      navigate("/auth", { replace: true });
    }
  };

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const data = await getCurrentUser();
        setEmail(data.email);
      } catch {
        removeToken();
        navigate("/auth", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProtected();
  }, [navigate]);

  return (

    <>
      {/* Toast Component */}
      <ToastAlert />

      <div className="min-h-screen flex flex-col animate-page-in">
        {/* Header */}
        <header className="flex justify-between items-center p-6 bg-white backdrop-blur  border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/fabrix.svg" alt="Fabrix logo" className="w-8 h-8" />
            <h1 className="text-2xl font-heading">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {email && (
              <p className="text-text text-sm">
                Logged in as: <span className="font-medium">{email}</span>
              </p>
            )}
            <button
              onClick={handleLogout}
              className="
                px-4 py-2
                bg-accent text-white
                rounded-md
                hover:bg-accent-hover
                transition
              "
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-8">
          {loading ? (
            <p className="text-text">Loading...</p>
          ) : (
            <BuildProgressCard />
          )}
        </main>
      </div>
    </>
  );
}

export default Dashboard;
