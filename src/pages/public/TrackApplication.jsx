import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, Check, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_APPLICATIONS } from '../../data/portalData';
import { usePortalData } from '../../context/PortalDataContext';

export default function TrackApplication() {
  const { applications: portalApps } = usePortalData();
  const applications = portalApps || SAMPLE_APPLICATIONS;
  const [arnInput, setArnInput] = useState('AA2709240019284');
  const [selectedApp, setSelectedApp] = useState(applications[0] || SAMPLE_APPLICATIONS[0]);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    const query = arnInput.trim().toUpperCase();
    const match = applications.find(a => a.arn === query);
    if (match) {
      setSelectedApp(match);
      setNotFound(false);
    } else {
      setSelectedApp(null);
      setNotFound(true);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Track Application Status' }]} />
      <PageHeader
        title="Track Application Status (ARN)"
        subtitle="Monitor progress, jurisdictional officer review, and approval lifecycle of your GST registration, amendment, or refund filing."
      />

      <div className="card" style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
        <div className="card-body">
          <form onSubmit={handleTrack}>
            <div className="form-group">
              <label className="form-label">Application Reference Number (ARN)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control mono"
                  value={arnInput}
                  onChange={(e) => setArnInput(e.target.value)}
                  placeholder="Enter 15-digit ARN (e.g. AA2709240019284)..."
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Search size={16} /> Track Status
                </button>
              </div>
            </div>
          </form>

          {/* Sample quick ARNs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample ARNs:</span>
            {applications.slice(0, 4).map(app => (
              <button
                key={app.arn}
                type="button"
                className="badge badge-primary"
                onClick={() => {
                  setArnInput(app.arn);
                  setSelectedApp(app);
                  setNotFound(false);
                }}
              >
                {app.arn} ({app.status})
              </button>
            ))}
          </div>
        </div>
      </div>

      {notFound && (
        <div className="empty-state" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <AlertCircle className="empty-state-icon" style={{ color: 'var(--danger)' }} />
          <h4 className="empty-state-title">ARN Not Found</h4>
          <p className="empty-state-text">
            No application record matched "{arnInput}". Please check the reference number on your acknowledgment slip.
          </p>
        </div>
      )}

      {selectedApp && (
        <div className="card" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <FileText size={20} className="text-primary" />
                <span>Application Reference: {selectedApp.arn}</span>
              </div>
              <span className="card-subtitle">{selectedApp.description} ({selectedApp.formType})</span>
            </div>
            <span className={`badge ${
              selectedApp.status === 'Approved' ? 'badge-success' :
              selectedApp.status === 'Clarification Required' ? 'badge-warning' : 'badge-info'
            }`}>
              {selectedApp.status}
            </span>
          </div>

          <div className="card-body">
            <div className="form-row" style={{ marginBottom: '28px' }}>
              <div>
                <span className="form-hint">Applicant Legal Entity</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>
                  {selectedApp.applicantName}
                </div>
              </div>
              <div>
                <span className="form-hint">Permanent Account Number (PAN)</span>
                <div className="mono" style={{ fontWeight: 600, marginTop: '2px' }}>
                  {selectedApp.pan}
                </div>
              </div>
              <div>
                <span className="form-hint">Date of Submission</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {selectedApp.submissionDate}
                </div>
              </div>
              <div>
                <span className="form-hint">Jurisdictional Officer</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {selectedApp.assignedOfficer}
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--primary)' }}>
              Application Lifecycle Timeline
            </h4>

            <div className="timeline">
              {selectedApp.stages.map((stage, idx) => (
                <div key={idx} className="timeline-step">
                  <div className={`timeline-dot ${stage.done ? 'completed' : 'active'}`}>
                    {stage.done ? <Check size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">{stage.title}</div>
                    <div className="timeline-desc">{stage.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {selectedApp.remarks && (
              <div style={{
                marginTop: '24px',
                padding: '14px',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  OFFICER REMARKS / FINDINGS:
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedApp.remarks}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
