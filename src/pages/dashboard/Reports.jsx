import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, FileSpreadsheet, Eye } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../context/NotificationContext';

export default function Reports() {
  const { toast } = useNotification();
  const [financialYear, setFinancialYear] = useState('2024-25');
  const [quarter, setQuarter] = useState('Q4 (Jan - Mar)');

  const handleGenerate = (name) => {
    toast.success('Report Generated', `${name} for FY ${financialYear} (${quarter}) has been downloaded.`);
  };

  const reportCards = [
    {
      title: 'Outward Sales Summary Report',
      desc: 'Invoice-by-invoice breakdown of B2B, B2C, export supplies, taxable value, and tax rates.',
      records: '142 Invoices'
    },
    {
      title: 'Inward Purchases & GSTR-2B Report',
      desc: 'Consolidated purchase ledger with matching status against supplier GSTR-1 filings.',
      records: '98 Purchase Bills'
    },
    {
      title: 'Comprehensive Tax Liability Report',
      desc: 'Cumulative monthly comparison of tax declared in GSTR-1 vs settled in GSTR-3B.',
      records: '12 Tax Periods'
    },
    {
      title: 'ITC Utilization & Availment Report',
      desc: 'Head-wise analysis of Central, State, and Integrated Input Tax Credit balances.',
      records: 'Complete Passbook'
    },
    {
      title: 'Tax Payment Challan Register',
      desc: 'Comprehensive register of all PMT-06 challans, CIN numbers, banks, and timestamps.',
      records: '18 Challans'
    },
    {
      title: 'Annual Return Consolidation (GSTR-9)',
      desc: 'Harmonized summary reconciling turnover with audited annual financial statements.',
      records: 'Annual Consolidated'
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Reports & Analytics' }]} />
      <PageHeader
        title="Compliance & Financial Reports"
        subtitle="Generate, reconcile, and export comprehensive sales, purchase, ITC, and tax payment reports."
      />

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Financial Year</label>
              <select
                className="form-control"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
              >
                <option value="2024-25">FY 2024-25 (Current)</option>
                <option value="2023-24">FY 2023-24</option>
                <option value="2022-23">FY 2022-23</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Quarter / Frequency</label>
              <select
                className="form-control"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
              >
                <option value="Q4 (Jan - Mar)">Q4: Jan – Mar</option>
                <option value="Q3 (Oct - Dec)">Q3: Oct – Dec</option>
                <option value="Q2 (Jul - Sep)">Q2: Jul – Sep</option>
                <option value="Q1 (Apr - Jun)">Q1: Apr – Jun</option>
                <option value="Annual">Whole Financial Year</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => toast.info('Filters Applied', `Updated view for FY ${financialYear} ${quarter}`)}
              >
                <Filter size={16} /> Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {reportCards.map((rep, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="card-title" style={{ fontSize: '1rem' }}>{rep.title}</span>
              <span className="badge badge-primary">{rep.records}</span>
            </div>
            <div className="card-body" style={{ flex: 1 }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {rep.desc}
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Format: Excel / PDF
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleGenerate(rep.title)}
                >
                  <Eye size={14} /> Preview
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleGenerate(rep.title)}
                >
                  <Download size={14} /> Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
