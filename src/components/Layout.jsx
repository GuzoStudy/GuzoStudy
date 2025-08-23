import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-content">
          {children}
        </main>
      </div>
      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
        }
        
        .page-content {
          flex: 1;
          padding: 2rem;
          background-color: #f8fafc;
        }
        
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;