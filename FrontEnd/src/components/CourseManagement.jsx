import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({
    totalCourses: 0,
    published: 0,
    draft: 0,
    revenue: 0,
  });
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Placeholder: all zeros until API connected
    setStats({
      totalCourses: 0,
      published: 0,
      draft: 0,
      revenue: 0,
    });
    setCourses([]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Course Management</h1>
        <div className="flex space-x-3">
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => navigate('/instructor/add-course')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Create New Course
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Courses" value={stats.totalCourses} bg="blue" />
        <StatCard label="Published" value={stats.published} bg="green" />
        <StatCard label="Draft" value={stats.draft} bg="yellow" />
        <StatCard label="Total Revenue" value={`$${stats.revenue}`} bg="purple" />
      </div>

      {/* Course Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No courses available
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-500 py-10">
                      No courses available
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <CourseRow key={course.id} course={course} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;

/* --- Stat Card --- */
const StatCard = ({ label, value, bg }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  };
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center shadow-sm">
      <div className={`p-2 rounded-lg ${colors[bg]}`}>
        {/* Placeholder icon */}
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

/* --- Grid Course Card --- */
const CourseCard = ({ course }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-6 text-center text-gray-500">
      {course?.title || "Course data will appear here"}
    </div>
  </div>
);

const CourseRow = ({ course }) => (
  <tr>
    <td colSpan="7" className="text-center text-gray-500">
      {course?.title || "Course data will appear here"}
    </td>
  </tr>
);
