import { useState } from 'react';

export const CourseManagement = () => {
  const [activeView, setActiveView] = useState('pending');

  // ✅ Mock Data
  const pendingCourses = [
    {
      id: 1,
      courses: { title: 'Introduction to Web Development', description: 'Learn HTML, CSS, and JavaScript basics.' },
      instructors: { profiles: { full_name: 'John Doe' } },
      submitted_at: '2024-08-12T00:00:00Z',
    },
    {
      id: 2,
      courses: { title: 'Data Structures in C++', description: 'Master stacks, queues, and trees.' },
      instructors: { profiles: { full_name: 'Jane Smith' } },
      submitted_at: '2024-09-05T00:00:00Z',
    },
  ];

  const reportedCourses = [
    {
      id: 1,
      courses: { title: 'Python for Beginners' },
      profiles: { full_name: 'Alex Brown' },
      reason: 'Inappropriate content',
      description: 'Contains misleading examples.',
      created_at: '2024-09-10T00:00:00Z',
    },
  ];

  const categories = [
    { id: 1, name: 'Technology', description: 'Tech-related courses', icon: '💻', active: true },
    { id: 2, name: 'Design', description: 'Creative design and UX', icon: '🎨', active: false },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Course Management
        </h2>
        <p className="text-gray-500 text-sm">Manage course approvals, reports, and categories</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {['pending', 'reported', 'categories'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-3 font-semibold rounded-xl text-sm transition-all ${
              activeView === view
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md'
                : 'bg-white border border-blue-100 text-gray-700 hover:bg-blue-50'
            }`}
          >
            {view === 'pending'
              ? `Pending Approvals (${pendingCourses.length})`
              : view === 'reported'
              ? `Reported (${reportedCourses.length})`
              : `Categories (${categories.length})`}
          </button>
        ))}
      </div>

      {/* Pending Approvals */}
      {activeView === 'pending' && (
        <div className="grid gap-5">
          {pendingCourses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-blue-100">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-gray-500 text-base">No pending course approvals</p>
            </div>
          ) : (
            pendingCourses.map((approval) => (
              <div
                key={approval.id}
                className="border border-blue-100 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {approval.courses?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Instructor: {approval.instructors?.profiles?.full_name}
                    </p>
                    <p className="text-sm text-gray-600">{approval.courses?.description}</p>
                    <p className="text-xs text-gray-400 mt-3">
                      Submitted: {new Date(approval.submitted_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-3 ml-6">
                    <button className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-lg shadow-md">
                      Approve
                    </button>
                    <button className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg shadow-md">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reported Courses */}
      {activeView === 'reported' && (
        <div className="grid gap-5">
          {reportedCourses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-blue-100">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500 text-base">No reported courses</p>
            </div>
          ) : (
            reportedCourses.map((report) => (
              <div
                key={report.id}
                className="border border-orange-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {report.courses?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Reported by:</strong> {report.profiles?.full_name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p className="text-sm text-gray-600">{report.description}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Reported: {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Categories */}
      {activeView === 'categories' && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-blue-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition text-center"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-base font-bold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                  category.active
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700'
                }`}
              >
                {category.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
