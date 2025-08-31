import React from "react";
import { View, StyleSheet } from "react-native";
import SidebarStudent from "./SidebarStudent";

// Import student pages
import StudantDashboard from "../pages/StudentDashboard";
import CoursesStudent from "../pages/CoursesStudent";
import MyCoursesStudent from "../pages/MyCoursesStudent";
import CourseDetailStudent from "../pages/CourseDetailStudent";
import ProfileStudent from "../pages/ProfileStudent";

const StudentWrapper = ({ pageId }) => {
  const renderPage = () => {
    switch (pageId) {
      case "dashboard":
        return <StudantDashboard />;
      case "courses":
        return <CoursesStudent />;
      case "my-courses":
        return <MyCoursesStudent />;
      case "profile":
        return <ProfileStudent />;
      case "course-detail":
        return <CourseDetailStudent />;
      default:
        return <StudantDashboard />; // fallback
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <SidebarStudent />
      </View>
      <View style={styles.mainContent}>{renderPage()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Sidebar + content side by side (if screen size allows)
    backgroundColor: "#f9fafb",
  },
  sidebar: {
    width: 250, // fixed width for sidebar (adjust as needed)
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  mainContent: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f3f4f6", // gray-50
  },
});

export default StudentWrapper;
