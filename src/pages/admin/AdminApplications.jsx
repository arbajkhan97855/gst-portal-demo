import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, HelpCircle, Eye } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { SAMPLE_APPLICATIONS } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function AdminApplications() {
  const { toast } = useNotification();
  const { applications, updateApplication, deleteApplication } = usePortalData();
  const apps = applications || SAMPLE_APPLICATIONS;
  const [selectedApp, setSelectedApp] = useState(null);

  const handleApprove = (arn) => {
    updateApplication(arn, { status: 'Approved' });
    toast.success('Application Approved', `ARN ${arn} approved. Certificate of Registration dispatched.`);
  };

  const handleReject = (arn) => {
    updateApplication(arn, { status: 'Rejected' });
    toast.error('Application Rejected', `Rejection order issued for ARN ${arn}.`);
  };

  const handleClarification = (arn) => {
    updateApplication(arn, { status: 'Clarification Required' });
    toast.warning('Clarification Notice Sent', `Form REG-03 clarification notice issued for ARN ${arn}.`);
  };

  const columns = [
    { header: 'ARN Reference', field: 'arn', render: (v) => <span className="mono"><strong>{v}</strong></span> },
    { header: 'Applicant Legal Name', field: 'applicantName' },
    { header: 'Form Category', field: 'formType', render: (v) => <span className="badge badge-primary">{v}</span> },
    { header: 'Submission Date', field: 'submissionDate' },
    {
      header: 'Review Status',
      field: 'status',
      render: (v) => (
        <span className={`badge ${
          v === 'Approved' ? 'badge-success' :
          v === 'Rejected' ? 'badge-danger' : 'badge-warning'
        }`}>
          {v}
        </span>
      )
    },
    { header: 'Jurisdictional Officer', field: 'assignedOfficer' }
  ];

  return (
    <div>
      <PageHeader
        title="Application Review & Scrutiny Workflow"
        subtitle="Adjudicate new registrations (REG-01), amendments (REG-14), and refund claims (RFD-01)."
      />

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={apps}
            pageSize={10}
            actions={(row) => (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedApp(row)}
                  title="View Dossier"
                >
                  <Eye size={14} /> View
                </button>
                {row.status !== 'Approved' && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(row.arn)}
                      title="Approve Application"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleClarification(row.arn)}
                      title="Request Clarification"
                    >
                      <HelpCircle size={14} /> Clarify
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(row.arn)}
                      title="Reject Application"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {selectedApp && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Application Scrutiny: ${selectedApp.arn}`}
          size="md"
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedApp(null)}>
              Close Dossier
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>Applicant Name:</span>
              <strong>{selectedApp.applicantName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>PAN:</span>
              <strong className="mono">{selectedApp.pan}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>Category:</span>
              <span>{selectedApp.description} ({selectedApp.formType})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>Status:</span>
              <span className="badge badge-primary">{selectedApp.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Officer Remarks:</span>
              <span style={{ fontSize: '0.88rem' }}>{selectedApp.remarks || 'No adverse remarks recorded.'}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
