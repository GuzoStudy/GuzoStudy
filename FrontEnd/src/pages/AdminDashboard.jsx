import { useState } from "react";
// import { PlatformAnalytics } from "../../components/admin/PlatformAnalytics";
import { PlatformAnalytics } from "../components/admin/PlatformAnalytics"
import { UserManagement } from "../components/admin/UserManagement";
import { CourseManagement } from "../components/admin/CourseManagement";
import { FinanceTransactions } from "../components/admin/FinanceTransactions";
import { ModerationReports } from "../components/admin/ModerationReports";
import { Settings } from "../components/admin/Settings";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  // Mock admin data (ready for backend API integration)
  const mockAdmin = {
    name: "Admin User",
    email: "admin@example.com",
  };

  const tabs = [
    { id: "analytics", label: "Platform Analytics", icon: "📊" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "courses", label: "Course Management", icon: "📚" },
    { id: "finance", label: "Finance & Transactions", icon: "💳" },
    { id: "moderation", label: "Moderation & Reports", icon: "📑" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <PlatformAnalytics />;
      case "users":
        return <UserManagement />;
      case "courses":
        return <CourseManagement />;
      case "finance":
        return <FinanceTransactions />;
      case "moderation":
        return <ModerationReports />;
      case "settings":
        return <Settings />;
      default:
        return <PlatformAnalytics />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Sidebar */}
      <aside className="w-72 bg-white/95 backdrop-blur-xl border-r border-blue-100 shadow-md flex flex-col">
        <div className="p-8 border-b border-blue-100 bg-gradient-to-br from-blue-50/60 to-transparent">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl mb-4 shadow-md">
            👨‍💼
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500 truncate">{mockAdmin.email}</p>
        </div>

        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl text-left font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md font-semibold"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-100 bg-gradient-to-t from-blue-50/40">
       
          <button
            onClick={() => alert('Sign Out Clicked')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-red-500 to-red-600 shadow-md hover:shadow-lg transition"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto animate-fadeIn p-6">
        {renderContent()}
      </main>
    </div>
  );
};
