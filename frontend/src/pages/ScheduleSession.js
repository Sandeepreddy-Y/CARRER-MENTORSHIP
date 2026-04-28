import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';
import '../styles/ScheduleSession.css';

export const ScheduleSession = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counsellors, setCounsellors] = useState([]);
  const [formData, setFormData] = useState({
    counsellorId: '',
    title: '',
    description: '',
    scheduledDate: '',
    duration: 60
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCounsellors, setFetchingCounsellors] = useState(true);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchCounsellors();
    }
  }, [user]);

  const fetchCounsellors = async () => {
    try {
      const response = await sessionAPI.getAvailableCounsellors();
      setCounsellors(response.data);
    } catch (error) {
      setError('Failed to fetch counsellors');
      console.error(error);
    } finally {
      setFetchingCounsellors(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sessionAPI.scheduleSession({
        counsellorId: formData.counsellorId,
        title: formData.title,
        description: formData.description,
        scheduledDate: new Date(formData.scheduledDate),
        duration: parseInt(formData.duration)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule session');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'student') {
    return <div className="error-page">Only students can schedule sessions</div>;
  }

  return (
    <div className="schedule-container">
      <h1>Schedule a Counselling Session</h1>

      {error && <div className="alert-error">{error}</div>}

      {fetchingCounsellors ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading counsellors...</div>
      ) : (
        <div className="schedule-content">
          <div className="counsellors-section">
            <h2>Select a Counsellor</h2>
            <div className="counsellors-list">
              {counsellors.map((counsellor) => (
                <div 
                  key={counsellor.id} 
                  className={`counsellor-card ${formData.counsellorId === counsellor.id ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, counsellorId: counsellor.id })}
                >
                  <h3>{counsellor.name}</h3>
                  <p>{counsellor.bio || 'Professional Career Counsellor'}</p>
                  {counsellor.skills && counsellor.skills.length > 0 && (
                    <div className="expertise-tags">
                      {counsellor.skills.map((skill, index) => (
                        <span key={index}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {counsellors.length === 0 && (
                <p style={{ color: 'var(--text-secondary)' }}>No counsellors available right now.</p>
              )}
            </div>
          </div>

          <div className="booking-section">
            <h2>Session Details</h2>
            <form className="schedule-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Session Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Career Guidance Session"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what you'd like to discuss"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Date and Time</label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>

              <button type="submit" className="btn-submit" disabled={loading || !formData.counsellorId}>
                {loading ? 'Scheduling...' : 'Confirm Session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
