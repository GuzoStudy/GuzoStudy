import { useState } from "react";

export const Notifications = () => {
  // Mock notifications (replace later with API)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Announcement",
      message: "Your instructor posted an update about the final project.",
      type: "announcement",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 2,
      title: "Upcoming Deadline",
      message: "Assignment 3 is due tomorrow at 11:59 PM.",
      type: "deadline",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: 3,
      title: "Feedback Received",
      message: "Your quiz submission has been graded.",
      type: "feedback",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ]);

  const [filter, setFilter] = useState("all");

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  };

  const getNotificationIcon = (type) => {
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

  const getNotificationColor = (type) => {
    switch (type) {
      case "announcement":
        return "bg-blue-500";
      case "deadline":
        return "bg-orange-500";
      case "feedback":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "unread", "announcement", "deadline", "feedback"].map(
          (filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition
                ${
                  filter === filterType
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {filterType}
            </button>
          )
        )}
      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium mb-2">No notifications</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`p-4 rounded-lg border cursor-pointer transition
                ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-blue-500"
                }`}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-md text-white ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {notification.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString()}{" "}
                      at {new Date(notification.created_at).toLocaleTimeString()}
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
