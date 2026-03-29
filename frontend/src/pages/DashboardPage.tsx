import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/auth", { replace: true });
  };

  const location = useLocation();
  const toastType = location.state?.toast;
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    if (toastType === "login-success") {
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toastType]);

  return (
    <>
      {showToast && (
        <div
          className="
          fixed top-6 right-6
          bg-green-200
          border border-border
          text-text
          px-4 py-2
          rounded-md
          shadow-md
          text-sm
          animate-fade-slide
        "
        >
          ✔ Logged in successfully
        </div>
      )}

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
    </>
  );
}

export default Dashboard;