import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Info,
  HelpCircle,
  ShieldCheck,
  FileText,
  Upload,
  Eye,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { useNavigate } from 'react-router-dom';

export default function GSTR9Annual() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { fileReturnRecord, cloudReturns } = usePortalData();
  const navigate = useNavigate();

  // Screen management:
  // 'search' (Initial / Post-Search Annual Returns view)
  // 'questionnaire' (Prepare Online questionnaire)
  // 'nil-filing' (Nil Annual Return filing verification)
  // 'gstr9-dashboard' (Full GSTR-9 Tables view)
  // 'gstr9c-dashboard' (Reconciliation statement GSTR-9C view)
  const [screen, setScreen] = useState('search');

  // Search form state
  const [financialYear, setFinancialYear] = useState('2025-26');
  const [hasSearched, setHasSearched] = useState(false);

  // Questionnaire state
  const [isNilSelected, setIsNilSelected] = useState(null); // 'yes' | 'no' | null

  // Filing states
  const [filingStatus, setFilingStatus] = useState('Not filed');
  const [arnNumber, setArnNumber] = useState(null);
  const [filingModalOpen, setFilingModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineFormType, setOfflineFormType] = useState('GSTR-9');

  // Taxpayer identity
  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  const fyList = ['2025-26', '2026-27', '2024-25', '2023-24', '2022-23', '2021-22'];

  // Handle Search on first page
  const handleSearch = (e) => {
    e?.preventDefault();
    setHasSearched(true);
    toast.info('Search Completed', `Annual Return options loaded for FY ${financialYear}.`);
  };

  // Handle GSTR-9 Prepare Online click
  const handlePrepareOnline = () => {
    setScreen('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Questionnaire Next
  const handleQuestionnaireNext = () => {
    if (isNilSelected === 'yes') {
      setScreen('nil-filing');
    } else if (isNilSelected === 'no') {
      setScreen('gstr9-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Confirm Filing
  const handleConfirmFiling = async () => {
    setSubmitting(true);
    setTimeout(() => {
      const generatedArn = `AA${gstin.slice(0, 2)}12${Math.floor(10000000 + Math.random() * 90000000)}`;
      setArnNumber(generatedArn);
      setFilingStatus('Filed');
      setSubmitting(false);
      setFilingModalOpen(false);

      if (fileReturnRecord) {
        fileReturnRecord({
          returnType: isNilSelected === 'yes' ? 'GSTR-9 (NIL)' : 'GSTR-9',
          financialYear,
          period: 'Annual',
          arn: generatedArn,
          taxpayerName: legalName,
          gstin
        });
      }

      toast.success('Return Filed Successfully', `Form GSTR-9 filed with ARN: ${generatedArn}`);
    }, 1200);
  };

  // Handle Offline modal open
  const handleOpenOffline = (formType) => {
    setOfflineFormType(formType);
    setOfflineModalOpen(true);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* ============================================================== */}
      {/* SCREEN 1: FILE ANNUAL RETURNS (SEARCH & SEARCH RESULTS)        */}
      {/* Screenshots: first_page_view_2c20576e.png,                     */}
      {/* search_ke_bad_ka_view_-1_47742800.png,                         */}
      {/* search_ke_bad_ka_view_-2_48edecd5.png,                         */}
      {/* search_ke_bad_ka_view_-3_80350c5a.png                          */}
      {/* ============================================================== */}
      {screen === 'search' && (
        <div>
          {/* Top Navigation & Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Annual Return' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Page Card */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                File Annual Returns
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
              </div>
            </div>

            {/* Filter Form */}
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <div style={{ width: '280px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Financial Year <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b'
                  }}
                >
                  {fyList.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#173059',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.5px'
                  }}
                >
                  SEARCH
                </button>
              </div>
            </form>
          </div>

          {/* ============================================================== */}
          {/* SEARCH KE BAAD KA VIEW (ONLY SHOWN AFTER SEARCH CLICK)         */}
          {/* ============================================================== */}
          {hasSearched && (
            <div>
              {/* 1. HELP BOX (matching search_ke_bad_ka_view_-1_47742800.png) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #7dd3fc',
                  borderRadius: '4px',
                  padding: '20px 24px',
                  marginBottom: '20px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#1e293b'
                }}
              >
                <h3 style={{ textAlign: 'center', fontWeight: 700, fontSize: '15px', color: '#0f172a', margin: '0 0 16px 0' }}>
                  Help
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <strong>1. NIL GSTR-9 RETURN can be filed, if you have:</strong>
                    <ul style={{ margin: '4px 0 4px 20px', padding: 0 }}>
                      <li>Not made any outward supply (commonly known as sale); AND</li>
                      <li>Not received any inward supplies (commonly known as purchase) of goods/services; AND</li>
                      <li>No liability of any kind; AND</li>
                      <li>Not claimed any Credit during the Financial Year; AND</li>
                      <li>Not received any order creating demand; AND</li>
                      <li>Not claimed any refund.</li>
                    </ul>
                    <div style={{ paddingLeft: '20px' }}>during the Financial Year</div>
                  </div>
                  <div>
                    <strong>2. </strong>GSTR-9 can be filed online. It can also be prepared on Offline tool and then uploaded on the Portal and filed.
                  </div>
                  <div>
                    <strong>3. </strong>Annual return in Form GSTR-9 is required to be filed by every taxpayer registered as normal taxpayer during the relevant financial year unless exempted by Government through notification.
                  </div>
                  <div>
                    <strong>4. </strong>All applicable statements of Forms GSTR-1/IFF and returns in Form GSTR-3B of the financial year should have been filed before filing GSTR-9.
                  </div>
                  <div>
                    <strong>5. </strong>In case, you are required to file GSTR-9C (Reconciliation statement and Certification), the same shall be enabled on the dashboard post filing of GSTR-9.
                  </div>
                </div>
              </div>

              {/* 2. PINK WARNING BOX (matching search_ke_bad_ka_view_-2_48edecd5.png) */}
              <div
                style={{
                  backgroundColor: '#ffe4e6',
                  border: '1px solid #fecdd3',
                  borderRadius: '4px',
                  padding: '14px 20px',
                  marginBottom: '24px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#991b1b'
                }}
              >
                <div>1. Annual return in Form GSTR-9 once filed cannot be revised.</div>
                <div>
                  2. Computation of ITC has been made based on GSTR-1/IFF/GSTR-5 filed by your corresponding suppliers upto 30/11/2025. GSTR-1/IFF/GSTR-5 filed after the updation date will be covered in the next updation.
                </div>
              </div>

              {/* 3. TWO CARDS GRID: GSTR-9 & GSTR-9C (matching search_ke_bad_ka_view_-2_48edecd5.png) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                
                {/* CARD 1: Annual Return GSTR-9 */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ backgroundColor: '#173059', color: '#ffffff', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Annual Return</div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>GSTR-9</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '36px 16px', textAlign: 'center' }}>
                    {filingStatus === 'Filed' && (
                      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>
                        <CheckCircle2 size={16} /> Status: Filed ({arnNumber})
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={handlePrepareOnline}
                        style={{
                          backgroundColor: '#173059',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '8px 20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          letterSpacing: '0.5px'
                        }}
                      >
                        PREPARE-ONLINE
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenOffline('GSTR-9')}
                        style={{
                          backgroundColor: '#173059',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '8px 20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          letterSpacing: '0.5px'
                        }}
                      >
                        PREPARE OFFLINE
                      </button>
                    </div>
                  </div>
                </div>

                {/* CARD 2: Reconciliation Statement GSTR-9C */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ backgroundColor: '#173059', color: '#ffffff', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>Reconciliation Statement</div>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>GSTR-9C</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '24px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
                      Due Date - <span style={{ color: '#0284c7' }}>31/12/2026</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setScreen('gstr9c-dashboard');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          backgroundColor: '#173059',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '8px 20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          letterSpacing: '0.5px'
                        }}
                      >
                        INITIATE-FILING
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenOffline('GSTR-9C')}
                        style={{
                          backgroundColor: '#173059',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '8px 20px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          letterSpacing: '0.5px'
                        }}
                      >
                        PREPARE OFFLINE
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* 4. IMPORTANT MESSAGE BOX (matching search_ke_bad_ka_view_-3_80350c5a.png) */}
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#1d4ed8', color: '#ffffff', padding: '10px 16px', textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                  Important Message
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', fontSize: '13px', lineHeight: '1.7', color: '#1e293b' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '13.5px' }}>Prepare Online:-</strong>
                    <div style={{ fontWeight: 600, marginTop: '4px' }}>Steps to be taken:</div>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      <li>Click on <strong>Prepare Online</strong>;</li>
                      <li>Select from the questionnaire page, whether you wish to file NIL Annual return;</li>
                      <li>You may download the draft of system generated GSTR-9, annual summary of GSTR-1/GSTR-1A/IFF and annual summary of GSTR-3B from GSTR-9 dashboard for reference.</li>
                      <li>If number of records/lines are less than or equal to 500 records per table in Table 17 and Table 18, then you may use the online facility;</li>
                      <li>Fill in the details in different tables and click on <strong>Compute Liabilities</strong>; and</li>
                      <li>Click on <strong>Proceed to file</strong> and <strong>File GSTR-9</strong> with DSC/EVC.</li>
                      <li>Additional liability, if any, declared in this return can be paid through Form GST DRC-03 by selecting as <strong>Annual Return</strong> from the cause of payment dropdown in the said form.</li>
                    </ul>
                  </div>

                  <div>
                    <strong style={{ fontSize: '13.5px' }}>Prepare Offline:-</strong>
                    <div style={{ fontWeight: 600, marginTop: '4px' }}>
                      If number of records/lines either in Table-17 or Table-18 are more than 500 records per table, then you should prepare your return by using the offline utility only and the same can be subsequently uploaded on Common Portal.
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      You can download the GSTR-9 offline tool from the <strong>Downloads</strong> section in the pre-login page on the portal and install it on your computer.
                    </div>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      <li>Click on <strong>Prepare Offline</strong>;</li>
                      <li>Click on <strong>Download</strong> to download auto-drafted GSTR-9 details, if any;</li>
                      <li>Import downloaded json into offline tool;</li>
                      <li>Follow instructions in <strong>GSTR-9 offline tool</strong> to add details and generate JSON file for upload; and</li>
                      <li>Click on <strong>Upload</strong> to upload JSON file and file the return with the help of instruction available on GSTR-9 dashboard.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 2: GSTR-9 PREPARE ONLINE QUESTIONNAIRE PAGE             */}
      {/* Screenshot: gstr-9_ka_prepare_online_0dd8ff42.png              */}
      {/* ============================================================== */}
      {screen === 'questionnaire' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Annual Return', onClick: () => setScreen('search') },
                { label: 'GSTR9' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          {/* Teal Header */}
          <div
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '15px' }}>
              GSTR-9 Annual return for Normal taxpayers
            </span>
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              onClick={() => toast.info('Refreshed', 'Questionnaire refreshed.')}
              title="Refresh"
            >
              <RotateCw size={15} />
            </button>
          </div>

          {/* Taxpayer Details Header Banner */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              padding: '16px 20px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#1e293b'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px 24px' }}>
              <div>GSTIN - <strong>{gstin}</strong></div>
              <div>Legal Name - <strong>{legalName}</strong></div>
              <div>Trade Name - <strong>{tradeName}</strong></div>
              <div>Status - <strong>{filingStatus}</strong></div>
              <div>FY - <strong>{financialYear}</strong></div>
            </div>
          </div>

          {/* Questionnaire Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b', marginBottom: '16px' }}>
              Please answer the below question to view the relevant parts of the return:-
            </div>

            {/* Table */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '3px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                    <th style={{ width: '40px', padding: '10px', borderRight: '1px solid #cbd5e1' }}></th>
                    <th style={{ padding: '10px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #cbd5e1' }}>
                      Description
                    </th>
                    <th style={{ width: '180px', padding: '10px', textAlign: 'center', fontWeight: 700 }}>
                      Option
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '14px', borderRight: '1px solid #cbd5e1', fontWeight: 600 }}>
                      1
                    </td>
                    <td style={{ padding: '14px 18px', borderRight: '1px solid #cbd5e1', lineHeight: '1.6' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        Do you want to file a Nil return?<span style={{ color: '#ef4444' }}>*</span>
                      </div>
                      <div style={{ color: '#0284c7', fontStyle: 'italic', fontWeight: 600, marginBottom: '4px' }}>
                        Note: Nil return can be filed for the Financial year, if you have: -
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#0284c7', fontSize: '12.5px' }}>
                        <li>NOT made any outward supply (commonly known as sale); AND</li>
                        <li>NOT received any goods/services (commonly known as purchase); AND</li>
                        <li>NO other liability to report; AND</li>
                        <li>NOT claimed any credit; AND</li>
                        <li>NOT claimed any refund; AND</li>
                        <li>NOT received any order creating demand</li>
                      </ul>
                    </td>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500 }}>
                          <input
                            type="radio"
                            name="nilOption"
                            value="yes"
                            checked={isNilSelected === 'yes'}
                            onChange={() => setIsNilSelected('yes')}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500 }}>
                          <input
                            type="radio"
                            name="nilOption"
                            value="no"
                            checked={isNilSelected === 'no'}
                            onChange={() => setIsNilSelected('no')}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          No
                        </label>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setScreen('search')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#173059',
                  border: '1px solid #173059',
                  borderRadius: '3px',
                  padding: '8px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BACK TO FILE RETURNS
              </button>
              <button
                type="button"
                onClick={handleQuestionnaireNext}
                disabled={!isNilSelected}
                style={{
                  backgroundColor: isNilSelected ? '#173059' : '#94a3b8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '8px 28px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isNilSelected ? 'pointer' : 'not-allowed'
                }}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 3: NIL ANNUAL RETURN FILING VERIFICATION                */}
      {/* ============================================================== */}
      {screen === 'nil-filing' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Annual Return', onClick: () => setScreen('search') },
                { label: 'GSTR9', onClick: () => setScreen('questionnaire') },
                { label: 'Nil Filing' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', fontWeight: 700, fontSize: '15px' }}>
            Form GSTR-9: NIL Annual Return Filing
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '24px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '14px 18px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', lineHeight: 1.6 }}>
              <strong>Notice:</strong> You have selected to file a <strong>NIL GSTR-9 Annual Return</strong> for Financial Year <strong>{financialYear}</strong>. All liability, supplies, and ITC values will be treated as zero.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '4px', marginBottom: '24px', fontSize: '13px' }}>
              <div>GSTIN: <strong>{gstin}</strong></div>
              <div>Legal Name: <strong>{legalName}</strong></div>
              <div>Trade Name: <strong>{tradeName}</strong></div>
              <div>Financial Year: <strong>{financialYear}</strong></div>
              <div>Total Tax Liability: <strong>₹ 0.00</strong></div>
              <div>Total ITC Availed: <strong>₹ 0.00</strong></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px', fontSize: '13px', color: '#334155' }}>
              <input type="checkbox" id="nilDeclaration" defaultChecked style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }} />
              <label htmlFor="nilDeclaration" style={{ cursor: 'pointer' }}>
                I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and that I fulfill all the criteria for filing a NIL Form GSTR-9.
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setScreen('questionnaire')}
                style={{ backgroundColor: '#ffffff', color: '#173059', border: '1px solid #173059', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => setFilingModalOpen(true)}
                style={{ backgroundColor: '#15803d', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                PROCEED TO FILE (NIL GSTR-9)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 4: FULL GSTR-9 TABLES DASHBOARD (IF NO TO NIL)          */}
      {/* ============================================================== */}
      {screen === 'gstr9-dashboard' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Annual Return', onClick: () => setScreen('search') },
                { label: 'GSTR9' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#0e8a7d', color: '#ffffff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Form GSTR-9: Annual Return Tables (FY {financialYear})</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => toast.success('Downloaded', 'GSTR-9 System Computed PDF exported.')}
                style={{ background: '#173059', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Download size={12} /> DOWNLOAD GSTR-9 PDF
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '20px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
              <div>GSTIN: <strong>{gstin}</strong></div>
              <div>Legal Name: <strong>{legalName}</strong></div>
              <div>Trade Name: <strong>{tradeName}</strong></div>
              <div>Status: <strong>{filingStatus}</strong></div>
            </div>

            {/* Tables Grid */}
            <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#1e293b', fontWeight: 700 }}>
              Form GSTR-9 Tables & Auto-Drafted Summaries
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { tableNo: '4', title: 'Details of advances, inward and outward supplies on which tax is payable', turnover: '₹ 58,24,000.00', tax: '₹ 10,48,320.00' },
                { tableNo: '5', title: 'Details of Outward supplies on which tax is NOT payable', turnover: '₹ 0.00', tax: '₹ 0.00' },
                { tableNo: '6', title: 'Details of ITC availed during the financial year', turnover: 'Table 6A to 6O', tax: '₹ 7,33,824.00' },
                { tableNo: '7', title: 'Details of ITC Reversed and Ineligible ITC for the FY', turnover: 'Rule 37, 39, 42, 43', tax: '₹ 0.00' },
                { tableNo: '8', title: 'Other ITC related information (GSTR-2A vs GSTR-3B matching)', turnover: 'ITC Comparison', tax: 'Matched' },
                { tableNo: '9', title: 'Details of Tax paid as declared in returns filed during the FY', turnover: 'Cash + Credit', tax: '₹ 10,48,320.00' },
                { tableNo: '10-14', title: 'Particulars of the transactions for previous FY declared in next FY', turnover: 'Supplies / ITC', tax: 'Reconciled' },
                { tableNo: '15', title: 'Particulars of Demands and Refunds', turnover: 'Refunds / Demands', tax: '₹ 0.00' },
                { tableNo: '16', title: 'Supplies received from composition taxpayers & deemed supply', turnover: 'Deemed supplies', tax: '₹ 0.00' },
                { tableNo: '17', title: 'HSN Wise Summary of Outward Supplies', turnover: 'HSN Summary', tax: 'Reported' },
                { tableNo: '18', title: 'HSN Wise Summary of Inward Supplies', turnover: 'Inward HSN', tax: 'Reported' },
                { tableNo: '19', title: 'Late fee payable and paid', turnover: 'CGST + SGST', tax: '₹ 0.00' }
              ].map((t) => (
                <div key={t.tableNo} style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '14px', backgroundColor: '#fcfcfc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#173059', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '3px' }}>
                      Table {t.tableNo}
                    </span>
                    <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>{t.tax}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 600, minHeight: '36px' }}>
                    {t.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                    <span>{t.turnover}</span>
                    <button
                      type="button"
                      onClick={() => toast.info(`Table ${t.tableNo}`, 'Auto-drafted records loaded for inspection.')}
                      style={{ background: 'transparent', border: '1px solid #0284c7', color: '#0284c7', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer', fontWeight: 600 }}
                    >
                      VIEW / EDIT
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setScreen('questionnaire')}
                style={{ backgroundColor: '#ffffff', color: '#173059', border: '1px solid #173059', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={() => toast.success('Compute Completed', 'Liabilities calculated based on Table 4 and Table 9.')}
                style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                COMPUTE LIABILITIES
              </button>
              <button
                type="button"
                onClick={() => setFilingModalOpen(true)}
                style={{ backgroundColor: '#15803d', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                PROCEED TO FILE GSTR-9
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SCREEN 5: GSTR-9C RECONCILIATION STATEMENT                     */}
      {/* ============================================================== */}
      {screen === 'gstr9c-dashboard' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Annual Return', onClick: () => setScreen('search') },
                { label: 'GSTR-9C' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155' }}>
                <option>English</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: '#173059', color: '#ffffff', padding: '12px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Form GSTR-9C: Reconciliation Statement (FY {financialYear})</span>
            <button
              type="button"
              onClick={() => toast.success('Downloaded', 'GSTR-9C Reconciliation PDF exported.')}
              style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              DOWNLOAD DRAFT GSTR-9C
            </button>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderTop: 'none', padding: '24px', borderRadius: '0 0 4px 4px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px' }}>
              Reconciliation of turnover declared in audited Annual Financial Statement with turnover declared in Annual Return (GSTR-9).
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Turnover as per Audited Accounts</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#173059' }}>₹ 5,82,40,000.00</div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Turnover declared in Form GSTR-9</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#0284c7' }}>₹ 5,82,40,000.00</div>
              </div>
              <div style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Unreconciled Difference</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#16a34a' }}>₹ 0.00 (Reconciled)</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setScreen('search')}
                style={{ backgroundColor: '#ffffff', color: '#173059', border: '1px solid #173059', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                BACK TO FILE RETURNS
              </button>
              <button
                type="button"
                onClick={() => toast.success('Self-Certified', 'GSTR-9C Self-Certification validation passed.')}
                style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
              >
                VERIFY & CERTIFY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: OTP / DSC VERIFY & FILE MODAL                         */}
      {/* ============================================================== */}
      <Modal
        isOpen={filingModalOpen}
        onClose={() => setFilingModalOpen(false)}
        title="File Form GSTR-9 Annual Return with EVC / DSC"
        size="md"
      >
        <div style={{ fontSize: '13px', color: '#1e293b' }}>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
            <ShieldCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
            I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Authorized Signatory: <strong>{legalName}</strong>
            </div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Enter One Time Password (OTP) sent to registered mobile/email:
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP (e.g. 123456)"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px', letterSpacing: '2px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setFilingModalOpen(false)}
              style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '3px', fontWeight: 600, cursor: 'pointer' }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleConfirmFiling}
              disabled={submitting}
              style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '3px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'VERIFYING...' : 'VERIFY & FILE'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* MODAL 2: PREPARE OFFLINE MODAL                                 */}
      {/* ============================================================== */}
      <Modal
        isOpen={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
        title={`Prepare Offline - Form ${offlineFormType}`}
        size="md"
      >
        <div style={{ fontSize: '13px', color: '#1e293b' }}>
          <p style={{ margin: '0 0 12px 0', lineHeight: 1.6 }}>
            Use the offline utility when table records exceed 500 lines or when compiling data from accounting software:
          </p>

          <ol style={{ paddingLeft: '20px', margin: '0 0 20px 0', lineHeight: 1.7 }}>
            <li>Download the offline tool from <strong>Downloads &gt; Offline Tools</strong>.</li>
            <li>Click <strong>Download JSON</strong> below to export auto-drafted GSTR-9 details.</li>
            <li>Open the offline tool and import the downloaded JSON.</li>
            <li>Fill and validate your data, then generate the JSON file.</li>
            <li>Upload the final JSON back onto the portal to file.</li>
          </ol>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                toast.success('Download Initiated', `Auto-drafted ${offlineFormType} JSON exported.`);
                setOfflineModalOpen(false);
              }}
              style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
            >
              DOWNLOAD JSON
            </button>
            <button
              type="button"
              onClick={() => {
                toast.info('Upload Ready', 'Select your offline generated JSON file to upload.');
                setOfflineModalOpen(false);
              }}
              style={{ backgroundColor: '#173059', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '3px', fontWeight: 700, cursor: 'pointer' }}
            >
              UPLOAD JSON
            </button>
            <button
              type="button"
              onClick={() => setOfflineModalOpen(false)}
              style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '3px', fontWeight: 600, cursor: 'pointer' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
