import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Info,
  HelpCircle,
  AlertTriangle,
  Save,
  RotateCw
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function QuarterlyOptIn() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();

  const [financialYear, setFinancialYear] = useState('2025-26');
  const [saving, setSaving] = useState(false);

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  // Quarterly Scheme preferences
  const [quarters, setQuarters] = useState([
    {
      quarter: 'Q1 (Apr - Jun)',
      selectedFrequency: 'Monthly',
      applicablePeriod: '01/05/2025 to 31/07/2025',
      status: 'Selection Window Closed'
    },
    {
      quarter: 'Q2 (Jul - Sep)',
      selectedFrequency: 'Monthly',
      applicablePeriod: '01/08/2025 to 31/10/2025',
      status: 'Selection Window Closed'
    },
    {
      quarter: 'Q3 (Oct - Dec)',
      selectedFrequency: 'Quarterly',
      applicablePeriod: '01/11/2025 to 31/01/2026',
      status: 'Open for Selection'
    },
    {
      quarter: 'Q4 (Jan - Mar)',
      selectedFrequency: 'Quarterly',
      applicablePeriod: '01/02/2026 to 30/04/2026',
      status: 'Open for Selection'
    }
  ]);

  const handleFrequencyChange = (index, freq) => {
    const updated = [...quarters];
    updated[index].selectedFrequency = freq;
    setQuarters(updated);
  };

  const handleSavePreferences = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Preferences Saved', `Opt-in preference for ${financialYear} updated successfully.`);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'Opt-in for Quarterly Return' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Taxpayer Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', fontSize: '13px', color: '#1e293b' }}>
          <div>GSTIN: <strong>{gstin}</strong></div>
          <div>Legal Name: <strong>{legalName}</strong></div>
          <div>Trade Name: <strong>{tradeName}</strong></div>
          <div>Aggregate Turnover: <strong>Up to ₹5.00 Cr</strong> (Eligible for QRMP)</div>
        </div>
      </div>

      {/* Header & Year Filter */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Opt-in for Quarterly Return (QRMP Scheme)
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ width: '260px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Financial Year <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff' }}
            >
              <option value="2025-26">2025-26</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => toast.info('Refreshed', 'Quarterly preferences loaded.')}
            style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '8px 28px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            SEARCH
          </button>
        </div>
      </div>

      {/* QRMP Scheme Note */}
      <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px', padding: '14px 20px', marginBottom: '24px', fontSize: '13px', lineHeight: '1.6', color: '#0369a1' }}>
        <strong>Quarterly Return Monthly Payment (QRMP) Scheme Rules:</strong>
        <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
          <li>Registered persons having aggregate turnover up to ₹5 Crore in preceding FY are eligible for QRMP Scheme.</li>
          <li>Opt-in preference can be selected for any quarter from the 1st day of the 2nd month of the preceding quarter till the last day of the 1st month of the quarter.</li>
          <li>Taxpayers filing quarterly returns can upload B2B invoices using Invoice Furnishing Facility (IFF) for the first two months.</li>
        </ul>
      </div>

      {/* Quarters Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#173059', color: '#ffffff' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left' }}>Quarter</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Selected Frequency</th>
              <th style={{ padding: '12px 14px', textAlign: 'left' }}>Applicable Window</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Window Status</th>
            </tr>
          </thead>
          <tbody>
            {quarters.map((q, idx) => {
              const isOpen = q.status.includes('Open');
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{q.quarter}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: isOpen ? 'pointer' : 'not-allowed', color: !isOpen ? '#94a3b8' : '#1e293b' }}>
                        <input
                          type="radio"
                          name={`freq-${idx}`}
                          value="Monthly"
                          checked={q.selectedFrequency === 'Monthly'}
                          disabled={!isOpen}
                          onChange={() => handleFrequencyChange(idx, 'Monthly')}
                          style={{ width: '15px', height: '15px' }}
                        />
                        Monthly
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: isOpen ? 'pointer' : 'not-allowed', color: !isOpen ? '#94a3b8' : '#1e293b' }}>
                        <input
                          type="radio"
                          name={`freq-${idx}`}
                          value="Quarterly"
                          checked={q.selectedFrequency === 'Quarterly'}
                          disabled={!isOpen}
                          onChange={() => handleFrequencyChange(idx, 'Quarterly')}
                          style={{ width: '15px', height: '15px' }}
                        />
                        Quarterly
                      </label>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{q.applicablePeriod}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        backgroundColor: isOpen ? '#dcfce7' : '#f1f5f9',
                        color: isOpen ? '#166534' : '#64748b'
                      }}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button
          type="button"
          onClick={handleSavePreferences}
          disabled={saving}
          style={{
            backgroundColor: '#173059',
            color: '#ffffff',
            border: 'none',
            borderRadius: '3px',
            padding: '10px 32px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.5px'
          }}
        >
          {saving ? 'SAVING PREFERENCES...' : 'SAVE'}
        </button>
      </div>
    </div>
  );
}
