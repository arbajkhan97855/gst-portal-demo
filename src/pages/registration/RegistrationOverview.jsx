import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowRight, FileCheck, CheckCircle2, Shield, Clock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';

export default function RegistrationOverview() {
  const steps = [
    { num: 1, title: 'Business Details', desc: 'Legal name, trade name, constitution, and state jurisdiction', path: '/registration/business-details' },
    { num: 2, title: 'Promoters / Partners', desc: 'Personal particulars, DIN/PAN, email, and mobile of directors', path: '/registration/promoter-details' },
    { num: 3, title: 'Principal Address', desc: 'Place of business, proof of ownership or rental lease agreement', path: '/registration/address' },
    { num: 4, title: 'Bank Accounts', desc: 'Bank account number, IFSC code, branch, and passbook upload', path: '/registration/bank-details' },
    { num: 5, title: 'Document Uploads', desc: 'PAN, photos, address proof, and partnership deed/COI', path: '/registration/documents' },
    { num: 6, title: 'Aadhaar / DSC Verification', desc: 'Digital signature or Aadhaar OTP authentication for final ARN', path: '/registration/verification' }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'GST Registration Portal' }]} />
      <PageHeader
        title="GST Registration Application (Form GST REG-01)"
        subtitle="Complete digital enrollment wizard for new taxpayers seeking registration under the Goods and Services Tax Act."
        actions={
          <Link to="/registration/status" className="btn btn-outline-primary">
            <Clock size={16} /> Track Existing ARN Status
          </Link>
        }
      />

      <div className="card" style={{ marginBottom: '28px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
              Ready to start your new registration?
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#1e3a8a', marginTop: '4px' }}>
              The registration wizard takes approximately 10-15 minutes. All data is saved in draft automatically.
            </p>
          </div>
          <Link to="/registration/business-details" className="btn btn-primary btn-lg">
            Start New Application <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
        Registration Workflow & Steps
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {steps.map(step => (
          <div key={step.num} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="badge badge-primary">Step {step.num}</span>
              <span className="badge badge-neutral">Form REG-01</span>
            </div>
            <div className="card-body" style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                {step.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {step.desc}
              </p>
            </div>
            <div className="card-footer">
              <Link to={step.path} className="btn btn-outline-primary btn-sm">
                Open Step {step.num} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
