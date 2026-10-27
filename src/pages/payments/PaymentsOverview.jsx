import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wallet, ArrowRight, Clock, Plus, ShieldCheck, IndianRupee } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { useAuth } from '../../context/AuthContext';
import { usePortalData } from '../../context/PortalDataContext';
import { SAMPLE_CHALLANS } from '../../data/portalData';

export default function PaymentsOverview() {
  const { currentUser } = useAuth();
  const { challans: portalChallans } = usePortalData();
  const challans = portalChallans || SAMPLE_CHALLANS;

  const columns = [
    { header: 'CPIN Reference', field: 'cpin', render: (val) => <span className="mono"><strong>{val}</strong></span> },
    { header: 'CIN (Bank Receipt)', field: 'cin', render: (v) => v ? <span className="mono">{v}</span> : 'Pending' },
    { header: 'Created Date', field: 'createdDate' },
    { header: 'Payment Mode', field: 'paymentMode' },
    {
      header: 'Total Amount (₹)',
      field: 'totalAmount',
      numeric: true,
      render: (v) => <strong style={{ color: 'var(--primary)' }}>₹{v.toLocaleString('en-IN')}</strong>
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => (
        <span className={`badge ${val.includes('Paid') ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Payments Overview' }]} />
      <PageHeader
        title="Electronic Tax Payments & Challan Operations"
        subtitle="Generate Form PMT-06 electronic challans, execute bank settlements, and track realization receipts."
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/payments/history" className="btn btn-outline">
              <Clock size={16} /> Challan History
            </Link>
            <Link to="/payments/challan" className="btn btn-primary">
              <Plus size={16} /> Create Payment Challan (PMT-06)
            </Link>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Electronic Cash Balance"
          value={`₹${(currentUser.cashBalance || 48520).toLocaleString('en-IN')}`}
          icon={<Wallet size={20} />}
          iconBg="purple"
          badge="Available"
          badgeType="primary"
          meta="In Form PMT-05 Cash Ledger"
        />

        <StatCard
          title="Last Realized Payment"
          value="₹9,36,000"
          icon={<IndianRupee size={20} />}
          iconBg="green"
          badge="Realized"
          badgeType="success"
          meta="CIN: SBIN25022700142984"
        />

        <StatCard
          title="Active Pending Challans"
          value="1 Challan"
          icon={<CreditCard size={20} />}
          iconBg="orange"
          badge="Pending Payment"
          badgeType="warning"
          meta="Expires in 15 days"
        />

        <StatCard
          title="Settlement Mode Supported"
          value="4 Gateways"
          icon={<ShieldCheck size={20} />}
          iconBg="blue"
          badge="Instant Credit"
          badgeType="info"
          meta="Net Banking, UPI, OTC, RTGS"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Tax Challans</span>
          <Link to="/payments/history" className="btn btn-outline-primary btn-sm">
            View All Challans <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={challans}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
}
