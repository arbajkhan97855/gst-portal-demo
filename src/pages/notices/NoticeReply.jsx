import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Send, Save, ArrowLeft, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_NOTICES } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';

export default function NoticeReply() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useNotification();
  const noticeId = searchParams.get('id') || 'NOT-2025-081';

  const notice = SAMPLE_NOTICES.find(n => n.id === noticeId) || SAMPLE_NOTICES[0];

  const [replyText, setReplyText] = useState(
    'In reference to Notice ' + notice.noticeNumber + ', the taxpayer respectfully submits that the ITC difference was reconciled as per revised GSTR-2B statement and tax invoice #INV/24-25/0842 uploaded in subsequent return period.'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSaveDraft = () => {
    toast.info('Draft Saved', 'Notice reply draft saved in local storage.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Validation Error', 'Please enter your written response.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      notice.status = 'Replied';
      toast.success(
        'Reply Submitted',
        `Form GST DRC-06 reply filed against Notice ${notice.noticeNumber}.`
      );
      navigate('/notices');
    }, 800);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Notices', to: '/notices' }, { label: 'Submit Reply' }]} />
      <PageHeader
        title={`Reply to Notice: ${notice.noticeNumber}`}
        subtitle={`Form GST DRC-06: Reply to Show Cause Notice / Departmental Intimation under ${notice.section}`}
      />

      <div className="card" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="card-header">
          <span className="card-title">Written Submissions & Evidence Documents</span>
          <span className="badge badge-primary">Form GST DRC-06</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Notice Reference Number</label>
                <input
                  type="text"
                  className="form-control mono"
                  value={notice.noticeNumber}
                  readOnly
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-control"
                  value={notice.subject}
                  readOnly
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Detailed Written Reply / Grounds of Defense <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter statutory reply, factual explanations, and relevant legal citations..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attach Supporting Evidence (Reconciliation Sheet / Tax Invoices)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', flex: 1 }}>Reconciliation_Statement_GSTR2B_vs_3B.pdf (420 KB)</span>
                <span className="badge badge-success">Attached ✓</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Link to="/notices" className="btn btn-outline">
                <ArrowLeft size={16} /> Cancel
              </Link>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="btn btn-outline" onClick={handleSaveDraft}>
                  <Save size={16} /> Save Draft
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Send size={16} /> {submitting ? 'Signing & Submitting...' : 'Sign & Submit Reply (DRC-06)'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
