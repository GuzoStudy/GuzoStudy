import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle2, Clock, BookOpen, Award } from 'lucide-react';

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeCourses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'Sarah Johnson',
      progress: 75,
      totalLessons: 42,
      completedLessons: 32,
      lastAccessed: '2 hours ago',
      nextLesson: 'React Hooks Deep Dive',
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400',
      estimatedTime: '8 hours left'
    },
    {
      id: 2,
      title: 'Advanced JavaScript ES6+',
      instructor: 'Mike Chen',
      progress: 45,
      totalLessons: 38,
      completedLessons: 17,
      lastAccessed: '1 day ago',
      nextLesson: 'Async/Await Patterns',
      image: 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=400',
      estimatedTime: '21 hours left'
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'Dr. Lisa Wang',
      progress: 20,
      totalLessons: 45,
      completedLessons: 9,
      lastAccessed: '3 days ago',
      nextLesson: 'Pandas DataFrames',
      image: 'https://images.pexels.com/photos/574070/pexels-photo-574070.jpeg?auto=compress&cs=tinysrgb&w=400',
      estimatedTime: '36 hours left'
    }
  ];

  const completedCourses = [
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Emily Davis',
      completedDate: '2024-12-15',
      grade: 'A+',
      certificateAvailable: true,
      rating: 5,
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      totalLessons: 28
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'Alex Rodriguez',
      completedDate: '2024-11-28',
      grade: 'A',
      certificateAvailable: true,
      rating: 4,
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      totalLessons: 32
    }
  ];

  

  return (
    <div className="my-courses-page">
      <div className="page-header">
        <h1>My Courses</h1>
        <p className="text-gray-600">Track your learning progress and continue your educational journey.</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon active">
            <PlayCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{activeCourses.length}</div>
            <div className="stat-label">Active Courses</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{completedCourses.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon time">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">65h</div>
            <div className="stat-label">Hours Remaining</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon cert">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">2</div>
            <div className="stat-label">Certificates</div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="course-tabs">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <PlayCircle size={16} />
          Active Courses ({activeCourses.length})
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle2 size={16} />
          Completed ({completedCourses.length})
        </button>
      </div>

      {/* Active Courses */}
      {activeTab === 'active' && (
        <div className="courses-section">
          {activeCourses.map(course => (
            <div key={course.id} className="course-card active-course">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="progress-overlay">
                  <div className="progress-circle">
                    <div className="progress-text">{course.progress}%</div>
                  </div>
                </div>
              </div>
              
              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                </div>
                
                <div className="course-progress-section">
                  <div className="progress-info">
                    <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
                    <span className="estimated-time">{course.estimatedTime}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="next-lesson">
                  <span className="next-label">Next:</span>
                  <span className="next-title">{course.nextLesson}</span>
                </div>
                
                <div className="course-actions">
                  <Link to={`/course/${course.id}`} className="btn-primary">
                    <PlayCircle size={16} />
                    Continue Learning
                  </Link>
                  <div className="last-accessed">
                    Last accessed {course.lastAccessed}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Courses */}
      {activeTab === 'completed' && (
        <div className="courses-section">
          {completedCourses.map(course => (
            <div key={course.id} className="course-card completed-course">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="completion-badge">
                  <CheckCircle2 size={24} />
                </div>
              </div>
              
              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                </div>
                
                <div className="completion-details">
                  <div className="detail-item">
                    <span className="detail-label">Completed:</span>
                    <span>{new Date(course.completedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Grade:</span>
                    <span className="grade">{course.grade}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Lessons:</span>
                    <span>{course.totalLessons} completed</span>
                  </div>
                </div>
                
                <div className="course-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < course.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="rating-text">Your rating</span>
                </div>
                
                <div className="course-actions">
                  {course.certificateAvailable && (
                    <button className="btn-primary">
                      <Award size={16} />
                      Download Certificate
                    </button>
                  )}
                  <Link to={`/course/${course.id}`} className="btn-secondary">
                    <BookOpen size={16} />
                    Review Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .my-courses-page {
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
        }
        
        .stat-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .stat-icon.active { background-color: #2563eb; }
        .stat-icon.completed { background-color: #059669; }
        .stat-icon.time { background-color: #f59e0b; }
        .stat-icon.cert { background-color: #8b5cf6; }
        
        .stat-number {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .course-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }
        
        .tab {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }
        
        .courses-section {
          display: grid;
          gap: 2rem;
        }
        
        .course-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          display: flex;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }
        
        .course-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .course-image {
          position: relative;
          width: 200px;
          height: 200px;
          flex-shrink: 0;
        }
        
        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .progress-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }
        
        .progress-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: rgba(37, 99, 235, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(37, 99, 235, 0.3);
        }
        
        .progress-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #2563eb;
        }
        
        .completion-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(5, 150, 105, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          padding: 0.5rem;
          color: #059669;
        }
        
        .course-content {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .course-header {
          margin-bottom: 1rem;
        }
        
        .course-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .course-instructor {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .course-progress-section {
          margin-bottom: 1rem;
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .estimated-time {
          color: #6b7280;
        }
        
        .next-lesson {
          margin-bottom: 1.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border-left: 3px solid #2563eb;
        }
        
        .next-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .next-title {
          font-weight: 500;
          color: #1e293b;
        }
        
        .completion-details {
          margin-bottom: 1rem;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .detail-label {
          color: #6b7280;
        }
        
        .grade {
          font-weight: 600;
          color: #059669;
        }
        
        .course-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .stars {
          display: flex;
          gap: 0.125rem;
        }
        
        .star {
          color: #d1d5db;
          font-size: 1.25rem;
        }
        
        .star.filled {
          color: #f59e0b;
        }
        
        .rating-text {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .course-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .last-accessed {
          font-size: 0.75rem;
          color: #6b7280;
          margin-left: auto;
        }
        
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .course-card {
            flex-direction: column;
          }
          
          .course-image {
            width: 100%;
            height: 200px;
          }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .course-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .last-accessed {
            margin-left: 0;
            text-align: center;
            margin-top: 0.5rem;
          }
          
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyCourses;