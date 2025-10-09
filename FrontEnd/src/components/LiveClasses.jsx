import React, { useState, useEffect } from 'react';

const LiveClasses = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [liveStats, setLiveStats] = useState({
    classesThisWeek: 0,
    totalAttendees: 0,
    averageDuration: '0h',
    satisfaction: '0/5',
  });
  const [liveClasses, setLiveClasses] = useState({
    upcoming: [],
    scheduled: [],
    history: [],
  });

  // Fetch live classes and stats from backend API
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // Replace these URLs with your actual backend endpoints
        const statsRes = await fetch('/api/live-stats');
        const statsData = await statsRes.json();

        const classesRes = await fetch('/api/live-classes');
        const classesData = await classesRes.json();

        setLiveStats({
          classesThisWeek: statsData.classesThisWeek || 0,
          totalAttendees: statsData.totalAttendees || 0,
          averageDuration: statsData.averageDuration || '0h',
          satisfaction: statsData.satisfaction || '0/5',
        });

        setLiveClasses({
          upcoming: classesData.filter(c => c.status === 'upcoming') || [],
          scheduled: classesData.filter(c => c.status === 'scheduled') || [],
          history: classesData.filter(c => c.status === 'history') || [],
        });
      } catch (err) {
        console.error('Error fetching live classes data:', err);
      }
    };

    fetchLiveData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Live Classes</h1>
        <div className="flex space-x-3">
          <a href="https://vc-frontend2.vercel.app" target="_blank" rel="noopener noreferrer">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Start Live Class
            </button>
          </a>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Schedule Class
          </button>
        </div>
      </div>

      {/* Live Class Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Classes This Week" value={liveStats.classesThisWeek} color="green" icon="calendar" />
        <StatCard label="Total Attendees" value={liveStats.totalAttendees} color="blue" icon="users" />
        <StatCard label="Average Duration" value={liveStats.averageDuration} color="purple" icon="clock" />
        <StatCard label="Satisfaction" value={liveStats.satisfaction} color="yellow" icon="star" />
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        upcomingCount={liveClasses.upcoming.length}
        scheduledCount={liveClasses.scheduled.length}
        historyCount={liveClasses.history.length}
      />

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'upcoming'
          ? liveClasses.upcoming
          : activeTab === 'scheduled'
          ? liveClasses.scheduled
          : liveClasses.history
        ).map((cls) => (
          <ClassCard key={cls.id} cls={cls} activeTab={activeTab} />
        ))}

        {/* Show empty state if no classes */}
        {((activeTab === 'upcoming' && liveClasses.upcoming.length === 0) ||
          (activeTab === 'scheduled' && liveClasses.scheduled.length === 0) ||
          (activeTab === 'history' && liveClasses.history.length === 0)) && (
          <p className="col-span-full text-center text-gray-500 py-10">No classes available</p>
        )}
      </div>

      {/* Schedule Class Modal */}
      {showScheduleModal && <ScheduleClassModal onClose={() => setShowScheduleModal(false)} />}
    </div>
  );
};

export default LiveClasses;

// ----------------------
// Helper Components
// ----------------------

const StatCard = ({ label, value, color, icon }) => {
  const colors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const icons = {
    calendar: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    users: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
    clock: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    star: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{icons[icon]}</div>
        <div className="ml-3">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const Tabs = ({ activeTab, setActiveTab, upcomingCount, scheduledCount, historyCount }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      <button
        onClick={() => setActiveTab('upcoming')}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'upcoming'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        Upcoming ({upcomingCount})
      </button>
      <button
        onClick={() => setActiveTab('scheduled')}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'scheduled'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        Scheduled ({scheduledCount})
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={`py-2 px-1 border-b-2 font-medium text-sm ${
          activeTab === 'history'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        History ({historyCount})
      </button>
    </nav>
  </div>
);

const ClassCard = ({ cls, activeTab }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{cls.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{cls.date} at {cls.time}</p>
        <p className="text-sm text-gray-600 mb-1">{cls.duration}</p>
        <p className="text-sm text-gray-600">{cls.students} students</p>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${cls.type === '1-to-1' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
        {cls.type}
      </span>
    </div>
    <div className="flex space-x-2">
      {activeTab === 'upcoming' && (
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium">
          Start Class
        </button>
      )}
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium">
        {activeTab === 'upcoming' ? 'Join' : 'Edit'}
      </button>
      <button className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
        Details
      </button>
    </div>
  </div>
);

const ScheduleClassModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Dark overlay */}
    <div
      className="absolute inset-0 bg-black opacity-50"
      onClick={onClose}
    ></div>

    {/* Modal box */}
    <div className="relative bg-white rounded-lg p-6 w-full max-w-lg z-10">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule New Class</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Class Title</label>
          <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="time" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              <option>1 hour</option>
              <option>1.5 hours</option>
              <option>2 hours</option>
              <option>3 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Type</label>
            <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Team Class</option>
              <option>1-to-1</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" rows={3}></textarea>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Schedule Class
          </button>
        </div>
      </form>
    </div>
  </div>
);
