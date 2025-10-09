import { useState } from 'react';

export const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Learning Platform',
    siteEmail: 'admin@platform.com',
    logoUrl: '',
    theme: 'light',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setSaving(false);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-2">
          Settings
        </h2>
        <p className="text-gray-500 text-sm">Configure platform settings and preferences</p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
              : 'bg-red-100 border-red-300 text-red-800'
          }`}
        >
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          {message.text}
        </div>
      )}

      {/* Site Settings */}
      <div className="bg-white border border-blue-100 shadow-md shadow-blue-100/30 rounded-2xl p-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Site Settings</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
            <input
              type="text"
              value={settings.logoUrl}
              placeholder="https://example.com/logo.png"
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition bg-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold text-white mt-6 shadow-md transition ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:shadow-blue-300/40'
          }`}
        >
          {saving ? '⏳ Saving...' : '💾 Save Settings'}
        </button>
      </div>

      {/* Access Control */}
      <div className="bg-white border border-blue-100 shadow-md shadow-blue-100/30 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Control</h3>
        <p className="text-gray-500 text-sm mb-4">
          Manage user roles and permissions across the platform
        </p>
        <button className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-purple-300/40 transition">
          Manage Roles
        </button>
      </div>

      {/* Backup & Security */}
      <div className="bg-white border border-amber-200 shadow-md shadow-amber-100/30 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Backup & Security</h3>
        <p className="text-gray-500 text-sm mb-4">
          Configure automatic backups and security settings
        </p>

        <div className="flex gap-3 flex-wrap">
          <button className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-emerald-300/40 transition">
            Create Backup
          </button>
          <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-md hover:shadow-amber-300/40 transition">
            Security Audit
          </button>
        </div>
      </div>
    </div>
  );
};
