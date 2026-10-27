import React from 'react';
import { Clock, ShieldCheck, FileSpreadsheet, CreditCard, User, Upload, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';

export default function Activity() {
  const activities = [
    {
      id: 'act-1',
      action: 'Taxpayer Session Login',
      category: 'Authentication',
      timestamp: 'Today, 09:30 AM',
      ip: '103.21.58.114',
      status: 'Successful',
      details: 'Logged in via Web Portal from Mumbai, Maharashtra'
    },
    {
      id: 'act-2',
      action: 'Challan Payment Realized',
      category: 'Payments',
      timestamp: '18-Feb-2025 04:15 PM',
      ip: '103.21.58.114',
      status: 'Realized',
      details: 'CPIN 25022700142984 credited to Electronic Cash Ledger (₹9,36,000)'
    },
    {
      id: 'act-3',
      action: 'Form GSTR-3B Filed',
      category: 'Returns',
      timestamp: '18-Feb-2025 05:20 PM',
      ip: '103.21.58.114',
      status: 'Filed & Signed',
      details: 'Form GSTR-3B for January 2025 submitted with ARN AA2701250119284'
    },
    {
      id: 'act-4',
      action: 'Form GSTR-1 Submitted',
      category: 'Returns',
      timestamp: '09-Feb-2025 02:40 PM',
      ip: '103.21.58.114',
      status: 'Filed & Signed',
      details: 'Outward supplies summary for January 2025 submitted with ARN AA2701250102938'
    },
    {
      id: 'act-5',
      action: 'Taxpayer Profile Updated',
      category: 'Profile',
      timestamp: '15-Jan-2025 11:10 AM',
      ip: '103.21.58.114',
      status: 'Updated',
      details: 'Authorized contact details and primary email address updated'
    }
  ];

  const columns = [
    { header: 'Activity Action', field: 'action', render: (val) => <strong>{val}</strong> },
    {
      header: 'Category',
      field: 'category',
      render: (val) => <span className="badge badge-neutral">{val}</span>
    },
    { header: 'Timestamp', field: 'timestamp' },
    { header: 'IP Address', field: 'ip', render: (val) => <span className="mono">{val}</span> },
    {
      header: 'Status',
      field: 'status',
      render: (val) => <span className="badge badge-success">{val}</span>
    },
    { header: 'Event Particulars', field: 'details' }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Activity Audit Log' }]} />
      <PageHeader
        title="Activity Audit Log & Security Trail"
        subtitle="Chronological log of logins, filing events, challan generations, and profile modifications."
      />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Clock size={18} className="text-primary" />
            <span>Audit Trail Records</span>
          </div>
          <span className="badge badge-primary">Immutable Audit Log</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={activities}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
