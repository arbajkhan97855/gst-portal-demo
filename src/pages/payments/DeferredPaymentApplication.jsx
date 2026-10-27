import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Send,
  Calendar,
  Building
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function DeferredPaymentApplication() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const navigate = useNavigate();

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  // Form fields
  const [demandOrderNo, setDemandOrderNo] = useState('ZA0802260019482');
  const [demandDate, setDemandDate] = useState('2026-02-15');
  const [taxPeriod, setTaxPeriod] = useState('2025-26');
  const [demandAmount, setDemandAmount] = useState('360000');
  const [reliefType, setReliefType] = useState('instalments'); // 'instalments' | 'deferred'
  const [numberOfInstalments, setNumberOfInstalments] = useState('12');
  const [deferredDate, setDeferredDate] = useState('2026-10-31');
  const [grounds, setGrounds] = useState('Severe working capital constraint due to pending delayed payments from government contracts. Business operations would be disrupted if lump sum recovery is enforced.');
  const [fileAttached, setFileAttached] = useState(true);
  const [evcModalOpen, setEvcModalOpen] = useState(false);
  const [evcCode, setEvcCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [arn, setArn] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvcModalOpen(true);
  };

  const handleConfirmFiling = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const generatedArn = `DP${gstin.slice(0, 2)}04${Math.floor(1000000 + Math.random() * 9000000)}`;
      setArn(generatedArn);
      setSubmitting(false);
      setEvcModalOpen(false);
      toast.success('Application Submitted', `DRC-20 application submitted successfully. ARN: ${generatedArn}`);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* Breadcrumb & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Services', to: '/services' },
            { label: 'Payments', to: '/payments' },
            { label: 'Application for Deferred Payment/Payment in Instalments' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#16325c',
            color: '#ffffff',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h1 style={{ fontSize: '16.5px', fontWeight: 700, margin: 0 }}>
              Application for Deferred Payment / Payment in Instalments
            </h1>
            <p style={{ fontSize: '12px', margin: '3px 0 0', opacity: 0.85 }}>
              Form GST DRC-20 (Under Section 80 of the CGST Act, 2017 & Rule 158 of the CGST Rules, 2017)
            </p>
          </div>
          {arn && (
            <div style={{ backgroundColor: '#0e8a7d', color: '#ffffff', padding: '4px 12px', borderRadius: '2px', fontSize: '12px', fontWeight: 700 }}>
              ARN: {arn}
            </div>
          )}
        </div>

        {/* Taxpayer Information Strip */}
        <div style={{ backgroundColor: '#f8fafc', padding: '14px 24px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#1e293b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>GSTIN: <strong>{gstin}</strong></div>
            <div>Legal Name: <strong>{legalName}</strong></div>
            <div>Trade Name: <strong>{tradeName}</strong></div>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>

          {/* Section 1: Demand Order Reference */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              1. Demand Order / Recovery Notice Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Demand Order Reference Number (DRC-07 / DRC-08 / APL-04) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={demandOrderNo}
                  onChange={(e) => setDemandOrderNo(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Demand Order Date <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="date"
                  value={demandDate}
                  onChange={(e) => setDemandDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Tax Period Related to Demand <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={taxPeriod}
                  onChange={(e) => setTaxPeriod(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Total Outstanding Demand Amount (₹) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  value={demandAmount}
                  onChange={(e) => setDemandAmount(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Relief Requested */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              2. Nature of Relief Requested
            </h2>

            <div style={{ display: 'flex', gap: '32px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="reliefType"
                  value="instalments"
                  checked={reliefType === 'instalments'}
                  onChange={() => setReliefType('instalments')}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a' }}
                />
                Payment in Monthly Instalments (up to 24 instalments)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500 }}>
                <input
                  type="radio"
                  name="reliefType"
                  value="deferred"
                  checked={reliefType === 'deferred'}
                  onChange={() => setReliefType('deferred')}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a' }}
                />
                Extension of Time (Deferred One-Time Payment)
              </label>
            </div>

            {reliefType === 'instalments' ? (
              <div style={{ width: '320px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Number of Monthly Instalments Requested (Maximum 24) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={numberOfInstalments}
                  onChange={(e) => setNumberOfInstalments(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="6">6 Months (₹{(demandAmount / 6).toFixed(0)} / month + interest)</option>
                  <option value="12">12 Months (₹{(demandAmount / 12).toFixed(0)} / month + interest)</option>
                  <option value="18">18 Months (₹{(demandAmount / 18).toFixed(0)} / month + interest)</option>
                  <option value="24">24 Months (₹{(demandAmount / 24).toFixed(0)} / month + interest)</option>
                </select>
              </div>
            ) : (
              <div style={{ width: '320px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Proposed Deferred Payment Date <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="date"
                  value={deferredDate}
                  onChange={(e) => setDeferredDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>
            )}
          </div>

          {/* Section 3: Grounds of Application */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              3. Grounds & Reasons for Inability to Pay in Lump Sum
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Detailed Grounds of Financial Hardship <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows={4}
                value={grounds}
                onChange={(e) => setGrounds(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
              />
            </div>

            {/* Document Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Upload Financial Proof / Cash Flow Statement / Bank Statement (PDF, max 5MB)
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="file"
                  id="drc20-doc"
                  style={{ display: 'none' }}
                  onChange={() => {
                    setFileAttached(true);
                    toast.success('Document Attached', 'Audited_CashFlow_2025_26.pdf attached.');
                  }}
                />
                <label
                  htmlFor="drc20-doc"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #16325c',
                    color: '#16325c',
                    padding: '6px 16px',
                    borderRadius: '2px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Upload size={14} /> Choose File
                </label>
                <span style={{ fontSize: '12.5px', color: '#15803d', fontWeight: 600 }}>
                  {fileAttached ? '✓ Audited_Financial_Statement_2025_26.pdf (1.8 MB)' : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Declaration Checkbox */}
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '2px', padding: '12px 16px', marginBottom: '24px', fontSize: '12.5px', color: '#92400e' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" required defaultChecked style={{ marginTop: '2px' }} />
              <span>
                I hereby declare that the particulars given above are true and correct. I am aware that interest under Section 50 at 18% p.a. will be applicable on the unpaid demand till the date of final payment. In case of default in payment of any instalment, the entire outstanding amount shall become immediately recoverable.
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => navigate('/services')}
              style={{
                backgroundColor: '#ffffff',
                color: '#16325c',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              BACK
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#16325c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 32px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.4px'
              }}
            >
              PROCEED TO APPLY
            </button>
          </div>

        </form>
      </div>

      {/* Verification Modal */}
      {evcModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setEvcModalOpen(false)}
          title="Digital Verification (Form GST DRC-20)"
          size="md"
        >
          <form onSubmit={handleConfirmFiling} style={{ padding: '8px 4px' }}>
            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '16px', lineHeight: 1.5 }}>
              Verify application for deferred/instalment payment of demand <strong>₹{Number(demandAmount).toLocaleString('en-IN')}</strong> under <strong>DRC-20</strong>.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Authorised Signatory
              </label>
              <input
                type="text"
                readOnly
                value={`${legalName} (Proprietor)`}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Enter OTP / EVC (Sent to registered mobile/email)
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={evcCode}
                onChange={(e) => setEvcCode(e.target.value)}
                maxLength={6}
                required
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setEvcModalOpen(false)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: '#0e8a7d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT WITH EVC'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
