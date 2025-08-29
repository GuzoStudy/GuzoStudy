// components/StudentWrapper.jsx
import React from "react";
import SidebarStudent from "./SidebarStudent";

// Import student pages
import StudantDashboard from "../pages/StudentDashboard";
import CoursesStudent from "../pages/CoursesStudent";
import MyCoursesStudent from "../pages/MyCoursesStudent";
import CourseDetailStudent from "../pages/CourseDetailStudent";
import ProfileStudent from "../pages/ProfileStudent";
import Explore from "../pages/Explore";

const StudentWrapper = ({ pageId }) => {
  const renderPage = () => {
    switch (pageId) {
      case "dashboard":
        return <StudantDashboard />;
      case "courses":
        return <Explore />;
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
    <div className="flex">
      <SidebarStudent />
      <main className="flex-1 p-6 bg-gray-50">
        {renderPage()}
      </main>
    </div>
  );
};

export default StudentWrapper;
