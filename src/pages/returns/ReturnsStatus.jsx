import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export default function ReturnsStatus() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };

  // Top Section: Financial Year
  const [financialYear, setFinancialYear] = useState('2026-2027');

  // Radio Filter Type: 'arn' | 'period' | 'status' (matches screenshots 1, 2, 3)
  const [filterType, setFilterType] = useState('status');

  // Input states
  const [inputArn, setInputArn] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Filed-Valid');

  // Search Results State
  // Initially show results if navigated or default, matching TRACK_RETURN_-_3___SEARCH_KE_BAD_df60fcfd.png
  const [hasSearched, setHasSearched] = useState(true);
  const [searchMethodLabel, setSearchMethodLabel] = useState('Search based on Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fyOptions = ['2026-2027', '2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  const statusDropdownOptions = [
    'Select',
    'Validated But Not Filed',
    'Filed-Valid',
    'Filed-Invalid'
  ];

  // Realistic sample return records matching screenshot TRACK_RETURN_-_3___SEARCH_KE_BAD_df60fcfd.png
  const allRecords = [
    {
      arn: 'AA080926822476P',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'September',
      filingDate: '15/10/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0809268221723',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'September',
      filingDate: '15/10/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AB080826017594U',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'August',
      filingDate: '15/10/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AB0808260175910',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'August',
      filingDate: '15/10/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0807268284121',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'July',
      filingDate: '20/08/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    // Page 2 records
    {
      arn: 'AA0807268284098',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'July',
      filingDate: '11/08/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0806260124891',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'June',
      filingDate: '20/07/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0806260124560',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'June',
      filingDate: '11/07/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0805260098124',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'May',
      filingDate: '20/06/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0805260098012',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'May',
      filingDate: '11/06/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    // Page 3 records
    {
      arn: 'AA0804260074129',
      returnType: 'GSTR3B',
      financialYear: '2026-2027',
      taxPeriod: 'April',
      filingDate: '20/05/2026',
      status: 'Filed',
      mode: 'ONLINE'
    },
    {
      arn: 'AA0804260074001',
      returnType: 'GSTR-1/IFF',
      financialYear: '2026-2027',
      taxPeriod: 'April',
      filingDate: '11/05/2026',
      status: 'Filed',
      mode: 'ONLINE'
    }
  ];

  const [filteredResults, setFilteredResults] = useState(allRecords);

  // Search by Financial Year
  const handleSearchFy = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setSearchMethodLabel('Search based on Financial Year');
    setCurrentPage(1);

    const matches = allRecords.filter(r => r.financialYear === financialYear);
    setFilteredResults(matches);
    toast.success('Search Completed', `Loaded ${matches.length} return records for FY ${financialYear}`);
  };

  // Search by Radio Filter (ARN / Return Filing Period / Status)
  const handleSearchRadio = (e) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(1);

    if (filterType === 'arn') {
      setSearchMethodLabel('Search based on ARN');
      if (!inputArn.trim()) {
        toast.warning('Input Required', 'Please enter an Application Reference Number (ARN).');
        return;
      }
      const cleanArn = inputArn.trim().toUpperCase();
      const matches = allRecords.filter(r => r.arn.toUpperCase().includes(cleanArn));
      setFilteredResults(matches);
      if (matches.length > 0) {
        toast.success('Record Found', `Found return filed under ARN ${cleanArn}`);
      } else {
        toast.info('No Record', `No record found for ARN ${cleanArn}`);
      }
    } else if (filterType === 'period') {
      setSearchMethodLabel('Search based on Return Filing Period');
      setFilteredResults(allRecords);
      toast.success('Period Search', 'Filtered returns for the selected filing date range.');
    } else if (filterType === 'status') {
      setSearchMethodLabel('Search based on Status');
      if (selectedStatus === 'Select') {
        toast.warning('Selection Required', 'Please select a status from the dropdown.');
        return;
      }
      if (selectedStatus === 'Filed-Valid' || selectedStatus === 'Filed') {
        setFilteredResults(allRecords);
        toast.success('Status Search', `Showing all ${allRecords.length} records with status Filed-Valid.`);
      } else {
        setFilteredResults([]);
        toast.info('No Records', `No records found with status ${selectedStatus}.`);
      }
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* Breadcrumb & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Main Filter Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '2px',
          padding: '24px 28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          marginBottom: '24px'
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Track Return Status
          </h1>
          <div style={{ fontSize: '12.5px', color: '#1e293b', fontWeight: 500 }}>
            <span style={{ color: '#dc2626', fontWeight: 700 }}>• </span>
            Indicates Mandatory Fields
          </div>
        </div>

        {/* Financial Year row */}
        <form onSubmit={handleSearchFy} style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
            Financial Year<span style={{ color: '#dc2626' }}>•</span>
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '260px' }}>
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
                  color: '#1e293b',
                  outline: 'none'
                }}
              >
                {fyOptions.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
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
                padding: '8px 32px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.4px'
              }}
            >
              SEARCH
            </button>
          </div>
        </form>

        {/* 3 Radio Options */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '18px' }}>
          {/* Radio 1: ARN */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
            <input
              type="radio"
              name="trackFilter"
              value="arn"
              checked={filterType === 'arn'}
              onChange={() => setFilterType('arn')}
              style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
            />
            <span>ARN<span style={{ color: '#dc2626' }}>•</span></span>
          </label>

          {/* Radio 2: Return Filing Period */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
            <input
              type="radio"
              name="trackFilter"
              value="period"
              checked={filterType === 'period'}
              onChange={() => setFilterType('period')}
              style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
            />
            <span>Return Filing Period<span style={{ color: '#dc2626' }}>•</span></span>
          </label>

          {/* Radio 3: Status */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 500, color: '#1e293b' }}>
            <input
              type="radio"
              name="trackFilter"
              value="status"
              checked={filterType === 'status'}
              onChange={() => setFilterType('status')}
              style={{ width: '16px', height: '16px', accentColor: '#16a34a', cursor: 'pointer' }}
            />
            <span>Status<span style={{ color: '#dc2626' }}>•</span></span>
          </label>
        </div>

        {/* Dynamic Inputs according to selected radio button */}
        <form onSubmit={handleSearchRadio}>

          {/* CASE 1: ARN selected (TRACK_RETURN_-_1_146311cf.png) */}
          {filterType === 'arn' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '340px' }}>
                <input
                  type="text"
                  placeholder="Enter ARN"
                  value={inputArn}
                  onChange={(e) => setInputArn(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    color: '#1e293b',
                    outline: 'none'
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
                  padding: '8px 32px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.4px'
                }}
              >
                SEARCH
              </button>
            </div>
          )}

          {/* CASE 2: Return Filing Period selected (TRACK_RETURN_-_2_8e33ae92.png) */}
          {filterType === 'period' && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* From Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                  From<span style={{ color: '#dc2626' }}>•</span>
                </span>
                <div style={{ position: 'relative', width: '200px' }}>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 36px 8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      pointerEvents: 'none',
                      fontSize: '14px'
                    }}
                  >
                    📅
                  </span>
                </div>
              </div>

              {/* To Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                  To<span style={{ color: '#dc2626' }}>•</span>
                </span>
                <div style={{ position: 'relative', width: '200px' }}>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 36px 8px 12px',
                      fontSize: '13px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '2px',
                      color: '#1e293b',
                      outline: 'none'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#64748b',
                      pointerEvents: 'none',
                      fontSize: '14px'
                    }}
                  >
                    📅
                  </span>
                </div>
              </div>

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
                SEARCH
              </button>
            </div>
          )}

          {/* CASE 3: Status selected (TRACK_RETURN_-_3_fb9b9d12.png) */}
          {filterType === 'status' && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '340px' }}>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    backgroundColor: '#ffffff',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                >
                  {statusDropdownOptions.map((st) => (
                    <option key={st} value={st}>{st}</option>
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
                  padding: '8px 32px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.4px'
                }}
              >
                SEARCH
              </button>
            </div>
          )}

        </form>
      </div>

      {/* ============================================================== */}
      {/* RESULTS TABLE SECTION ("SEARCH KE BAD" VIEW)                   */}
      {/* Screenshot: TRACK_RETURN_-_3___SEARCH_KE_BAD_df60fcfd.png       */}
      {/* ============================================================== */}
      {hasSearched && (
        <div style={{ marginTop: '16px' }}>

          {/* Subheading matching screenshot: Search based on Status */}
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            {searchMethodLabel}
          </h2>

          {filteredResults.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '32px 20px',
                textAlign: 'center',
                color: '#64748b'
              }}
            >
              No return records found matching the specified parameters.
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1', color: '#1e293b' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>ARN</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Return Type</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Financial Year</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Tax Period</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        Date of filing <span style={{ fontSize: '11px' }}>▴</span>
                      </span>
                    </th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                        Status <span style={{ fontSize: '11px' }}>▴</span>
                      </span>
                    </th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700 }}>Mode of filing</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row, idx) => (
                    <tr
                      key={row.arn || idx}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.arn}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.returnType}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.financialYear}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.taxPeriod}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.filingDate}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#1e293b' }}>
                        {row.status}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', color: '#1e293b' }}>
                        {row.mode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination matching screenshot TRACK_RETURN_-_3___SEARCH_KE_BAD_df60fcfd.png */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 20px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'inline-flex', border: '1px solid #cbd5e1', borderRadius: '3px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '5px 12px',
                      border: 'none',
                      borderRight: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '13px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    «
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCurrentPage(num)}
                      style={{
                        padding: '5px 12px',
                        border: 'none',
                        borderRight: num < totalPages ? '1px solid #cbd5e1' : 'none',
                        backgroundColor: currentPage === num ? '#2563eb' : '#ffffff',
                        color: currentPage === num ? '#ffffff' : '#334155',
                        fontSize: '13px',
                        fontWeight: currentPage === num ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '5px 12px',
                      border: 'none',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '13px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    »
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
