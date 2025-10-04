import { useState, useEffect } from "react";

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    profile_picture: "",
    contact_info: {
      email: "",
      phone: "",
    },
    learning_preferences: {
      topics: [],
      language: "en",
      notifications: true,
    },
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Mock fetch
  useEffect(() => {
    setTimeout(() => {
      const mockProfile = {
        id: "user_123",
        full_name: "Jane Doe",
        bio: "Frontend developer & lifelong learner",
        profile_picture: "https://via.placeholder.com/100",
        contact_info: { email: "jane@example.com", phone: "+251912345678" },
        learning_preferences: {
          topics: ["React", "UI/UX", "AI"],
          language: "en",
          notifications: true,
        },
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
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

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setProfile(formData);
      setEditing(false);
      setSaving(false);
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setChangingPassword(false);
      setSaving(false);
    }, 1000);
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold">My Profile</h2>

      {message.text && (
        <div
          className={`p-3 rounded mb-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Personal Info */}
      <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!editing}
              rows={3}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
            <input
              type="text"
              name="profile_picture"
              value={formData.profile_picture}
              onChange={handleInputChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.contact_info.email}
              onChange={handleContactChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.contact_info.phone}
              onChange={handleContactChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Learning Preferences</h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topics</label>
            <input
              type="text"
              value={formData.learning_preferences.topics.join(", ")}
              onChange={handleTopicsChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preferred Language</label>
            <select
              name="language"
              value={formData.learning_preferences.language}
              onChange={handlePreferenceChange}
              disabled={!editing}
              className="w-full p-2 border rounded-lg disabled:bg-gray-100"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.learning_preferences.notifications}
              onChange={handlePreferenceChange}
              disabled={!editing}
              className="w-4 h-4"
            />
            <span className="text-sm">Enable email notifications</span>
          </label>
        </div>
      </section>

      {/* Security */}
      <section className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Security</h3>
          <button
            onClick={() => setChangingPassword(!changingPassword)}
            className={`px-4 py-2 text-sm rounded-lg ${
              changingPassword
                ? "bg-gray-100 text-gray-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {changingPassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {changingPassword && (
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={saving}
              className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
