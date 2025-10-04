import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Student components
import { CoreLearning } from "../components/student/CoreLearning";
import { Analytics } from "../components/student/Analytics";
import { Notifications } from "../components/student/Notifications";
import { Payments } from "../components/student/Payments";
import { Profile } from "../components/student/Profile";

const StudentDashboard = () => {   // 🔹 FIXED name (uppercase)
  const navigate = useNavigate();

  const user = { id: "123", email: "student@example.com", name: "Jane Doe" };
  const [activeTab, setActiveTab] = useState("learning");

  const handleSignOut = () => {
    navigate("/login");
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold mb-1">Student Portal</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default StudentDashboard;
