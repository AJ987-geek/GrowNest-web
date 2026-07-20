import { useState } from 'react';
import { User, Bell, Shield, Lock, Trash2, Save } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Settings() {
  const { darkMode, toggleDarkMode, user, setUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('account');
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [notifications, setNotifications] = useState({
    vaccineReminders: true,
    growthAlerts: true,
    weeklyReport: true,
    communityUpdates: false,
    aiInsights: true,
    promotions: false,
  });

  const tabs = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'security', label: 'Security', icon: Lock },
  ];

  const handleSave = () => {
    setUser(prev => ({ ...prev, name: form.name, email: form.email }));
    showToast('Settings saved successfully!', 'success');
  };

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0'
        }`} />
    </button>
  );

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{title}</h3>
      <div className="card divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
        {children}
      </div>
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex items-center justify-between px-5 py-4 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );

  const PrivacyItem = ({ label, desc, defaultVal }) => {
    const [val, setVal] = useState(defaultVal);
    return (
      <SettingRow label={label} description={desc}>
        <Toggle value={val} onChange={setVal} />
      </SettingRow>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="card p-2 flex lg:flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 lg:flex-initial ${activeTab === tab.key
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'account' && (
            <div>
              <Section title="Profile">
                <div className="p-5 space-y-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      className="input"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <button onClick={handleSave} className="btn-primary text-sm">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </Section>
              <Section title="Appearance">
                <SettingRow label="Dark Mode" description="Switch between light and dark theme">
                  <Toggle value={darkMode} onChange={toggleDarkMode} />
                </SettingRow>
              </Section>
              <Section title="Danger Zone">
                <SettingRow label="Delete Account" description="Permanently delete your account and all data">
                  <button
                    onClick={() => showToast('Account deletion requires email verification', 'warning')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </SettingRow>
              </Section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Section title="Notification Preferences">
              {[
                { key: 'vaccineReminders', label: 'Vaccine Reminders', desc: 'Get notified before upcoming vaccinations' },
                { key: 'growthAlerts', label: 'Growth Alerts', desc: 'Receive alerts when growth milestones are missed' },
                { key: 'weeklyReport', label: 'Weekly Health Report', desc: "Weekly summary of your child's health" },
                { key: 'communityUpdates', label: 'Community Updates', desc: 'Replies and upvotes on your posts' },
                { key: 'aiInsights', label: 'AI Insights', desc: 'Personalized health tips from AI' },
                { key: 'promotions', label: 'Promotions', desc: 'Product updates and offers' },
              ].map(n => (
                <SettingRow key={n.key} label={n.label} description={n.desc}>
                  <Toggle
                    value={notifications[n.key]}
                    onChange={v => setNotifications(p => ({ ...p, [n.key]: v }))}
                  />
                </SettingRow>
              ))}
            </Section>
          )}

          {activeTab === 'privacy' && (
            <Section title="Privacy Controls">
              <PrivacyItem label="Public Profile" desc="Allow other parents to see your profile" defaultVal={false} />
              <PrivacyItem label="Data Analytics" desc="Help improve the app with anonymized data" defaultVal={true} />
              <PrivacyItem label="Personalized Recommendations" desc="Allow AI to personalize content" defaultVal={true} />
            </Section>
          )}

          {activeTab === 'security' && (
            <div>
              <Section title="Password">
                <div className="p-5 space-y-3">
                  {['Current Password', 'New Password', 'Confirm New Password'].map(f => (
                    <div key={f}>
                      <label className="label">{f}</label>
                      <input type="password" className="input" placeholder="••••••••" />
                    </div>
                  ))}
                  <button
                    onClick={() => showToast('Password updated successfully!', 'success')}
                    className="btn-primary text-sm"
                  >
                    <Save className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </Section>
              <Section title="Two-Factor Authentication">
                <SettingRow label="Enable 2FA" description="Add an extra layer of security to your account">
                  <button
                    onClick={() => showToast('2FA setup coming soon!', 'info')}
                    className="btn-secondary text-xs py-1.5"
                  >
                    Enable
                  </button>
                </SettingRow>
              </Section>
              <Section title="Active Sessions">
                <SettingRow label="Current Session" description="Windows • Chrome • Active now">
                  <span className="badge badge-success">Active</span>
                </SettingRow>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
