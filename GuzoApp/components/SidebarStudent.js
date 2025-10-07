import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Home, BookOpen, Play, User, X, Bell } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const SidebarStudent = ({ isOpen = true, onClose }) => {
  const navigation = useNavigation();

  const navItems = [
    { screen: "StudentDashboard", icon: Home, label: "Dashboard" },
    { screen: "ExploreStudent", icon: BookOpen, label: "Explore Courses" },
    { screen: "MyCoursesStudent", icon: Play, label: "My Courses" },
    { screen: "Notification", icon: Bell, label: "Notifications" },
    { screen: "ProfileStudent", icon: User, label: "Profile" },
  ];

  if (!isOpen) return null; // hide completely when closed

  return (
    <View style={styles.overlayWrapper}>
      {/* Dark overlay */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Sidebar */}
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <BookOpen size={24} color="#2563eb" />
            <Text style={styles.brandText}>Guzo</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        <ScrollView contentContainerStyle={styles.navContainer}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => {
                navigation.navigate(item.screen);
                onClose();
              }}
              style={styles.navItem}
            >
              <item.icon size={20} color="#374151" />
              <Text style={styles.navText}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Weekly Progress */}
          <View style={styles.progressBox}>
            <Text style={styles.progressTitle}>Weekly Progress</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "68%" }]} />
            </View>
            <Text style={styles.progressLabel}>68% completed</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    flexDirection: "row",
    zIndex: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sidebar: {
    width: 260,
    height: "100%",
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 20,
    zIndex: 101, // 👈 always above overlay
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 8,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 8,
  },
  navContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
  },
  progressBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#2563eb",
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 6,
  },
});

export default SidebarStudent;
