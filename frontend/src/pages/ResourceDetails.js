import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { careerResourceAPI } from '../api/client';
import '../styles/ResourceDetails.css';

export const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await careerResourceAPI.getResourceById(id);
        setResource(response.data);
      } catch (err) {
        setError('Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (loading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!resource) return <div className="error-state">Resource not found</div>;

  const categoryImage = ['Engineering', 'Business', 'Healthcare', 'IT', 'Finance', 'Creative', 'Education'].includes(resource.category) 
    ? resource.category.toLowerCase() 
    : 'other';

  return (
    <div className="resource-details">
      <div className="details-hero" style={{ backgroundImage: `url('/images/${categoryImage}.png')` }}>
        <div className="details-hero-content">
          <span className="details-category">{resource.category}</span>
          <h1>{resource.title}</h1>
        </div>
      </div>

      <div className="details-container">
        <div className="details-main">
          <div className="details-section">
            <h2>About the Role</h2>
            <p>{resource.description}</p>
          </div>

          {resource.educationRequired && (
            <div className="details-section">
              <h2>Educational Requirements</h2>
              <p>{resource.educationRequired}</p>
            </div>
          )}

          {resource.skills && resource.skills.length > 0 && (
            <div className="details-section">
              <h2>Required Skills</h2>
              <div className="details-skills">
                {resource.skills.map((skill, index) => (
                  <span key={index} className="details-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {resource.resourceLinks && resource.resourceLinks.length > 0 && (
            <div className="details-section">
              <h2>Helpful Resources</h2>
              {resource.resourceLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="link-item">
                  {link.title} ({link.type})
                </a>
              ))}
            </div>
          )}
          
          <a href="/career-paths" className="back-link">← Back to Career Paths</a>
        </div>

        <div className="details-sidebar">
          {resource.salary && (
            <div className="details-card salary-box">
              <h3>Estimated Salary</h3>
              <p className="amount">${resource.salary.min.toLocaleString()} - ${resource.salary.max.toLocaleString()}</p>
            </div>
          )}

          {resource.jobOutlook && (
            <div className="details-card outlook-box">
              <h2>Job Outlook</h2>
              <p>{resource.jobOutlook}</p>
            </div>
          )}

          <div className="details-card">
            <h2>Need Guidance?</h2>
            <p>Talk to a professional counsellor about pursuing a career as a {resource.title}.</p>
            <button className="btn-schedule" onClick={() => navigate('/schedule-session')}>
              Schedule a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
