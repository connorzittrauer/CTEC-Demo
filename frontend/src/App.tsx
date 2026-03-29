import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Auth route */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/auth" replace />} />

    </Routes>
  );
}

export default App;