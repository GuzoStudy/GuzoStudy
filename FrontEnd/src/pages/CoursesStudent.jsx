import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Users, Clock, BookOpen } from 'lucide-react';

const   CoursesStudent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'data-science', label: 'Data Science' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'Sarah Johnson',
      category: 'programming',
      level: 'intermediate',
      rating: 4.8,
      students: 2840,
      duration: '42 hours',
      price: 89.99,
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Master React from fundamentals to advanced concepts including hooks, context, and testing.'
    },
    {
      id: 2,
      title: 'Advanced JavaScript ES6+',
      instructor: 'Mike Chen',
      category: 'programming',
      level: 'advanced',
      rating: 4.9,
      students: 1920,
      duration: '38 hours',
      price: 79.99,
      image: 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Deep dive into modern JavaScript features, async programming, and best practices.'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Davis',
      category: 'design',
      level: 'beginner',
      rating: 4.7,
      students: 3150,
      duration: '28 hours',
      price: 69.99,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn design principles, user research, wireframing, and prototyping.'
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'Alex Rodriguez',
      category: 'marketing',
      level: 'intermediate',
      rating: 4.6,
      students: 2640,
      duration: '32 hours',
      price: 74.99,
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Comprehensive digital marketing including SEO, social media, and analytics.'
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'Dr. Lisa Wang',
      category: 'data-science',
      level: 'beginner',
      rating: 4.8,
      students: 4200,
      duration: '45 hours',
      price: 94.99,
      image: 'https://images.pexels.com/photos/574070/pexels-photo-574070.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn Python programming for data analysis, visualization, and machine learning.'
    },
    {
      id: 6,
      title: 'Business Strategy & Leadership',
      instructor: 'James Wilson',
      category: 'business',
      level: 'advanced',
      rating: 4.7,
      students: 1580,
      duration: '24 hours',
      price: 84.99,
      image: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Strategic thinking, leadership skills, and business management principles.'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Explore Courses</h1>
        <p className="text-gray-600">Discover new skills and advance your career with our comprehensive courses.</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          <button className="btn-secondary">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span>{filteredCourses.length} courses found</span>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <div className="course-level">
                {course.level}
              </div>
            </div>
            
            <div className="course-content">
              <div className="course-category">
                {categories.find(c => c.value === course.category)?.label}
              </div>
              
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">by {course.instructor}</p>
              <p className="course-description">{course.description}</p>
              
              <div className="course-stats">
                <div className="stat">
                  <Star className="stat-icon" size={16} />
                  <span>{course.rating}</span>
                </div>
                <div className="stat">
                  <Users className="stat-icon" size={16} />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="stat">
                  <Clock className="stat-icon" size={16} />
                  <span>{course.duration}</span>
                </div>
              </div>
              
              <div className="course-footer">
                <div className="course-price">
                  <span className="price">${course.price}</span>
                </div>
                <Link to={`/course/${course.id}`} className="btn-primary">
                  <BookOpen size={16} />
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .courses-page {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .page-header {
          margin-bottom: 2rem;
        }
        
        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }
        
        .filters-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .search-container {
          position: relative;
          flex: 1;
          min-width: 300px;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }
        
        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: white;
        }
        
        .filter-controls {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        
        .filter-select {
          padding: 0.875rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background: white;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .results-info {
          margin-bottom: 1.5rem;
          font-weight: 500;
          color: #4b5563;
        }
        
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .course-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
        }
        
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .course-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .course-level {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(37, 99, 235, 0.9);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .course-content {
          padding: 1.5rem;
        }
        
        .course-category {
          font-size: 0.75rem;
          font-weight: 500;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        
        .course-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }
        
        .course-instructor {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.75rem;
        }
        
        .course-description {
          font-size: 0.875rem;
          color: #4b5563;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        
        .course-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .stat-icon {
          color: #f59e0b;
        }
        
        .course-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .course-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .price::before {
          content: '$';
        }
        
        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-container {
            min-width: 100%;
          }
          
          .filter-controls {
            flex-wrap: wrap;
          }
          
          .courses-grid {
            grid-template-columns: 1fr;
          }
          
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesStudent;