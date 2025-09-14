import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const InstructorProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    title: '',
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [],
    education: '',
    experience: '',
    languages: [],
    linkedin: '',
    twitter: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const [achievements, setAchievements] = useState([
    { title: '', description: '', date: '' }
  ]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const addSpecialty = () => {
    setProfileData({ ...profileData, specialties: [...profileData.specialties, ''] });
  };

  const updateSpecialty = (index, value) => {
    const newSpecialties = [...profileData.specialties];
    newSpecialties[index] = value;
    setProfileData({ ...profileData, specialties: newSpecialties });
  };

  const removeSpecialty = (index) => {
    const newSpecialties = [...profileData.specialties];
    newSpecialties.splice(index, 1);
    setProfileData({ ...profileData, specialties: newSpecialties });
  };

  const addLanguage = () => {
    setProfileData({ ...profileData, languages: [...profileData.languages, ''] });
  };

  const updateLanguage = (index, value) => {
    const newLanguages = [...profileData.languages];
    newLanguages[index] = value;
    setProfileData({ ...profileData, languages: newLanguages });
  };

  const removeLanguage = (index) => {
    const newLanguages = [...profileData.languages];
    newLanguages.splice(index, 1);
    setProfileData({ ...profileData, languages: newLanguages });
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: '', description: '', icon: '', date: '' }]);
  };

  const updateAchievement = (index, field, value) => {
    const newAchievements = [...achievements];
    newAchievements[index][field] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index) => {
    const newAchievements = [...achievements];
    newAchievements.splice(index, 1);
    setAchievements(newAchievements);
  };

  return (
    <>
      <Header />
      <div className="w-full flex flex-col md:flex-row px-6 py-10 gap-8">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-800">Profile Management</h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Save Changes
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {['general','professional','social','achievements'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'general' && 'General Information'}
                    {tab === 'professional' && 'Professional Details'}
                    {tab === 'social' && 'Social Links'}
                    {tab === 'achievements' && 'Achievements'}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={photoPreview || 'https://via.placeholder.com/96'}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <input type="file" className="hidden" onChange={handlePhotoChange} />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-600">This will be displayed on your profile</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      placeholder="Enter your professional title"
                      value={profileData.title}
                      onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={profileData.firstName}
                         onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      placeholder="Brief description for your profile"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Education Background</label>
                    <input
                      type="text"
                      placeholder="Your education"
                      value={profileData.education}
                      onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                    <input
                      type="text"
                      placeholder="Experience in years"
                      value={profileData.experience}
                      onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialties</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profileData.specialties.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Specialty"
                            value={spec}
                            onChange={(e) => updateSpecialty(idx, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                          />
                          <button onClick={() => removeSpecialty(idx)} className="text-red-500 hover:text-red-700 text-sm">x</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addSpecialty} className="mt-2 text-sm text-blue-600 hover:text-blue-700">Add Specialty</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Languages</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profileData.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Language"
                            value={lang}
                            onChange={(e) => updateLanguage(idx, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                          />
                          <button onClick={() => removeLanguage(idx)} className="text-red-500 hover:text-red-700 text-sm">x</button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addLanguage} className="mt-2 text-sm text-blue-600 hover:text-blue-700">Add Language</button>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Profile</label>
                    <input
                      type="url"
                      placeholder="Twitter URL"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4">
                  <button onClick={addAchievement} className="mb-4 text-sm text-blue-600 hover:text-blue-700">+ Add Achievement</button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((ach, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">Achievement {idx + 1}</h3>
                          {idx !== 0 && (
                          <button onClick={() => removeAchievement(idx)}
                                  className="text-red-500 hover:text-red-700 text-sm">
                                  Remove
                          </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Title"
                          value={ach.title}
                          onChange={(e) => updateAchievement(idx, 'title', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          value={ach.description}
                          onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                        <input
                          type="date"
                          value={ach.date}
                          onChange={(e) => updateAchievement(idx, 'date', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right side - Example Public Profile */}
        <div className="w-full md:w-1/2 space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Public Profile Preview</h2>
          <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://via.placeholder.com/80"
                alt="Example Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-lg font-semibold">Jane Doe</h3>
                <p className="text-sm text-gray-500">Senior Web Developer</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Passionate developer with 5+ years of experience in full-stack web development, building modern and responsive web applications.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">React</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Node.js</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">JavaScript</span>
            </div>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-blue-600 text-xs hover:underline">Website</a>
              <a href="#" className="text-blue-600 text-xs hover:underline">LinkedIn</a>
              <a href="#" className="text-blue-600 text-xs hover:underline">Twitter</a>
            </div>

            {/* Example Achievements */}
            <h3 className="text-sm font-semibold text-gray-700 mt-4">Achievements</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="border border-gray-200 rounded-lg p-2 flex items-center space-x-2">
                <span className="text-xl">🏆</span>
                <div>
                  <p className="text-sm font-medium">Top Rated Teacher</p>
                  <p className="text-xs text-gray-500">4.8+ rating for 6 months</p>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-2 flex items-center space-x-2">
                <span className="text-xl">👥</span>
                <div>
                  <p className="text-sm font-medium">1000+ Students Taught</p>
                  <p className="text-xs text-gray-500">Milestone achievement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InstructorProfile;
