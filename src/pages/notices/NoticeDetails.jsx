import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BellRing, ArrowLeft, Send, Download, AlertTriangle, FileText } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_NOTICES } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';

export default function NoticeDetails() {
  const [searchParams] = useSearchParams();
  const { toast } = useNotification();
  const noticeId = searchParams.get('id') || 'NOT-2025-081';

  const notice = SAMPLE_NOTICES.find(n => n.id === noticeId) || SAMPLE_NOTICES[0];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Notices', to: '/notices' }, { label: notice.noticeNumber }]} />
      <PageHeader
        title={`Notice: ${notice.noticeNumber}`}
        subtitle={`Issued under ${notice.section} by ${notice.issuingAuthority}`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/notices" className="btn btn-outline">
              <ArrowLeft size={16} /> Back to Notices
            </Link>
            <button
              className="btn btn-outline-primary"
              onClick={() => toast.success('Downloaded', `Notice ${notice.noticeNumber} exported in PDF.`)}
            >
              <Download size={16} /> Download Notice PDF
            </button>
            {notice.status !== 'Closed' && (
              <Link to={`/notices/reply?id=${notice.id}`} className="btn btn-primary">
                <Send size={16} /> File Official Reply
              </Link>
            )}
          </div>
        }
      />

      <div className="card" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <BellRing size={20} className="text-primary" />
              <span>{notice.subject}</span>
            </div>
            <span className="card-subtitle">Issued Date: {notice.date} | Statutory Due Date: {notice.dueDate}</span>
          </div>
          <span className={`badge ${notice.status === 'New' ? 'badge-danger' : 'badge-warning'}`}>
            {notice.status}
          </span>
        </div>

        <div className="card-body">
          <div className="form-row" style={{ marginBottom: '24px' }}>
            <div>
              <span className="form-hint">Notice Reference</span>
              <div className="mono" style={{ fontWeight: 700, marginTop: '2px' }}>{notice.noticeNumber}</div>
            </div>
            <div>
              <span className="form-hint">Governing Act Section</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{notice.section}</div>
            </div>
            <div>
              <span className="form-hint">Issuing Tax Office</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{notice.issuingAuthority}</div>
            </div>
            <div>
              <span className="form-hint">Demanded / In Discrepancy (₹)</span>
              <div className="mono" style={{ fontWeight: 700, color: 'var(--danger)', marginTop: '2px' }}>
                ₹{notice.amountInvolved.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'var(--primary)' }}>
            Statutory Description & Grounds of Notice
          </h4>
          <div style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '20px',
            lineHeight: '1.6',
            fontSize: '0.92rem',
            color: 'var(--text-primary)'
          }}>
            {notice.details}
          </div>

          <div style={{
            marginTop: '24px',
            padding: '14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span>
              <strong>Deadline Alert:</strong> A response or payment of demand must be filed on or before <strong>{notice.dueDate}</strong> to avoid ex-parte adjudication order under Section 73(9).
            </span>
            <Link to={`/notices/reply?id=${notice.id}`} className="btn btn-danger btn-sm">
              Submit Reply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
