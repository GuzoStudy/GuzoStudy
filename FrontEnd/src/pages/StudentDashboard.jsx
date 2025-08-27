import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  PlayCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: '6',
      change: '+2 this week',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Hours Studied',
      value: '24.5',
      change: '+5.2 this week',
      color: 'text-green-600'
    },
    {
      icon: Award,
      label: 'Certificates',
      value: '3',
      change: '+1 this month',
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: '87%',
      change: '+3% this month',
      color: 'text-purple-600'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'React Development Masterclass',
      instructor: 'Sarah Johnson',
      progress: 75,
      lastAccessed: '2 hours ago',
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Mike Chen',
      progress: 45,
      lastAccessed: '1 day ago',
      image: 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      instructor: 'Emily Davis',
      progress: 90,
      lastAccessed: '3 days ago',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'React Project Submission',
      course: 'React Development',
      dueDate: '2025-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'JavaScript Quiz',
      course: 'Advanced JavaScript',
      dueDate: '2025-01-18',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Design Portfolio Review',
      course: 'UI/UX Design',
      dueDate: '2025-01-22',
      priority: 'low'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, John! 👋</h1>
          <p className="text-gray-600">Here's what's happening with your learning journey today.</p>
        </div>
        <Link to="/courses" className="btn-primary">
          <BookOpen size={20} />
          Explore Courses
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">Continue Learning</h2>
              <Link to="/my-courses" className="text-blue-600 font-medium flex items-center gap-1">
                View All
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <button className="btn-primary btn-small">
                      <PlayCircle size={16} />
                      Continue
                    </button>
                    <p className="text-xs text-gray-500 mt-2">{course.lastAccessed}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="card-title">Upcoming Deadlines</h2>
              <Calendar size={20} className="text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="border-l-4 border-blue-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">{deadline.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{deadline.course}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Due: {new Date(deadline.dueDate).toLocaleDateString()}
                    </span>
                    <span className={`badge ${
                      deadline.priority === 'high' ? 'badge-warning' : 
                      deadline.priority === 'medium' ? 'badge-info' : 'badge-success'
                    }`}>
                      {deadline.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="btn-secondary w-full mt-4">
              <Calendar size={16} />
              View Calendar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }
        
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        @media (max-width: 1024px) {
          .col-span-2 {
            grid-column: span 3;
          }
          
          .grid.grid-cols-3 {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .dashboard-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;