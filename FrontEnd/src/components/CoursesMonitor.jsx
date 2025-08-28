import React, { useState } from 'react';
import { Search, Play, Users, Clock, Star, MoreVertical } from 'lucide-react';

const CoursesMonitor = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. James Miller',
      category: 'Web Development',
      students: 1245,
      rating: 4.8,
      price: 199,
      status: 'published',
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      title: 'Data Science with Python',
      instructor: 'Prof. Lisa Anderson',
      category: 'Data Science',
      students: 892,
      rating: 4.9,
      price: 249,
      status: 'published',
      createdDate: '2024-01-18',
      lastUpdated: '2024-01-22'
    },
    {
      id: 3,
      title: 'Mobile App Development',
      instructor: 'Dr. Robert Taylor',
      category: 'Mobile Development',
      students: 567,
      rating: 4.7,
      price: 179,
      status: 'draft',
      createdDate: '2024-01-20',
      lastUpdated: '2024-01-25'
    }
  ];

  const liveClasses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Dr. James Miller',
      course: 'Complete Web Development Bootcamp',
      scheduledTime: '2024-01-30 14:00',
      duration: 90,
      attendees: 45,
      maxAttendees: 50,
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      instructor: 'Prof. Lisa Anderson',
      course: 'Data Science with Python',
      scheduledTime: '2024-01-30 16:00',
      duration: 120,
      attendees: 38,
      maxAttendees: 40,
      status: 'live'
    },
    {
      id: 3,
      title: 'iOS Development Workshop',
      instructor: 'Dr. Robert Taylor',
      course: 'Mobile App Development',
      scheduledTime: '2024-01-31 10:00',
      duration: 180,
      attendees: 25,
      maxAttendees: 30,
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'draft': return '#f59e0b';
      case 'suspended': return '#ef4444';
      case 'live': return '#ef4444';
      case 'scheduled': return '#2563eb';
      case 'completed': return '#64748b';
      default: return '#64748b';
    }
  };

  const filteredData = (activeTab === 'courses' ? courses : liveClasses).filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Courses & Live Classes Monitor
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Monitor course performance, manage live classes, and track engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '12px' }}>
              <Play size={24} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Total Courses</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>163</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
              <Users size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Total Enrollments</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>12,847</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
              <Clock size={24} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Live Classes Today</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>8</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
              <Star size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Avg Rating</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>4.8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {['courses', 'live-classes'].map(tab => (
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
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
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
              placeholder={`Search ${activeTab.replace('-', ' ')}...`}
              className="input"
              style={{ paddingLeft: '44px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary">Filter</button>
          <button className="btn-primary">
            {activeTab === 'courses' ? 'Add Course' : 'Schedule Class'}
          </button>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'courses' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Course Info</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(course => (
                  <tr key={course.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: '600' }}>{course.title}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>
                          Created: {course.createdDate}
                        </p>
                      </div>
                    </td>
                    <td>{course.instructor}</td>
                    <td>
                      <span style={{ 
                        backgroundColor: '#e0f2fe', 
                        color: '#0369a1',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {course.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        {course.students}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        {course.rating}
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>${course.price}</td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getStatusColor(course.status)}20`,
                        color: getStatusColor(course.status)
                      }}>
                        {course.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#64748b' }}>
                      {course.lastUpdated}
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
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Class Info</th>
                  <th>Instructor</th>
                  <th>Course</th>
                  <th>Scheduled Time</th>
                  <th>Duration</th>
                  <th>Attendees</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(liveClass => (
                  <tr key={liveClass.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: '600' }}>{liveClass.title}</p>
                      </div>
                    </td>
                    <td>{liveClass.instructor}</td>
                    <td style={{ fontSize: '14px', color: '#64748b' }}>
                      {liveClass.course}
                    </td>
                    <td style={{ fontSize: '14px' }}>
                      {new Date(liveClass.scheduledTime).toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} />
                        {liveClass.duration} min
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={14} />
                        {liveClass.attendees}/{liveClass.maxAttendees}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getStatusColor(liveClass.status)}20`,
                        color: getStatusColor(liveClass.status)
                      }}>
                        {liveClass.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                          {liveClass.status === 'live' ? 'Join' : 'Edit'}
                        </button>
                        <button style={{ 
                          border: 'none', 
                          backgroundColor: 'transparent', 
                          cursor: 'pointer',
                          padding: '4px'
                        }}>
                          <MoreVertical size={16} color="#64748b" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesMonitor;