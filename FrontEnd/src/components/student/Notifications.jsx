import { useState } from "react";

export const Notifications = () => {
  // --- Mock Notifications ---
  const mockNotifications = [
    {
      id: 1,
      title: "New Course Announcement",
      message: "A new advanced React course has been added to your dashboard.",
      type: "announcement",
      created_at: "2025-10-03T10:00:00Z",
      read: false,
    },
    {
      id: 2,
      title: "Quiz Deadline Reminder",
      message: "Your JavaScript quiz is due tomorrow. Don’t forget to complete it!",
      type: "deadline",
      created_at: "2025-10-02T15:30:00Z",
      read: false,
    },
    {
      id: 3,
      title: "Instructor Feedback Available",
      message: "You have new feedback on your last assignment from John Doe.",
      type: "feedback",
      created_at: "2025-10-01T09:15:00Z",
      read: true,
    },
    {
      id: 4,
      title: "Platform Update",
      message: "We’ve improved course navigation for a smoother experience.",
      type: "announcement",
      created_at: "2025-09-28T11:45:00Z",
      read: true,
    },
  ];

  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  // --- Helpers ---
  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "announcement":
        return "📢";
      case "deadline":
        return "⏰";
      case "feedback":
        return "💬";
      default:
        return "🔔";
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "announcement":
        return "text-blue-500 bg-blue-50";
      case "deadline":
        return "text-sky-500 bg-sky-50";
      case "feedback":
        return "text-indigo-500 bg-indigo-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const filtered = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white min-h-screen rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              ({unreadCount} unread)
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium shadow hover:shadow-md transition-all"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["all", "unread", "announcement", "deadline", "feedback"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === type
                  ? "bg-[#3B82F6] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Notifications */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium">No notifications</p>
          <p className="text-sm mt-2">You're all caught up 🎉</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                n.read
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-[#3B82F6]"
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="text-2xl">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-gray-800">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 bg-[#3B82F6] rounded-full mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{n.message}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${getColor(
                        n.type
                      )}`}
                    >
                      {n.type}
                    </span>
                    <span>
                      {new Date(n.created_at).toLocaleDateString()} •{" "}
                      {new Date(n.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
