import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, Eye, Send, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import { SAMPLE_NOTICES } from '../../data/portalData';

export default function NoticesList() {
  const [notices, setNotices] = useState(SAMPLE_NOTICES);

  const columns = [
    { header: 'Notice Ref No.', field: 'noticeNumber', render: (val) => <span className="mono"><strong>{val}</strong></span> },
    { header: 'Issuing Section', field: 'section', render: (v) => <span className="badge badge-primary">{v}</span> },
    { header: 'Issue Date', field: 'date' },
    { header: 'Subject Particulars', field: 'subject' },
    { header: 'Response Deadline', field: 'dueDate', render: (v) => <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{v}</span> },
    {
      header: 'Status',
      field: 'status',
      render: (val) => (
        <span className={`badge ${
          val === 'New' ? 'badge-danger' :
          val === 'Replied' ? 'badge-warning' : 'badge-success'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Notices & Statutory Orders' }]} />
      <PageHeader
        title="Departmental Notices, Orders & Demands"
        subtitle="Review show cause notices (SCN), scrutiny intimations (ASMT-10), and submit statutory replies."
      />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BellRing size={18} className="text-primary" />
            <span>Notices Issued by Jurisdictional Tax Authorities</span>
          </div>
          <span className="badge badge-danger">1 Action Required</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={notices}
            pageSize={10}
            actions={(row) => (
              <div style={{ display: 'flex', gap: '6px' }}>
                <Link
                  to={`/notices/details?id=${row.id}`}
                  className="btn btn-outline btn-sm"
                  title="View Notice"
                >
                  <Eye size={14} /> View
                </Link>
                {row.status !== 'Closed' && (
                  <Link
                    to={`/notices/reply?id=${row.id}`}
                    className="btn btn-primary btn-sm"
                    title="Submit Reply"
                  >
                    <Send size={14} /> Reply
                  </Link>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
