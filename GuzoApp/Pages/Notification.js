import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";

const Notification = () => {
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
      message:
        "Your JavaScript quiz is due tomorrow. Don’t forget to complete it!",
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
        return { backgroundColor: "#E0F2FE", color: "#2563EB" };
      case "deadline":
        return { backgroundColor: "#FFF7ED", color: "#EA580C" };
      case "feedback":
        return { backgroundColor: "#ECFDF5", color: "#16A34A" };
      default:
        return { backgroundColor: "#F9FAFB", color: "#6B7280" };
    }
  };

  const filtered = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Notifications{" "}
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>({unreadCount} unread)</Text>
          )}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark All as Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {["all", "unread", "announcement", "deadline", "feedback"].map(
          (type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filter === type && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(type)}>
              <Text
                style={[
                  styles.filterText,
                  filter === type && styles.activeFilterText,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubText}>You're all caught up 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const colorStyle = getColor(item.type);
            return (
              <TouchableOpacity
                onPress={() => !item.read && markAsRead(item.id)}
                style={[
                  styles.notificationCard,
                  item.read ? styles.readCard : styles.unreadCard,
                ]}>
                <View style={styles.notificationRow}>
                  <Text style={styles.icon}>{getIcon(item.type)}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{item.title}</Text>
                      {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                    <View style={styles.footerRow}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: colorStyle.backgroundColor },
                        ]}>
                        <Text
                          style={[
                            styles.badgeText,
                            { color: colorStyle.color },
                          ]}>
                          {item.type}
                        </Text>
                      </View>
                      <Text style={styles.date}>
                        {new Date(item.created_at).toLocaleDateString()} •{" "}
                        {new Date(item.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
  },
  unreadCount: {
    color: "#65A30D",
    fontSize: 14,
  },
  markAllButton: {
    backgroundColor: "#8BD02A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#374151",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeFilterButton: {
    backgroundColor: "#8BD02A",
  },
  activeFilterText: {
    color: "#fff",
  },
  notificationCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  unreadCard: {
    borderColor: "#8BD02A",
    backgroundColor: "#F9FAFB",
  },
  readCard: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  notificationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  icon: {
    fontSize: 26,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: "#8BD02A",
    borderRadius: 4,
  },
  message: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  date: {
    fontSize: 11,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptySubText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
