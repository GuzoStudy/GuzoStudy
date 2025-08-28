import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  BookOpen,
  Play,
  User,
  X
} from "lucide-react";

const SidebarStudent = ({ isOpen = true, onClose }) => {
  const navItems = [
    { to: "/student/dashboard", icon: Home, label: "Dashboard" },
    { to: "/student/courses", icon: BookOpen, label: "Explore Courses" },
    { to: "/student/my-courses", icon: Play, label: "My Courses" },
    { to: "/student/profile", icon: User, label: "Profile" }
  ];
  

  return (
    <div className="flex min-h-screen">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} />
            <span className="text-lg font-bold text-gray-900">Guzo</span>
          </div>
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100 text-gray-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
              onClick={() => window.innerWidth <= 1024 && onClose()}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Bottom Section */}
          <div className="mt-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Weekly Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">68% completed</p>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarStudent;
