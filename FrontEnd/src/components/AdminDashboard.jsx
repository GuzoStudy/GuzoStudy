import React, { useState } from 'react';
import Sidebar from './Sidebar';
// import StudentsTeachersManager from './StudentsTeachersManager';
import StudentsTeachersManager from './StudentsTeachersManger'
import TeacherVerification from './TeacherVerfication';
import CoursesMonitor from './CoursesMonitor';
import PaymentsSubscriptions from './PaymentsSubscriptions';
import FraudDetection from './FraudDeection';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('analytics');

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'users':
        return <StudentsTeachersManager />;
      case 'verification':
        return <TeacherVerification />;
      case 'courses':
        return <CoursesMonitor />;
      case 'payments':
        return <PaymentsSubscriptions />;
      case 'fraud':
        return <FraudDetection />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main style={{ flex: 1, padding: '32px', backgroundColor: '#f8fafc' }}>
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;