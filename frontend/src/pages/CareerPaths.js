import React, { useState, useEffect } from 'react';
import { careerResourceAPI } from '../api/client';
import '../styles/CareerPaths.css';

export const CareerPaths = () => {
  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Engineering',
    'Business',
    'Healthcare',
    'IT',
    'Finance',
    'Creative',
    'Education',
    'Other'
  ];

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, search]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await careerResourceAPI.getAllResources({
        category: selectedCategory || undefined,
        search: search || undefined
      });
      setResources(response.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-paths">
      <h1>Explore Career Paths</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
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
                  <p className="description">{resource.description}</p>

                  {resource.skills && resource.skills.length > 0 && (
                    <div className="skills">
                      <strong>Required Skills:</strong>
                      <div className="skills-tags">
                        {resource.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resource.salary && (
                    <p className="salary">
                      Salary: ${resource.salary.min} - ${resource.salary.max}
                    </p>
                  )}

                  <a href={`/resources/${resource._id}`} className="btn-view">
                    Learn More
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && resources.length === 0 && (
        <p className="no-results">No career paths found. Try adjusting your filters.</p>
      )}
    </div>
  );
};
