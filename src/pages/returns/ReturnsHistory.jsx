import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  RotateCcw,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { downloadReturnAcknowledgment } from '../../utils/downloadHelpers';

export default function ReturnsHistory() {
  const { currentUser } = useAuth();
  const { returns } = usePortalData();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };

  // Form selections matching screenshot first_page_img_7abfd08f.png
  const [financialYear, setFinancialYear] = useState('Select');
  const [returnPeriod, setReturnPeriod] = useState('Select');
  const [returnType, setReturnType] = useState('Select');

  // Search state
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Available options
  const fyOptions = [
    'Select',
    '2026-27',
    '2025-26',
    '2024-25',
    '2023-24',
    '2022-23',
    '2021-22',
    '2020-21',
    '2019-20',
    '2018-19',
    '2017-18'
  ];

  const returnPeriodOptions = [
    'Select',
    'All',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'Quarter 1 (Apr-Jun)',
    'Quarter 2 (Jul-Sep)',
    'Quarter 3 (Oct-Dec)',
    'Quarter 4 (Jan-Mar)'
  ];

  const returnTypeOptions = [
    'Select',
    'All',
    'GSTR-1',
    'GSTR-3B',
    'GSTR-9',
    'GSTR-9C',
    'CMP-08',
    'GSTR-4',
    'GSTR-2A',
    'GSTR-2B',
    'ITC-01',
    'ITC-02',
    'ITC-02A',
    'ITC-03',
    'ITC-04',
    'TRAN-1',
    'TRAN-2'
  ];

  // Comprehensive sample dataset of filed returns for realistic viewing
  const defaultFiledReturns = [
    {
      id: 'RET-01',
      financialYear: '2025-26',
      taxPeriod: 'December',
      returnType: 'GSTR-3B',
      arn: 'AA0812250198421',
      filingDate: '20/01/2026',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1850000,
      cgst: 166500,
      sgst: 166500,
      igst: 85000,
      cess: 0,
      totalTax: 418000
    },
    {
      id: 'RET-02',
      financialYear: '2025-26',
      taxPeriod: 'December',
      returnType: 'GSTR-1',
      arn: 'AA0812250172349',
      filingDate: '11/01/2026',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1850000,
      cgst: 166500,
      sgst: 166500,
      igst: 85000,
      cess: 0,
      totalTax: 418000
    },
    {
      id: 'RET-03',
      financialYear: '2025-26',
      taxPeriod: 'November',
      returnType: 'GSTR-3B',
      arn: 'AA0811250239104',
      filingDate: '19/12/2025',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1420000,
      cgst: 127800,
      sgst: 127800,
      igst: 62000,
      cess: 0,
      totalTax: 317600
    },
    {
      id: 'RET-04',
      financialYear: '2025-26',
      taxPeriod: 'November',
      returnType: 'GSTR-1',
      arn: 'AA0811250211842',
      filingDate: '10/12/2025',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1420000,
      cgst: 127800,
      sgst: 127800,
      igst: 62000,
      cess: 0,
      totalTax: 317600
    },
    {
      id: 'RET-05',
      financialYear: '2025-26',
      taxPeriod: 'October',
      returnType: 'GSTR-3B',
      arn: 'AA0810250084321',
      filingDate: '20/11/2025',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1650000,
      cgst: 148500,
      sgst: 148500,
      igst: 74000,
      cess: 0,
      totalTax: 371000
    },
    {
      id: 'RET-06',
      financialYear: '2025-26',
      taxPeriod: 'October',
      returnType: 'GSTR-1',
      arn: 'AA0810250069412',
      filingDate: '11/11/2025',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 1650000,
      cgst: 148500,
      sgst: 148500,
      igst: 74000,
      cess: 0,
      totalTax: 371000
    },
    {
      id: 'RET-07',
      financialYear: '2024-25',
      taxPeriod: 'Annual',
      returnType: 'GSTR-9',
      arn: 'AA0812240998312',
      filingDate: '28/12/2025',
      status: 'Filed',
      mode: 'Online',
      taxableValue: 19800000,
      cgst: 1782000,
      sgst: 1782000,
      igst: 980000,
      cess: 0,
      totalTax: 4544000
    },
    {
      id: 'RET-08',
      financialYear: '2025-26',
      taxPeriod: 'September',
      returnType: 'ITC-04',
      arn: 'AA0809250041289',
      filingDate: '25/10/2025',
      status: 'Filed',
      mode: 'Offline',
      taxableValue: 420000,
      cgst: 37800,
      sgst: 37800,
      igst: 0,
      cess: 0,
      totalTax: 75600
    }
  ];

  // Combined dataset with portal returns
  const allFiledList = [
    ...defaultFiledReturns,
    ...(returns || []).map((r, idx) => ({
      id: `PORTAL-${idx}`,
      financialYear: r.taxPeriod?.includes('2024') ? '2024-25' : '2025-26',
      taxPeriod: r.taxPeriod || 'Recent',
      returnType: r.returnType || 'GSTR-3B',
      arn: r.arn || `AA08${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      filingDate: r.filingDate || '18/01/2026',
      status: r.status || 'Filed',
      mode: 'Online',
      taxableValue: 1200000,
      cgst: 108000,
      sgst: 108000,
      igst: 45000,
      cess: 0,
      totalTax: r.totalTax || 261000
    }))
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (financialYear === 'Select') {
      toast.warning('Selection Required', 'Please select a Financial Year.');
      return;
    }

    setHasSearched(true);

    const results = allFiledList.filter((item) => {
      // FY filter
      const matchFy = item.financialYear === financialYear;

      // Period filter: if 'Select' or 'All', include all periods for this FY
      const matchPeriod =
        returnPeriod === 'Select' ||
        returnPeriod === 'All' ||
        item.taxPeriod?.toLowerCase() === returnPeriod?.toLowerCase() ||
        (returnPeriod.includes('Quarter') && item.taxPeriod?.includes('Quarter'));

      // Return Type filter
      const matchType =
        returnType === 'Select' ||
        returnType === 'All' ||
        item.returnType?.toUpperCase() === returnType?.toUpperCase();

      return matchFy && matchPeriod && matchType;
    });

    setFilteredResults(results);

    if (results.length > 0) {
      toast.success('Records Found', `Found ${results.length} filed return record(s) for FY ${financialYear}.`);
    } else {
      toast.info('No Records', 'No filed return records found for the selected criteria.');
    }
  };

  const handleReset = () => {
    setFinancialYear('Select');
    setReturnPeriod('Select');
    setReturnType('Select');
    setHasSearched(false);
    setFilteredResults([]);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '50px' }}>

      {/* Top Breadcrumb & Language */}
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

      {/* Main Container */}
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
        {/* Title */}
        <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>
          View Filed Returns
        </h1>

        {/* Yellow / Cream Notice Box matching first_page_img_7abfd08f.png */}
        <div
          style={{
            backgroundColor: '#fef9c3',
            border: '1px solid #fef08a',
            borderRadius: '2px',
            padding: '12px 18px',
            color: '#1e293b',
            fontSize: '12.5px',
            lineHeight: 1.5,
            marginBottom: '18px'
          }}
        >
          To view the filed GST ITC-01/02A/03, TRAN-1/2 forms; please click on 'Search' post selection of 'Financial Year' and 'Return Type'. Please do not select 'Return Filing Period' in this case.
        </div>

        {/* Mandatory indicator on the right */}
        <div style={{ textAlign: 'right', fontSize: '12.5px', color: '#1e293b', fontWeight: 500, marginBottom: '16px' }}>
          <span style={{ color: '#dc2626', fontWeight: 700 }}>• </span>
          Indicates Mandatory Fields
        </div>

        {/* Form Controls Row */}
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>

            {/* Field 1: Financial year */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Financial year<span style={{ color: '#dc2626' }}>•</span>
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
                  color: '#1e293b',
                  outline: 'none'
                }}
              >
                {fyOptions.map((fy) => (
                  <option key={fy} value={fy}>{fy}</option>
                ))}
              </select>
            </div>

            {/* Field 2: Return Filing Period */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Return Filing Period<span style={{ color: '#dc2626' }}>•</span>
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
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none'
                }}
              >
                {returnPeriodOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Field 3: Return Type */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                Return Type<span style={{ color: '#dc2626' }}>•</span>
              </label>
              <select
                value={returnType}
                onChange={(e) => setReturnType(e.target.value)}
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
                {returnTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Search Button row aligned to right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
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
                RESET
              </button>
            )}
            <button
              type="submit"
              style={{
                backgroundColor: '#16325c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 36px',
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
      </div>

      {/* ============================================================== */}
      {/* RESULTS TABLE SECTION ("SEARCH KE BAD USI PAGE PAR NICHE TABLE") */}
      {/* ============================================================== */}
      {hasSearched && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              backgroundColor: '#16325c',
              color: '#ffffff',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ fontSize: '14.5px', fontWeight: 700 }}>
              Filed Returns Details (FY: {financialYear}
              {returnPeriod !== 'Select' && returnPeriod !== 'All' ? ` | Period: ${returnPeriod}` : ''}
              {returnType !== 'Select' && returnType !== 'All' ? ` | Type: ${returnType}` : ''})
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 500 }}>
              Total Records: <strong>{filteredResults.length}</strong>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            /* Empty state */
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ffe4e6',
                  border: '1px solid #fecdd3',
                  borderRadius: '2px',
                  padding: '14px 20px',
                  color: '#991b1b',
                  fontSize: '13.5px',
                  maxWidth: '600px',
                  margin: '0 auto 16px'
                }}
              >
                No records found for the provided inputs in Financial Year {financialYear}.
              </div>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Tip: Try selecting <strong>'All'</strong> in Return Filing Period and Return Type to view all filed returns.
              </p>
            </div>
          ) : (
            /* Table of Filed Returns */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Financial Year</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Tax Period</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Return Type</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>ARN</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Date of Filing</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Mode</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                        {row.financialYear}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                        {row.taxPeriod}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0' }}>
                        <span
                          style={{
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontWeight: 700,
                            fontSize: '12px'
                          }}
                        >
                          {row.returnType}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace', fontWeight: 600, color: '#16325c' }}>
                        {row.arn}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                        {row.filingDate}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <span
                          style={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '11.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={13} /> {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', textAlign: 'center', fontSize: '12.5px', color: '#475569' }}>
                        {row.mode}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedReturn(row)}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#16325c',
                              border: '1px solid #16325c',
                              borderRadius: '2px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="View Return Details"
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              downloadReturnAcknowledgment(row, currentUser);
                              toast.success('Downloaded', `Acknowledgment receipt for ARN ${row.arn} downloaded.`);
                            }}
                            style={{
                              backgroundColor: '#16325c',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '2px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Download Acknowledgment Receipt"
                          >
                            <Download size={13} /> Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VIEW RETURN DETAILS                                     */}
      {/* ============================================================== */}
      {selectedReturn && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReturn(null)}
          title={`Return Filing Summary — ${selectedReturn.returnType} (${selectedReturn.taxPeriod} ${selectedReturn.financialYear})`}
          size="lg"
        >
          <div style={{ padding: '4px' }}>
            {/* Top Info Banner */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '14px 18px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                <div>GSTIN: <strong>{currentUser?.gstin || '08NSGPS8609G1ZY'}</strong></div>
                <div>Legal Name: <strong>{currentUser?.legalName || 'RAVI SAINI'}</strong></div>
                <div>Status: <strong style={{ color: '#16a34a' }}>{selectedReturn.status}</strong></div>
                <div>ARN: <strong style={{ fontFamily: 'monospace' }}>{selectedReturn.arn}</strong></div>
                <div>Filing Date: <strong>{selectedReturn.filingDate}</strong></div>
                <div>Filing Mode: <strong>{selectedReturn.mode}</strong></div>
              </div>
            </div>

            {/* Financial Details Table */}
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
              Tax Liability & ITC Summary
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#16325c', color: '#ffffff' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #cbd5e1' }}>Description</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Integrated Tax (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Central Tax (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #cbd5e1' }}>State Tax (₹)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', border: '1px solid #cbd5e1' }}>Total Tax (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Total Tax Paid</td>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>₹{Number(selectedReturn.igst || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>₹{Number(selectedReturn.cgst || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'right' }}>₹{Number(selectedReturn.sgst || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>₹{Number(selectedReturn.totalTax || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 600 }}>Total Taxable Turnover</td>
                  <td colSpan={4} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700 }}>
                    ₹{Number(selectedReturn.taxableValue || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Verification Details */}
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '12px 16px', fontSize: '12.5px', color: '#166534', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                <ShieldCheck size={16} /> Digitally Signed and Verified
              </div>
              <div>Signatory: <strong>{currentUser?.legalName || 'RAVI SAINI'}</strong> (Proprietor / Authorized Signatory)</div>
              <div>Verification Method: <strong>Electronic Verification Code (EVC)</strong></div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setSelectedReturn(null)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadReturnAcknowledgment(selectedReturn, currentUser);
                  toast.success('Downloaded', `Acknowledgment receipt for ARN ${selectedReturn.arn} downloaded.`);
                }}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={14} /> Download Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
