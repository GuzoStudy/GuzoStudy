// Dashboard.js (Updated with clearer sidebar and adjusted menu position)

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import components
import CoreLearning from "../components/CoreLearning";
import Analytics from "../components/Analytics";
import Notifications from "../Pages/Notification";
import Payments from "../components/Payments";
import Profile from "../Pages/ProfileStudent";

const SCREEN_WIDTH = Dimensions.get("window").width;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("learning");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const user = {
    email: "student@example.com",
    name: "Jane Doe",
  };

  const tabs = [
    { id: "learning", label: "My Learning", icon: "book-outline" },
    { id: "analytics", label: "Analytics", icon: "stats-chart-outline" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "notifications-outline",
    },
    { id: "payments", label: "Payments", icon: "card-outline" },
    { id: "profile", label: "Profile", icon: "person-outline" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

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
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={28} color="#4CAF50" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>📘 My Learning Journey</Text>
      </View>

      {/* Sidebar (animated) */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>🎓</Text>
          </View>
          <Text style={styles.title}>Student Portal</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <ScrollView style={styles.nav}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => {
                setActiveTab(tab.id);
                toggleMenu();
              }}
              style={[
                styles.navButton,
                activeTab === tab.id && styles.navButtonActive,
              ]}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.id ? "white" : "#444"}
                style={styles.navIcon}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeTab === tab.id && styles.navLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.signOutContainer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Dim overlay when sidebar is open */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Main content */}
      <ScrollView style={styles.mainContent}>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF9",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18, // increased padding to lower the menu icon
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomColor: "#C8E6C9",
    borderBottomWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  menuButton: {
    marginRight: 12,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 250,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "#C8E6C9",
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 0 },
    shadowRadius: 5,
    elevation: 15,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#D0F0D0",
    backgroundColor: "#F3FBF6",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#8BD02A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  email: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  nav: {
    flex: 1,
    padding: 10,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  navButtonActive: {
    backgroundColor: "#8BD02A",
  },
  navIcon: {
    marginRight: 10,
  },
  navLabel: {
    fontSize: 16,
    color: "#333",
  },
  navLabelActive: {
    color: "white",
    fontWeight: "bold",
  },
  signOutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0F0E0",
    padding: 10,
  },
  signOutButton: {
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
});
