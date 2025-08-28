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
    firstName: 'Nahom',
    lastName: 'Tesfaye',
    email: 'nahom.tesfaye@guzo.et',
    phone: '+251 911 234 567',
    location: 'Addis Ababa, Ethiopia',
    bio: 'Curious learner exploring programming and design. I believe education is the key to building the future of Ethiopia.',
    joinDate: '2024-03-10',
    timezone: 'East Africa Time (EAT)',
    learningGoal: 'Finish 10 Guzo courses in 2025',
    weeklyGoal: '12 hours per week'
  });

  const achievements = [
    {
      id: 1,
      title: 'Amharic Web Developer',
      description: 'Completed Guzo’s React in Amharic course',
      date: '2024-12-15',
      icon: Award,
      color: 'text-blue-600'
    },
    {
      id: 2,
      title: 'Digital Innovator',
      description: 'Presented project in local hackathon',
      date: '2024-11-28',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 3,
      title: 'Early Guzo Explorer',
      description: 'Joined Guzo community in 2024',
      date: '2024-03-10',
      icon: Calendar,
      color: 'text-green-600'
    }
  ];

  const learningStats = [
    { label: 'Courses Completed', value: '5', icon: BookOpen },
    { label: 'Total Study Time', value: '142h', icon: Clock },
    { label: 'Current Streak', value: '21 days', icon: Target },
    { label: 'Certificates Earned', value: '3', icon: Award }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Finished "JavaScript ከመሠረት እስከ ላይ"',
      date: '4 hours ago',
      icon: BookOpen
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Earned "Amharic Web Developer" certificate',
      date: '2 days ago',
      icon: Award
    },
    {
      id: 3,
      type: 'course_started',
      title: 'Started "Python for Data Science"',
      date: '1 week ago',
      icon: BookOpen
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save changes to backend here
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 md:p-10 mb-10 shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-100">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white">
          <User size={40} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-500">{profile.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Calendar size={16}/> Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><MapPin size={16}/> {profile.location}</span>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={16}/> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
                onClick={handleSave}
              >
                <Save size={16}/> Save
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center gap-2 hover:bg-gray-300"
                onClick={handleCancel}
              >
                <X size={16}/> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Learning on Guzo</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {learningStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow border border-gray-100 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl mb-3">
                <stat.icon size={24}/>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-6 mb-6">
        {['overview','achievements','activity'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium transition-colors ${
              activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'achievements' ? 'Achievements' : 'Recent Activity'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                {['firstName','lastName','email','phone','location','bio'].map((field) => (
                  <div key={field}>
                    <label className="text-sm text-gray-500 capitalize">{field}</label>
                    {isEditing ? (
                      field === 'bio' ? (
                        <textarea 
                          value={profile[field]}
                          onChange={(e)=>handleInputChange(field,e.target.value)}
                          className="w-full mt-1 p-2 border rounded-lg"
                        />
                      ) : (
                        <input 
                          type="text"
                          value={profile[field]}
                          onChange={(e)=>handleInputChange(field,e.target.value)}
                          className="w-full mt-1 p-2 border rounded-lg"
                        />
                      )
                    ) : (
                      <p className="text-gray-800 mt-1">{profile[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Learning Preferences</h3>
              <div className="space-y-3">
                {['learningGoal','weeklyGoal','timezone'].map(field => (
                  <div key={field}>
                    <label className="text-sm text-gray-500 capitalize">{field}</label>
                    {isEditing ? (
                      <input 
                        type="text"
                        value={profile[field]}
                        onChange={(e)=>handleInputChange(field,e.target.value)}
                        className="w-full mt-1 p-2 border rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-800 mt-1">{profile[field]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map(item => (
              <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow">
                <div className={`p-3 rounded-lg bg-gray-50 ${item.color}`}>
                  <item.icon size={24}/>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Earned {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {recentActivity.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-sm">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <item.icon size={18}/>
                </div>
                <div>
                  <p className="text-gray-800">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStudent;
