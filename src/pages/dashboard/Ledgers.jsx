import React, { useState } from 'react';
import { BookOpen, Wallet, Sparkles, Scale, Download } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Tabs from '../../components/Tabs';
import Table from '../../components/Table';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { SAMPLE_LEDGER_ENTRIES } from '../../data/portalData';

export default function Ledgers() {
  const { currentUser } = useAuth();
  const { ledgerEntries: portalLedgers } = usePortalData();
  const ledgerEntries = portalLedgers || SAMPLE_LEDGER_ENTRIES;
  const [activeTab, setActiveTab] = useState('cash');

  const tabs = [
    { id: 'cash', label: 'Electronic Cash Ledger (PMT-05)', icon: <Wallet /> },
    { id: 'credit', label: 'Electronic Credit Ledger (PMT-02)', icon: <Sparkles /> },
    { id: 'liability', label: 'Electronic Liability Register (PMT-01)', icon: <Scale /> }
  ];

  const columns = [
    { header: 'Date', field: 'date' },
    { header: 'Transaction Reference', field: 'ref', render: (val) => <span className="mono">{val}</span> },
    { header: 'Description / Purpose', field: 'description' },
    {
      header: 'Entry Type',
      field: 'type',
      render: (val) => (
        <span className={`badge ${val === 'Credit' ? 'badge-success' : 'badge-danger'}`}>
          {val}
        </span>
      )
    },
    { header: 'CGST (₹)', field: 'cgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'SGST (₹)', field: 'sgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'IGST (₹)', field: 'igst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    {
      header: 'Running Balance (₹)',
      field: 'balance',
      numeric: true,
      render: (v) => <strong>₹{v.toLocaleString('en-IN')}</strong>
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Electronic Ledgers' }]} />
      <PageHeader
        title="Electronic Tax Ledgers & Registers"
        subtitle="View official cash balance, input tax credit ledger, and tax payment liability accounts maintained under the GST law."
        actions={
          <button
            className="btn btn-outline"
            onClick={() => alert('Electronic ledger statement exported to Excel/PDF.')}
          >
            <Download size={14} /> Export Ledger (PDF)
          </button>
        }
      />

      {/* Ledger Balances Strip */}
      <div className="grid-3col" style={{ marginBottom: '24px' }}>
        <div className="ledger-stat-box">
          <div className="card-subtitle">Cash Ledger Balance</div>
          <div className="ledger-amount-row">
            <span className="ledger-amount" style={{ color: 'var(--primary)' }}>
              ₹{(currentUser.cashBalance || 48520).toLocaleString('en-IN')}
            </span>
            <span className="badge badge-primary">Form PMT-05</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deposited via Challans</div>
        </div>

        <div className="ledger-stat-box">
          <div className="card-subtitle">Credit Ledger (ITC) Balance</div>
          <div className="ledger-amount-row">
            <span className="ledger-amount" style={{ color: 'var(--success)' }}>
              ₹{(currentUser.creditBalance || 142850).toLocaleString('en-IN')}
            </span>
            <span className="badge badge-success">Form PMT-02</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From Inward B2B Invoices</div>
        </div>

        <div className="ledger-stat-box">
          <div className="card-subtitle">Return Liability Balance</div>
          <div className="ledger-amount-row">
            <span className="ledger-amount" style={{ color: 'var(--danger)' }}>
              ₹{(currentUser.liabilityBalance || 24500).toLocaleString('en-IN')}
            </span>
            <span className="badge badge-warning">Form PMT-01</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Month Payable</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BookOpen size={18} className="text-primary" />
            <span>Passbook Statement & Transaction Audit Trail</span>
          </div>
        </div>
        <div className="card-body">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          <Table
            columns={columns}
            data={ledgerEntries}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
