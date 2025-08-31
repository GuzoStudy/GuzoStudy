import React, { useState } from 'react';
import { studentProgressData, enrollmentData } from '../data/teacherData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const StudentProgress = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState('overview');

  const progressStats = [
    { label: 'Excellent (90-100%)', count: 142, color: '#10B981', percentage: 35 },
    { label: 'Good (80-89%)', count: 186, color: '#3B82F6', percentage: 45 },
    { label: 'Average (70-79%)', count: 98, color: '#F59E0B', percentage: 15 },
    { label: 'Needs Help (<70%)', count: 21, color: '#EF4444', percentage: 5 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Student Progress</h1>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Courses</option>
            <option>JavaScript Basics</option>
            <option>React Advanced</option>
            <option>Python Basics</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Export Report
          </button>
        </div>
      </div>

      {/* Progress Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {progressStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
              <span className="text-xs text-gray-500">{stat.percentage}%</span>
            </div>
            <p className="text-lg font-semibold text-gray-800">{stat.count}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* View Mode Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setViewMode('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('individual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'individual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Individual Progress
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              viewMode === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Enrollment Trend */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Student Enrollment Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newStudents" stroke="#3B82F6" strokeWidth={2} name="New Students" />
                  <Line type="monotone" dataKey="totalStudents" stroke="#10B981" strokeWidth={2} name="Total Students" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Progress Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ label, percentage }) => `${label.split(' ')[0]} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {progressStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Recent Student Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentProgressData.map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">{student.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          student.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {viewMode === 'individual' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Individual Student Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentProgressData.map((student, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-medium">{student.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.course}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Grade: <span className="font-medium">{student.grade}</span></span>
                    <span className="text-gray-500">{student.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Completion Rates by Course</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">JavaScript Basics</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">React Advanced</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                  <span className="text-sm font-medium">74%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Python Basics</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-sm font-medium">91%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Student Engagement Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Session Duration</span>
                <span className="text-sm font-semibold">42 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Quiz Completion Rate</span>
                <span className="text-sm font-semibold">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Assignment Submission Rate</span>
                <span className="text-sm font-semibold">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Discussion Participation</span>
                <span className="text-sm font-semibold">67%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Video Watch Completion</span>
                <span className="text-sm font-semibold">78%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Student Details - {selectedStudent.name}</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <p className="text-sm text-gray-900">{selectedStudent.course}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Overall Progress</label>
                  <p className="text-sm text-gray-900">{selectedStudent.progress}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Grade</label>
                  <p className="text-sm text-gray-900">{selectedStudent.grade}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Active</label>
                  <p className="text-sm text-gray-900">{selectedStudent.lastActive}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                  Send Message
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm">
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;