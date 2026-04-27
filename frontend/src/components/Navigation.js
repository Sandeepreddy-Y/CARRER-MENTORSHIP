import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/dashboard">CareerMentor</Link>
      </div>

      <div className="nav-menu">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/career-paths" className="nav-link">
          Career Paths
        </Link>
        <Link to="/schedule-session" className="nav-link">
          Schedule Session
        </Link>
        {user && (user.role === 'admin' || user.role === 'counsellor') && (
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        )}
      </div>

      <div className="nav-user">
        <span className="user-name">{user?.name}</span>
        <span className="user-role">{user?.role}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
