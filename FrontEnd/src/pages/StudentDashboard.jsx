import React from 'react';
import { Link } from 'react-router-dom';
import Explore from './Explore';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  PlayCircle,
  ArrowRight
} from 'lucide-react';

const StudentDashboard = () => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: '6',
      change: '+2 this week',
      color: 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white'
    },
    {
      icon: Clock,
      label: 'Hours Studied',
      value: '24.5',
      change: '+5.2 this week',
      color: 'bg-gradient-to-tr from-green-500 to-emerald-500 text-white'
    },
    {
      icon: Award,
      label: 'Certificates',
      value: '3',
      change: '+1 this month',
      color: 'bg-gradient-to-tr from-yellow-400 to-orange-400 text-white'
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: '87%',
      change: '+3% this month',
      color: 'bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white'
    }
  ];

  const recentCourses = [
    {
      id: 1,
      title: 'Full Stack Development with React',
      instructor: 'Abebe Bekele',
      progress: 75,
      lastAccessed: '2 hours ago',
      image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 2,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Mekdes Alemu',
      progress: 45,
      lastAccessed: '1 day ago',
      image: 'https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      instructor: 'Getachew Tadesse',
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
    <div className="dashboard max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome back to <span className="text-blue-600">Guzo</span>, Saba! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Keep pushing forward — your learning journey is moving strong!
          </p>
        </div>
        <Link
          to="/Explore"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow hover:opacity-90 transition"
        >
          <BookOpen size={18} />
          Explore Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition">
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
              <stat.icon size={28} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
            <div className="text-sm font-medium text-green-600 mt-1">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning + Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
            <Link
              to="/student/my-courses"
              className="text-blue-600 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 ml-4">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500">by {course.instructor}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    <PlayCircle size={14} />
                    Continue
                  </button>
                  <p className="text-xs text-gray-400 mt-2">{course.lastAccessed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Deadlines</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className={`p-4 rounded-lg border-l-4 ${
                  deadline.priority === 'high'
                    ? 'border-red-500 bg-red-50'
                    : deadline.priority === 'medium'
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <h4 className="font-semibold text-gray-900">{deadline.title}</h4>
                <p className="text-sm text-gray-600">{deadline.course}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Due: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                  <span className="capitalize font-medium">
                    {deadline.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 bg-gray-100 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition">
            <Calendar size={16} className="inline-block mr-2" />
            View Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
