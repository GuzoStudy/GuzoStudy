import { useState } from "react";

export const Profile = () => {
  // Mock data
  const mockProfile = {
    full_name: "Cedy N.",
    bio: "Passionate learner exploring web development and UI design.",
    profile_picture: "https://i.pravatar.cc/120?img=12",
    contact_info: {
      email: "cedy@example.com",
      phone: "+251912345678",
    },
    learning_preferences: {
      topics: ["React", "TailwindCSS", "Laravel"],
      language: "en",
      notifications: true,
    },
  };

  const [formData, setFormData] = useState(mockProfile);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [name]: value },
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      learning_preferences: {
        ...prev.learning_preferences,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleTopicsChange = (e) => {
    const topics = e.target.value.split(",").map((t) => t.trim());
    setFormData((prev) => ({
      ...prev,
      learning_preferences: { ...prev.learning_preferences, topics },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">My Profile</h2>

      {/* Personal Info */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[#8BD02A] rounded-lg hover:bg-[#7bc025] transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#8BD02A] rounded-lg hover:bg-[#7bc025]"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <img
              src={formData.profile_picture}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-gray-200"
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                type="text"
                name="profile_picture"
                value={formData.profile_picture}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-3 py-2 text-sm border rounded-lg ${
                  editing
                    ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-3 py-2 text-sm border rounded-lg ${
                editing
                  ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                  : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              disabled={!editing}
              className={`w-full px-3 py-2 text-sm border rounded-lg resize-none ${
                editing
                  ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                  : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.contact_info.email}
                onChange={handleContactChange}
                disabled={!editing}
                className={`w-full px-3 py-2 text-sm border rounded-lg ${
                  editing
                    ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.contact_info.phone}
                onChange={handleContactChange}
                disabled={!editing}
                className={`w-full px-3 py-2 text-sm border rounded-lg ${
                  editing
                    ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Preferences */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Preferences</h3>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics of Interest
            </label>
            <input
              type="text"
              value={formData.learning_preferences.topics.join(", ")}
              onChange={handleTopicsChange}
              disabled={!editing}
              placeholder="e.g., React, UI Design"
              className={`w-full px-3 py-2 text-sm border rounded-lg ${
                editing
                  ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                  : "bg-gray-100 border-gray-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language
            </label>
            <select
              name="language"
              value={formData.learning_preferences.language}
              onChange={handlePreferenceChange}
              disabled={!editing}
              className={`w-full px-3 py-2 text-sm border rounded-lg ${
                editing
                  ? "bg-white border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.learning_preferences.notifications}
              onChange={handlePreferenceChange}
              disabled={!editing}
              className="w-4 h-4 text-[#8BD02A] focus:ring-[#8BD02A]"
            />
            Enable email notifications
          </label>
        </div>
      </section>

      {/* Security */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Security</h3>
          <button
            onClick={() => setChangingPassword(!changingPassword)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              changingPassword
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-[#8BD02A] text-white hover:bg-[#7bc025]"
            }`}
          >
            {changingPassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {changingPassword && (
          <div className="grid gap-4">
            <input
              type="password"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#8BD02A]"
            />
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#8BD02A] rounded-lg hover:bg-[#7bc025] transition">
              Update Password
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
