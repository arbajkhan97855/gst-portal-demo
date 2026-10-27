import React, { useState } from 'react';
import {
  GitCompare,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function LiabilityItcComparison() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();

  const [financialYear, setFinancialYear] = useState('2025-26');
  const [activeReportTab, setActiveReportTab] = useState('liability'); // 'liability' | 'itc'

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  // Sample Tax Liability comparison rows (GSTR-1 vs GSTR-3B)
  const liabilityRows = [
    { month: 'April 2025', gstr1Tax: 120000, gstr3bTax: 120000, diff: 0, status: 'Matched' },
    { month: 'May 2025', gstr1Tax: 145000, gstr3bTax: 145000, diff: 0, status: 'Matched' },
    { month: 'June 2025', gstr1Tax: 180000, gstr3bTax: 180000, diff: 0, status: 'Matched' },
    { month: 'July 2025', gstr1Tax: 210000, gstr3bTax: 210000, diff: 0, status: 'Matched' },
    { month: 'August 2025', gstr1Tax: 195000, gstr3bTax: 195000, diff: 0, status: 'Matched' },
    { month: 'September 2025', gstr1Tax: 230000, gstr3bTax: 230000, diff: 0, status: 'Matched' },
    { month: 'October 2025', gstr1Tax: 175000, gstr3bTax: 175000, diff: 0, status: 'Matched' },
    { month: 'November 2025', gstr1Tax: 240000, gstr3bTax: 240000, diff: 0, status: 'Matched' },
    { month: 'December 2025', gstr1Tax: 260000, gstr3bTax: 260000, diff: 0, status: 'Matched' },
    { month: 'January 2026', gstr1Tax: 290000, gstr3bTax: 290000, diff: 0, status: 'Matched' }
  ];

  // Sample ITC comparison rows (GSTR-2B vs GSTR-3B)
  const itcRows = [
    { month: 'April 2025', gstr2bItc: 98000, gstr3bItc: 98000, diff: 0, status: 'Matched' },
    { month: 'May 2025', gstr2bItc: 112000, gstr3bItc: 112000, diff: 0, status: 'Matched' },
    { month: 'June 2025', gstr2bItc: 140000, gstr3bItc: 140000, diff: 0, status: 'Matched' },
    { month: 'July 2025', gstr2bItc: 165000, gstr3bItc: 165000, diff: 0, status: 'Matched' },
    { month: 'August 2025', gstr2bItc: 150000, gstr3bItc: 150000, diff: 0, status: 'Matched' },
    { month: 'September 2025', gstr2bItc: 178000, gstr3bItc: 178000, diff: 0, status: 'Matched' },
    { month: 'October 2025', gstr2bItc: 135000, gstr3bItc: 135000, diff: 0, status: 'Matched' },
    { month: 'November 2025', gstr2bItc: 190000, gstr3bItc: 190000, diff: 0, status: 'Matched' },
    { month: 'December 2025', gstr2bItc: 205000, gstr3bItc: 205000, diff: 0, status: 'Matched' },
    { month: 'January 2026', gstr2bItc: 228000, gstr3bItc: 228000, diff: 0, status: 'Matched' }
  ];

  const totalGstr1 = liabilityRows.reduce((acc, r) => acc + r.gstr1Tax, 0);
  const totalGstr3b = liabilityRows.reduce((acc, r) => acc + r.gstr3bTax, 0);

  const totalGstr2b = itcRows.reduce((acc, r) => acc + r.gstr2bItc, 0);
  const totalGstr3bItc = itcRows.reduce((acc, r) => acc + r.gstr3bItc, 0);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'Tax liabilities and ITC comparison' }
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
          <div>Overall Comparison Status: <strong style={{ color: '#16a34a' }}>100% Reconciled (No Variance)</strong></div>
        </div>
      </div>

      {/* Header Bar */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Comparison of Liability Declared and Input Tax Credit (ITC) Claimed
          </h2>
          <button
            type="button"
            onClick={() => toast.success('Downloaded', 'Comparison report exported to Excel.')}
            style={{
              backgroundColor: '#173059',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '8px 20px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} /> DOWNLOAD EXCEL (XLSX)
          </button>
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
            onClick={() => toast.info('Refreshed', 'Comparison tables refreshed for FY ' + financialYear)}
            style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '8px 28px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
          >
            SEARCH
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #cbd5e1', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveReportTab('liability')}
          style={{
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeReportTab === 'liability' ? '3px solid #173059' : '3px solid transparent',
            color: activeReportTab === 'liability' ? '#173059' : '#64748b',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          1. Tax Liability (GSTR-1 vs GSTR-3B)
        </button>
        <button
          type="button"
          onClick={() => setActiveReportTab('itc')}
          style={{
            padding: '10px 20px',
            fontSize: '13.5px',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeReportTab === 'itc' ? '3px solid #173059' : '3px solid transparent',
            color: activeReportTab === 'itc' ? '#173059' : '#64748b',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          2. Input Tax Credit (GSTR-2B vs GSTR-3B)
        </button>
      </div>

      {/* Report Tables */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', overflowX: 'auto', marginBottom: '24px' }}>
        {activeReportTab === 'liability' ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#173059', color: '#ffffff' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Tax Period</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Liability in GSTR-1 (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Liability in GSTR-3B (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Variance / Difference (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Comparison Status</th>
              </tr>
            </thead>
            <tbody>
              {liabilityRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.month}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{row.gstr1Tax.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{row.gstr3bTax.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: row.diff === 0 ? '#16a34a' : '#dc2626' }}>
                    ₹{row.diff.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                <td style={{ padding: '12px 14px' }}>TOTAL (FY {financialYear})</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>₹{totalGstr1.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>₹{totalGstr3b.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a' }}>₹0.00</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', color: '#16a34a' }}>Fully Reconciled</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#173059', color: '#ffffff' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left' }}>Tax Period</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Available ITC in GSTR-2B (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Claimed ITC in GSTR-3B (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Variance / Difference (₹)</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Comparison Status</th>
              </tr>
            </thead>
            <tbody>
              {itcRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.month}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{row.gstr2bItc.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>₹{row.gstr3bItc.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: row.diff === 0 ? '#16a34a' : '#dc2626' }}>
                    ₹{row.diff.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 700, borderTop: '2px solid #cbd5e1' }}>
                <td style={{ padding: '12px 14px' }}>TOTAL (FY {financialYear})</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>₹{totalGstr2b.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>₹{totalGstr3bItc.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a' }}>₹0.00</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', color: '#16a34a' }}>Fully Reconciled</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
