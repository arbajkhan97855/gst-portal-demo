import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Upload,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Send,
  Building,
  CreditCard
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function GrievancePMT07() {
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

  // Form Fields
  const [grievanceType, setGrievanceType] = useState('Amount debited from bank account, but Cash Ledger not updated (CIN not generated)');
  const [cpin, setCpin] = useState('26042700142984');
  const [paymentDate, setPaymentDate] = useState('2026-04-18');
  const [amountDebited, setAmountDebited] = useState('36000');
  const [paymentMode, setPaymentMode] = useState('Net Banking');
  const [bankName, setBankName] = useState('State Bank of India');
  const [bankAccountNo, setBankAccountNo] = useState('389104829104');
  const [utrNumber, setUtrNumber] = useState('SBIN260418902143');
  const [remarks, setRemarks] = useState('Payment was successfully debited from our SBI Current account at 11:42 AM on 18/04/2026 for GSTR-3B tax payment, but the status still shows "Awaiting Bank Confirmation" and Electronic Cash ledger balance is not updated.');
  const [proofAttached, setProofAttached] = useState(true);

  // Submission state
  const [ticketId, setTicketId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const generatedTicket = `PMT07${gstin.slice(0, 2)}${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTicketId(generatedTicket);
      setSubmitting(false);
      toast.success('Grievance Lodged', `Form GST PMT-07 submitted successfully. Grievance Reference No: ${generatedTicket}`);
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
            { label: 'Grievance against Payment(GST PMT-07)' }
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
              Grievance against Payment (GST PMT-07)
            </h1>
            <p style={{ fontSize: '12px', margin: '3px 0 0', opacity: 0.85 }}>
              Application for intimation of grievance against payment under Rule 87(8) of the CGST Rules, 2017
            </p>
          </div>
          {ticketId && (
            <div style={{ backgroundColor: '#0e8a7d', color: '#ffffff', padding: '4px 12px', borderRadius: '2px', fontSize: '12px', fontWeight: 700 }}>
              Ticket No: {ticketId}
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

        {/* Confirmation banner if submitted */}
        {ticketId && (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px 24px', margin: '20px 24px 0', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
              <CheckCircle2 size={18} /> Grievance Registered Successfully!
            </div>
            <p style={{ fontSize: '13px', color: '#166534', margin: '0 0 6px' }}>
              Your grievance reference number is <strong>{ticketId}</strong>. The banking aggregator and nodal GST officer will resolve your payment mismatch within 24–48 working hours.
            </p>
            <div style={{ fontSize: '12px', color: '#475569' }}>
              Electronic Cash Ledger will be updated automatically upon realization confirmation from the Reserve Bank of India / Authorised Bank.
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>

          {/* Section 1: Grievance Details */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              1. Grievance Category & Reason
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Select Grievance Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                value={grievanceType}
                onChange={(e) => setGrievanceType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
              >
                <option value="Amount debited from bank account, but Cash Ledger not updated (CIN not generated)">
                  Amount debited from bank account, but Cash Ledger not updated (CIN not generated)
                </option>
                <option value="Double debit for the same CPIN">
                  Double debit for the same CPIN
                </option>
                <option value="NEFT/RTGS transaction initiated, UTR generated but CIN not created">
                  NEFT/RTGS transaction initiated, UTR generated but CIN not created
                </option>
                <option value="Tax paid under wrong major/minor head">
                  Tax paid under wrong major/minor head
                </option>
              </select>
            </div>
          </div>

          {/* Section 2: Payment Particulars */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              2. Transaction & Banking Particulars
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  14-digit CPIN (Common Portal Identification Number) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={cpin}
                  onChange={(e) => setCpin(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Date of Payment / Bank Debit <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Total Amount Debited (₹) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  value={amountDebited}
                  onChange={(e) => setAmountDebited(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Payment Mode <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="Net Banking">Net Banking</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="UPI">UPI (Unified Payments Interface)</option>
                  <option value="Over The Counter (OTC)">Over The Counter (OTC - Cash/Cheque)</option>
                  <option value="NEFT / RTGS">NEFT / RTGS</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Bank Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Bank Account Number <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Bank Reference Number / UTR / Transaction Ref ID <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Grievance Remarks & Upload */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
              3. Remarks & Bank Statement Proof
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Remarks / Description of Issue <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Attach Bank Debit Advice / Account Statement (PDF/JPG, max 5MB) <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="file"
                  id="pmt07-proof"
                  style={{ display: 'none' }}
                  onChange={() => {
                    setProofAttached(true);
                    toast.success('File Uploaded', 'SBI_Debit_Advice_CPIN260427.pdf attached.');
                  }}
                />
                <label
                  htmlFor="pmt07-proof"
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
                  {proofAttached ? '✓ SBI_Bank_Debit_Advice_CPIN260427.pdf (420 KB)' : 'No file chosen'}
                </span>
              </div>
            </div>
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
              disabled={submitting}
              style={{
                backgroundColor: '#16325c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 32px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                letterSpacing: '0.4px'
              }}
            >
              {submitting ? 'SUBMITTING GRIEVANCE...' : 'SUBMIT GRIEVANCE'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
