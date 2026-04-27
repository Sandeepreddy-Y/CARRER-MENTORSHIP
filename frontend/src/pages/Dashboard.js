import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { careerResourceAPI, sessionAPI } from '../api/client';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resourcesRes, sessionsRes] = await Promise.all([
        careerResourceAPI.getAllResources({ limit: 5 }),
        sessionAPI.getUserSessions()
      ]);
      setResources(resourcesRes.data);
      setSessions(sessionsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header hero-banner" style={{ backgroundImage: "url('/images/hero_banner.png')" }}>
        <div className="hero-content">
          <h1>Welcome, {user?.name}!</h1>
          <p>Role: {user?.role}</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Career Resources
        </button>
        <button
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          Counselling Sessions
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Quick Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Available Resources</h3>
                <p className="stat-number">{resources.length}</p>
              </div>
              <div className="stat-card">
                <h3>Scheduled Sessions</h3>
                <p className="stat-number">{sessions.filter(s => s.status === 'scheduled').length}</p>
              </div>
              <div className="stat-card">
                <h3>Completed Sessions</h3>
                <p className="stat-number">{sessions.filter(s => s.status === 'completed').length}</p>
              </div>
            </div>
            
            <h2 style={{ marginTop: '40px' }}>Explore Categories</h2>
            <div className="category-directory">
              {[
                { name: 'Engineering', desc: 'Build the future with technology and design.' },
                { name: 'Business', desc: 'Lead organizations and drive corporate strategy.' },
                { name: 'Healthcare', desc: 'Make a difference in medicine and patient care.' },
                { name: 'IT', desc: 'Innovate with software and information systems.' },
                { name: 'Finance', desc: 'Manage wealth, investments, and economic growth.' },
                { name: 'Creative', desc: 'Express ideas through art, design, and media.' },
                { name: 'Education', desc: 'Empower the next generation through teaching.' },
                { name: 'Other', desc: 'Discover unique and diverse career paths.' }
              ].map(cat => (
                <div key={cat.name} className="category-card" onClick={() => window.location.href = '/career-paths'}>
                  <div className="cat-bg" style={{ backgroundImage: `url('/images/${cat.name.toLowerCase()}.png')` }}></div>
                  <div className="cat-overlay">
                    <h3>{cat.name}</h3>
                    <p>{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            <h2>Featured Career Resources</h2>
            <div className="resources-grid">
              {resources.map((resource) => {
                const categoryImage = ['Engineering', 'Business', 'Healthcare', 'IT', 'Finance', 'Creative', 'Education'].includes(resource.category) 
                  ? resource.category.toLowerCase() 
                  : 'other';
                return (
                  <div key={resource._id} className="resource-card">
                    <div className="resource-image" style={{ backgroundImage: `url('/images/${categoryImage}.png')` }}></div>
                    <div className="resource-content">
                      <h3>{resource.title}</h3>
                      <p className="category">{resource.category}</p>
                      <p>{resource.description.substring(0, 100)}...</p>
                      <a href={`/resources/${resource._id}`} className="btn-view">
                        View Details
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="sessions-section">
            <h2>Your Counselling Sessions</h2>
            <div className="sessions-list">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div key={session._id} className="session-item">
                    <div className="session-info">
                      <h3>{session.title}</h3>
                      <p>Status: <span className={`status-${session.status}`}>{session.status}</span></p>
                      <p>Date: {new Date(session.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    <a href={`/sessions/${session._id}`} className="btn-view">
                      View
                    </a>
                  </div>
                ))
              ) : (
                <p>No sessions scheduled yet. <a href="/schedule-session">Schedule one now</a></p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
