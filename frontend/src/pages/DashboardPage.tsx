import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-heading">Dashboard</h1>

      <p className="text-text">You are logged in.</p>

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
  );
}

export default Dashboard;