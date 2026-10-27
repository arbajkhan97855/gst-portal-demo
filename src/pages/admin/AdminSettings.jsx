import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useNotification } from '../../context/NotificationContext';

export default function AdminSettings() {
  const { toast } = useNotification();
  const [thresholdGoods, setThresholdGoods] = useState('4000000');
  const [thresholdServices, setThresholdServices] = useState('2000000');
  const [autoSrn, setAutoSrn] = useState(true);
  const [advisoryActive, setAdvisoryActive] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Configuration Saved', 'Statutory portal parameters updated.');
  };

  return (
    <div>
      <PageHeader
        title="Officer & Portal Configuration"
        subtitle="Manage statutory registration turnover thresholds, automated scrutiny rules, and public announcements."
      />

      <div className="card" style={{ maxWidth: '680px' }}>
        <div className="card-header">
          <span className="card-title">Statutory Thresholds & Rules</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Goods Registration Threshold (Section 22)</label>
              <input
                type="number"
                className="form-control mono"
                value={thresholdGoods}
                onChange={(e) => setThresholdGoods(e.target.value)}
              />
              <span className="form-hint">Standard: ₹40,00,000 for regular states.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Services Registration Threshold (Section 22)</label>
              <input
                type="number"
                className="form-control mono"
                value={thresholdServices}
                onChange={(e) => setThresholdServices(e.target.value)}
              />
              <span className="form-hint">Standard: ₹20,00,000 for regular states.</span>
            </div>

            <div style={{ padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '16px 0' }}>
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={autoSrn}
                  onChange={(e) => setAutoSrn(e.target.checked)}
                />
                <span className="form-check-label">
                  <strong>Enable Automated Risk-Based Scrutiny (Rule 88C / 88D)</strong>
                </span>
              </label>

              <label className="form-check" style={{ marginTop: '12px' }}>
                <input
                  type="checkbox"
                  checked={advisoryActive}
                  onChange={(e) => setAdvisoryActive(e.target.checked)}
                />
                <span className="form-check-label">
                  <strong>Show GSTR-1 & 3B Due Date Advisory on Public Home</strong>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Portal Parameters
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
