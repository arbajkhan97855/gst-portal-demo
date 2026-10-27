import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Key, Lock, CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function Security() {
  const { toast } = useNotification();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const sessions = [
    {
      id: 'sess-1',
      device: 'Chrome on macOS (Current Session)',
      location: 'Mumbai, Maharashtra, IN',
      ip: '103.21.58.114',
      lastActive: 'Just now',
      isCurrent: true
    },
    {
      id: 'sess-2',
      device: 'Safari on iPhone 15 Pro',
      location: 'Pune, Maharashtra, IN',
      ip: '49.36.120.89',
      lastActive: '2 days ago',
      isCurrent: false
    }
  ];

  const columns = [
    {
      header: 'Device & Browser',
      field: 'device',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={16} />
          <strong>{val}</strong>
          {row.isCurrent && <span className="badge badge-success">Current</span>}
        </div>
      )
    },
    { header: 'Approximate Location', field: 'location' },
    { header: 'IP Address', field: 'ip', render: (val) => <span className="mono">{val}</span> },
    { header: 'Last Active', field: 'lastActive' }
  ];

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      'Two-Factor Authentication',
      !twoFactorEnabled ? '2FA via SMS/Authenticator App has been enabled.' : '2FA has been disabled.'
    );
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Security & Access' }]} />
      <PageHeader
        title="Security & Access Credentials"
        subtitle="Manage authentication security, inspect active browser sessions, and configure two-factor verification."
      />

      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        {/* Security Overview Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ShieldCheck size={18} className="text-primary" />
              <span>Authentication Status</span>
            </div>
            <span className="badge badge-success">Protected</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span className="form-hint">Password Last Changed</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>15-Jan-2025 (45 days ago)</div>
              </div>

              <div>
                <span className="form-hint">Last Successful Login</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>Today, 09:30 AM IST (From Mumbai)</div>
              </div>

              <div>
                <span className="form-hint">Authorized DSC (Digital Signature Certificate)</span>
                <div style={{ fontWeight: 600, marginTop: '2px', color: 'var(--success)' }}>
                  Class-3 DSC Registered (Valid till 31-Dec-2026)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Smartphone size={18} className="text-primary" />
              <span>Two-Factor Authentication (2FA)</span>
            </div>
            <span className={`badge ${twoFactorEnabled ? 'badge-success' : 'badge-neutral'}`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Enhance login protection by requiring a 6-digit one-time passcode generated on your registered mobile number or authenticator app.
            </p>

            <button
              type="button"
              className={`btn ${twoFactorEnabled ? 'btn-danger' : 'btn-primary'}`}
              onClick={toggleTwoFactor}
            >
              {twoFactorEnabled ? 'Disable Two-Factor Auth' : 'Enable Two-Factor Auth'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Monitor size={18} className="text-primary" />
            <span>Active Login Sessions</span>
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => toast.info('Sessions Revoked', 'All other browser sessions have been logged out.')}
          >
            Revoke All Other Sessions
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={sessions}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
}
