import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  BookOpen,
  Clock,
  Target,
  Edit2,
  Save,
  X
} from 'lucide-react';

const ProfileStudent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate learner and developer with a keen interest in modern web technologies. Always eager to expand my skill set and take on new challenges.',
    joinDate: '2023-06-15',
    timezone: 'Pacific Time (PT)',
    learningGoal: 'Complete 5 courses this year',
    weeklyGoal: '10 hours per week'
  });

  const achievements = [
    {
      id: 1,
      title: 'React Master',
      description: 'Completed React Development Course',
      date: '2024-12-15',
      icon: Award,
      color: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Design Enthusiast',
      description: 'Completed UI/UX Design Fundamentals',
      date: '2024-11-28',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 3,
      title: 'Early Bird',
      description: 'Joined the platform in 2023',
      date: '2023-06-15',
      icon: Calendar,
      color: 'text-green-600'
    }
  ];

  const learningStats = [
    { label: 'Courses Completed', value: '3', icon: BookOpen },
    { label: 'Total Study Time', value: '127h', icon: Clock },
    { label: 'Current Streak', value: '15 days', icon: Target },
    { label: 'Certificates Earned', value: '2', icon: Award }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "React Hooks Deep Dive"',
      date: '2 hours ago',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Earned "React Master" achievement',
      date: '1 day ago',
      icon: Award
    },
    {
      id: 3,
      type: 'course_started',
      title: 'Started "Python for Data Science"',
      date: '3 days ago',
      icon: BookOpen
    },
    {
      id: 4,
      type: 'lesson_completed',
      title: 'Completed "Advanced JavaScript Concepts"',
      date: '5 days ago',
      icon: BookOpen
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <div className="profile-info">
          <h1>{profile.firstName} {profile.lastName}</h1>
          <p className="profile-email">{profile.email}</p>
          <div className="profile-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="meta-item">
              <MapPin size={16} />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-primary" onClick={handleSave}>
                <Save size={16} />
                Save
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="stats-section">
        <h2>Learning Statistics</h2>
        <div className="stats-grid">
          {learningStats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Recent Activity
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="profile-details">
              <div className="card">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.firstName}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.lastName}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.email}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.phone}</p>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.location}</p>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="form-input"
                        rows="3"
                      />
                    ) : (
                      <p className="form-value">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3>Learning Preferences</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Learning Goal</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.learningGoal}
                        onChange={(e) => handleInputChange('learningGoal', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.learningGoal}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weekly Goal</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.weeklyGoal}
                        onChange={(e) => handleInputChange('weeklyGoal', e.target.value)}
                        className="form-input"
                      />
                    ) : (
                      <p className="form-value">{profile.weeklyGoal}</p>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Timezone</label>
                    {isEditing ? (
                      <select
                        value={profile.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="form-input"
                      >
                        <option value="Pacific Time (PT)">Pacific Time (PT)</option>
                        <option value="Mountain Time (MT)">Mountain Time (MT)</option>
                        <option value="Central Time (CT)">Central Time (CT)</option>
                        <option value="Eastern Time (ET)">Eastern Time (ET)</option>
                      </select>
                    ) : (
                      <p className="form-value">{profile.timezone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-content">
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <div className={`achievement-icon ${achievement.color}`}>
                    <achievement.icon size={24} />
                  </div>
                  <div className="achievement-content">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    <span className="achievement-date">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-content">
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <activity.icon size={16} />
                  </div>
                  <div className="activity-content">
                    <p>{activity.title}</p>
                    <span className="activity-date">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .profile-header {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .profile-avatar {
          width: 5rem;
          height: 5rem;
          background: #2563eb;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-info h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .profile-email {
          color: #6b7280;
          margin-bottom: 1rem;
        }
        
        .profile-meta {
          display: flex;
          gap: 2rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .profile-actions {
          flex-shrink: 0;
        }
        
        .edit-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .stats-section {
          margin-bottom: 2rem;
        }
        
        .stats-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .stat-icon {
          width: 3rem;
          height: 3rem;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .profile-tabs {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
        }
        
        .tab {
          background: none;
          border: none;
          padding: 1rem 1.5rem;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }
        
        .tab-content {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .profile-details {
          display: grid;
          gap: 2rem;
        }
        
        .card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .form-group.full-width {
          grid-column: span 2;
        }
        
        .form-value {
          padding: 0.75rem 0;
          color: #4b5563;
          margin: 0;
        }
        
        .achievements-grid {
          display: grid;
          gap: 1.5rem;
        }
        
        .achievement-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
        }
        
        .achievement-icon {
          width: 3rem;
          height: 3rem;
          background: white;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .achievement-content h4 {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        
        .achievement-content p {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        
        .achievement-date {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .activity-list {
          display: grid;
          gap: 1rem;
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        
        .activity-icon {
          width: 2rem;
          height: 2rem;
          background: #2563eb;
          color: white;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .activity-content p {
          font-weight: 500;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }
        
        .activity-date {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-group.full-width {
            grid-column: span 1;
          }
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .profile-meta {
            justify-content: center;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .edit-actions {
            flex-direction: column;
          }
          
          .profile-info h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileStudent;