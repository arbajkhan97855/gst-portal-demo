import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  Building,
  Smartphone,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Info
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { downloadChallanReceipt } from '../../utils/downloadHelpers';

export default function GenerateChallan() {
  const { currentUser, updateProfile } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const { addChallan } = usePortalData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Screen: 'reason' (matches create_challan_-_1_21f9c520.png, create_challan_-_2_d136993d.png, create_challan_-_3_b4e705fd.png)
  // or 'create' (PMT-06 tax grid)
  const initialScreen = searchParams.get('direct') ? 'create' : 'reason';
  const [screen, setScreen] = useState(initialScreen);

  // Reason for Challan states (from screenshots)
  // 'monthly_qr' = "Monthly payment for quarterly return"
  // 'other' = "Any other payment"
  const [reasonForChallan, setReasonForChallan] = useState('monthly_qr');
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [period, setPeriod] = useState('August');
  
  // Challan Type: '35_percent' | 'self_assessment' | null
  const [challanType, setChallanType] = useState('35_percent');

  // Ledger Balance Collapsible state
  const [showLedgerBalance, setShowLedgerBalance] = useState(true);

  // Help Modal State
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Heads: Tax, Interest, Penalty, Fee, Other
  const [heads, setHeads] = useState({
    igst: { tax: 0, interest: 0, penalty: 0, fee: 0, other: 0 },
    cgst: { tax: 15000, interest: 0, penalty: 0, fee: 0, other: 0 },
    sgst: { tax: 15000, interest: 0, penalty: 0, fee: 0, other: 0 },
    cess: { tax: 0, interest: 0, penalty: 0, fee: 0, other: 0 }
  });

  const [paymentMode, setPaymentMode] = useState('netbanking');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [paying, setPaying] = useState(false);
  const [receiptModal, setReceiptModal] = useState(null);

  const calculateSubtotal = (headObj) => {
    return (
      (parseFloat(headObj.tax) || 0) +
      (parseFloat(headObj.interest) || 0) +
      (parseFloat(headObj.penalty) || 0) +
      (parseFloat(headObj.fee) || 0) +
      (parseFloat(headObj.other) || 0)
    );
  };

  const igstTotal = calculateSubtotal(heads.igst);
  const cgstTotal = calculateSubtotal(heads.cgst);
  const sgstTotal = calculateSubtotal(heads.sgst);
  const cessTotal = calculateSubtotal(heads.cess);
  const grandTotal = igstTotal + cgstTotal + sgstTotal + cessTotal;

  const updateField = (taxType, field, val) => {
    setHeads(prev => ({
      ...prev,
      [taxType]: {
        ...prev[taxType],
        [field]: parseFloat(val) || 0
      }
    }));
  };

  // When proceeding from Reason screen to PMT-06 Create Challan screen
  const handleProceedFromReason = () => {
    if (reasonForChallan === 'monthly_qr' && !challanType) {
      toast.warning('Selection Required', 'Please select a Challan Type (35% Challan or Self-assessment).');
      return;
    }

    if (reasonForChallan === 'monthly_qr' && challanType === '35_percent') {
      // Auto pre-populate 35% of cash paid in previous quarter (e.g. ₹10,500 CGST + ₹10,500 SGST)
      setHeads({
        igst: { tax: 0, interest: 0, penalty: 0, fee: 0, other: 0 },
        cgst: { tax: 10500, interest: 0, penalty: 0, fee: 0, other: 0 },
        sgst: { tax: 10500, interest: 0, penalty: 0, fee: 0, other: 0 },
        cess: { tax: 0, interest: 0, penalty: 0, fee: 0, other: 0 }
      });
      toast.info('35% Challan Pre-filled', 'Amounts auto-calculated based on 35% of net cash tax paid in preceding quarter.');
    }

    setScreen('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (grandTotal <= 0) {
      toast.error('Validation Error', 'Challan amount must be greater than zero.');
      return;
    }

    setPaying(true);

    setTimeout(() => {
      setPaying(false);
      const cpin = `26042700${Math.floor(100000 + Math.random() * 900000)}`;
      const cin = `${selectedBank.substring(0, 4).toUpperCase()}260427${Math.floor(100000 + Math.random() * 900000)}`;

      // Update user cash balance in context
      const newCash = (currentUser.cashBalance || 48520) + grandTotal;
      if (updateProfile) updateProfile({ cashBalance: newCash });

      // Save Challan record
      if (addChallan) {
        addChallan({
          cpin,
          cin,
          createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          bank: selectedBank,
          paymentMode: paymentMode.toUpperCase(),
          totalAmount: grandTotal,
          status: 'Realized / Paid'
        });
      }

      setReceiptModal({
        cpin,
        cin,
        amount: grandTotal,
        date: new Date().toLocaleString('en-IN'),
        bank: selectedBank,
        mode: paymentMode,
        heads
      });

      toast.success('Challan Paid Successfully', `Payment realized via ${selectedBank}. CIN: ${cin}`);
    }, 1200);
  };

  // Determine if Proceed button is enabled in reason screen
  const isProceedEnabled =
    reasonForChallan === 'other' ||
    (reasonForChallan === 'monthly_qr' && Boolean(challanType));

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* ============================================================== */}
      {/* SCREEN 1: REASON FOR CHALLAN                                   */}
      {/* Screenshots: create_challan_-_1_21f9c520.png                  */}
      {/*             create_challan_-_2_d136993d.png                  */}
      {/*             create_challan_-_3_b4e705fd.png                  */}
      {/* URL: payment.gst.gov.in/payment/auth/challanreason             */}
      {/* ============================================================== */}
      {screen === 'reason' && (
        <div>
          {/* Breadcrumb & Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Payment', to: '/payments' },
                { label: 'Reason for challan' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '24px 32px 32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              marginBottom: '20px'
            }}
          >
            {/* Heading and HELP button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Reason For Challan
              </h1>
              <button
                type="button"
                onClick={() => setHelpModalOpen(true)}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                HELP <HelpCircle size={15} />
              </button>
            </div>

            {/* Mandatory Fields indicator */}
            <div style={{ textAlign: 'right', fontSize: '12.5px', color: '#1e293b', fontWeight: 500, marginBottom: '24px' }}>
              <span style={{ color: '#dc2626', fontWeight: 700 }}>• </span>
              indicates mandatory fields
            </div>

            {/* Field: Reason For Challan */}
            <div style={{ display: 'flex', marginBottom: '24px' }}>
              <div style={{ width: '220px', fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
                Reason For Challan<span style={{ color: '#dc2626' }}>•</span> :
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="reasonForChallan"
                    value="monthly_qr"
                    checked={reasonForChallan === 'monthly_qr'}
                    onChange={() => setReasonForChallan('monthly_qr')}
                    style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                  />
                  Monthly payment for quarterly return
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: 500 }}>
                  <input
                    type="radio"
                    name="reasonForChallan"
                    value="other"
                    checked={reasonForChallan === 'other'}
                    onChange={() => setReasonForChallan('other')}
                    style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                  />
                  Any other payment
                </label>
              </div>
            </div>

            {/* Conditional Fields when "Monthly payment for quarterly return" is selected */}
            {reasonForChallan === 'monthly_qr' && (
              <div style={{ marginLeft: '220px', marginBottom: '24px' }}>
                {/* Financial Year & Period Row */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                  <div style={{ width: '220px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                      Financial Year<span style={{ color: '#dc2626' }}>•</span>
                    </label>
                    <select
                      value={financialYear}
                      onChange={(e) => setFinancialYear(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '13px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                        backgroundColor: '#ffffff',
                        color: '#1e293b'
                      }}
                    >
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                    </select>
                  </div>

                  <div style={{ width: '220px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                      Period<span style={{ color: '#dc2626' }}>•</span>
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '13px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '2px',
                        backgroundColor: '#ffffff',
                        color: '#1e293b'
                      }}
                    >
                      <option value="August">August</option>
                      <option value="July">July</option>
                      <option value="May">May</option>
                      <option value="April">April</option>
                      <option value="November">November</option>
                      <option value="October">October</option>
                      <option value="February">February</option>
                      <option value="January">January</option>
                    </select>
                  </div>
                </div>

                {/* Challan Type */}
                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '130px', fontSize: '13.5px', fontWeight: 700, color: '#1e293b', paddingTop: '2px' }}>
                    Challan Type<span style={{ color: '#dc2626' }}>•</span> :
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: 500 }}>
                      <input
                        type="radio"
                        name="challanType"
                        value="35_percent"
                        checked={challanType === '35_percent'}
                        onChange={() => setChallanType('35_percent')}
                        style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                      />
                      35 % Challan
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', color: '#1e293b', fontWeight: 500 }}>
                      <input
                        type="radio"
                        name="challanType"
                        value="self_assessment"
                        checked={challanType === 'self_assessment'}
                        onChange={() => setChallanType('self_assessment')}
                        style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                      />
                      Challan on self-assessment basis
                    </label>
                  </div>
                </div>

                {/* Blue Informational Banner when 35 % Challan is selected (create_challan_-_2_d136993d.png) */}
                {challanType === '35_percent' && (
                  <div
                    style={{
                      backgroundColor: '#e0f2fe',
                      border: '1px solid #bae6fd',
                      borderRadius: '2px',
                      padding: '12px 16px',
                      color: '#0369a1',
                      fontSize: '13px',
                      marginTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>ℹ</span>
                    <span>
                      As per Law, no interest shall be levied for the selected month if payment is made by 25th of the next month or the extended date, if any
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Row: VIEW LEDGER BALANCE and PROCEED */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setShowLedgerBalance(!showLedgerBalance)}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  letterSpacing: '0.4px'
                }}
              >
                VIEW LEDGER BALANCE {showLedgerBalance ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <button
                type="button"
                onClick={handleProceedFromReason}
                disabled={!isProceedEnabled}
                style={{
                  backgroundColor: isProceedEnabled ? '#16325c' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px 36px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isProceedEnabled ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.5px'
                }}
              >
                PROCEED
              </button>
            </div>

            {/* Collapsible Ledger Balance Table (create_challan_-_2_d136993d.png & create_challan_-_3_b4e705fd.png) */}
            {showLedgerBalance && (
              <div style={{ marginTop: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                  Ledger Balance as on date : 21-10-2026
                </div>

                <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                        <th
                          rowSpan={2}
                          style={{
                            padding: '10px 14px',
                            textAlign: 'left',
                            fontWeight: 700,
                            color: '#1e293b',
                            borderRight: '1px solid #cbd5e1',
                            width: '260px'
                          }}
                        >
                          Type of Ledger
                        </th>
                        <th
                          colSpan={5}
                          style={{
                            padding: '8px 14px',
                            textAlign: 'center',
                            fontWeight: 700,
                            color: '#1e293b',
                            borderBottom: '1px solid #cbd5e1'
                          }}
                        >
                          Available Balance (₹)
                        </th>
                      </tr>
                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', borderRight: '1px solid #e2e8f0' }}>Integrated Tax (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', borderRight: '1px solid #e2e8f0' }}>Central Tax (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', borderRight: '1px solid #e2e8f0' }}>State Tax (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', borderRight: '1px solid #e2e8f0' }}>CESS (₹)</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 500, color: '#1e293b' }}>
                          Electronic Cash Ledger
                        </td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', color: '#2563eb', fontWeight: 600 }}>0.00</td>
                      </tr>
                      <tr style={{ backgroundColor: '#ffffff' }}>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #cbd5e1', fontWeight: 500, color: '#1e293b' }}>
                          Electronic Credit Ledger
                        </td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>730.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>1,917.00</td>
                        <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>0.00</td>
                        <td style={{ padding: '10px 14px', color: '#2563eb', fontWeight: 600 }}>2,647.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Note Section (matches create_challan_-_1_21f9c520.png verbatim) */}
            <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.6, borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                Note: For taxpayer filing GSTR-3B on quarterly basis:
              </div>
              <p style={{ margin: '0 0 6px' }}>
                1. To make payment for the first (M1) and second (M2) months of the quarter, please select reason as 'Monthly Payment for Quarterly Return' and the relevant period (financial year, month) and choose whether to pay through 35% challan or self-assessment challan.
              </p>
              <p style={{ margin: '0 0 6px' }}>
                2. To make payment for the third month of the Quarter (M3), please use 'Create Challan' option in payment Table-6 of Form GSTR-3B Quarterly. An auto-populated challan amounting to liabilities for the quarter net off credit utilization and existing cash balance can be generated and used to offset liabilities.
              </p>
              <p style={{ margin: 0 }}>
                <Link to="/returns" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Click here</Link> for navigation to 'Return Dashboard' and prepare GSTR-3B Quarterly. Filing of GSTR-3B Quarterly available in the third month of the quarter is
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: PMT-06 CREATE CHALLAN TABLE                          */}
      {/* ============================================================== */}
      {screen === 'create' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Payment', to: '/payments' },
                { label: 'Reason for challan', onClick: () => setScreen('reason') },
                { label: 'Create Challan' }
              ]}
            />
            <button
              type="button"
              onClick={() => setScreen('reason')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#16325c',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ArrowLeft size={13} /> Change Reason / Period
            </button>
          </div>

          <PageHeader
            title="Create Challan (Form GST PMT-06)"
            subtitle={
              reasonForChallan === 'monthly_qr'
                ? `Monthly Payment for Quarterly Return (${period} ${financialYear} — ${challanType === '35_percent' ? '35% Challan' : 'Self-assessment'})`
                : 'Any Other Payment (Normal Payment of Tax, Interest, Penalty, Fees)'
            }
          />

          <form onSubmit={handleSimulatePayment}>
            {/* Tax Details Grid */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <span className="card-title">Tax Details</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Enter amounts to be deposited into the Electronic Cash Ledger
                </span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th style={{ width: '22%' }}>Major Head</th>
                        <th style={{ width: '15%' }}>Tax (₹)</th>
                        <th style={{ width: '15%' }}>Interest (₹)</th>
                        <th style={{ width: '15%' }}>Penalty (₹)</th>
                        <th style={{ width: '15%' }}>Fee (₹)</th>
                        <th style={{ width: '18%', textAlign: 'right' }}>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* IGST */}
                      <tr>
                        <td><strong>Integrated Tax (0008)</strong></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.igst.tax} onChange={e => updateField('igst', 'tax', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.igst.interest} onChange={e => updateField('igst', 'interest', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.igst.penalty} onChange={e => updateField('igst', 'penalty', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.igst.fee} onChange={e => updateField('igst', 'fee', e.target.value)} /></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{igstTotal.toLocaleString('en-IN')}</td>
                      </tr>

                      {/* CGST */}
                      <tr>
                        <td><strong>Central Tax (0005)</strong></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cgst.tax} onChange={e => updateField('cgst', 'tax', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cgst.interest} onChange={e => updateField('cgst', 'interest', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cgst.penalty} onChange={e => updateField('cgst', 'penalty', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cgst.fee} onChange={e => updateField('cgst', 'fee', e.target.value)} /></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{cgstTotal.toLocaleString('en-IN')}</td>
                      </tr>

                      {/* SGST */}
                      <tr>
                        <td><strong>State / UT Tax (0006)</strong></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.sgst.tax} onChange={e => updateField('sgst', 'tax', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.sgst.interest} onChange={e => updateField('sgst', 'interest', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.sgst.penalty} onChange={e => updateField('sgst', 'penalty', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.sgst.fee} onChange={e => updateField('sgst', 'fee', e.target.value)} /></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{sgstTotal.toLocaleString('en-IN')}</td>
                      </tr>

                      {/* Cess */}
                      <tr>
                        <td><strong>GST Cess (0009)</strong></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cess.tax} onChange={e => updateField('cess', 'tax', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cess.interest} onChange={e => updateField('cess', 'interest', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cess.penalty} onChange={e => updateField('cess', 'penalty', e.target.value)} /></td>
                        <td><input type="number" min="0" className="form-control form-control-sm" value={heads.cess.fee} onChange={e => updateField('cess', 'fee', e.target.value)} /></td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{cessTotal.toLocaleString('en-IN')}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <td style={{ fontWeight: 700 }}>Total Challan Amount:</td>
                        <td colSpan={5} style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.15rem', color: 'var(--primary)' }}>
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header">
                <span className="card-title">Payment Modes</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <label className={`card ${paymentMode === 'netbanking' ? 'border-primary' : ''}`} style={{ cursor: 'pointer', padding: '16px', margin: 0, backgroundColor: paymentMode === 'netbanking' ? 'rgba(11,34,70,0.03)' : 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="paymode" value="netbanking" checked={paymentMode === 'netbanking'} onChange={e => setPaymentMode(e.target.value)} />
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building size={16} /> Net Banking
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time realization (All major banks)</div>
                      </div>
                    </div>
                  </label>

                  <label className={`card ${paymentMode === 'upi' ? 'border-primary' : ''}`} style={{ cursor: 'pointer', padding: '16px', margin: 0, backgroundColor: paymentMode === 'upi' ? 'rgba(11,34,70,0.03)' : 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="paymode" value="upi" checked={paymentMode === 'upi'} onChange={e => setPaymentMode(e.target.value)} />
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Smartphone size={16} /> UPI / QR Code
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BHIM, GPay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </label>

                  <label className={`card ${paymentMode === 'cards' ? 'border-primary' : ''}`} style={{ cursor: 'pointer', padding: '16px', margin: 0, backgroundColor: paymentMode === 'cards' ? 'rgba(11,34,70,0.03)' : 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="paymode" value="cards" checked={paymentMode === 'cards'} onChange={e => setPaymentMode(e.target.value)} />
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={16} /> Credit / Debit Card
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay</div>
                      </div>
                    </div>
                  </label>

                  <label className={`card ${paymentMode === 'neft' ? 'border-primary' : ''}`} style={{ cursor: 'pointer', padding: '16px', margin: 0, backgroundColor: paymentMode === 'neft' ? 'rgba(11,34,70,0.03)' : 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="radio" name="paymode" value="neft" checked={paymentMode === 'neft'} onChange={e => setPaymentMode(e.target.value)} />
                      <div>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Wallet size={16} /> NEFT / RTGS / OTC
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Over the Counter or Bank Mandate</div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="form-group" style={{ maxWidth: '400px' }}>
                  <label className="form-label">Select Authorized Bank</label>
                  <select className="form-control" value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setScreen('reason')}
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Back to Reason for Challan
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={paying || grandTotal <= 0}
              >
                {paying ? (
                  <>Processing Bank Payment...</>
                ) : (
                  <>
                    <CreditCard size={18} /> GENERATE CHALLAN & PAY ₹{grandTotal.toLocaleString('en-IN')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* HELP MODAL */}
      {helpModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setHelpModalOpen(false)}
          title="Help — Reason for Challan & QRMP Scheme Payments"
          size="md"
        >
          <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#16325c', marginBottom: '8px' }}>
              Quarterly Return Monthly Payment (QRMP) Scheme
            </h4>
            <p>
              Taxpayers with an aggregate turnover up to ₹5 crore can opt for the QRMP scheme. Under this scheme, returns (Form GSTR-3B) are filed quarterly, but tax for the first two months of the quarter (M1 and M2) must be paid monthly by the 25th of the succeeding month.
            </p>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#16325c', margin: '12px 0 4px' }}>
              1. 35% Fixed Sum Challan:
            </h5>
            <p>
              A pre-filled challan equal to 35% of the tax paid in cash in the preceding quarter's return. No interest is charged on this amount if paid by the 25th.
            </p>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#16325c', margin: '12px 0 4px' }}>
              2. Self-Assessment Challan:
            </h5>
            <p>
              Taxpayer calculates actual tax liability on outward supplies after considering eligible Input Tax Credit (ITC) for that specific month.
            </p>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#16325c', margin: '12px 0 4px' }}>
              3. Any Other Payment:
            </h5>
            <p>
              For regular monthly filers or voluntary tax payments, demand orders, DRC-03 payments, or advance liability deposits.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                style={{ backgroundColor: '#16325c', color: '#fff', border: 'none', padding: '6px 18px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RECEIPT MODAL */}
      {receiptModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setReceiptModal(null);
            navigate('/payments/history');
          }}
          title="Challan Payment Realized (Form GST PMT-06)"
          size="lg"
        >
          <div style={{ padding: '8px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={48} color="#15803d" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ margin: 0, color: '#15803d' }}>Payment Successful</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Your tax payment has been credited to your Electronic Cash Ledger (Form GST PMT-05).
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.875rem' }}>
                <div><strong>Common Portal ID (CPIN):</strong> <span className="mono">{receiptModal.cpin}</span></div>
                <div><strong>Challan Identification (CIN):</strong> <span className="mono">{receiptModal.cin}</span></div>
                <div><strong>Taxpayer GSTIN:</strong> <span className="mono">{currentUser.gstin}</span></div>
                <div><strong>Payment Channel:</strong> {receiptModal.mode.toUpperCase()} ({receiptModal.bank})</div>
                <div><strong>Realization Timestamp:</strong> {receiptModal.date}</div>
                <div><strong>Total Realized Amount:</strong> <strong style={{ color: 'var(--primary)' }}>₹{receiptModal.amount.toLocaleString('en-IN')}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  downloadChallanReceipt(receiptModal, currentUser);
                  toast.success('Downloaded', 'Challan receipt (PMT-06) downloaded.');
                }}
              >
                <Download size={16} /> Download Challan PDF
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setReceiptModal(null);
                  navigate('/payments/history');
                }}
              >
                View in Challan History
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
