import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../styles/SessionDetails.css';

export const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getUserSessions();
      // Since there's no specific getSessionById exposed directly without proper auth flow sometimes,
      // we filter from the user's sessions list to be safe.
      const foundSession = response.data.find(s => s._id === id);
      if (foundSession) {
        setSession(foundSession);
      } else {
        setError('Session not found or you are not authorized to view it.');
      }
    } catch (err) {
      setError('Failed to fetch session details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      try {
        await sessionAPI.cancelSession(id);
        alert('Session cancelled successfully.');
        fetchSessionDetails(); // Refresh data
      } catch (err) {
        alert('Failed to cancel session.');
      }
    }
  };

  if (loading) return <div className="session-details-page"><h2>Loading...</h2></div>;
  if (error) return <div className="session-details-page"><h2 style={{color: 'red'}}>{error}</h2></div>;
  if (!session) return null;

  const sessionDate = new Date(session.scheduledDate);
  
  return (
    <div className="session-details-page">
      <div>
        <a href="/dashboard" className="back-link">← Back to Dashboard</a>
        <div className="session-container">
          <div className="session-main-card">
            <div className="session-header">
              <span className={`status-badge ${session.status}`}>{session.status}</span>
              <h1 style={{marginTop: '15px'}}>{session.title}</h1>
            </div>

            <div className="session-info-group">
              <h3>Description / Goals</h3>
              <p>{session.description || 'No description provided.'}</p>
            </div>

            <div className="session-info-group">
              <h3>Date & Time</h3>
              <p>{sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>

            <div className="session-info-group">
              <h3>Duration</h3>
              <p>{session.duration} minutes</p>
            </div>

            <div className="action-buttons">
              {session.status === 'scheduled' && (
                <>
                  <button className="btn-action btn-primary" onClick={() => alert('Virtual meeting link will be available 5 minutes before the session starts.')}>
                    Join Virtual Meeting
                  </button>
                  <button className="btn-action btn-danger" onClick={handleCancel}>
                    Cancel Session
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="session-side-card">
            <div className="counsellor-profile">
              <div className="counsellor-avatar">
                {session.counsellor.name.charAt(0)}
              </div>
              <h2>{session.counsellor.name}</h2>
              <div className="email">{session.counsellor.email}</div>
              
              {session.counsellor.bio && (
                <div className="bio">
                  <strong>About Counsellor:</strong><br />
                  {session.counsellor.bio}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
