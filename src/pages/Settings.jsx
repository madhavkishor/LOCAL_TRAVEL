// src/pages/Settings.jsx
import React, { useState } from 'react';
import { Bell, Mail, Shield, Globe, Moon, Sun, Save } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('userSettings');
      return saved ? JSON.parse(saved) : {
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        language: 'english',
        currency: 'USD',
        theme: 'light',
        privacy: 'public'
      };
    } catch (e) { return {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      language: 'english',
      currency: 'USD',
      theme: 'light',
      privacy: 'public'
    }; }
  });

  const [message, setMessage] = useState('');

  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      let loaded = null;
      if (savedUser) {
        const id = JSON.parse(savedUser)._id;
        const per = localStorage.getItem(`userSettings_${id}`);
        if (per) loaded = JSON.parse(per);
      }
      if (!loaded) {
        const gen = localStorage.getItem('userSettings');
        if (gen) loaded = JSON.parse(gen);
      }
      if (loaded) setSettings(loaded);
    } catch (e) { console.error(e); }
  }, []);

  const handleSave = () => {
    // Save settings to localStorage per-user if available
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const id = JSON.parse(savedUser)._id;
        localStorage.setItem(`userSettings_${id}`, JSON.stringify(settings));
      }
      // fallback generic
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) { console.error(e); }
  };

return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Settings Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-blue-100 text-lg">Manage your account preferences and privacy</p>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-8">
            {message && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200">
                {message}
              </div>
            )}

            <div className="space-y-8">
              {/* Notifications Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Bell size={24} />
                  Notifications
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser notifications' },
                    { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text messages' }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800">{label}</p>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[key]}
                          onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences Section */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Globe size={24} />
                  Preferences
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSettings({...settings, theme: 'light'})}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Sun size={20} />
                        Light
                      </button>
                      <button
                        onClick={() => setSettings({...settings, theme: 'dark'})}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          settings.theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                        }`}
                      >
                        <Moon size={20} />
                        Dark
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Privacy</label>
                    <select
                      value={settings.privacy}
                      onChange={(e) => setSettings({...settings, privacy: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Save size={20} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;