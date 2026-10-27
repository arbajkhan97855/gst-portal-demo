import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/Modal';

export default function ReturnCompliance() {
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

  // Screen management:
  // 'menu' -> Return Compliance 2-card menu (return_complience_1_1b8fd183.png)
  // 'drc01b' -> Liability Mismatch (DRC-01B) screen (page_-2, reference, status, period screenshots)
  // 'drc01c' -> ITC Mismatch (DRC-01C) screen
  const getInitialScreen = () => {
    if (location.pathname.includes('/drc01b')) return 'drc01b';
    if (location.pathname.includes('/drc01c')) return 'drc01c';
    return 'menu';
  };

  const [screen, setScreen] = useState(getInitialScreen);

  useEffect(() => {
    setScreen(getInitialScreen());
  }, [location.pathname]);

  // Search mode state: 'ref' | 'period' | 'status'
  const [searchMode, setSearchMode] = useState('status'); // default in status screenshot
  const [refNumber, setRefNumber] = useState('');
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [returnPeriod, setReturnPeriod] = useState('October');
  const [selectedStatus, setSelectedStatus] = useState('Select Status');
  const [hasSearched, setHasSearched] = useState(false);
  const [foundRecords, setFoundRecords] = useState([]);

  // DRC-01C search state
  const [itcSearchMode, setItcSearchMode] = useState('period');
  const [itcRefNumber, setItcRefNumber] = useState('');
  const [itcFy, setItcFy] = useState('2026-27');
  const [itcPeriod, setItcPeriod] = useState('October');
  const [itcStatus, setItcStatus] = useState('Select Status');
  const [itcHasSearched, setItcHasSearched] = useState(false);
  const [itcFoundRecords, setItcFoundRecords] = useState([]);

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeMismatchRecord, setActiveMismatchRecord] = useState(null);
  const [replyReason, setReplyReason] = useState('Disaster/Flood/Tech issue');
  const [drc03Arn, setDrc03Arn] = useState('');

  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const fyOptions = ['2026-27', '2025-26', '2024-25', '2023-24'];

  const statusOptions = [
    'Select Status',
    'Pending for action',
    'Part B filed - Pending with Tax Officer',
    'Completed',
    'Order Issued'
  ];

  // Handle Search for DRC-01B
  const handleSearchDrc01b = (e) => {
    e?.preventDefault();
    setHasSearched(true);

    if (searchMode === 'ref' && refNumber.trim()) {
      if (refNumber.toUpperCase().includes('DRC') || refNumber.includes('100')) {
        setFoundRecords([
          {
            refNo: refNumber.toUpperCase(),
            fy: '2025-26',
            period: 'December',
            gstr1Tax: '₹2,50,000',
            gstr3bTax: '₹2,00,000',
            diffTax: '₹50,000',
            status: 'Pending for action',
            date: '15/01/2026'
          }
        ]);
        toast.success('Record Found', `Intimation found for Reference: ${refNumber}`);
      } else {
        setFoundRecords([]);
        toast.info('Search Completed', 'No records found for the entered reference number.');
      }
    } else {
      // In normal cases for compliant taxpayers (like Ravi Saini)
      setFoundRecords([]);
    }
  };

  // Handle Search for DRC-01C
  const handleSearchDrc01c = (e) => {
    e?.preventDefault();
    setItcHasSearched(true);
    setItcFoundRecords([]);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* ============================================================== */}
      {/* SCREEN 1: RETURN COMPLIANCE 2-CARDS MENU                       */}
      {/* Screenshot: return_complience_1_1b8fd183.png                   */}
      {/* URL: return.gst.gov.in/returns/auth/returnComp                 */}
      {/* ============================================================== */}
      {screen === 'menu' && (
        <div>
          {/* Top Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'Return Compliance' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
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
              fontSize: '15px'
            }}
          >
            Return Compliance
          </div>

          {/* Main White Area with 2 Cards */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '32px 28px',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '40px' }}>

              {/* CARD 1: Liability Mismatch (DRC-01B) */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '28px 20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '15.5px'
                  }}
                >
                  Liability Mismatch (DRC-01B)
                </div>
                <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('drc01b');
                      setSearchMode('status');
                      setHasSearched(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: '#16325c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '8px 42px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '0.5px'
                    }}
                  >
                    VIEW
                  </button>
                </div>
              </div>

              {/* CARD 2: ITC Mismatch (DRC-01C) */}
              <div
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <div
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    padding: '28px 20px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '15.5px'
                  }}
                >
                  ITC Mismatch (DRC-01C)
                </div>
                <div style={{ padding: '36px 20px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('drc01c');
                      setItcSearchMode('period');
                      setItcHasSearched(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      backgroundColor: '#16325c',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '8px 42px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      letterSpacing: '0.5px'
                    }}
                  >
                    VIEW
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Right Back Button matching screenshot */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/returns')}
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
      {/* SCREEN 2: LIABILITY MISMATCH (DRC-01B) SCREEN                  */}
      {/* Screenshots: page_-2_ba3092f2.png,                            */}
      {/* return_complience_reference_3eccb48a.png,                      */}
      {/* return_status_ke_according_4e8bc25d.png,                       */}
      {/* return_period_ke_acccordig_dde34695.png                        */}
      {/* URL: return.gst.gov.in/returns/auth/drc01b                     */}
      {/* ============================================================== */}
      {screen === 'drc01b' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'Return Compliance', onClick: () => setScreen('menu') },
                { label: 'Liability Mismatch (DRC-01B)' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
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
              fontSize: '15px'
            }}
          >
            Liability Mismatch (DRC-01B)
          </div>

          {/* Main White Area */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px 28px',
              marginBottom: '24px'
            }}
          >
            {/* 3 Radio Options matching screenshots */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01bSearch"
                  value="ref"
                  checked={searchMode === 'ref'}
                  onChange={() => {
                    setSearchMode('ref');
                    setHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Reference number
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01bSearch"
                  value="period"
                  checked={searchMode === 'period'}
                  onChange={() => {
                    setSearchMode('period');
                    setHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Return period
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01bSearch"
                  value="status"
                  checked={searchMode === 'status'}
                  onChange={() => {
                    setSearchMode('status');
                    setHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Status
              </label>
            </div>

            {/* Inputs based on selected radio button */}

            {/* MODE 1: Reference Number (return_complience_reference_3eccb48a.png) */}
            {searchMode === 'ref' && (
              <form onSubmit={handleSearchDrc01b} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '320px' }}>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="Enter Reference number"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      color: '#1e293b'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* MODE 2: Return period (return_period_ke_acccordig_dde34695.png) */}
            {searchMode === 'period' && (
              <form onSubmit={handleSearchDrc01b} style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ width: '300px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Financial Year
                  </label>
                  <select
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #3b82f6',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {fyOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div style={{ width: '300px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Return period
                  </label>
                  <select
                    value={returnPeriod}
                    onChange={(e) => setReturnPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* MODE 3: Status (return_status_ke_according_4e8bc25d.png) */}
            {searchMode === 'status' && (
              <form onSubmit={handleSearchDrc01b} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '300px' }}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* Result Area */}
            {hasSearched && (
              <div>
                {foundRecords.length === 0 ? (
                  /* Pink Box matching page_-2_ba3092f2.png & return_period_ke_acccordig_dde34695.png */
                  <div
                    style={{
                      backgroundColor: '#ffe4e6',
                      border: '1px solid #fecdd3',
                      borderRadius: '2px',
                      padding: '14px 20px',
                      color: '#991b1b',
                      fontSize: '13.5px',
                      marginBottom: '28px'
                    }}
                  >
                    {searchMode === 'period'
                      ? 'No records found for the provided inputs.'
                      : 'No records found.'}
                  </div>
                ) : (
                  /* Table if records exist */
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '2px', overflowX: 'auto', marginBottom: '28px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#16325c', color: '#ffffff' }}>
                          <th style={{ padding: '10px 12px', textAlign: 'left' }}>Reference No</th>
                          <th style={{ padding: '10px 12px', textAlign: 'left' }}>Tax Period</th>
                          <th style={{ padding: '10px 12px', textAlign: 'right' }}>Liability (GSTR-1)</th>
                          <th style={{ padding: '10px 12px', textAlign: 'right' }}>Liability (GSTR-3B)</th>
                          <th style={{ padding: '10px 12px', textAlign: 'right' }}>Differential</th>
                          <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                          <th style={{ padding: '10px 12px', textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {foundRecords.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{r.refNo}</td>
                            <td style={{ padding: '10px 12px' }}>{r.period} ({r.fy})</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{r.gstr1Tax}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>{r.gstr3bTax}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626', fontWeight: 700 }}>{r.diffTax}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span style={{ padding: '3px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e' }}>
                                {r.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMismatchRecord(r);
                                  setReplyModalOpen(true);
                                }}
                                style={{ backgroundColor: '#16325c', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Reply (Part B)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Right Back Button matching screenshots */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('menu')}
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
      {/* SCREEN 3: ITC MISMATCH (DRC-01C) SCREEN                        */}
      {/* URL: return.gst.gov.in/returns/auth/drc01c                     */}
      {/* ============================================================== */}
      {screen === 'drc01c' && (
        <div>
          {/* Breadcrumb & Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Breadcrumb
              items={[
                { label: 'Dashboard', to: '/dashboard' },
                { label: 'Returns', to: '/returns' },
                { label: 'Return Compliance', onClick: () => setScreen('menu') },
                { label: 'ITC Mismatch (DRC-01C)' }
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <span style={{ fontSize: '14px' }}>🌐</span>
              <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                <option>English</option>
              </select>
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
              fontSize: '15px'
            }}
          >
            ITC Mismatch (DRC-01C)
          </div>

          {/* Main White Area */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderTop: 'none',
              borderRadius: '0 0 2px 2px',
              padding: '24px 28px',
              marginBottom: '24px'
            }}
          >
            {/* 3 Radio Options */}
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01cSearch"
                  value="ref"
                  checked={itcSearchMode === 'ref'}
                  onChange={() => {
                    setItcSearchMode('ref');
                    setItcHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Reference number
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01cSearch"
                  value="period"
                  checked={itcSearchMode === 'period'}
                  onChange={() => {
                    setItcSearchMode('period');
                    setItcHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Return period
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
                <input
                  type="radio"
                  name="drc01cSearch"
                  value="status"
                  checked={itcSearchMode === 'status'}
                  onChange={() => {
                    setItcSearchMode('status');
                    setItcHasSearched(false);
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
                />
                Status
              </label>
            </div>

            {/* MODE 1: Reference Number */}
            {itcSearchMode === 'ref' && (
              <form onSubmit={handleSearchDrc01c} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '320px' }}>
                  <input
                    type="text"
                    value={itcRefNumber}
                    onChange={(e) => setItcRefNumber(e.target.value)}
                    placeholder="Enter Reference number"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      color: '#1e293b'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* MODE 2: Return period */}
            {itcSearchMode === 'period' && (
              <form onSubmit={handleSearchDrc01c} style={{ display: 'flex', gap: '24px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ width: '300px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Financial Year
                  </label>
                  <select
                    value={itcFy}
                    onChange={(e) => setItcFy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #3b82f6',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {fyOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div style={{ width: '300px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Return period
                  </label>
                  <select
                    value={itcPeriod}
                    onChange={(e) => setItcPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* MODE 3: Status */}
            {itcSearchMode === 'status' && (
              <form onSubmit={handleSearchDrc01c} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '300px' }}>
                  <select
                    value={itcStatus}
                    onChange={(e) => setItcStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#16325c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    padding: '8px 28px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.4px'
                  }}
                >
                  SEARCH
                </button>
              </form>
            )}

            {/* Result Area */}
            {itcHasSearched && (
              <div
                style={{
                  backgroundColor: '#ffe4e6',
                  border: '1px solid #fecdd3',
                  borderRadius: '2px',
                  padding: '14px 20px',
                  color: '#991b1b',
                  fontSize: '13.5px',
                  marginBottom: '28px'
                }}
              >
                {itcSearchMode === 'period'
                  ? 'No records found for the provided inputs.'
                  : 'No records found.'}
              </div>
            )}

            {/* Bottom Right Back Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setScreen('menu')}
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
      {/* MODAL: REPLY TO DRC-01B (PART B)                               */}
      {/* ============================================================== */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title="Form GST DRC-01B (Part B) - Reply by Taxpayer"
        maxWidth="750px"
      >
        {activeMismatchRecord && (
          <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px', padding: '12px 16px', marginBottom: '16px' }}>
              <div><strong>Reference No:</strong> {activeMismatchRecord.refNo}</div>
              <div><strong>Period:</strong> {activeMismatchRecord.period} ({activeMismatchRecord.fy})</div>
              <div><strong>Differential Tax:</strong> {activeMismatchRecord.diffTax}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Option 1: Paid through Form DRC-03 ARN (if already paid)
              </label>
              <input
                type="text"
                value={drc03Arn}
                onChange={(e) => setDrc03Arn(e.target.value)}
                placeholder="Enter Form GST DRC-03 ARN"
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Option 2: Reason for difference in liability
              </label>
              <select
                value={replyReason}
                onChange={(e) => setReplyReason(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '3px' }}
              >
                <option value="Excess liability declared in GSTR-1 by mistake in error">Excess liability declared in GSTR-1 by mistake in error</option>
                <option value="Some transactions were cancelled/credit notes not adjusted in GSTR-1">Some transactions were cancelled/credit notes not adjusted in GSTR-1</option>
                <option value="Liability already discharged in preceding GSTR-3B return">Liability already discharged in preceding GSTR-3B return</option>
                <option value="Disaster/Flood/Tech issue">Disaster/Force majeure event</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setReplyModalOpen(false)}
                style={{ backgroundColor: '#ffffff', color: '#16325c', border: '1px solid #cbd5e1', padding: '7px 20px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer' }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyModalOpen(false);
                  toast.success('Reply Submitted', 'DRC-01B (Part B) reply filed with EVC.');
                }}
                style={{ backgroundColor: '#16325c', color: '#ffffff', border: 'none', padding: '7px 24px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer' }}
              >
                SUBMIT REPLY (PART B)
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
