import React from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-button" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search courses, assignments..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="header-right">
          <button className="notification-button">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Student</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 100%;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        
        .menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          color: #6b7280;
        }
        
        .menu-button:hover {
          background-color: #f3f4f6;
        }
        
        .search-container {
          position: relative;
          max-width: 400px;
          flex: 1;
        }
        
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }
        
        .search-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          background-color: #f8fafc;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          background-color: white;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .notification-button {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .notification-button:hover {
          background-color: #f3f4f6;
        }
        
        .notification-badge {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background-color: #ef4444;
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          min-width: 1rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .user-menu:hover {
          background-color: #f3f4f6;
        }
        
        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
        }
        
        .user-name {
          font-weight: 500;
          font-size: 0.875rem;
          color: #1e293b;
        }
        
        .user-role {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 1rem;
          }
          
          .menu-button {
            display: block;
          }
          
          .search-container {
            display: none;
          }
          
          .user-info {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;