import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Shield, User } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Tabs from '../../components/Tabs';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';

export default function Settings() {
  const { theme, toggleTheme, fontSize, setFontSize, language, changeLanguage } = useTheme();
  const { toast } = useNotification();
  const [activeTab, setActiveTab] = useState('appearance');

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dueReminders, setDueReminders] = useState(true);

  const tabs = [
    { id: 'appearance', label: 'Appearance & Theme', icon: <Moon /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell /> },
    { id: 'language', label: 'Language & Locale', icon: <Globe /> },
    { id: 'security', label: 'Security & Auth', icon: <Shield /> }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Settings' }]} />
      <PageHeader
        title="Portal Settings & Preferences"
        subtitle="Configure application theme, notification channels, accessibility scaling, and display language."
      />

      <div className="card">
        <div className="card-body">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'appearance' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Theme & Contrast</h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Color Theme</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Switch between Light Mode and Dark Mode for comfortable viewing.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={toggleTheme}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Accessibility Font Sizing</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Scale system typography for enhanced readability.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className={`btn btn-sm ${fontSize === 'small' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFontSize('small')}
                  >
                    Small
                  </button>
                  <button
                    className={`btn btn-sm ${fontSize === 'normal' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFontSize('normal')}
                  >
                    Normal
                  </button>
                  <button
                    className={`btn btn-sm ${fontSize === 'large' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFontSize('large')}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Notification Channels</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label className="form-check" style={{ justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Email Filing Alerts</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Receive email confirmations for GSTR-1 and GSTR-3B filings.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => {
                      setEmailAlerts(e.target.checked);
                      toast.info('Preferences Saved', 'Email notification settings updated.');
                    }}
                  />
                </label>

                <label className="form-check" style={{ justifyContent: 'space-between', width: '100%', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>SMS Verification Alerts</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Receive instant SMS OTPs and challan credit intimations.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => {
                      setSmsAlerts(e.target.checked);
                      toast.info('Preferences Saved', 'SMS alert settings updated.');
                    }}
                  />
                </label>

                <label className="form-check" style={{ justifyContent: 'space-between', width: '100%', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Statutory Due Date Reminders</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Get automatic portal banner reminders 3 days before filing deadlines.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dueReminders}
                    onChange={(e) => {
                      setDueReminders(e.target.checked);
                      toast.info('Preferences Saved', 'Deadline reminder settings updated.');
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Portal Language</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select your preferred language for navigation, alerts, and field labels.
              </p>

              <div className="form-group">
                <select
                  className="form-control"
                  value={language}
                  onChange={(e) => {
                    changeLanguage(e.target.value);
                    toast.success('Language Selected', `Interface language switched to ${e.target.value.toUpperCase()}.`);
                  }}
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Security Preferences</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Manage authentication safeguards and active session lifecycles.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>Auto-Logout Timer</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Automatically log out after 15 minutes of inactivity for compliance safety.
                  </div>
                </div>
                <div style={{ padding: '14px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>Digital Signature (DSC) Enforcement</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Required for corporate filings under Companies Act.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
