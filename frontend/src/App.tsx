import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Redirect root URL "/" → "/auth"
         This ensures users always land on the auth page first */}
      <Route path="/" element={<Navigate to="/auth" />} />
      
      {/* Single authentication page (handles BOTH login + signup internally) */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected dashboard page (only accessible after login) */}
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
