import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, Clock, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_APPLICATIONS } from '../../data/portalData';

export default function RefundStatus() {
  const [searchParams] = useSearchParams();
  const queryArn = searchParams.get('arn') || 'AA2709240031950';

  const [arn, setArn] = useState(queryArn);
  const [app, setApp] = useState(() => {
    return SAMPLE_APPLICATIONS.find(a => a.arn === queryArn) || SAMPLE_APPLICATIONS[2];
  });

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Refunds', to: '/refunds' }, { label: 'Track Refund Status' }]} />
      <PageHeader
        title="Track Refund Claim Processing (RFD-01)"
        subtitle="Monitor verification milestones, deficiency memos (RFD-08), and sanction payment orders."
      />

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header">
          <div>
            <div className="card-title">
              <RotateCcw size={20} className="text-primary" />
              <span>Refund Claim ARN: {app.arn}</span>
            </div>
            <span className="card-subtitle">{app.description}</span>
          </div>
          <span className="badge badge-warning">{app.status}</span>
        </div>

        <div className="card-body">
          <div className="form-row" style={{ marginBottom: '24px' }}>
            <div>
              <span className="form-hint">Claimant Legal Entity</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{app.applicantName}</div>
            </div>
            <div>
              <span className="form-hint">Claim Filing Date</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{app.submissionDate}</div>
            </div>
            <div>
              <span className="form-hint">Assigned Jurisdictional Officer</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{app.assignedOfficer}</div>
            </div>
            <div>
              <span className="form-hint">Form Category</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{app.formType}</div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>
            Refund Lifecycle Timeline
          </h4>

          <div className="timeline">
            {app.stages.map((stage, idx) => (
              <div key={idx} className="timeline-step">
                <div className={`timeline-dot ${stage.done ? 'completed' : 'active'}`}>
                  {stage.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{stage.title}</div>
                  <div className="timeline-desc">{stage.date}</div>
                </div>
              </div>
            ))}
          </div>

          {app.remarks && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              color: '#92400e'
            }}>
              <strong style={{ fontSize: '0.85rem' }}>OFFICER DEFICIENCY MEMO (RFD-08):</strong>
              <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>{app.remarks}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <Link to="/refunds" className="btn btn-outline">
              Back to Refunds
            </Link>
            <Link to="/notices/reply" className="btn btn-primary">
              Furnish Clarification (RFD-09) <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
