import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../api/client';
import '../styles/AdminDashboard.css';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'counsellor') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers({ role: 'student' })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'counsellor') {
    return <div className="error-page">Access denied. Admin privileges required.</div>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && stats && (
          <div>
            <h2>Platform Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.users.total}</p>
                <p className="stat-detail">Students: {stats.users.students}</p>
                <p className="stat-detail">Counsellors: {stats.users.counsellors}</p>
              </div>
              <div className="stat-card">
                <h3>Counselling Sessions</h3>
                <p className="stat-number">{stats.sessions.total}</p>
                <p className="stat-detail">Completed: {stats.sessions.completed}</p>
              </div>
              <div className="stat-card">
                <h3>Career Resources</h3>
                <p className="stat-number">{stats.resources.total}</p>
              </div>
              <div className="stat-card">
                <h3>User Engagements</h3>
                <p className="stat-number">{stats.engagement.total}</p>
              </div>
            </div>

            <h2>Session Status Breakdown</h2>
            <div className="status-breakdown">
              {stats.sessions.byStatus.map((status) => (
                <div key={status._id} className="status-item">
                  <span className={`status-badge status-${status._id}`}>{status._id}</span>
                  <span className="status-count">{status.count}</span>
                </div>
              ))}
            </div>

            {stats.topResources.length > 0 && (
              <>
                <h2>Top Resources by Views</h2>
                <div className="top-resources">
                  {stats.topResources.map((item, idx) => (
                    <div key={idx} className="resource-item">
                      <span className="rank">#{idx + 1}</span>
                      <span className="resource-name">{item.resource[0]?.title || 'Unknown'}</span>
                      <span className="view-count">{item.viewCount} views</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>Student Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Interests</th>
                    <th>Skills</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.interests?.join(', ') || '-'}</td>
                      <td>{user.skills?.join(', ') || '-'}</td>
                      <td>
                        <button className="btn-small">View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h2>Manage Career Resources</h2>
            <p>Resource management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};
