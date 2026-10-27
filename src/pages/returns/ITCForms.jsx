import React, { useState } from 'react';
import {
  FileText,
  RotateCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Upload,
  ArrowLeft,
  Eye,
  Send,
  Save,
  ShieldCheck,
  Building
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ITCForms() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialScreen = () => {
    const path = location.pathname;
    if (path.includes('/itcform/add')) return 'itc01';
    if (path.includes('/itc02/transfer')) return 'itc02';
    if (path.includes('/itc02a/transfer')) return 'itc02a';
    if (path.includes('/itc03/section')) return 'itc03';
    if (path.includes('/itc04/selectquarter')) return 'itc04';
    return 'home';
  };

  const [screen, setScreen] = useState(getInitialScreen);

  // Synchronize when path changes
  React.useEffect(() => {
    const newScreen = getInitialScreen();
    setScreen(newScreen);
  }, [location.pathname]);

  // Taxpayer identity
  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  // ==============================================================
  // ITC-01 State
  // ==============================================================
  const [itc01Section, setItc01Section] = useState('Select');
  const [itc01Invoices, setItc01Invoices] = useState([
    {
      id: 1,
      supplierGstin: '07AABCB2212M1Z5',
      invNo: 'INV/25/881',
      invDate: '2025-05-14',
      goodsType: 'Inputs in stock',
      hsn: '84713010',
      taxableValue: 240000,
      cgst: 21600,
      sgst: 21600,
      igst: 0
    }
  ]);

  // ==============================================================
  // ITC-02 State
  // ==============================================================
  const [itc02TransfereeGstin, setItc02TransfereeGstin] = useState('');
  const [itc02TransfereeLegalName, setItc02TransfereeLegalName] = useState('');
  const [itc02TransfereeTradeName, setItc02TransfereeTradeName] = useState('');
  const [itc02TransferAmounts, setItc02TransferAmounts] = useState({
    cgst: '',
    sgst: '',
    igst: '',
    cess: ''
  });
  const [itc02CaFirm, setItc02CaFirm] = useState('');
  const [itc02CaName, setItc02CaName] = useState('');
  const [itc02CaMembership, setItc02CaMembership] = useState('');
  const [itc02CaCertDate, setItc02CaCertDate] = useState('');
  const [itc02AttachmentName, setItc02AttachmentName] = useState('');

  // When transferee GSTIN is typed
  const handleTransfereeGstinChange = (val) => {
    setItc02TransfereeGstin(val);
    if (val.length === 15) {
      setItc02TransfereeLegalName('BHARAT LOGISTICS & ALLIED SERVICES PVT LTD');
      setItc02TransfereeTradeName('BHARAT ALLIED');
    } else {
      setItc02TransfereeLegalName('');
      setItc02TransfereeTradeName('');
    }
  };

  // ==============================================================
  // ITC-02A State
  // ==============================================================
  const [itc02aAmounts, setItc02aAmounts] = useState({
    cgst: '0',
    sgst: '0',
    igst: '0',
    cess: '0'
  });

  // ==============================================================
  // ITC-03 State
  // ==============================================================
  const [itc03Section, setItc03Section] = useState('Select');
  const [itc03StockRecords, setItc03StockRecords] = useState([
    {
      id: 1,
      desc: 'Inputs held in stock as raw materials',
      hsn: '85176290',
      qty: 120,
      unit: 'NOS',
      taxableVal: 180000,
      cgstRev: 16200,
      sgstRev: 16200,
      igstRev: 0
    }
  ]);

  // ==============================================================
  // ITC-04 State
  // ==============================================================
  const [itc04Fy, setItc04Fy] = useState('Select');
  const [itc04Period, setItc04Period] = useState('Select');
  const [itc04Searched, setItc04Searched] = useState(false);

  // ITC-04 Records Count
  const [itc04Table4Records, setItc04Table4Records] = useState([]);
  const [itc04Table5aRecords, setItc04Table5aRecords] = useState([]);
  const [itc04Table5bRecords, setItc04Table5bRecords] = useState([]);
  const [itc04Table5cRecords, setItc04Table5cRecords] = useState([]);

  // Submitting / OTP Filing modal state
  const [filingModalOpen, setFilingModalOpen] = useState(false);
  const [filingType, setFilingType] = useState('EVC'); // 'EVC' | 'DSC'
  const [activeFilingForm, setActiveFilingForm] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedArns, setGeneratedArns] = useState({});

  const handleStartFiling = (formCode, mode) => {
    setActiveFilingForm(formCode);
    setFilingType(mode);
    setOtpInput('');
    setFilingModalOpen(true);
  };

  const handleConfirmFiling = () => {
    setSubmitting(true);
    setTimeout(() => {
      const arn = `AA${gstin.slice(0, 2)}${activeFilingForm.replace(/[^0-9]/g, '')}${Math.floor(1000000 + Math.random() * 9000000)}`;
      setGeneratedArns((prev) => ({
        ...prev,
        [activeFilingForm]: arn
      }));
      setSubmitting(false);
      setFilingModalOpen(false);
      toast.success('Form Filed Successfully', `${activeFilingForm} filed successfully with ARN: ${arn}`);
    }, 1200);
  };

  const handleSaveDraft = (formCode) => {
    toast.success('Draft Saved', `${formCode} details saved as draft successfully.`);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '50px' }}>

      {/* ============================================================== */}
      {/* SCREEN 1: GST ITC FORMS LANDING PAGE                           */}
      {/* Screenshot: First-page.png                                     */}
      {/* URL: return.gst.gov.in/returns2/auth/itcform/links             */}
      {/* ============================================================== */}
      {screen === 'home' && (
        <div>
          {/* Top Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'GST ITC Forms' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Centered White Heading Box */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '16px 20px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              GST ITC Forms
            </h1>
          </div>

          {/* Tiles Grid: 3 columns top row, 2 columns bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>

            {/* TILE 1: GST ITC-01 */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  padding: '18px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  minHeight: '85px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                GST ITC-01 : Declaration for claim of ITC under sub-section (1) of section 18
              </div>
              <div style={{ padding: '24px 16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc01');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE ONLINE
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Download Offline Utility', 'GST ITC-01 Excel/JSON offline utility downloaded.')}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE OFFLINE
                </button>
              </div>
            </div>

            {/* TILE 2: GST ITC-02 */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  padding: '18px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  minHeight: '85px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                GST ITC-02 : Declaration for transfer of ITC in case of sale, merger, or transfer of a business under Section 18(3)
              </div>
              <div style={{ padding: '24px 16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc02');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 22px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE ONLINE
                </button>
              </div>
            </div>

            {/* TILE 3: GST ITC-02A */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  padding: '14px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  minHeight: '85px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>GST ITC-02A</div>
                <div style={{ fontSize: '11.5px', fontWeight: 500, opacity: 0.95 }}>
                  Declaration for transfer of ITC pursuant to registration under sub-section (2) of section 25
                </div>
              </div>
              <div style={{ padding: '24px 16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc02a');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  TRANSFER ITC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc02a-action');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  TAKE ACTION
                </button>
              </div>
            </div>

          </div>

          {/* Row 2: 2 Tiles (GST-ITC-03 & GST ITC-04) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

            {/* TILE 4: GST-ITC-03 */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  padding: '18px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  minHeight: '85px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                GST-ITC-03 : ITC reversal/payment of tax under sec 18 (4)
              </div>
              <div style={{ padding: '24px 16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc03');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE ONLINE
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Download Offline Utility', 'GST ITC-03 Excel/JSON offline utility downloaded.')}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE OFFLINE
                </button>
              </div>
            </div>

            {/* TILE 5: GST ITC-04 */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  padding: '18px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  minHeight: '85px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                GST ITC-04 : Details of goods/capital goods sent to job worker and received back
              </div>
              <div style={{ padding: '24px 16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('itc04');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE ONLINE
                </button>
                <button
                  type="button"
                  onClick={() => toast.info('Download Offline Utility', 'GST ITC-04 Excel/JSON offline utility downloaded.')}
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  PREPARE OFFLINE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: GST ITC-01 SCREEN                                    */}
      {/* Screenshot: ITC-1.png                                          */}
      {/* URL: return.gst.gov.in/returns2/auth/itcform/add               */}
      {/* ============================================================== */}
      {screen === 'itc01' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC01' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Details Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '14px 20px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#1e293b'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px 24px' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
            </div>
          </div>

          {/* Teal Header */}
          <div
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '2px 2px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '14.5px' }}>
              Declaration for claim of input tax credit under sub-section (1) of section 18
            </span>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              onClick={() => toast.info('Refreshed', 'Form refreshed.')}
              title="Refresh"
            >
              <RotateCw size={15} />
            </button>
          </div>

          {/* Main Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px 24px',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            {/* Dropdown: Claim made under* */}
            <div style={{ maxWidth: '420px', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Claim made under<span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={itc01Section}
                onChange={(e) => setItc01Section(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '3px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b'
                }}
              >
                <option value="Select">Select</option>
                <option value="Section 18(1)(b)">Section 18(1)(b)</option>
                <option value="Section 18(1)(d)">Section 18(1)(d)</option>
              </select>
            </div>

            {/* Info Notice matching screenshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155', marginBottom: '24px' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>ℹ</span>
              <span>If you have more than 500 invoices, please use offline utility to upload the invoices.</span>
            </div>

            {/* If section chosen, show Inward invoices table */}
            {itc01Section !== 'Select' && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>
                    Invoices of inputs held in stock ({itc01Section})
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = itc01Invoices.length + 1;
                      setItc01Invoices([
                        ...itc01Invoices,
                        {
                          id: newId,
                          supplierGstin: '08AAACG1122K1Z9',
                          invNo: `INV-25-${newId * 100}`,
                          invDate: '2025-06-15',
                          goodsType: 'Inputs in stock',
                          hsn: '85044090',
                          taxableValue: 125000,
                          cgst: 11250,
                          sgst: 11250,
                          igst: 0
                        }
                      ]);
                      toast.success('Row Added', 'New invoice row added.');
                    }}
                    style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> ADD INVOICE
                  </button>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflowX: 'auto', marginBottom: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Supplier GSTIN</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Invoice No</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Invoice Date</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>HSN</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Taxable Val (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>CGST (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>SGST (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itc01Invoices.map((inv) => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{inv.supplierGstin}</td>
                          <td style={{ padding: '8px 10px' }}>{inv.invNo}</td>
                          <td style={{ padding: '8px 10px' }}>{inv.invDate}</td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{inv.hsn}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{inv.taxableValue.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>₹{inv.cgst.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>₹{inv.sgst.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setItc01Invoices(itc01Invoices.filter((i) => i.id !== inv.id))}
                              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveDraft('GST ITC-01')}
                    style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '8px 22px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartFiling('GST ITC-01', 'EVC')}
                    style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '8px 22px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    FILE WITH EVC
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Buttons matching screenshot ITC-1.png */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('home')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '7px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.4px'
                }}
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 3: GST ITC-02 SCREEN                                    */}
      {/* Screenshots: ITC-02 KA 1.png & ITC-02 KA 2.png                 */}
      {/* URL: return.gst.gov.in/returns2/auth/itc02/transfer            */}
      {/* ============================================================== */}
      {screen === 'itc02' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC02' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Details Bar with Status - Not Filed */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '14px 20px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#1e293b'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px 20px' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div>Status - <strong style={{ color: generatedArns['GST ITC-02'] ? '#16a34a' : '#1e293b' }}>{generatedArns['GST ITC-02'] ? 'Filed' : 'Not Filed'}</strong></div>
            </div>
          </div>

          {/* Teal Header Banner */}
          <div
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '2px 2px 0 0',
              fontWeight: 700,
              fontSize: '14.5px',
              lineHeight: '1.4'
            }}
          >
            Declaration for transfer of ITC in case of sale, merger, demerger, amalgamation, lease or transfer of a business under sub-section (3) of section 18
          </div>

          {/* Card Body */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px 24px',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            {/* Row: Transferee GSTIN, Legal Name, Trade Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Transferee GSTIN/UIN<span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={itc02TransfereeGstin}
                  onChange={(e) => handleTransfereeGstinChange(e.target.value.toUpperCase())}
                  placeholder=""
                  maxLength={15}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #3b82f6',
                    borderRadius: '2px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Transferee Legal Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={itc02TransfereeLegalName}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Transferee Trade Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={itc02TransfereeTradeName}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }}
                />
              </div>
            </div>

            {/* Details of ITC to be transferred */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>
                Details of ITC to be transferred
              </h3>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #cbd5e1', width: '25%' }}>
                        Tax
                      </th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #cbd5e1', width: '35%' }}>
                        Amount of matched ITC available (₹)
                      </th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, width: '40%' }}>
                        Amount of matched ITC to be transferred (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Central tax</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>730.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02TransferAmounts.cgst}
                          onChange={(e) => setItc02TransferAmounts({ ...itc02TransferAmounts, cgst: e.target.value })}
                          placeholder="₹0.00"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>State/UT tax</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>1,917.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02TransferAmounts.sgst}
                          onChange={(e) => setItc02TransferAmounts({ ...itc02TransferAmounts, sgst: e.target.value })}
                          placeholder="₹0.00"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Integrated tax (₹)</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>0.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02TransferAmounts.igst}
                          onChange={(e) => setItc02TransferAmounts({ ...itc02TransferAmounts, igst: e.target.value })}
                          placeholder="₹0.00"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Cess</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>0.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02TransferAmounts.cess}
                          onChange={(e) => setItc02TransferAmounts({ ...itc02TransferAmounts, cess: e.target.value })}
                          placeholder="₹0.00"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Particulars of certifying CA / CMA (Matching ITC-02 KA 2.png) */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>
                Particulars of certifying Chartered Accountant or Cost Accountant
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Name of the Firm issuing certificate<span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={itc02CaFirm}
                    onChange={(e) => setItc02CaFirm(e.target.value)}
                    placeholder="Name of the Firm issuing certificate"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Name of the certifying Chartered Accountant/Cost Accountant<span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={itc02CaName}
                    onChange={(e) => setItc02CaName(e.target.value)}
                    placeholder="Enter Name"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Membership number<span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={itc02CaMembership}
                    onChange={(e) => setItc02CaMembership(e.target.value)}
                    placeholder="Enter Membership number"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Date of issuance of certificate<span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={itc02CaCertDate}
                    onChange={(e) => setItc02CaCertDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                  />
                </div>
              </div>

              {/* Attachment file upload */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Attachment (option for uploading certificate)<span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '3px' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>ℹ </span>Only JPEG/PDF file format is allowed
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  <span style={{ color: '#0f172a', fontWeight: 700 }}>ℹ </span>Maximum file size for upload is 500 KB
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="file"
                    id="itc02-file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setItc02AttachmentName(e.target.files[0].name);
                        toast.info('File Chosen', e.target.files[0].name);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('itc02-file').click()}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      padding: '5px 14px',
                      fontSize: '12.5px',
                      cursor: 'pointer'
                    }}
                  >
                    Choose File
                  </button>
                  <span style={{ fontSize: '12.5px', color: itc02AttachmentName ? '#16a34a' : '#64748b' }}>
                    {itc02AttachmentName || 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Buttons matching screenshot ITC-02 KA 2.png */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('home')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '7px 22px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => handleSaveDraft('GST ITC-02')}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 24px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={() => handleStartFiling('GST ITC-02', 'DSC')}
                style={{
                  backgroundColor: '#8fa4be',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                FILE ITC WITH DSC
              </button>
              <button
                type="button"
                onClick={() => handleStartFiling('GST ITC-02', 'EVC')}
                style={{
                  backgroundColor: '#8fa4be',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                FILE ITC WITH EVC
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 4: GST ITC-02A (TRANSFER ITC)                           */}
      {/* Screenshot: ITC-02A - TRANSFER ITC - KA 2.png                  */}
      {/* URL: return.gst.gov.in/returns2/auth/itc02a/transfer           */}
      {/* ============================================================== */}
      {screen === 'itc02a' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-02A' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
              Transferee Action -
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 12px 0' }}>
                Details of ITC to be transferred
              </h3>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #cbd5e1', width: '25%' }}>
                        Tax
                      </th>
                      <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #cbd5e1', width: '35%' }}>
                        Amount of matched ITC available (₹)
                      </th>
                      <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, width: '40%' }}>
                        Amount of matched ITC to be transferred (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Central tax</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>₹730.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02aAmounts.cgst}
                          onChange={(e) => setItc02aAmounts({ ...itc02aAmounts, cgst: e.target.value })}
                          placeholder="₹0"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>State/UT tax</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>₹1,917.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02aAmounts.sgst}
                          onChange={(e) => setItc02aAmounts({ ...itc02aAmounts, sgst: e.target.value })}
                          placeholder="₹0"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Integrated tax (₹)</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>₹0.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02aAmounts.igst}
                          onChange={(e) => setItc02aAmounts({ ...itc02aAmounts, igst: e.target.value })}
                          placeholder="₹0"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 14px', fontWeight: 600, borderRight: '1px solid #cbd5e1' }}>Cess</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #cbd5e1' }}>₹0.00</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          type="text"
                          value={itc02aAmounts.cess}
                          onChange={(e) => setItc02aAmounts({ ...itc02aAmounts, cess: e.target.value })}
                          placeholder="₹0"
                          style={{ width: '100%', padding: '6px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '2px', textAlign: 'right' }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Buttons matching screenshot ITC-02A - TRANSFER ITC - KA 2.png */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('home')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '7px 22px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => handleSaveDraft('GST ITC-02A')}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 24px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={() => handleStartFiling('GST ITC-02A', 'DSC')}
                style={{
                  backgroundColor: '#8fa4be',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                FILE ITC WITH DSC
              </button>
              <button
                type="button"
                onClick={() => handleStartFiling('GST ITC-02A', 'EVC')}
                style={{
                  backgroundColor: '#8fa4be',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                FILE ITC WITH EVC
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 4B: GST ITC-02A (TAKE ACTION)                           */}
      {/* ============================================================== */}
      {screen === 'itc02a-action' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-02A Take Action' }
              ]}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
              Pending ITC-02A Transfer Requests from Transferor
            </h2>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No pending ITC-02A transfer requests available for action at this time.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setScreen('home')}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 24px', borderRadius: '2px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 5: GST-ITC-03 SCREEN                                    */}
      {/* Screenshot: ITC-03.png                                         */}
      {/* URL: return.gst.gov.in/returns2/auth/itc03/section             */}
      {/* ============================================================== */}
      {screen === 'itc03' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-03' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Details Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              padding: '14px 20px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#1e293b'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px 24px' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
            </div>
          </div>

          {/* Teal Header */}
          <div
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '2px 2px 0 0',
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '1.45'
            }}
          >
            Declaration for intimation of ITC reversal/payment of tax on inputs held in stock, inputs contained in semi-finished and finished goods held in stock and capital goods under sub-section (4) of section 18
          </div>

          {/* Card Body */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginBottom: '20px' }}>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
            </div>

            {/* Section* Dropdown matching ITC-03.png */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', minWidth: '70px' }}>
                Section<span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ width: '280px' }}>
                <select
                  value={itc03Section}
                  onChange={(e) => setItc03Section(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Select">Select</option>
                  <option value="Section 18(4) - Opting for Composition Scheme">Section 18(4) - Opting for Composition Scheme</option>
                  <option value="Section 18(4) - Goods or services becoming wholly exempt">Section 18(4) - Goods or services becoming wholly exempt</option>
                  <option value="Section 29(5) - Cancellation of Registration">Section 29(5) - Cancellation of Registration</option>
                </select>
              </div>
            </div>

            {/* If PROCEED clicked or section chosen, show table */}
            {itc03Section !== 'Select' && (
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b', marginBottom: '12px' }}>
                  Stock Reversal Computation Table ({itc03Section})
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflowX: 'auto', marginBottom: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Stock Description</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>HSN</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Stock Value (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>CGST Reversal (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>SGST Reversal (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itc03StockRecords.map((r) => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px' }}>{r.desc}</td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{r.hsn}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{r.taxableVal.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>₹{r.cgstRev.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>₹{r.sgstRev.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveDraft('GST ITC-03')}
                    style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 22px', borderRadius: '2px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartFiling('GST ITC-03', 'EVC')}
                    style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 22px', borderRadius: '2px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    FILE WITH EVC
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Buttons matching ITC-03.png */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('home')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '7px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BACK
              </button>
              <button
                type="button"
                disabled={itc03Section === 'Select'}
                onClick={() => {
                  toast.success('Section Selected', 'Proceeding with ' + itc03Section);
                }}
                style={{
                  backgroundColor: itc03Section === 'Select' ? '#8fa4be' : '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: itc03Section === 'Select' ? 'not-allowed' : 'pointer'
                }}
              >
                PROCEED
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 6: GST ITC-04 SCREEN                                    */}
      {/* Screenshots: ITC-04 KA 1, 2, 3 VIEW                            */}
      {/* URL: return.gst.gov.in/returns2/auth/itc04/selectquarter       */}
      {/* ============================================================== */}
      {screen === 'itc04' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-04' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Details Bar */}
          {itc04Searched ? (
            /* Search ke baad ka status header matching ITC-04 KA 3 VIEW SEARCH BAD.png */
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                padding: '12px 20px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#1e293b'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>FY - <strong>{itc04Fy}</strong></div>
                <div>Tax Period - <strong>{itc04Period}</strong></div>
                <div>Due Date - <strong>25/10/2025</strong></div>
                <div>Filing Status - <strong style={{ color: generatedArns['GST ITC-04'] ? '#16a34a' : '#1e293b' }}>{generatedArns['GST ITC-04'] ? 'Filed' : 'Not Filed'}</strong></div>
              </div>
            </div>
          ) : (
            /* Search se pehle ka header matching ITC-04 KA 1 VIEW & KA 2 VIEW */
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                padding: '14px 20px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#1e293b'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px 24px' }}>
                <div>GSTIN - <strong>{gstin}</strong></div>
                <div>Legal Name - <strong>{legalName}</strong></div>
                <div>Trade Name - <strong>{tradeName}</strong></div>
              </div>
            </div>
          )}

          {/* Teal Header Banner with Refresh Icon */}
          <div
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '2px 2px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '14.5px' }}>
              Details of goods/capital goods sent to job worker and received back
            </span>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              onClick={() => toast.info('Refreshed', 'ITC-04 view refreshed.')}
              title="Refresh"
            >
              <RotateCw size={15} />
            </button>
          </div>

          {/* Card Body */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px',
              marginBottom: '24px'
            }}
          >
            {/* If not searched yet, show FY and Period Selection Form */}
            {!itc04Searched ? (
              <div>
                {/* AATO line on right matching ITC-04 KA 2 VIEW.png */}
                {itc04Fy !== 'Select' && (
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#1e293b', fontWeight: 600, marginBottom: '14px' }}>
                    Annual Aggregate Turnover (AATO) for FY 2024-25 : NA
                  </div>
                )}

                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {/* Financial Year* */}
                  <div style={{ width: '260px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Financial Year<span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      value={itc04Fy}
                      onChange={(e) => {
                        setItc04Fy(e.target.value);
                        if (e.target.value === 'Select') setItc04Period('Select');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '13px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '3px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value="Select">Select</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2026-27">2026-27</option>
                    </select>
                  </div>

                  {/* Return Filing Period* (matching ITC-04 KA 2 VIEW.png) */}
                  {itc04Fy !== 'Select' && (
                    <div style={{ width: '260px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Return Filing Period<span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        value={itc04Period}
                        onChange={(e) => setItc04Period(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: '13px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '3px',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <option value="Select">Select</option>
                        <option value="Apr-Sep">Apr-Sep</option>
                        <option value="Oct-Mar">Oct-Mar</option>
                        <option value="Apr-Mar">Apr-Mar</option>
                      </select>
                    </div>
                  )}

                  {/* SEARCH Button */}
                  <div>
                    <button
                      type="button"
                      disabled={itc04Fy === 'Select' || itc04Period === 'Select'}
                      onClick={() => {
                        setItc04Searched(true);
                        toast.success('Search Successful', `ITC-04 loaded for ${itc04Period} (${itc04Fy}).`);
                      }}
                      style={{
                        backgroundColor: itc04Fy !== 'Select' && itc04Period !== 'Select' ? '#16325c' : '#16325c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '8px 24px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: itc04Fy !== 'Select' && itc04Period !== 'Select' ? 'pointer' : 'default',
                        letterSpacing: '0.4px'
                      }}
                    >
                      SEARCH
                    </button>
                  </div>
                </div>

                {/* Bottom Back Button matching screenshot */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setScreen('home')}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#16325c',
                      border: '1px solid #16325c',
                      borderRadius: '2px',
                      padding: '7px 28px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    BACK
                  </button>
                </div>
              </div>
            ) : (
              /* SEARCH KE BAAD KA VIEW: 4 Blue Tiles matching ITC-04 KA 3 VIEW SEARCH BAD.png */
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>

                  {/* TILE 1: Table 4 */}
                  <div
                    onClick={() => setScreen('itc04-table-4')}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        lineHeight: '1.45',
                        minHeight: '85px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      4. Details of inputs/capital goods sent for job work (includes inputs/capital goods directly sent to place of business /premises of job worker)
                    </div>
                    <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>No. of Records-</div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 700, marginTop: '4px' }}>
                        {itc04Table4Records.length}
                      </div>
                    </div>
                  </div>

                  {/* TILE 2: Table 5A */}
                  <div
                    onClick={() => setScreen('itc04-table-5a')}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        lineHeight: '1.45',
                        minHeight: '85px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      5A. Details of inputs/ capital goods received back from job worker to whom such goods were sent for job work; and losses and wastes:
                    </div>
                    <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>No. of Records-</div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 700, marginTop: '4px' }}>
                        {itc04Table5aRecords.length}
                      </div>
                    </div>
                  </div>

                  {/* TILE 3: Table 5B */}
                  <div
                    onClick={() => setScreen('itc04-table-5b')}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        lineHeight: '1.45',
                        minHeight: '85px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      5B. Details of inputs / capital goods received back from job worker other than the job worker to whom such goods were originally sent for job work; and losses and wastes:
                    </div>
                    <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>No. of Records-</div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 700, marginTop: '4px' }}>
                        {itc04Table5bRecords.length}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Tile 4 (Table 5C) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  <div
                    onClick={() => setScreen('itc04-table-5c')}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        lineHeight: '1.45',
                        minHeight: '85px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      5C. Details of inputs/ Capital goods sent to job worker and subsequently supplied from premises of job worker; and losses and wastes:
                    </div>
                    <div style={{ padding: '24px 16px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                      <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>No. of Records-</div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 700, marginTop: '4px' }}>
                        {itc04Table5cRecords.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions bottom bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setItc04Searched(false)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#16325c',
                      border: '1px solid #16325c',
                      borderRadius: '2px',
                      padding: '7px 24px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    CHANGE PERIOD
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleSaveDraft('GST ITC-04')}
                      style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 22px', borderRadius: '2px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      SAVE DRAFT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartFiling('GST ITC-04', 'EVC')}
                      style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 22px', borderRadius: '2px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      FILE WITH EVC
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 6B: ITC-04 TABLE 4 DETAILS ENTRY                        */}
      {/* ============================================================== */}
      {screen === 'itc04-table-4' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-04', onClick: () => setScreen('itc04') },
                { label: 'Table 4: Goods Sent to Job Worker' }
              ]}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                4. Details of inputs/capital goods sent for job work
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newId = itc04Table4Records.length + 1;
                  setItc04Table4Records([
                    ...itc04Table4Records,
                    {
                      id: newId,
                      challanNo: `CH-25-${newId * 10}`,
                      challanDate: '2025-05-18',
                      jwGstin: '08AAACG2211J1Z8',
                      jwState: '08-Rajasthan',
                      goodsDesc: 'Fabric rolls for stitching & embroidery',
                      hsn: '52081190',
                      taxableVal: 150000,
                      igst: 7500
                    }
                  ]);
                  toast.success('Record Added', 'Challan record added.');
                }}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> ADD CHALLAN
              </button>
            </div>

            {itc04Table4Records.length === 0 ? (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No records found. Click on "ADD CHALLAN" to add details of goods sent for job work.
              </div>
            ) : (
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Challan No</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Challan Date</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Job Worker GSTIN</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>HSN</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Taxable Val (₹)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Tax (₹)</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itc04Table4Records.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r.challanNo}</td>
                        <td style={{ padding: '8px 10px' }}>{r.challanDate}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{r.jwGstin}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace' }}>{r.hsn}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{r.taxableVal.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>₹{r.igst.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setItc04Table4Records(itc04Table4Records.filter((x) => x.id !== r.id))}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setScreen('itc04')}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 24px', borderRadius: '2px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK TO ITC-04
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 6C: ITC-04 TABLE 5A DETAILS ENTRY                       */}
      {/* ============================================================== */}
      {screen === 'itc04-table-5a' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-04', onClick: () => setScreen('itc04') },
                { label: 'Table 5A: Goods Received Back' }
              ]}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                5A. Details of inputs/capital goods received back from job worker
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newId = itc04Table5aRecords.length + 1;
                  setItc04Table5aRecords([
                    ...itc04Table5aRecords,
                    {
                      id: newId,
                      origChallanNo: `CH-25-${newId * 10}`,
                      recvChallanNo: `RCV-25-${newId * 10}`,
                      recvDate: '2025-06-12',
                      qtyRecv: '500 MTR',
                      lossQty: '10 MTR',
                      status: 'Received Back'
                    }
                  ]);
                  toast.success('Record Added', 'Received goods record added.');
                }}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '2px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> ADD RECEIPT
              </button>
            </div>

            {itc04Table5aRecords.length === 0 ? (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No records found. Click on "ADD RECEIPT" to record goods received back from job worker.
              </div>
            ) : (
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Original Challan</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Receipt Challan</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>Receipt Date</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty Received</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Loss / Waste</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itc04Table5aRecords.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px' }}>{r.origChallanNo}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r.recvChallanNo}</td>
                        <td style={{ padding: '8px 10px' }}>{r.recvDate}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{r.qtyRecv}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#eab308' }}>{r.lossQty}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setItc04Table5aRecords(itc04Table5aRecords.filter((x) => x.id !== r.id))}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setScreen('itc04')}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 24px', borderRadius: '2px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK TO ITC-04
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 6D & 6E: ITC-04 TABLE 5B & 5C SCREENS                   */}
      {/* ============================================================== */}
      {(screen === 'itc04-table-5b' || screen === 'itc04-table-5c') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'ITC Forms', onClick: () => setScreen('home') },
                { label: 'ITC-04', onClick: () => setScreen('itc04') },
                { label: screen === 'itc04-table-5b' ? 'Table 5B' : 'Table 5C' }
              ]}
            />
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
              {screen === 'itc04-table-5b'
                ? '5B. Details of inputs/capital goods received back from other job worker'
                : '5C. Details of goods supplied directly from premises of job worker'}
            </h3>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
              No records declared under this table for the selected period.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setScreen('itc04')}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 24px', borderRadius: '2px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK TO ITC-04
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VERIFICATION & FILING WITH EVC / DSC                    */}
      {/* ============================================================== */}
      <Modal
        isOpen={filingModalOpen}
        onClose={() => setFilingModalOpen(false)}
        title={`File ${activeFilingForm} with ${filingType}`}
        maxWidth="550px"
      >
        <div style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldCheck size={18} /> Taxpayer Authentication
            </div>
            <div style={{ color: '#14532d', fontSize: '12.5px' }}>
              One Time Password (OTP) has been sent to the registered mobile number (••••••8910) and email address (••••••@gmail.com).
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Enter 6-digit OTP <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="e.g. 582910"
              style={{ width: '100%', padding: '10px 14px', fontSize: '15px', letterSpacing: '4px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setFilingModalOpen(false)}
              style={{ backgroundColor: '#ffffff', color: '#16325c', border: '1px solid #cbd5e1', padding: '8px 20px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleConfirmFiling}
              disabled={submitting}
              style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '8px 26px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
            >
              {submitting ? 'VERIFYING & FILING...' : 'CONFIRM & FILE'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
