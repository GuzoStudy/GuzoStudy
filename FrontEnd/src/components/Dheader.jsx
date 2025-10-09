import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Dheader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
const goToProfile = () => {
    navigate("/instructor/profile");
  };
  // Dummy notifications (replace with API later)
  const notifications = [
    { id: 1, type: 'enrollment', message: 'New student enrolled in JavaScript Basics', time: '2 min ago' },
    { id: 2, type: 'payment', message: 'Payment received for 1-on-1 session', time: '5 min ago' },
    { id: 3, type: 'live', message: 'Live class starting in 30 minutes', time: '25 min ago' },
    { id: 4, type: 'question', message: 'Student question in React Advanced course', time: '1 hour ago' },
  ];

  // Load user from localStorage
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://guzostudy-1.onrender.com/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  };

  

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-blue-600">Guzo</span>
          <span className="text-gray-800">Study</span>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search courses, students..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Actions */}
          <a href="https://vc-frontend2.vercel.app" target="_blank" rel="noopener noreferrer">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Start Live Class
            </button>
          </a>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-400 hover:text-gray-600 relative"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 3a1 1 0 00-1 1v8l-2 2H6a1 1 0 00-1 1v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-1-1h-3l-2-2V4a1 1 0 00-1-1z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-blue-600 text-sm hover:text-blue-700">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          {currentUser && (
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <img
                  src={
                    currentUser.profilePic ||
                    `https://ui-avatars.com/api/?name=${currentUser.name}`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Hi, {currentUser.name}</span>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all">
                <button
                  onClick={goToProfile}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Dheader;
