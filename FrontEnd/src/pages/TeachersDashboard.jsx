import React, { useState } from 'react';
import Dheader from '../components/Dheader';
import TSidebar from '../components/TSidebar';
import Dashboard from '../components/Dashboard';
import CourseManagement from '../components/CourseManagement';
import LiveClasses from '../components/LiveClasses';
import StudentProgress from '../components/StudentProgress';
import EarningsReport from '../components/EarningsReport';
import Profile from '../components/Profile';
import Messages from '../components/Messages';
import Settings from '../components/Settings';

import Header from '../components/Header';
import Footer from '../components/Footer';

function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <CourseManagement />;
      case 'live-classes':
        return <LiveClasses />;
      case 'students':
        return <StudentProgress />;
      case 'earnings':
        return <EarningsReport />;
      case 'profile':
        return <Profile />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (

    <>
    <Header />

    <div className="flex flex-col min-h-screen bg-gray-50">
      <Dheader />
      <div className="flex flex-1">
        <TSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default TeacherDashboard;