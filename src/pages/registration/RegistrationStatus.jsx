import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, FileText, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_APPLICATIONS } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';

export default function RegistrationStatus() {
  const [searchParams] = useSearchParams();
  const { toast } = useNotification();
  const queryArn = searchParams.get('arn') || 'AA2709240019284';

  const [arn, setArn] = useState(queryArn);
  const [app, setApp] = useState(() => {
    return SAMPLE_APPLICATIONS.find(a => a.arn === queryArn) || SAMPLE_APPLICATIONS[0];
  });

  const handleDownloadSlip = () => {
    toast.success('Downloaded', `Acknowledgment Slip for ARN ${app.arn} saved.`);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Application Status' }]} />
      <PageHeader
        title="Application Status & Officer Review (ARN)"
        subtitle="Track the real-time processing stages and jurisdictional officer review of your registration application."
        actions={
          <button className="btn btn-outline" onClick={handleDownloadSlip}>
            <Download size={16} /> Download Acknowledgment (REG-02)
          </button>
        }
      />

      <div className="card" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="card-header" style={{
          backgroundColor: app.status === 'Approved' ? '#ecfdf5' : '#eff6ff',
          borderColor: app.status === 'Approved' ? '#a7f3d0' : '#bfdbfe'
        }}>
          <div>
            <div className="card-title">
              <ShieldCheck size={20} color={app.status === 'Approved' ? 'var(--success)' : 'var(--primary)'} />
              <span>Application Reference: {app.arn}</span>
            </div>
            <span className="card-subtitle">{app.description} ({app.formType})</span>
          </div>
          <span className={`badge ${app.status === 'Approved' ? 'badge-success' : 'badge-primary'}`}>
            {app.status}
          </span>
        </div>

        <div className="card-body">
          <div className="form-row" style={{ marginBottom: '24px' }}>
            <div>
              <span className="form-hint">Applicant Legal Name</span>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{app.applicantName}</div>
            </div>
            <div>
              <span className="form-hint">Permanent Account Number (PAN)</span>
              <div className="mono" style={{ fontWeight: 600, marginTop: '2px' }}>{app.pan}</div>
            </div>
            <div>
              <span className="form-hint">Date of Submission</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{app.submissionDate}</div>
            </div>
            <div>
              <span className="form-hint">Jurisdictional Range & Officer</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{app.assignedOfficer}</div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>
            Processing Milestones
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
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                OFFICER REVIEW FINDINGS:
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {app.remarks}
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <Link to="/registration" className="btn btn-outline">
              Start Another Registration
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Return to Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
