import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import SidebarStudent from "../components/SidebarStudent";
import { Menu } from "lucide-react-native";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://guzostudy.onrender.com/api/notifications/my"
      );
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title || "No Title"}</Text>
      <Text style={styles.message}>{item.message || "No message"}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => setIsSidebarOpen(true)}>
          <Menu size={24} color="#111827" />
        </TouchableOpacity>

        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 12 }}>Loading notifications…</Text>

        {isSidebarOpen && (
          <SidebarStudent isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Menu button to toggle sidebar */}
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => setIsSidebarOpen(true)}>
        <Menu size={24} color="#111827" />
      </TouchableOpacity>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingTop: 10 }}
        />
      ) : (
        <View style={styles.centerBox}>
          <Text style={styles.noNotifText}>No notifications found.</Text>
        </View>
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <SidebarStudent isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  menuBtn: {
    position: "absolute",
    top: 20,
    left: 16,
    zIndex: 100,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ffffffcc",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotifText: {
    color: "#6b7280",
    fontSize: 16,
  },
});

export default Notification;
