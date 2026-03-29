import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/user";
import ToastAlert from "../components/ToastAlert";
import BuildProgressCard from "../components/BuildProgressCard";

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    removeToken();
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const data = await getCurrentUser();
        setEmail(data.email);
      } catch (err: any) {
        removeToken();
        navigate("/auth", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProtected();
  }, []);

  return (

    <>
      {/* Toast Component */}
      <ToastAlert />

      <div className="min-h-screen flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-heading">Dashboard</h1>

        {loading && <p className="text-text">Loading...</p>}
        <div className="flex flex-col items-center gap-6">
          {email && (
            <p className="text-text">
              Logged in as: <span className="font-medium">{email}</span>
            </p>
          )}

          <BuildProgressCard />
        </div>
        <button
          onClick={handleLogout}
          className="
            px-4 py-2
            bg-accent text-white
            rounded-md
            hover:bg-accent-hover
          "
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Dashboard;