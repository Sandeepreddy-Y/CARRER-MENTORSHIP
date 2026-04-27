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
    <div className="schedule-session">
      <div className="form-container">
        <h1>Schedule a Counselling Session</h1>

        {error && <div className="error-message">{error}</div>}

        {fetchingCounsellors ? (
          <div>Loading counsellors...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Counsellor</label>
              <select
                name="counsellorId"
                value={formData.counsellorId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a counsellor</option>
                {counsellors.map((counsellor) => (
                  <option key={counsellor._id} value={counsellor._id}>
                    {counsellor.name} - {counsellor.bio || 'Counsellor'}
                  </option>
                ))}
              </select>
            </div>

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
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="30"
                max="120"
                step="15"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Session'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
