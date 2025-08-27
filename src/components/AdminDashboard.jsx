import React, { useState } from "react";
import Sidebaradmin from "./Sidebaradmin";
import StudentsTeachersManager from "./StudentsTeachersManager";
import TeacherVerification from "./TeacherVerfication";
import CoursesMonitor from "./CoursesMonitor";
import PaymentsSubscriptions from "./PaymentsSubscriptions";
import FraudDetection from "./FraudDetection";
import AnalyticsDashboard from "./AnalyticsDashboard";
import "./AdminDashboard.css"; // custom styles only for this page

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("analytics");

  const renderContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "users":
        return <StudentsTeachersManager />;
      case "verification":
        return <TeacherVerification />;
      case "courses":
        return <CoursesMonitor />;
      case "payments":
        return <PaymentsSubscriptions />;
      case "fraud":
        return <FraudDetection />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebaradmin
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <main className="admin-main fade-in">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
