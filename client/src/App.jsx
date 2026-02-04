import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";

import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Basic Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard if role doesn't match
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

// Small banner component to show backend connection status (only on login/signup)
const BackendStatusBar = ({ statusText }) => {
  const location = useLocation();
  const show = location.pathname === "/login" || location.pathname === "/signup";
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 12,
      left: 12,
      right: 12,
      padding: "10px 12px",
      borderRadius: 10,
      background: "#ffffff",
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      fontSize: 14,
      zIndex: 9999
    }}>
      <b>Backend:</b> {statusText}
    </div>
  );
};

const App = () => {
  const [backendStatus, setBackendStatus] = useState("Checking connection...");

  useEffect(() => {
    fetch("http://localhost:3000/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // if your API returns { message: "..."} we show it
        setBackendStatus(data?.message || "Connected ✅");
      })
      .catch((err) => {
        console.error("Backend connection error:", err);
        setBackendStatus("❌ Not connected (check backend running / CORS / URL)");
      });
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <BackendStatusBar statusText={backendStatus} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Unified Dashboard Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<RoleBasedRedirect />} />
      </Routes>
    </Router>
  );
};

// Helper for root redirect
const RoleBasedRedirect = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  const user = JSON.parse(userStr);
  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
};

export default App;
