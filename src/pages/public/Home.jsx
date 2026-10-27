import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  UserCheck,
  CreditCard,
  Receipt,
  RotateCcw,
  Search,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Download,
  Scale,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { FAQ_LIST } from '../../data/portalData';
import {
  downloadRegistrationCertificate,
  downloadReturnAcknowledgment,
  downloadChallanReceipt,
  downloadCsv
} from '../../utils/downloadHelpers';

export default function Home() {
  const { isAuthenticated, currentUser, login, credentials } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [quickGstin, setQuickGstin] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  // Home Quick Login Form state
  const [username, setUsername] = useState('@samyakcomputerclasses123');
  const [password, setPassword] = useState('samyak@123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (quickGstin.trim()) {
      navigate(`/verify-gstin?gstin=${encodeURIComponent(quickGstin.trim().toUpperCase())}`);
    } else {
      navigate('/verify-gstin?gstin=27AABCS1429B1Z8');
    }
  };

  const handleHomeLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim() || !password) {
      setLoginError('Please enter both username and password.');
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      const res = login(username, password, true);
      setLoginLoading(false);
      if (res.success) {
        toast.success('Authentication Successful', 'Welcome to Taxpayer Portal!');
        navigate('/dashboard');
      } else {
        setLoginError(res.error || 'Invalid credentials.');
        toast.error('Login Failed', 'Please verify your credentials.');
      }
    }, 400);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      {/* 1. Official News & Updates Ticker Bar */}
      <div style={{
        backgroundColor: '#081a36',
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '8px 0',
        fontSize: '13px'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '2px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            LATEST UPDATES
          </span>
          <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span>📢 <strong>Advisory:</strong> Auto-population of Form GSTR-1 and GSTR-3B from validated e-Invoices is enabled. | Form GSTR-1 for February due date: 11th March. | Download offline utility v3.4.1.</span>
          </div>
          <Link to="/notices" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600, fontSize: '12px' }}>
            View All Advisories →
          </Link>
        </div>
      </div>

      {/* 2. Official Full-Width GST Honeycomb Banner (Matching Image 2 100%) */}
      <section className="gst-banner-container" aria-label="Official GST Portal Banner">
        <img
          src="/gst-banner.jpg"
          alt="Goods and Services Tax Portal Official Honeycomb Banner"
          className="gst-banner-image"
        />

        {/* Advisory Marquee Bar (Exact Text and Styling from Image 2) */}
        <div className="gst-advisory-ticker-bar">
          <div className="gst-advisory-badge-label">
            <span role="img" aria-label="alert">🔔</span>
            <span>Advisory:</span>
          </div>
          <div className="gst-advisory-marquee-container">
            <div className="gst-advisory-marquee-content">
              Planned maintenance / services on the GST portal on : 2nd October'26 12:00 AM onwards. GST Portal services will not be available until 2nd October'26 02:00 AM. The inconvenience caused is regretted. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Auto-population of Form GSTR-1 and GSTR-3B from validated e-Invoices is enabled. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Form GSTR-1 for February due date: 11th March 2025. &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; Download Offline Utility v3.4.1 for B2B invoice generation.
            </div>
          </div>
        </div>
      </section>

      {/* Quick Utility Action Bar: Search GSTIN & Taxpayer Access */}
      <section style={{ backgroundColor: '#0b2246', color: '#ffffff', padding: '16px 0', borderBottom: '3px solid #133b70' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            {/* Quick GSTIN Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 360px', maxWidth: '540px' }}>
              <form onSubmit={handleQuickVerify} style={{ display: 'flex', width: '100%', background: '#ffffff', borderRadius: '3px', overflow: 'hidden', padding: '3px' }}>
                <input
                  type="text"
                  placeholder="Enter 15-digit GSTIN (e.g. 27AABCS1429B1Z8)..."
                  value={quickGstin}
                  onChange={(e) => setQuickGstin(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    padding: '8px 12px',
                    fontSize: '13px',
                    outline: 'none',
                    color: '#0f172a'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1f3e6e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '0 16px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Search size={14} /> SEARCH
                </button>
              </form>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/registration"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0b2246',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserCheck size={14} /> New Registration
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                style={{
                  backgroundColor: '#1f3e6e',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={14} /> {isAuthenticated ? 'Go to Dashboard' : 'Taxpayer Login'}
              </Link>
              <Link
                to="/services"
                style={{
                  backgroundColor: 'transparent',
                  color: '#93c5fd',
                  padding: '8px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                All Services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Statutory Services Grid (All Working) */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              TAXPAYER SERVICES
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0b2246', margin: '8px 0 6px' }}>
              Statutory GST Compliance Modules
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '650px', margin: '0 auto' }}>
              Complete statutory features designed for students and professionals to practice real-life taxpayer operations.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Card 1: Registration */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#dbeafe', color: '#1d4ed8', padding: '8px', borderRadius: '6px' }}>
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0b2246' }}>GST Registration</h3>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Form GST REG-01</span>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Apply for new taxpayer registration, complete partner/promoter details, business places, and receive immediate ARN tracking.
                </p>
              </div>
              <div className="card-footer" style={{ borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/registration" className="btn btn-outline-primary btn-sm">
                  Apply Now →
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadRegistrationCertificate(currentUser)}
                  title="Download Certificate"
                >
                  <Download size={14} /> Certificate
                </button>
              </div>
            </div>

            {/* Card 2: Return Filing */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px', borderRadius: '6px' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0b2246' }}>Returns Filing</h3>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>GSTR-1, GSTR-3B & 9</span>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  File outward sales return (GSTR-1), self-assessed monthly summary (GSTR-3B), and compute tax liabilities with ITC matching.
                </p>
              </div>
              <div className="card-footer" style={{ borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={isAuthenticated ? '/returns' : '/login'} className="btn btn-outline-primary btn-sm">
                  File Return →
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadReturnAcknowledgment({ returnType: 'GSTR-3B', arn: 'AA2701250119284', taxPeriod: 'Jan 2025' }, currentUser)}
                  title="Download Acknowledgment"
                >
                  <Download size={14} /> Sample ARN
                </button>
              </div>
            </div>

            {/* Card 3: Payments & Challans */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#fef3c7', color: '#b45309', padding: '8px', borderRadius: '6px' }}>
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0b2246' }}>Create Challan</h3>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Form GST PMT-06</span>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Generate statutory payment challans for CGST, SGST, IGST, and cess. Deposit money into Electronic Cash Ledger with CIN generation.
                </p>
              </div>
              <div className="card-footer" style={{ borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={isAuthenticated ? '/payments/challan' : '/track-payment'} className="btn btn-outline-primary btn-sm">
                  Create Challan →
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadChallanReceipt({ cpin: '25022700142984', cin: 'SBIN25022700142984', totalAmount: 936000 }, currentUser)}
                  title="Download Challan"
                >
                  <Download size={14} /> Sample CIN
                </button>
              </div>
            </div>

            {/* Card 4: Tax Invoices & E-Invoice */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header" style={{ backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: '#f3e8ff', color: '#7e22ce', padding: '8px', borderRadius: '6px' }}>
                    <Receipt size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0b2246' }}>Tax Invoices & e-Invoice</h3>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Rule 46 & IRN Generation</span>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Generate compliant B2B tax invoices with auto-calculated GST breakdown, print PDF copies, and generate sample e-invoices with QR code.
                </p>
              </div>
              <div className="card-footer" style={{ borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={isAuthenticated ? '/invoices' : '/login'} className="btn btn-outline-primary btn-sm">
                  Manage Invoices →
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    downloadCsv('Sample_GST_Invoice_Format.csv', ['Item', 'HSN', 'Qty', 'Rate', 'Taxable', 'GST %', 'Total'], [
                      ['ERP Software License', '998314', 1, 350000, 350000, 18, 413000]
                    ]);
                    toast.success('Downloaded', 'Sample invoice template downloaded.');
                  }}
                  title="Download Template"
                >
                  <Download size={14} /> Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GST System National Statistics */}
      <section style={{ backgroundColor: '#0b2246', color: '#ffffff', padding: '36px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#60a5fa' }}>1.41 Cr+</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Active Registered Taxpayers</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#34d399' }}>98.6%</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>GSTR-3B Monthly Filing Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fbbf24' }}>₹1.87 Lakh Cr</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Monthly National Collection</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f472b6' }}>100% Real-Time</div>
              <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>Live Cloud Data Sync Across All PCs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (Interactive Accordion) */}
      <section style={{ padding: '48px 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b2246', margin: '0 0 8px' }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Practical guidance on GST rules, returns filing procedures, and portal usage.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ_LIST.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    textAlign: 'left',
                    background: openFaq === idx ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0b2246'
                  }}
                >
                  <span>{faq.question}</span>
                  {openFaq === idx ? <ChevronUp size={18} color="#0b2246" /> : <ChevronDown size={18} color="#64748b" />}
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '14px 18px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9', fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
