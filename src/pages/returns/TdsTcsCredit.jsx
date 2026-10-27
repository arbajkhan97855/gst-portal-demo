import React, { useState } from 'react';
import {
  RotateCw,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Eye,
  ShieldCheck,
  Building,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function TdsTcsCredit() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };

  // Views: 'search' (first_page_view__1e6897aa.png) | 'dashboard' (peview_online_ke_bad_1_view_2c594cff.png)
  const [view, setView] = useState('dashboard'); // Start on dashboard or search based on state
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [returnPeriod, setReturnPeriod] = useState('April');

  // Taxpayer details
  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';
  const [filingStatus, setFilingStatus] = useState('Not Filed');
  const [arn, setArn] = useState(null);

  // Active Card Modal for viewing/editing records
  const [activeModalCard, setActiveModalCard] = useState(null); // 'tds' | 'tds_amend' | 'tcs' | 'tcs_amend' | null

  // Filing state
  const [filingModalOpen, setFilingModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [evcCode, setEvcCode] = useState('');
  const [signatory, setSignatory] = useState(legalName);
  const [ledgerComputed, setLedgerComputed] = useState(false);
  const [showFilingSteps, setShowFilingSteps] = useState(false);

  // Sample Records for TDS
  const [tdsRecords, setTdsRecords] = useState([
    {
      id: 'TDS-01',
      deductorGstin: '08AAAGD0123L1Z4',
      deductorName: 'PUBLIC WORKS DEPARTMENT, JAIPUR',
      contractVal: 450000,
      taxableVal: 450000,
      cgst: 4500,
      sgst: 4500,
      igst: 0,
      action: 'Pending', // 'Accepted' | 'Rejected' | 'Pending'
      month: 'April'
    },
    {
      id: 'TDS-02',
      deductorGstin: '07AAACG5521K1Z2',
      deductorName: 'NATIONAL HIGHWAYS AUTHORITY OF INDIA',
      contractVal: 320000,
      taxableVal: 320000,
      cgst: 0,
      sgst: 0,
      igst: 6400,
      action: 'Pending',
      month: 'April'
    }
  ]);

  // Sample Records for Amendments to TDS
  const [tdsAmendRecords, setTdsAmendRecords] = useState([]);

  // Sample Records for TCS
  const [tcsRecords, setTcsRecords] = useState([
    {
      id: 'TCS-01',
      ecoGstin: '07AAACE1234F1Z8',
      ecoName: 'AMAZON SELLER SERVICES PVT LTD',
      grossVal: 280000,
      suppliesReturned: 15000,
      taxableVal: 265000,
      cgst: 1325,
      sgst: 1325,
      igst: 0,
      action: 'Pending',
      month: 'April'
    },
    {
      id: 'TCS-02',
      ecoGstin: '29AAACF9999M1Z1',
      ecoName: 'FLIPKART INTERNET PRIVATE LIMITED',
      grossVal: 195000,
      suppliesReturned: 8000,
      taxableVal: 187000,
      cgst: 935,
      sgst: 935,
      igst: 0,
      action: 'Pending',
      month: 'April'
    }
  ]);

  // Sample Records for Amendments to TCS
  const [tcsAmendRecords, setTcsAmendRecords] = useState([]);

  // Calculations for TDS Card
  const calcCardStats = (records) => {
    const totalRecords = records.length;
    const acceptedList = records.filter(r => r.action === 'Accepted');
    const rejectedList = records.filter(r => r.action === 'Rejected');

    const totalAcceptedCount = acceptedList.length;
    const totalAcceptedTaxable = acceptedList.reduce((acc, r) => acc + (r.taxableVal || 0), 0);
    const totalAcceptedTax = acceptedList.reduce((acc, r) => acc + ((r.cgst || 0) + (r.sgst || 0) + (r.igst || 0)), 0);

    const totalRejectedCount = rejectedList.length;
    const totalRejectedTaxable = rejectedList.reduce((acc, r) => acc + (r.taxableVal || 0), 0);
    const totalRejectedTax = rejectedList.reduce((acc, r) => acc + ((r.cgst || 0) + (r.sgst || 0) + (r.igst || 0)), 0);

    return {
      totalRecords,
      totalAcceptedCount,
      totalAcceptedTaxable,
      totalAcceptedTax,
      totalRejectedCount,
      totalRejectedTaxable,
      totalRejectedTax
    };
  };

  const tdsStats = calcCardStats(tdsRecords);
  const tdsAmendStats = calcCardStats(tdsAmendRecords);
  const tcsStats = calcCardStats(tcsRecords);
  const tcsAmendStats = calcCardStats(tcsAmendRecords);

  const monthsList = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const fyOptions = ['2026-27', '2025-26', '2024-25', '2023-24'];

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const updateAction = (cardType, recordId, newAction) => {
    if (cardType === 'tds') {
      setTdsRecords(prev => prev.map(r => r.id === recordId ? { ...r, action: newAction } : r));
    } else if (cardType === 'tcs') {
      setTcsRecords(prev => prev.map(r => r.id === recordId ? { ...r, action: newAction } : r));
    }
    toast.info('Status Updated', `Record marked as ${newAction}`);
  };

  const handleBulkAction = (cardType, newAction) => {
    if (cardType === 'tds') {
      setTdsRecords(prev => prev.map(r => ({ ...r, action: newAction })));
    } else if (cardType === 'tcs') {
      setTcsRecords(prev => prev.map(r => ({ ...r, action: newAction })));
    }
    toast.success('Action Applied', `All records marked as ${newAction}`);
  };

  const handleComputeLedger = () => {
    setLedgerComputed(true);
    const totalCredited = tdsStats.totalAcceptedTax + tcsStats.totalAcceptedTax;
    toast.success('Cash Ledger Computed', `${formatCurrency(totalCredited)} is ready to be credited to Electronic Cash Ledger upon filing.`);
  };

  const handleFileReturn = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const generatedArn = `TD${gstin.slice(0, 2)}04${Math.floor(1000000 + Math.random() * 9000000)}`;
      setArn(generatedArn);
      setFilingStatus('Filed');
      setSubmitting(false);
      setFilingModalOpen(false);
      toast.success('TDS/TCS Return Filed', `Form successfully filed. ARN: ${generatedArn}`);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '50px' }}>

      {/* ============================================================== */}
      {/* SCREEN 1: FIRST PAGE VIEW (first_page_view__1e6897aa.png)      */}
      {/* URL: return.gst.gov.in/returns2/auth/comptds                   */}
      {/* ============================================================== */}
      {view === 'search' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'TDS and TCS credit received' }
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
              padding: '24px 32px 36px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                TDS and TCS credit received
              </h1>
              <div style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>• </span>
                Indicates Mandatory Fields
              </div>
            </div>

            {/* Form row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                toast.success('Period Selected', `Loaded TDS & TCS details for ${returnPeriod} ${financialYear}`);
              }}
              style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', flexWrap: 'wrap' }}
            >
              {/* Financial Year */}
              <div style={{ width: '280px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                  Financial Year<span style={{ color: '#dc2626' }}>•</span>
                </label>
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13.5px',
                    border: '1px solid #3b82f6',
                    borderRadius: '2px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b'
                  }}
                >
                  {fyOptions.map((fy) => (
                    <option key={fy} value={fy}>{fy}</option>
                  ))}
                </select>
              </div>

              {/* Return Filing Period */}
              <div style={{ width: '320px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                  Return Filing Period<span style={{ color: '#dc2626' }}>•</span>
                </label>
                <select
                  value={returnPeriod}
                  onChange={(e) => setReturnPeriod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13.5px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b'
                  }}
                >
                  {monthsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Search button */}
              <button
                type="submit"
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px 36px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: AUTO DRAFTED TDS/TCS DETAILS DASHBOARD               */}
      {/* Screenshots: peview_online_ke_bad_1_view_2c594cff.png          */}
      {/*             peview_online_ke_bad_2_view_8b59e41e.png          */}
      {/* URL: return.gst.gov.in/returns2/auth/gstr2x                    */}
      {/* ============================================================== */}
      {view === 'dashboard' && (
        <div>
          {/* Top Switch button to Search page */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'TDS and TCS credit received', onClick: () => setView('search') }
              ]}
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setView('search')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#16325c',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              >
                Change Period ({returnPeriod} {financialYear})
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <span style={{ fontSize: '14px' }}>🌐</span>
                <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <option>English</option>
                </select>
              </div>
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
              fontSize: '15px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>AUTO DRAFTED TDS/TCS DETAILS</span>
            <button
              type="button"
              onClick={() => toast.info('Refreshed', 'TDS & TCS records re-synced with portal.')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
              title="Refresh Auto-drafted Details"
            >
              <RotateCw size={18} />
            </button>
          </div>

          {/* Taxpayer Details Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              padding: '14px 20px',
              fontSize: '13px',
              color: '#1e293b',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '8px', columnGap: '20px' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div>FY - <strong>{financialYear}</strong></div>
              <div>Return Period - <strong>{returnPeriod}</strong></div>
              <div>
                Status - <strong style={{ color: filingStatus === 'Filed' ? '#16a34a' : '#1e293b' }}>{filingStatus}</strong>
                {arn && <span style={{ marginLeft: '10px', color: '#0e8a7d' }}>(ARN: {arn})</span>}
              </div>
            </div>
          </div>

          {/* Blue Steps Box (Steps to prepare your TDS and TCS credit received form online) */}
          <div
            style={{
              border: '1px solid #3b82f6',
              borderRadius: '2px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              marginBottom: '28px'
            }}
          >
            {/* Blue Title Banner */}
            <div
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '10px 16px',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Steps to prepare your TDS and TCS credit received form online
            </div>

            {/* Instruction content */}
            <div style={{ padding: '16px 24px', fontSize: '13px', color: '#1e293b', lineHeight: 1.6 }}>
              <ol style={{ margin: 0, paddingLeft: '18px' }}>
                <li style={{ marginBottom: '6px' }}>
                  Click on 'TDS Credit received' or 'Amendments to TDS credit received' or 'TCS credit received' or 'Amendments to TCS credit received' box whichever is applicable and take action (Accept/Reject);
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Accepted TDS amount will be added to Cash ledger and rejected entries will be auto populated to counter party's return after successful filing of return.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Total number of records visible on the relevant box will include count of accepted records, rejected records and records pending for action.
                </li>
                <li style={{ marginBottom: '6px' }}>
                  Click on <strong>'Preview Draft TDS and TCS credit received'</strong> button to view summary of auto drafted details in PDF format;
                </li>
                <li style={{ marginBottom: '6px' }}>
                  You can also download all auto drafted details as an excel file by clicking on <strong>'Download TDS and TCS Credit received details (Excel)'</strong>; and
                </li>
                <li style={{ marginBottom: '6px' }}>
                  After taking action on all auto populated details, follow filing process as indicated at the bottom of this page.
                </li>
              </ol>

              {/* User Manual link */}
              <div style={{ textAlign: 'right', marginTop: '4px' }}>
                <a
                  href="#user-manual"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('User Manual', 'TDS & TCS Credit Received Advisory v3.2 downloaded.');
                  }}
                  style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600, fontSize: '12.5px' }}
                >
                  User Manual
                </a>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: TDS Credit received                                 */}
          {/* ============================================================== */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
              TDS Credit received
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

              {/* CARD 1: TDS Credit received */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                {/* Navy Header Banner */}
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '14.5px'
                  }}
                >
                  <span>TDS Credit received</span>
                  <span style={{ fontSize: '13.5px' }}>Number of Records : {tdsStats.totalRecords}</span>
                </div>

                {/* White Body with 2 rows x 3 columns */}
                <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr', rowGap: '16px', columnGap: '12px', fontSize: '13px' }}>
                    {/* Row 1: Accepted */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tdsStats.totalAcceptedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tdsStats.totalAcceptedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(tdsStats.totalAcceptedTax)}</div>
                    </div>

                    {/* Row 2: Rejected */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tdsStats.totalRejectedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tdsStats.totalRejectedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>{formatCurrency(tdsStats.totalRejectedTax)}</div>
                    </div>
                  </div>

                  {/* Action button inside card */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalCard('tds')}
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '6px 20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      VIEW RECORDS ({tdsRecords.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 2: Amendments to TDS Credit Received */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                {/* Navy Header Banner */}
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '14.5px'
                  }}
                >
                  <span>Amendments to TDS Credit Received</span>
                  <span style={{ fontSize: '13.5px' }}>Number of Records : {tdsAmendStats.totalRecords}</span>
                </div>

                {/* White Body with 2 rows x 3 columns */}
                <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr', rowGap: '16px', columnGap: '12px', fontSize: '13px' }}>
                    {/* Row 1: Accepted */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tdsAmendStats.totalAcceptedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tdsAmendStats.totalAcceptedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(tdsAmendStats.totalAcceptedTax)}</div>
                    </div>

                    {/* Row 2: Rejected */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tdsAmendStats.totalRejectedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tdsAmendStats.totalRejectedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>{formatCurrency(tdsAmendStats.totalRejectedTax)}</div>
                    </div>
                  </div>

                  {/* Action button inside card */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalCard('tds_amend')}
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '6px 20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      VIEW RECORDS ({tdsAmendRecords.length})
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: TCS Credit received                                 */}
          {/* ============================================================== */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
              TCS Credit received
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>

              {/* CARD 3: TCS Credit received */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                {/* Navy Header Banner */}
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '14.5px'
                  }}
                >
                  <span>TCS Credit received</span>
                  <span style={{ fontSize: '13.5px' }}>Total Number of Records : {tcsStats.totalRecords}</span>
                </div>

                {/* White Body with 2 rows x 3 columns */}
                <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr', rowGap: '16px', columnGap: '12px', fontSize: '13px' }}>
                    {/* Row 1: Accepted */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tcsStats.totalAcceptedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tcsStats.totalAcceptedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(tcsStats.totalAcceptedTax)}</div>
                    </div>

                    {/* Row 2: Rejected */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tcsStats.totalRejectedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tcsStats.totalRejectedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>{formatCurrency(tcsStats.totalRejectedTax)}</div>
                    </div>
                  </div>

                  {/* Action button inside card */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalCard('tcs')}
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '6px 20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      VIEW RECORDS ({tcsRecords.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 4: Amendments to TCS credit received */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}
              >
                {/* Navy Header Banner */}
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '12px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '14.5px'
                  }}
                >
                  <span>Amendments to TCS credit received</span>
                  <span style={{ fontSize: '13.5px' }}>Total Number of Records : {tcsAmendStats.totalRecords}</span>
                </div>

                {/* White Body with 2 rows x 3 columns */}
                <div style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.3fr', rowGap: '16px', columnGap: '12px', fontSize: '13px' }}>
                    {/* Row 1: Accepted */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tcsAmendStats.totalAcceptedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tcsAmendStats.totalAcceptedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Accepted Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#16a34a' }}>{formatCurrency(tcsAmendStats.totalAcceptedTax)}</div>
                    </div>

                    {/* Row 2: Rejected */}
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Count</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{tcsAmendStats.totalRejectedCount}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Taxable Value</div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{formatCurrency(tcsAmendStats.totalRejectedTaxable)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#475569', fontSize: '12px', marginBottom: '3px' }}>Total Rejected Tax Amount</div>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>{formatCurrency(tcsAmendStats.totalRejectedTax)}</div>
                    </div>
                  </div>

                  {/* Action button inside card */}
                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalCard('tcs_amend')}
                      style={{
                        backgroundColor: '#16325c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        padding: '6px 20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      VIEW RECORDS ({tcsAmendRecords.length})
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM BANNER: Steps to file your TDS and TCS Credit form      */}
          {/* ============================================================== */}
          <div
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
            onClick={() => setShowFilingSteps(!showFilingSteps)}
          >
            <span>Steps to file your TDS and TCS Credit received form</span>
            <span>{showFilingSteps ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
          </div>

          {showFilingSteps && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '16px 20px',
                fontSize: '13px',
                color: '#334155',
                marginBottom: '20px',
                borderRadius: '2px'
              }}
            >
              <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                <li>Review all auto-populated TDS and TCS records in both sections.</li>
                <li>Mark each entry as <strong>Accepted</strong> or <strong>Rejected</strong>.</li>
                <li>Click on <strong>COMPUTE CASH LEDGER</strong> to update your electronic cash ledger with accepted tax amounts.</li>
                <li>Preview the draft PDF summary using <strong>PREVIEW DRAFT</strong> button.</li>
                <li>Click <strong>PROCEED TO FILE</strong> to file with DSC or EVC verification.</li>
              </ol>
            </div>
          )}

          {/* ============================================================== */}
          {/* BOTTOM ACTION BUTTONS ROW                                      */}
          {/* ============================================================== */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #e2e8f0'
            }}
          >
            <button
              type="button"
              onClick={() => setView('search')}
              style={{
                backgroundColor: '#ffffff',
                color: '#16325c',
                border: '1px solid #16325c',
                borderRadius: '2px',
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              BACK
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => toast.info('Preview Draft', 'Downloaded Draft TDS & TCS Credit received summary (PDF).')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                PREVIEW DRAFT TDS/TCS (PDF)
              </button>

              <button
                type="button"
                onClick={() => toast.info('Download Excel', 'Downloaded TDS and TCS Credit received details (.xlsx).')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                DOWNLOAD DETAILS (EXCEL)
              </button>

              <button
                type="button"
                onClick={handleComputeLedger}
                style={{
                  backgroundColor: ledgerComputed ? '#15803d' : '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '8px 20px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {ledgerComputed ? '✓ LEDGER COMPUTED' : 'COMPUTE CASH LEDGER'}
              </button>

              <button
                type="button"
                onClick={() => setFilingModalOpen(true)}
                disabled={filingStatus === 'Filed'}
                style={{
                  backgroundColor: filingStatus === 'Filed' ? '#94a3b8' : '#0e8a7d',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '8px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: filingStatus === 'Filed' ? 'not-allowed' : 'pointer'
                }}
              >
                {filingStatus === 'Filed' ? 'RETURN ALREADY FILED' : 'PROCEED TO FILE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: RECORDS DETAIL (TDS / TCS / Amendments)               */}
      {/* ============================================================== */}
      <Modal
        isOpen={Boolean(activeModalCard)}
        onClose={() => setActiveModalCard(null)}
        title={
          activeModalCard === 'tds' ? 'TDS Credit Received Records' :
          activeModalCard === 'tds_amend' ? 'Amendments to TDS Credit Received' :
          activeModalCard === 'tcs' ? 'TCS Credit Received Records' :
          'Amendments to TCS Credit Received'
        }
        size="xl"
      >
        <div style={{ padding: '8px 4px' }}>
          {/* Header controls inside modal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Period: <strong>{returnPeriod} {financialYear}</strong> | GSTIN: <strong>{gstin}</strong>
            </div>
            {(activeModalCard === 'tds' || activeModalCard === 'tcs') && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleBulkAction(activeModalCard, 'Accepted')}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkAction(activeModalCard, 'Rejected')}
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reject All
                </button>
              </div>
            )}
          </div>

          {/* TDS Table */}
          {activeModalCard === 'tds' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#16325c', color: '#ffffff' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Deductor GSTIN</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Deductor Name</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Taxable Value</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>CGST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>SGST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>IGST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #cbd5e1' }}>Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #cbd5e1' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tdsRecords.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#16325c' }}>{r.deductorGstin}</td>
                      <td style={{ padding: '8px 10px' }}>{r.deductorName}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(r.taxableVal)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.cgst)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.sgst)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.igst)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: r.action === 'Accepted' ? '#dcfce7' : r.action === 'Rejected' ? '#fee2e2' : '#fef3c7',
                            color: r.action === 'Accepted' ? '#15803d' : r.action === 'Rejected' ? '#b91c1c' : '#b45309'
                          }}
                        >
                          {r.action}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => updateAction('tds', r.id, 'Accepted')}
                            style={{
                              backgroundColor: r.action === 'Accepted' ? '#15803d' : '#f1f5f9',
                              color: r.action === 'Accepted' ? '#ffffff' : '#15803d',
                              border: '1px solid #15803d',
                              borderRadius: '2px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAction('tds', r.id, 'Rejected')}
                            style={{
                              backgroundColor: r.action === 'Rejected' ? '#b91c1c' : '#f1f5f9',
                              color: r.action === 'Rejected' ? '#ffffff' : '#b91c1c',
                              border: '1px solid #b91c1c',
                              borderRadius: '2px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TCS Table */}
          {activeModalCard === 'tcs' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#16325c', color: '#ffffff' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Operator GSTIN</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Operator Name</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Gross Value</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Returns</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Net Taxable</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>CGST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', border: '1px solid #cbd5e1' }}>SGST</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #cbd5e1' }}>Status</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', border: '1px solid #cbd5e1' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tcsRecords.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#16325c' }}>{r.ecoGstin}</td>
                      <td style={{ padding: '8px 10px' }}>{r.ecoName}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.grossVal)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', color: '#dc2626' }}>{formatCurrency(r.suppliesReturned)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(r.taxableVal)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.cgst)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>{formatCurrency(r.sgst)}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: r.action === 'Accepted' ? '#dcfce7' : r.action === 'Rejected' ? '#fee2e2' : '#fef3c7',
                            color: r.action === 'Accepted' ? '#15803d' : r.action === 'Rejected' ? '#b91c1c' : '#b45309'
                          }}
                        >
                          {r.action}
                        </span>
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => updateAction('tcs', r.id, 'Accepted')}
                            style={{
                              backgroundColor: r.action === 'Accepted' ? '#15803d' : '#f1f5f9',
                              color: r.action === 'Accepted' ? '#ffffff' : '#15803d',
                              border: '1px solid #15803d',
                              borderRadius: '2px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => updateAction('tcs', r.id, 'Rejected')}
                            style={{
                              backgroundColor: r.action === 'Rejected' ? '#b91c1c' : '#f1f5f9',
                              color: r.action === 'Rejected' ? '#ffffff' : '#b91c1c',
                              border: '1px solid #b91c1c',
                              borderRadius: '2px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state for Amendments */}
          {(activeModalCard === 'tds_amend' || activeModalCard === 'tcs_amend') && (
            <div style={{ padding: '32px 16px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '4px' }}>
              <div style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '8px' }}>
                No amended records reported by deductors/collectors for this return period.
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Any corrections by counter-parties in GSTR-7 / GSTR-8 will appear here automatically.
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setActiveModalCard(null)}
              style={{
                backgroundColor: '#16325c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              SAVE & BACK
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: PROCEED TO FILE RETURN                                */}
      {/* ============================================================== */}
      <Modal
        isOpen={filingModalOpen}
        onClose={() => setFilingModalOpen(false)}
        title="File TDS & TCS Credit Received"
        size="md"
      >
        <form onSubmit={handleFileReturn} style={{ padding: '4px' }}>
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', padding: '12px', marginBottom: '16px', fontSize: '12.5px', color: '#1e3a8a' }}>
            <div>Period: <strong>{returnPeriod} {financialYear}</strong></div>
            <div>Accepted TDS Tax: <strong>{formatCurrency(tdsStats.totalAcceptedTax)}</strong></div>
            <div>Accepted TCS Tax: <strong>{formatCurrency(tcsStats.totalAcceptedTax)}</strong></div>
            <div style={{ marginTop: '6px', fontWeight: 700, color: '#16a34a' }}>
              Total Credit to Electronic Cash Ledger: {formatCurrency(tdsStats.totalAcceptedTax + tcsStats.totalAcceptedTax)}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" required defaultChecked style={{ marginTop: '2px' }} />
              <span>
                I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Authorised Signatory
            </label>
            <input
              type="text"
              value={signatory}
              onChange={(e) => setSignatory(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Enter OTP / EVC (Sent to registered mobile/email)
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP (e.g. 123456)"
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
              onClick={() => setFilingModalOpen(false)}
              style={{
                backgroundColor: '#ffffff',
                color: '#16325c',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                padding: '8px 18px',
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
                padding: '8px 24px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'FILING...' : 'FILE WITH EVC'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
