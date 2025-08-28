import React from 'react';
import { 
  BarChart3, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  CreditCard, 
  Shield, 
  Home 
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Students & Teachers', icon: Users },
    { id: 'verification', label: 'Teacher Verification', icon: ShieldCheck },
    { id: 'courses', label: 'Courses & Classes', icon: BookOpen },
    { id: 'payments', label: 'Payments & Subscriptions', icon: CreditCard },
    { id: 'fraud', label: 'Fraud Detection', icon: Shield }
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: 'white',
      borderRight: '1px solid #e2e8f0',
      padding: '24px 0'
    }}>
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Home size={28} color="#2563eb" />
          EduAdmin
        </h1>
      </div>
      
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                border: 'none',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRight: isActive ? '3px solid #2563eb' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '24px', 
        left: '24px', 
        right: '24px' 
      }}>
        <div style={{
          padding: '16px',
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            Admin Panel v2.0
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            Last updated: Today
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;