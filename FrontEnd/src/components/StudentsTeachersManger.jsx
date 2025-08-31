import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';

const StudentsTeachersManager = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', phone: '+1 234 567 8901', courses: 3, status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 234 567 8902', courses: 5, status: 'active', joinDate: '2024-02-20' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '+1 234 567 8903', courses: 2, status: 'suspended', joinDate: '2024-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1 234 567 8904', courses: 4, status: 'active', joinDate: '2024-01-05' }
  ];

  const teachers = [
    { id: 1, name: 'Dr. James Miller', email: 'james@example.com', phone: '+1 234 567 9001', courses: 12, students: 450, status: 'verified', rating: 4.9, joinDate: '2023-09-15' },
    { id: 2, name: 'Prof. Lisa Anderson', email: 'lisa@example.com', phone: '+1 234 567 9002', courses: 8, students: 320, status: 'verified', rating: 4.8, joinDate: '2023-11-20' },
    { id: 3, name: 'Dr. Robert Taylor', email: 'robert@example.com', phone: '+1 234 567 9003', courses: 15, students: 680, status: 'pending', rating: 4.7, joinDate: '2024-01-10' },
    { id: 4, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 234 567 9004', courses: 6, students: 200, status: 'verified', rating: 4.9, joinDate: '2023-12-05' }
  ];

  const filteredData = (activeTab === 'students' ? students : teachers).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Students & Teachers Management
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Manage user accounts, permissions, and monitor activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Total Students</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>2,485</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Active Teachers</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>158</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Pending Verifications</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>23</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>Suspended Accounts</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>12</p>
        </div>
      </div>

      <div className="card">
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {['students', 'teachers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === tab ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="input"
              style={{ paddingLeft: '44px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} />
            Filter
          </button>
          <button className="btn-primary">
            Add New {activeTab === 'students' ? 'Student' : 'Teacher'}
          </button>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                {activeTab === 'students' ? <th>Courses Enrolled</th> : <th>Courses Created</th>}
                {activeTab === 'teachers' && <th>Students</th>}
                {activeTab === 'teachers' && <th>Rating</th>}
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <p style={{ fontWeight: '600' }}>{item.name}</p>
                      <p style={{ fontSize: '14px', color: '#64748b' }}>ID: {item.id}</p>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Mail size={14} />
                        {item.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={14} />
                        {item.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{item.courses}</span>
                  </td>
                  {activeTab === 'teachers' && (
                    <>
                      <td>
                        <span style={{ fontWeight: '600' }}>{item.students}</span>
                      </td>
                      <td>
                        <span style={{ 
                          backgroundColor: '#fef3c7', 
                          color: '#92400e',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          ⭐ {item.rating}
                        </span>
                      </td>
                    </>
                  )}
                  <td>
                    <span className={`status-badge status-${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '14px', color: '#64748b' }}>
                    {item.joinDate}
                  </td>
                  <td>
                    <button style={{ 
                      border: 'none', 
                      backgroundColor: 'transparent', 
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '4px'
                    }}>
                      <MoreVertical size={16} color="#64748b" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsTeachersManager;