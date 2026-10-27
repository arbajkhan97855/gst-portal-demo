import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Plus, Clock, FileCheck, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { SAMPLE_APPLICATIONS } from '../../data/portalData';

export default function RefundsOverview() {
  const refundApplications = SAMPLE_APPLICATIONS.filter(a => a.formType === 'RFD-01');

  const columns = [
    { header: 'Refund ARN', field: 'arn', render: (val) => <span className="mono"><strong>{val}</strong></span> },
    { header: 'Refund Category', field: 'description' },
    { header: 'Filing Date', field: 'submissionDate' },
    { header: 'Jurisdictional Officer', field: 'assignedOfficer' },
    {
      header: 'Processing Status',
      field: 'status',
      render: (val) => (
        <span className={`badge ${
          val === 'Approved' ? 'badge-success' :
          val === 'Clarification Required' ? 'badge-warning' : 'badge-primary'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Refunds' }]} />
      <PageHeader
        title="Tax Refund Services (Form GST RFD-01)"
        subtitle="Claim statutory refunds for accumulated cash ledger balance, inverted duty structure, or zero-rated export supplies."
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/refunds/status" className="btn btn-outline">
              <Clock size={16} /> Track Refund Status
            </Link>
            <Link to="/refunds/apply" className="btn btn-primary">
              <Plus size={16} /> Apply for Refund (RFD-01)
            </Link>
          </div>
        }
      />

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Excess Cash Balance Eligible"
          value="₹48,520"
          icon={<Wallet size={20} />}
          iconBg="purple"
          badge="In Cash Ledger"
          badgeType="primary"
          meta="Refundable immediately"
        />

        <StatCard
          title="Active Refund Claims"
          value="1 Application"
          icon={<RotateCcw size={20} />}
          iconBg="orange"
          badge="Clarification"
          badgeType="warning"
          meta="ARN: AA2709240031950"
        />

        <StatCard
          title="Past Sanctioned Refunds"
          value="₹2,10,000"
          icon={<ShieldCheck size={20} />}
          iconBg="green"
          badge="Sanctioned"
          badgeType="success"
          meta="Directly credited to Bank"
        />

        <StatCard
          title="Average Processing Turnaround"
          value="18 Days"
          icon={<Clock size={20} />}
          iconBg="blue"
          badge="Within SLA"
          badgeType="info"
          meta="Statutory limit: 60 days"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Submitted Refund Claims (RFD-01)</span>
          <Link to="/refunds/apply" className="btn btn-outline-primary btn-sm">
            New Claim <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={refundApplications}
            pageSize={5}
            actions={(row) => (
              <Link to={`/refunds/status?arn=${row.arn}`} className="btn btn-outline-primary btn-sm">
                View Timeline
              </Link>
            )}
          />
        </div>
      </div>
    </div>
  );
}
