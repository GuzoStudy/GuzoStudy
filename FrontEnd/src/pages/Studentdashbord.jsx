// src/pages/Dashboard.jsx
import { useState } from "react";
import { CoreLearning } from "../components/student/CoreLearning";
import { Analytics } from "../components/student/Analytics";
import { Notifications } from "../components/student/Notifications";
import { Payments } from "../components/student/Payments";
import { Profile } from "../components/student/Profile";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("learning");

  // Mock user data (replace when backend is ready)
  const user = {
    email: "student@example.com",
    name: "Jane Doe",
  };

  const tabs = [
    { id: "learning", label: "My Learning", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "learning":
        return <CoreLearning />;
      case "analytics":
        return <Analytics />;
      case "notifications":
        return <Notifications />;
      case "payments":
        return <Payments />;
      case "profile":
        return <Profile />;
      default:
        return <CoreLearning />;
    }
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white/90 backdrop-blur-xl border-r border-blue-100 shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-blue-100 bg-gradient-to-br from-blue-50/30 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-4 shadow-md">
            🎓
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Student Portal
          </h1>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl mb-2 transition-all duration-300 font-medium ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-blue-100 bg-gradient-to-t from-blue-50/40 to-transparent">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-red-500 to-red-600 shadow-md hover:shadow-lg transition"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 animate-fadeIn">
        {renderContent()}
      </main>
    </div>
  );
};
