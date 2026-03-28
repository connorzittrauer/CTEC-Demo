import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;