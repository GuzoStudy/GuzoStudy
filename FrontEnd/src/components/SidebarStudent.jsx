import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Play, 
  User, 
  Award, 
  Calendar,
  Settings,
  X
} from 'lucide-react';

const SidebarStudent = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/studentdashboard', icon: Home, label: 'Dashboard' },
    { to: '/coursesStudent', icon: BookOpen, label: 'Explore Courses' },
    { to: '/MyCoursesStudent', icon: Play, label: 'My Courses' },
    { to: '/profileStudent', icon: User, label: 'Profile' }
  ];

  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <BookOpen className="logo-icon" size={24} />
            <span className="logo-text">EduDash</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => window.innerWidth <= 768 && onClose()}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="sidebar-bottom">
            <div className="progress-card">
              <h4>Weekly Progress</h4>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '68%' }}></div>
              </div>
              <p className="progress-text">68% completed</p>
            </div>
          </div>
        </nav>
        
        <style jsx>{`
          .overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 199;
            display: none;
          }
          
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 260px;
            height: 100vh;
            background: white;
            border-right: 1px solid #e2e8f0;
            z-index: 200;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
          }
          
          .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .logo-icon {
            color: #2563eb;
          }
          
          .logo-text {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
          }
          
          .close-button {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.25rem;
            color: #6b7280;
          }
          
          .close-button:hover {
            background-color: #f3f4f6;
          }
          
          .sidebar-nav {
            flex: 1;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
          }
          
          .nav-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          
          .nav-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.5rem;
            color: #6b7280;
            text-decoration: none;
            transition: all 0.2s ease;
            border-right: 3px solid transparent;
          }
          
          .nav-link:hover {
            background-color: #f8fafc;
            color: #2563eb;
          }
          
          .nav-link.active {
            background-color: #eff6ff;
            color: #2563eb;
            border-right-color: #2563eb;
            font-weight: 500;
          }
          
          .sidebar-bottom {
            margin-top: auto;
            padding: 1rem 1.5rem;
          }
          
          .progress-card {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
          }
          
          .progress-card h4 {
            margin: 0 0 0.5rem 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: #1e293b;
          }
          
          .progress-text {
            margin: 0.5rem 0 0 0;
            font-size: 0.75rem;
            color: #6b7280;
          }
          
          @media (max-width: 768px) {
            .overlay {
              display: block;
            }
            
            .sidebar {
              transform: translateX(-100%);
            }
            
            .sidebar.open {
              transform: translateX(0);
            }
            
            .close-button {
              display: block;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default SidebarStudent;