import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CareerPaths } from './pages/CareerPaths';
import { ResourceDetails } from './pages/ResourceDetails';
import { SessionDetails } from './pages/SessionDetails';
import { ScheduleSession } from './pages/ScheduleSession';
import { AdminDashboard } from './pages/AdminDashboard';
import Navigation from './components/Navigation';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/career-paths"
          element={
            <PrivateRoute>
              <CareerPaths />
            </PrivateRoute>
          }
        />
        <Route
          path="/schedule-session"
          element={
            <PrivateRoute>
              <ScheduleSession />
            </PrivateRoute>
          }
        />
        <Route
          path="/sessions/:id"
          element={
            <PrivateRoute>
              <SessionDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/resources/:id"
          element={
            <PrivateRoute>
              <ResourceDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
