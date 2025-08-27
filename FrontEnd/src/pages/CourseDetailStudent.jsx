import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, 
  Clock, 
  Users, 
  Star, 
  CheckCircle2, 
  Lock,
  Download,
  ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';

const CourseDetailStudent = () => {
  const { id } = useParams();
  const [activeModule, setActiveModule] = useState(0);

  // Mock course data - in real app, fetch based on ID
  const course = {
    id: parseInt(id),
    title: 'Complete React Development Course',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    students: 2840,
    duration: '42 hours',
    price: 89.99,
    level: 'Intermediate',
    language: 'English',
    image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Master React from fundamentals to advanced concepts including hooks, context, and testing. This comprehensive course covers everything you need to become a professional React developer.',
    learningOutcomes: [
      'Build modern React applications from scratch',
      'Understand React hooks and functional components',
      'Implement state management with Context API',
      'Create responsive and accessible user interfaces',
      'Write comprehensive tests for React components',
      'Deploy React applications to production'
    ],
    prerequisites: [
      'Basic JavaScript knowledge',
      'HTML and CSS fundamentals',
      'Understanding of ES6+ features'
    ],
    modules: [
      {
        title: 'Getting Started with React',
        lessons: [
          { id: 1, title: 'Introduction to React', duration: '12:30', completed: true, locked: false },
          { id: 2, title: 'Setting up Development Environment', duration: '18:45', completed: true, locked: false },
          { id: 3, title: 'Your First React Component', duration: '15:20', completed: true, locked: false },
          { id: 4, title: 'JSX and React Elements', duration: '22:10', completed: false, locked: false }
        ]
      },
      {
        title: 'Components and Props',
        lessons: [
          { id: 5, title: 'Functional vs Class Components', duration: '16:30', completed: false, locked: false },
          { id: 6, title: 'Props and Component Communication', duration: '20:15', completed: false, locked: false },
          { id: 7, title: 'Component Composition', duration: '14:45', completed: false, locked: false },
          { id: 8, title: 'Props Validation with PropTypes', duration: '11:20', completed: false, locked: false }
        ]
      },
      {
        title: 'State Management',
        lessons: [
          { id: 9, title: 'Introduction to React Hooks', duration: '19:30', completed: false, locked: true },
          { id: 10, title: 'useState Hook Deep Dive', duration: '25:45', completed: false, locked: true },
          { id: 11, title: 'useEffect and Side Effects', duration: '28:20', completed: false, locked: true },
          { id: 12, title: 'Custom Hooks', duration: '22:15', completed: false, locked: true }
        ]
      }
    ]
  };

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((acc, module) => 
    acc + module.lessons.filter(lesson => lesson.completed).length, 0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const toggleModule = (moduleIndex) => {
    setActiveModule(activeModule === moduleIndex ? -1 : moduleIndex);
  };

  return (
    <div className="course-detail">
      <div className="course-header">
        <div className="header-content">
          <div className="course-info">
            <div className="breadcrumb">
              <Link to="/courses">Courses</Link> / <span>{course.title}</span>
            </div>
            
            <h1>{course.title}</h1>
            <p className="instructor">by {course.instructor}</p>
            
            <div className="course-meta">
              <div className="meta-item">
                <Star className="meta-icon" size={16} />
                <span>{course.rating} ({course.students.toLocaleString()} students)</span>
              </div>
              <div className="meta-item">
                <Clock className="meta-icon" size={16} />
                <span>{course.duration}</span>
              </div>
              <div className="meta-item">
                <Users className="meta-icon" size={16} />
                <span>{course.level}</span>
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-info">
                <span>Your Progress: {completedLessons}/{totalLessons} lessons completed</span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="course-image">
            <img src={course.image} alt={course.title} />
            <div className="play-overlay">
              <PlayCircle size={48} />
              <span>Continue Learning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-body">
        <div className="course-content">
          {/* Course Description */}
          <section className="content-section">
            <h2>About This Course</h2>
            <p>{course.description}</p>
          </section>

          {/* Learning Outcomes */}
          <section className="content-section">
            <h2>What You'll Learn</h2>
            <ul className="outcomes-list">
              {course.learningOutcomes.map((outcome, index) => (
                <li key={index}>
                  <CheckCircle2 size={16} />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prerequisites */}
          <section className="content-section">
            <h2>Prerequisites</h2>
            <ul className="prerequisites-list">
              {course.prerequisites.map((prereq, index) => (
                <li key={index}>{prereq}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Course Curriculum */}
        <div className="course-sidebar">
          <div className="curriculum-card">
            <div className="card-header">
              <h3>Course Curriculum</h3>
              <span className="lesson-count">{totalLessons} lessons</span>
            </div>
            
            <div className="modules-list">
              {course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="module">
                  <div 
                    className="module-header"
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    <div className="module-info">
                      {activeModule === moduleIndex ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                      <span className="module-title">{module.title}</span>
                    </div>
                    <span className="lesson-count">{module.lessons.length} lessons</span>
                  </div>
                  
                  {activeModule === moduleIndex && (
                    <div className="lessons-list">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className={`lesson ${lesson.completed ? 'completed' : ''} ${lesson.locked ? 'locked' : ''}`}>
                          <div className="lesson-info">
                            <div className="lesson-icon">
                              {lesson.locked ? (
                                <Lock size={14} />
                              ) : lesson.completed ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <PlayCircle size={14} />
                              )}
                            </div>
                            <span className="lesson-title">{lesson.title}</span>
                          </div>
                          <span className="lesson-duration">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="curriculum-actions">
              <button className="btn-primary w-full">
                <PlayCircle size={16} />
                Continue Learning
              </button>
              <button className="btn-secondary w-full mt-2">
                <Download size={16} />
                Download Resources
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .course-detail {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .course-header {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .header-content {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
        }
        
        .course-info {
          flex: 1;
        }
        
        .breadcrumb {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }
        
        .breadcrumb a {
          color: #2563eb;
          text-decoration: none;
        }
        
        .course-info h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        .instructor {
          font-size: 1.125rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        
        .course-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .meta-icon {
          color: #6b7280;
        }
        
        .progress-section {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }
        
        .progress-percentage {
          font-weight: 600;
          color: #2563eb;
        }
        
        .course-image {
          position: relative;
          width: 400px;
          height: 250px;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .course-image:hover {
          transform: scale(1.02);
        }
        
        .course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .course-image:hover .play-overlay {
          opacity: 1;
        }
        
        .play-overlay span {
          margin-top: 0.5rem;
          font-weight: 500;
        }
        
        .course-body {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }
        
        .content-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .content-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .content-section p {
          color: #4b5563;
          line-height: 1.6;
        }
        
        .outcomes-list,
        .prerequisites-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .outcomes-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: #4b5563;
        }
        
        .outcomes-list svg {
          color: #059669;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }
        
        .prerequisites-list li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        .prerequisites-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #2563eb;
          font-weight: bold;
        }
        
        .curriculum-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .card-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }
        
        .lesson-count {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }
        
        .modules-list {
          margin-bottom: 1.5rem;
        }
        
        .module {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        
        .module-header {
          padding: 0.75rem 1rem;
          background: #f8fafc;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s ease;
        }
        
        .module-header:hover {
          background: #f1f5f9;
        }
        
        .module-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .module-title {
          font-weight: 500;
          color: #1e293b;
        }
        
        .lessons-list {
          border-top: 1px solid #e2e8f0;
        }
        
        .lesson {
          padding: 0.75rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .lesson:last-child {
          border-bottom: none;
        }
        
        .lesson:hover:not(.locked) {
          background: #f8fafc;
        }
        
        .lesson-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .lesson-icon {
          color: #6b7280;
        }
        
        .lesson.completed .lesson-icon {
          color: #059669;
        }
        
        .lesson.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .lesson-title {
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .lesson.completed .lesson-title {
          color: #059669;
        }
        
        .lesson-duration {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .curriculum-actions {
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        
        @media (max-width: 1024px) {
          .course-body {
            grid-template-columns: 1fr;
          }
          
          .curriculum-card {
            position: relative;
            top: 0;
          }
          
          .header-content {
            flex-direction: column;
            gap: 2rem;
          }
          
          .course-image {
            width: 100%;
            max-width: 400px;
          }
        }
        
        @media (max-width: 768px) {
          .course-header {
            padding: 1.5rem;
          }
          
          .course-info h1 {
            font-size: 1.75rem;
          }
          
          .course-meta {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .content-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseDetailStudent;