import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Key, Smartphone } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function VerificationStep() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [signatory, setSignatory] = useState('Rajesh Ramniklal Sharma (Managing Director)');
  const [place, setPlace] = useState('Mumbai');
  const [signingMethod, setSigningMethod] = useState('evc'); // 'evc' or 'dsc'
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!declarationAgreed) {
      toast.error('Declaration Required', 'You must agree to the statutory declaration before submitting.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      const generatedArn = `AA27092400${Math.floor(10000 + Math.random() * 90000)}`;
      localStorage.setItem('gst_last_arn', generatedArn);
      toast.success(
        'Application Submitted',
        `Form REG-01 submitted successfully. ARN: ${generatedArn}`
      );
      navigate(`/registration/status?arn=${generatedArn}`);
    }, 800);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 6: Verification' }]} />
      <PageHeader
        title="Form GST REG-01: Step 6 — Statutory Declaration & E-Sign"
        subtitle="Authenticate and digitally sign your Goods and Services Tax application."
      />

      <RegistrationWizardNav currentStep={6} />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <ShieldCheck size={18} className="text-primary" />
            <span>Solemn Affirmation & Digital Authentication</span>
          </div>
          <span className="badge badge-primary">Final Step</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <label className="form-check" style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                />
                <span className="form-check-label" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                  <strong>I hereby solemnly affirm and declare</strong> that the information given herein above is true and correct to the best of my knowledge and belief and that nothing has been concealed therefrom. I understand that any false statement or suppression of material facts will make the registration liable to immediate cancellation under Section 29 of the CGST Act.
                </span>
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Authorized Signatory</label>
                <input
                  type="text"
                  className="form-control"
                  value={signatory}
                  readOnly
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Place of Declaration <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Digital Authentication Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                <div
                  onClick={() => setSigningMethod('evc')}
                  style={{
                    border: `2px solid ${signingMethod === 'evc' ? 'var(--secondary)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: signingMethod === 'evc' ? '#eff6ff' : 'var(--surface)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary)' }}>
                    <Smartphone size={18} />
                    <span>Submit with EVC (Aadhaar OTP)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Quick instant authentication via Aadhaar registered mobile OTP (Simulated).
                  </div>
                </div>

                <div
                  onClick={() => setSigningMethod('dsc')}
                  style={{
                    border: `2px solid ${signingMethod === 'dsc' ? 'var(--secondary)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: signingMethod === 'dsc' ? '#eff6ff' : 'var(--surface)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--primary)' }}>
                    <Key size={18} />
                    <span>Submit with Digital Signature (DSC)</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Sign using Class-3 USB Token DSC (Required for Companies / LLPs).
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <Link to="/registration/documents" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Documents
              </Link>
              <button
                type="submit"
                className="btn btn-success btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Generating ARN & Signing...' : 'Sign & Submit Application (REG-01)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
