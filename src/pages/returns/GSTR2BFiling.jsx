import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  RotateCw,
  Plus,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  Printer,
  Info,
  ExternalLink,
  Edit2
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function GSTR2BFiling() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fy = searchParams.get('fy') || '2024-25';
  const taxPeriod = searchParams.get('period') || 'April';
  const quarter = searchParams.get('quarter') || 'Quarter 1 (Apr - Jun)';

  const gstin = currentUser?.gstin || '29UATYY9012A1Z8';
  const legalName = currentUser?.legalName || 'UATYCO';
  const tradeName = currentUser?.tradeName || 'GSTN';
  const generationDate = '01/01/2025';

  // Header Banner Collapse
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  // Active top tab: 'SUMMARY' | 'ALL_TABLES'
  const [activeTab, setActiveTab] = useState('SUMMARY');

  // Category Pill inside Summary:
  // 'available' | 'not_available' | 'reversal' | 'rejected'
  const [categoryPill, setCategoryPill] = useState('available');

  // Drilldown / Selected Table in ALL_TABLES:
  const [selectedTable, setSelectedTable] = useState('b2b');

  // Sub-view in ALL_TABLES: 'supplier' | 'document'
  const [subTab, setSubTab] = useState('document');

  // Table expand/collapse state in Summary
  const [expandAll, setExpandAll] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    'partA-I': true,
    'partA-II': true,
    'partA-III': true,
    'partA-IV': true,
    'partB-I': true
  });

  const toggleSection = (secId) => {
    setExpandedSections(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const handleToggleAll = () => {
    const nextState = !expandAll;
    setExpandAll(nextState);
    setExpandedSections({
      'partA-I': nextState,
      'partA-II': nextState,
      'partA-III': nextState,
      'partA-IV': nextState,
      'partB-I': nextState
    });
  };

  // Advisory modal & Help modal
  const [advisoryOpen, setAdvisoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Add / Edit Record Modal
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  // View Record details modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Form State for User Input:
  const initialFormState = {
    category: 'available', // available, not_available, reversal, rejected
    tableType: 'b2b', // b2b, b2b_debit, b2b_credit, b2ba, b2b_dnr, b2b_cnr, itc_reversed, itc_rejected, isd, rcm, impg
    supplierGstin: '',
    supplierName: '',
    originalInvoiceNumber: '',
    originalInvoiceDate: '',
    invoiceNumber: '',
    invoiceType: 'Regular',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceValue: '',
    pos: 'Tamil Nadu',
    reverseCharge: 'No',
    taxableValue: '',
    igst: '',
    cgst: '',
    sgst: '',
    cess: '',
    filingPeriod: "Mar'23",
    filingDate: '08/12/2023',
    itcAvailability: 'Yes',
    reason: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // Records state: empty by default as requested by user ("DATA AUTO FILLED NHI AAYEGA TO USKE LIYE AIK OPTION DENA BUTTON JISPER CLICK KRKE ME DATA FIELD KRUGA")
  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('gst_gstr2b_user_records');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return []; // Empty by default!
  });

  // Save to localStorage whenever records change
  const saveRecords = (newRecords) => {
    setRecords(newRecords);
    try {
      localStorage.setItem('gst_gstr2b_user_records', JSON.stringify(newRecords));
    } catch {
      // ignore
    }
  };

  // Search & Filter state for ALL_TABLES
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Table options for dropdown in ALL_TABLES view
  const tableOptions = [
    { value: 'b2ba', label: 'Amendments to previously filed invoices by supplier - B2BA (ITC reversal)' },
    { value: 'b2b_dnr', label: 'Debit notes(Original) - B2B DNR' },
    { value: 'b2b', label: 'B2B - Invoices (Regular)' },
    { value: 'b2b_debit', label: 'B2B - Debit notes - IMS' },
    { value: 'b2b_credit', label: 'B2B - Credit Notes - IMS' },
    { value: 'itc_reversed', label: 'ITC Reversed - B2B' },
    { value: 'itc_rejected', label: 'ITC Rejected - B2B' },
    { value: 'isd', label: 'Inward supplies from ISD' },
    { value: 'rcm', label: 'Inward supplies liable to reverse charge (RCM)' },
    { value: 'impg', label: 'Import of Goods (IMPG / ICEGATE)' }
  ];

  // Format currency helper
  const fmt = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Compute summary rows based on records and active categoryPill
  // Category tabs: 'available' | 'not_available' | 'reversal' | 'rejected'
  const summaryTotals = useMemo(() => {
    const getSum = (catFilter, tableFilter) => {
      let filtered = records.filter(r => r.category === catFilter);
      if (tableFilter) {
        if (Array.isArray(tableFilter)) {
          filtered = filtered.filter(r => tableFilter.includes(r.tableType));
        } else {
          filtered = filtered.filter(r => r.tableType === tableFilter);
        }
      }
      return filtered.reduce(
        (acc, r) => ({
          igst: acc.igst + (Number(r.igst) || 0),
          cgst: acc.cgst + (Number(r.cgst) || 0),
          sgst: acc.sgst + (Number(r.sgst) || 0),
          cess: acc.cess + (Number(r.cess) || 0)
        }),
        { igst: 0, cgst: 0, sgst: 0, cess: 0 }
      );
    };

    return {
      getSum,
      available: {
        partA_I: getSum('available', ['b2b', 'b2b_debit', 'b2ba']),
        partA_II: getSum('available', 'isd'),
        partA_III: getSum('available', 'rcm'),
        partA_IV: getSum('available', 'impg'),
        partB_I: getSum('available', 'b2b_credit')
      },
      rejected: {
        partA_I_b2b: getSum('rejected', 'b2b'),
        partA_I_dn: getSum('rejected', 'b2b_debit'),
        partA_I_eco: getSum('rejected', 'eco'),
        partA_I_b2ba: getSum('rejected', 'b2ba'),
        partA_I_dna: getSum('rejected', 'b2b_dna'),
        partA_I_ecoa: getSum('rejected', 'ecoa'),
        partA_II_isd: getSum('rejected', 'isd'),
        partA_II_isda: getSum('rejected', 'isda'),
        partB_I_cn: getSum('rejected', 'b2b_credit'),
        partB_I_cna: getSum('rejected', 'b2b_cna'),
        partB_I_isdcn: getSum('rejected', 'isd_credit'),
        partB_I_isdcna: getSum('rejected', 'isd_credita')
      },
      reversal: {
        b2ba: getSum('reversal', 'b2ba'),
        b2bdnr: getSum('reversal', 'b2b_dnr'),
        itc_reversed: getSum('reversal', 'itc_reversed')
      },
      not_available: {
        ineligible: getSum('not_available')
      }
    };
  }, [records]);

  // Filter records for Document Details table
  const filteredRecords = useMemo(() => {
    let list = records;

    // Filter by selected table type in ALL_TABLES dropdown
    if (selectedTable === 'b2ba') {
      list = list.filter(r => r.tableType === 'b2ba');
    } else if (selectedTable === 'b2b_dnr') {
      list = list.filter(r => r.tableType === 'b2b_dnr' || r.tableType === 'b2b_debit');
    } else if (selectedTable === 'b2b') {
      list = list.filter(r => r.tableType === 'b2b');
    } else if (selectedTable === 'b2b_debit') {
      list = list.filter(r => r.tableType === 'b2b_debit');
    } else if (selectedTable === 'b2b_credit') {
      list = list.filter(r => r.tableType === 'b2b_credit');
    } else if (selectedTable === 'itc_reversed') {
      list = list.filter(r => r.category === 'reversal');
    } else if (selectedTable === 'itc_rejected') {
      list = list.filter(r => r.category === 'rejected');
    } else if (selectedTable === 'isd') {
      list = list.filter(r => r.tableType === 'isd');
    } else if (selectedTable === 'rcm') {
      list = list.filter(r => r.tableType === 'rcm');
    } else if (selectedTable === 'impg') {
      list = list.filter(r => r.tableType === 'impg');
    }

    // Search term filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        r =>
          (r.supplierGstin && r.supplierGstin.toLowerCase().includes(q)) ||
          (r.supplierName && r.supplierName.toLowerCase().includes(q)) ||
          (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(q)) ||
          (r.originalInvoiceNumber && r.originalInvoiceNumber.toLowerCase().includes(q))
      );
    }

    return list;
  }, [records, selectedTable, searchTerm]);

  // Aggregated Supplier-Wise records
  const supplierWiseRecords = useMemo(() => {
    const map = {};
    filteredRecords.forEach(r => {
      const key = r.supplierGstin || 'UNKNOWN';
      if (!map[key]) {
        map[key] = {
          gstin: key,
          name: r.supplierName || 'GSTN',
          count: 0,
          taxableValue: 0,
          igst: 0,
          cgst: 0,
          sgst: 0,
          cess: 0,
          totalTax: 0
        };
      }
      map[key].count += 1;
      map[key].taxableValue += Number(r.taxableValue) || 0;
      map[key].igst += Number(r.igst) || 0;
      map[key].cgst += Number(r.cgst) || 0;
      map[key].sgst += Number(r.sgst) || 0;
      map[key].cess += Number(r.cess) || 0;
      map[key].totalTax += (Number(r.igst) || 0) + (Number(r.cgst) || 0) + (Number(r.sgst) || 0) + (Number(r.cess) || 0);
    });
    return Object.values(map);
  }, [filteredRecords]);

  // Form Submit Handler
  const handleSaveRecord = (e) => {
    e.preventDefault();

    if (!formData.supplierGstin) {
      toast.error('Validation Error', 'Supplier GSTIN is required.');
      return;
    }
    if (!formData.invoiceNumber) {
      toast.error('Validation Error', 'Invoice Number is required.');
      return;
    }

    const tv = Number(formData.taxableValue) || 0;
    const igstVal = Number(formData.igst) || 0;
    const cgstVal = Number(formData.cgst) || 0;
    const sgstVal = Number(formData.sgst) || 0;
    const cessVal = Number(formData.cess) || 0;
    const invVal = Number(formData.invoiceValue) || (tv + igstVal + cgstVal + sgstVal + cessVal);

    if (editingRecordId) {
      // Edit existing
      const updated = records.map(r => {
        if (r.id === editingRecordId) {
          return {
            ...formData,
            id: editingRecordId,
            taxableValue: tv,
            igst: igstVal,
            cgst: cgstVal,
            sgst: sgstVal,
            cess: cessVal,
            invoiceValue: invVal
          };
        }
        return r;
      });
      saveRecords(updated);
      toast.success('Record Updated', `Invoice ${formData.invoiceNumber} updated successfully.`);
    } else {
      // Add new
      const newRec = {
        ...formData,
        id: `REC-${Date.now().toString().slice(-4)}`,
        taxableValue: tv,
        igst: igstVal,
        cgst: cgstVal,
        sgst: sgstVal,
        cess: cessVal,
        invoiceValue: invVal
      };
      saveRecords([newRec, ...records]);
      toast.success('Record Added', `Invoice ${newRec.invoiceNumber} added to GSTR-2B.`);
    }

    setRecordModalOpen(false);
    setEditingRecordId(null);
    setFormData(initialFormState);
  };

  const handleEditRecord = (rec) => {
    setEditingRecordId(rec.id);
    setFormData({
      ...rec,
      invoiceValue: rec.invoiceValue || '',
      taxableValue: rec.taxableValue || '',
      igst: rec.igst || '',
      cgst: rec.cgst || '',
      sgst: rec.sgst || '',
      cess: rec.cess || ''
    });
    setRecordModalOpen(true);
  };

  const handleDeleteRecord = (id) => {
    const updated = records.filter(r => r.id !== id);
    saveRecords(updated);
    toast.info('Deleted', 'Record removed from GSTR-2B.');
  };

  const handleClearAll = () => {
    saveRecords([]);
    toast.warning('Data Cleared', 'All GSTR-2B records cleared.');
  };

  // Download Excel / CSV handler
  const handleExportExcel = (dataToExport, fileName = 'GSTR2B_Details') => {
    if (!dataToExport || dataToExport.length === 0) {
      toast.warning('No Records', 'There is no data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Original Invoice Number',
      'Original Invoice Date',
      'GSTIN of Supplier',
      'Trade/Legal Name',
      'Invoice Number',
      'Invoice Type',
      'Invoice Date',
      'Invoice Value',
      'Place of Supply',
      'Supply Attract Reverse Charge',
      'Total Taxable Value',
      'Integrated Tax (IGST)',
      'Central Tax (CGST)',
      'State/UT Tax (SGST)',
      'Cess',
      'GSTR-1/IFF Period',
      'GSTR-1/IFF Filing Date',
      'ITC Availability',
      'Reason'
    ];

    const rows = dataToExport.map((r, i) => [
      i + 1,
      r.originalInvoiceNumber || '',
      r.originalInvoiceDate || '',
      r.supplierGstin || '',
      `"${(r.supplierName || '').replace(/"/g, '""')}"`,
      r.invoiceNumber || '',
      r.invoiceType || 'Regular',
      r.invoiceDate || '',
      r.invoiceValue || 0,
      `"${r.pos || ''}"`,
      r.reverseCharge || 'No',
      r.taxableValue || 0,
      r.igst || 0,
      r.cgst || 0,
      r.sgst || 0,
      r.cess || 0,
      r.filingPeriod || '',
      r.filingDate || '',
      r.itcAvailability || 'Yes',
      `"${(r.reason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${fileName}_${taxPeriod}_${fy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Downloaded', `${fileName}.csv exported successfully.`);
  };

  // PDF Summary Download handler
  const handleDownloadPdf = () => {
    toast.info('Generating PDF', 'Preparing GSTR-2B Summary report for download...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto', paddingBottom: '60px', fontFamily: '"Public Sans", Arial, sans-serif' }}>

      {/* Top Breadcrumbs & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'GSTR-2B' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Collapsible Teal Header Bar (exact color #00a29b / #1fb5a2 from portal screenshot) */}
      <div
        style={{
          backgroundColor: '#00a29b',
          color: '#ffffff',
          padding: '11px 18px',
          borderRadius: '2px 2px 0 0',
          fontWeight: 700,
          fontSize: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setHeaderCollapsed(!headerCollapsed)}
      >
        <span>GSTR-2B- AUTO-DRAFTED ITC STATEMENT</span>
        <button
          type="button"
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          {headerCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Taxpayer Information Strip (matching S_b17633f7.jfif) */}
      {!headerCollapsed && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderTop: 'none',
            padding: '14px 20px',
            fontSize: '13px',
            color: '#1e293b',
            marginBottom: '16px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '8px', columnGap: '24px' }}>
            <div>
              <span style={{ color: '#475569' }}>GSTIN- </span>
              <strong>{gstin}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Legal Name - </span>
              <strong>{legalName}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Trade Name - </span>
              <strong>{tradeName}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Financial Year - </span>
              <strong>{fy}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Return Period - </span>
              <strong>{taxPeriod}</strong>
            </div>
            <div>
              <span style={{ color: '#475569' }}>Generation date - </span>
              <strong>{generationDate}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls Strip: SUMMARY / ALL TABLES Tabs + Action Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '16px',
          paddingBottom: '8px',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setActiveTab('SUMMARY')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px 4px',
              fontSize: '14px',
              fontWeight: 700,
              color: activeTab === 'SUMMARY' ? '#00a29b' : '#64748b',
              borderBottom: activeTab === 'SUMMARY' ? '3px solid #00a29b' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            SUMMARY
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ALL_TABLES')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px 4px',
              fontSize: '14px',
              fontWeight: 700,
              color: activeTab === 'ALL_TABLES' ? '#00a29b' : '#64748b',
              borderBottom: activeTab === 'ALL_TABLES' ? '3px solid #00a29b' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            ALL TABLES
          </button>
        </div>

        {/* User Data Entry & Management Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              setEditingRecordId(null);
              setFormData(initialFormState);
              setRecordModalOpen(true);
            }}
            style={{
              backgroundColor: '#00a29b',
              color: '#ffffff',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '2px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <Plus size={16} /> + ADD / ENTER INVOICE DATA
          </button>

          {records.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              style={{
                backgroundColor: '#ffffff',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                padding: '6px 12px',
                borderRadius: '2px',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Clear all entered data"
            >
              <Trash2 size={13} /> Clear Data
            </button>
          )}

          <button
            type="button"
            onClick={() => setAdvisoryOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0284c7',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            View Advisory
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: SUMMARY TAB (Images S_b17633f7.jfif and SSS_8f2422dd.jfif)*/}
      {/* ============================================================== */}
      {activeTab === 'SUMMARY' && (
        <div>
          {/* Category Navigation Pills */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCategoryPill('available')}
                style={{
                  backgroundColor: categoryPill === 'available' ? '#00a29b' : '#ffffff',
                  color: categoryPill === 'available' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ITC available
              </button>

              <button
                type="button"
                onClick={() => setCategoryPill('not_available')}
                style={{
                  backgroundColor: categoryPill === 'not_available' ? '#00a29b' : '#ffffff',
                  color: categoryPill === 'not_available' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ITC Not Available
              </button>

              <button
                type="button"
                onClick={() => setCategoryPill('reversal')}
                style={{
                  backgroundColor: categoryPill === 'reversal' ? '#00a29b' : '#ffffff',
                  color: categoryPill === 'reversal' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ITC Reversal
              </button>

              <button
                type="button"
                onClick={() => setCategoryPill('rejected')}
                style={{
                  backgroundColor: categoryPill === 'rejected' ? '#d9534f' : '#ffffff',
                  color: categoryPill === 'rejected' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ITC Rejected
              </button>
            </div>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              style={{
                backgroundColor: '#337ab7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              HELP <HelpCircle size={13} />
            </button>
          </div>

          {/* Main Summary Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ width: '5%', padding: '10px 8px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    S.NO.
                  </th>
                  <th style={{ width: '45%', padding: '10px 12px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    Heading{' '}
                    <span
                      onClick={handleToggleAll}
                      style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 600, fontSize: '12px', marginLeft: '6px' }}
                    >
                      {expandAll ? '[Collapse All ^]' : '[Expand All v]'}
                    </span>
                  </th>
                  <th style={{ width: '12%', padding: '10px 8px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    GSTR-3B table
                  </th>
                  <th style={{ width: '10%', padding: '10px 10px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    Integrated Tax (₹)
                  </th>
                  <th style={{ width: '10%', padding: '10px 10px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    Central Tax (₹)
                  </th>
                  <th style={{ width: '10%', padding: '10px 10px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>
                    State/UT Tax (₹)
                  </th>
                  <th style={{ width: '8%', padding: '10px 10px', textAlign: 'right', fontWeight: 700 }}>
                    Cess (₹)
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* -------------------------------------------------------- */}
                {/* CATEGORY: ITC AVAILABLE (Image S_b17633f7.jfif)           */}
                {/* -------------------------------------------------------- */}
                {categoryPill === 'available' && (
                  <>
                    {/* Header Part A */}
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700, borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part A</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#16325c' }}>
                        ITC Available - Credit may be claimed in relevant headings in GSTR-3B
                      </td>
                    </tr>

                    {/* Row I: All other ITC - Supplies from registered persons */}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => toggleSection('partA-I')}
                        >
                          All other ITC - Supplies from registered persons {expandedSections['partA-I'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />} (IMS)
                        </div>
                        {expandedSections['partA-I'] && (
                          <div style={{ marginTop: '8px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('b2b'); setActiveTab('ALL_TABLES'); }}>• B2B - Invoices - IMS</span>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('b2b_debit'); setActiveTab('ALL_TABLES'); }}>• B2B - Debit notes - IMS</span>
                            <span>• ECO - Documents - IMS</span>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('b2ba'); setActiveTab('ALL_TABLES'); }}>• B2B - Invoices (Amendment) - IMS</span>
                            <span>• B2B - Debit notes (Amendment) - IMS</span>
                            <span>• ECO - Documents (Amendment) - IMS</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                        4(A)(5) ⓘ
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_I.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_I.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_I.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_I.cess)}
                      </td>
                    </tr>

                    {/* Row II: Inward Supplies from ISD */}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>II</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => toggleSection('partA-II')}
                        >
                          Inward Supplies from ISD {expandedSections['partA-II'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        {expandedSections['partA-II'] && (
                          <div style={{ marginTop: '8px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('isd'); setActiveTab('ALL_TABLES'); }}>• ISD - Invoices</span>
                            <span>• ISD - Invoices (Amendment)</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>4(A)(4) ⓘ</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_II.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_II.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_II.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_II.cess)}
                      </td>
                    </tr>

                    {/* Row III: Inward Supplies liable for reverse charge */}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>III</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => toggleSection('partA-III')}
                        >
                          Inward Supplies liable for reverse charge {expandedSections['partA-III'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        {expandedSections['partA-III'] && (
                          <div style={{ marginTop: '8px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('rcm'); setActiveTab('ALL_TABLES'); }}>• B2B - Reverse Charge</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontSize: '12px' }}>
                        3.1(d)<br />4(A)(3) ⓘ
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_III.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_III.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_III.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_III.cess)}
                      </td>
                    </tr>

                    {/* Row IV: Import of Goods */}
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>IV</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => toggleSection('partA-IV')}
                        >
                          Import of Goods {expandedSections['partA-IV'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        {expandedSections['partA-IV'] && (
                          <div style={{ marginTop: '8px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('impg'); setActiveTab('ALL_TABLES'); }}>• IMPG - Overseas Bills of Entry</span>
                            <span>• IMPGSEZ - SEZ Units</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>4(A)(1) ⓘ</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_IV.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_IV.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_IV.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partA_IV.cess)}
                      </td>
                    </tr>

                    {/* Header Part B */}
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700, borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part B</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#16325c' }}>
                        ITC Available - Credit notes should be net off against relevant ITC available headings in GSTR-3B
                      </td>
                    </tr>

                    {/* Row I: Others */}
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => toggleSection('partB-I')}
                        >
                          Others {expandedSections['partB-I'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        {expandedSections['partB-I'] && (
                          <div style={{ marginTop: '8px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                            <span style={{ cursor: 'pointer', color: '#0284c7' }} onClick={() => { setSelectedTable('b2b_credit'); setActiveTab('ALL_TABLES'); }}>• B2B - Credit Notes - IMS</span>
                            <span>• B2B - Credit notes (Amendment) - IMS</span>
                            <span>• ISD - Credit notes</span>
                            <span>• ISD - Credit notes (Amendment)</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>4(A) ⓘ</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partB_I.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partB_I.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partB_I.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.available.partB_I.cess)}
                      </td>
                    </tr>
                  </>
                )}

                {/* -------------------------------------------------------- */}
                {/* CATEGORY: ITC REJECTED (Image SSS_8f2422dd.jfif)          */}
                {/* -------------------------------------------------------- */}
                {categoryPill === 'rejected' && (
                  <>
                    <tr style={{ backgroundColor: '#fef2f2', fontWeight: 700, borderBottom: '1px solid #fecdd3' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part A</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#991b1b' }}>
                        ITC Rejected
                      </td>
                    </tr>

                    {/* Part A Row I */}
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                          All other ITC - Supplies from registered persons ^ (IMS)
                        </div>
                        <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Invoices - IMS</span>
                            <strong>{fmt(summaryTotals.rejected.partA_I_b2b.igst)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Debit notes - IMS</span>
                            <strong>{fmt(summaryTotals.rejected.partA_I_dn.igst)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>ECO - Documents - IMS</span>
                            <span>{fmt(summaryTotals.rejected.partA_I_eco.igst)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Invoices (Amendment) - IMS</span>
                            <span>{fmt(summaryTotals.rejected.partA_I_b2ba.igst)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Debit notes (Amendment) - IMS</span>
                            <span>{fmt(summaryTotals.rejected.partA_I_dna.igst)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>ECO - Documents (Amendment) - IMS</span>
                            <span>{fmt(summaryTotals.rejected.partA_I_ecoa.igst)}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>NA</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.rejected.partA_I_b2b.igst + summaryTotals.rejected.partA_I_dn.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>0.00</td>
                    </tr>

                    {/* Part A Row II: ISD */}
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>II</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Inward Supplies from ISD ^</div>
                        <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                          <span>ISD - Invoices</span>
                          <span>ISD - Invoices (Amendment)</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>NA</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>0.00</td>
                    </tr>

                    {/* Header Part B: Rejected Records */}
                    <tr style={{ backgroundColor: '#fef2f2', fontWeight: 700, borderBottom: '1px solid #fecdd3' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part B</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#991b1b' }}>
                        Rejected Records - Credit Notes rejected on IMS Dashboard
                      </td>
                    </tr>

                    {/* Part B Row I */}
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>Others ^ (IMS)</div>
                        <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Credit Notes - IMS</span>
                            <strong>{fmt(summaryTotals.rejected.partB_I_cn.igst)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>B2B - Credit notes (Amendment) - IMS</span>
                            <span>0.00</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>ISD - Credit notes</span>
                            <span>0.00</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                            <span>ISD - Credit notes (Amendment)</span>
                            <span>0.00</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>NA</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.rejected.partB_I_cn.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>0.00</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>0.00</td>
                    </tr>
                  </>
                )}

                {/* -------------------------------------------------------- */}
                {/* CATEGORY: ITC REVERSAL & NOT AVAILABLE                    */}
                {/* -------------------------------------------------------- */}
                {categoryPill === 'reversal' && (
                  <>
                    <tr style={{ backgroundColor: '#fffbeb', fontWeight: 700, borderBottom: '1px solid #fef3c7' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part A</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#92400e' }}>
                        ITC Reversal - Ineligible under Section 16(4) / Section 17(5)
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        B2BA - Amendments to previously filed invoices (ITC reversal)
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>4(B) ⓘ</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.reversal.b2ba.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.reversal.b2ba.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.reversal.b2ba.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.reversal.b2ba.cess)}
                      </td>
                    </tr>
                  </>
                )}

                {categoryPill === 'not_available' && (
                  <>
                    <tr style={{ backgroundColor: '#f1f5f9', fontWeight: 700, borderBottom: '1px solid #cbd5e1' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>Part A</td>
                      <td colSpan={6} style={{ padding: '8px 12px', color: '#16325c' }}>
                        ITC Not Available
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>I</td>
                      <td style={{ padding: '8px 12px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        Ineligible Inward Supplies (Section 17(5))
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>4(D) ⓘ</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.not_available.ineligible.igst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.not_available.ineligible.cgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {fmt(summaryTotals.not_available.ineligible.sgst)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(summaryTotals.not_available.ineligible.cess)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Buttons (Matching Image S_b17633f7.jfif and SSS_8f2422dd.jfif) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Row 1: Back to Dashboard + Download Summary (PDF) + Download Details (Excel) */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate('/returns')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #16325c',
                  borderRadius: '2px',
                  padding: '9px 24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                BACK TO DASHBOARD
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                style={{
                  backgroundColor: '#1f385c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px 26px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                DOWNLOAD GSTR-2B SUMMARY (PDF)
              </button>

              <button
                type="button"
                onClick={() => handleExportExcel(records, 'GSTR2B_Details')}
                style={{
                  backgroundColor: '#1f385c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '9px 26px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                DOWNLOAD GSTR-2B DETAILS (EXCEL)
              </button>
            </div>

            {/* Row 2: OPEN GSTR-3B + OPEN IMS DASHBOARD */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => navigate(`/returns/gstr3b?fy=${encodeURIComponent(fy)}&period=${encodeURIComponent(taxPeriod)}`)}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: '2px solid #b91c1c',
                  borderRadius: '2px',
                  padding: '9px 40px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                OPEN GSTR-3B
              </button>

              <button
                type="button"
                onClick={() => navigate('/returns/ims-dashboard')}
                style={{
                  backgroundColor: '#16325c',
                  color: '#ffffff',
                  border: '2px solid #b91c1c',
                  borderRadius: '2px',
                  padding: '9px 40px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                OPEN IMS DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: ALL TABLES / DRILLDOWN TABLE (Images SS, SSSS, SSSSS, SSSSSS)*/}
      {/* ============================================================== */}
      {activeTab === 'ALL_TABLES' && (
        <div>
          {/* Table Selector Header (Image SSSSS & SSSSSS) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#e0f2fe',
              padding: '8px 16px',
              borderRadius: '2px',
              marginBottom: '16px',
              border: '1px solid #bae6fd'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{
                  backgroundColor: '#337ab7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <option value="b2ba">Amendments to previously filed invoices - B2BA</option>
                <option value="b2b_dnr">Debit notes(Original) - B2B DNR</option>
                <option value="b2b">B2B - Invoices (Regular)</option>
                <option value="b2b_debit">B2B - Debit notes - IMS</option>
                <option value="b2b_credit">B2B - Credit Notes - IMS</option>
                <option value="itc_reversed">ITC Reversed - B2B</option>
                <option value="itc_rejected">ITC Rejected - B2B</option>
                <option value="isd">Inward supplies from ISD</option>
                <option value="rcm">Inward supplies liable to RCM</option>
                <option value="impg">Import of Goods (IMPG)</option>
              </select>

              <div style={{ fontWeight: 700, fontSize: '14px', color: '#16325c' }}>
                {tableOptions.find(t => t.value === selectedTable)?.label || 'B2B Invoices'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              style={{
                backgroundColor: '#337ab7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              HELP <HelpCircle size={13} />
            </button>
          </div>

          {/* Sub-Tabs: Supplier wise Details vs Document Details */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSubTab('supplier')}
                style={{
                  backgroundColor: subTab === 'supplier' ? '#00a29b' : '#ffffff',
                  color: subTab === 'supplier' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Supplier wise Details
              </button>

              <button
                type="button"
                onClick={() => setSubTab('document')}
                style={{
                  backgroundColor: subTab === 'document' ? '#00a29b' : '#ffffff',
                  color: subTab === 'document' ? '#ffffff' : '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Document Details
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleExportExcel(filteredRecords, selectedTable)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0284c7',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Download Excel <Download size={13} />
            </button>
          </div>

          {/* Controls Bar: Display/Hide Columns, Records Per Page, Filter, Search */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
              borderRadius: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                <span>Display/Hide Columns:</span>
                <button
                  type="button"
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  +1 ▼
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                <span>Records Per Page:</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    padding: '2px 6px',
                    fontSize: '12px'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                Apply filter <Filter size={12} />
              </button>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    padding: '4px 28px 4px 8px',
                    fontSize: '12px',
                    width: '180px'
                  }}
                />
                <Search
                  size={13}
                  style={{ position: 'absolute', right: '8px', top: '7px', color: '#94a3b8' }}
                />
              </div>
            </div>
          </div>

          {/* SUB-VIEW 1: DOCUMENT DETAILS TABLE (Matching images SSSSS, SSSSSS, SS, SSSS) */}
          {subTab === 'document' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                overflowX: 'auto',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <table style={{ width: '100%', minWidth: '1500px', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#cfe2f3', color: '#16325c', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 6px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>S.NO.</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Original Invoice number ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>Original Invoice date ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>GSTIN of supplier ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Trade/legal name ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Invoice number ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Invoice type ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>Invoice Date ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>Invoice Value (₹)</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Place of supply ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>Supply Attract Reverse Charge ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>Total Taxable Value (₹) ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>Integrated Tax (₹) ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>Central Tax (₹) ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>State/UT Tax (₹) ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'right', borderRight: '1px solid #b6d4fe' }}>Cess (₹) ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>GSTR-1/IFF Period ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>GSTR-1/IFF Filing Date ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'center', borderRight: '1px solid #b6d4fe' }}>ITC Availability ▲</th>
                    <th style={{ padding: '8px 8px', textAlign: 'left', borderRight: '1px solid #b6d4fe' }}>Reason / Remarks</th>
                    <th style={{ padding: '8px 6px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={21} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        No records found for the selected criteria. Click "+ ADD / ENTER INVOICE DATA" above to add records.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r, idx) => (
                      <tr
                        key={r.id || idx}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                        }}
                      >
                        <td style={{ padding: '7px 6px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>{idx + 1}</td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                          {r.originalInvoiceNumber || '-'}
                        </td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#475569' }}>
                          {r.originalInvoiceDate || '-'}
                        </td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace', fontWeight: 600, color: '#16325c' }}>
                          {r.supplierGstin}
                        </td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0' }}>{r.supplierName || 'GSTN'}</td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>{r.invoiceNumber}</td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0' }}>{r.invoiceType || 'Regular'}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>{r.invoiceDate}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>{fmt(r.invoiceValue)}</td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0' }}>{r.pos || 'Tamil Nadu'}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>{r.reverseCharge || 'No'}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>{fmt(r.taxableValue)}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>{fmt(r.igst)}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>{fmt(r.cgst)}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>{fmt(r.sgst)}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>{fmt(r.cess)}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#475569' }}>{r.filingPeriod || "Mar'23"}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#475569' }}>{r.filingDate || '08/12/2023'}</td>
                        <td style={{ padding: '7px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                          <span
                            style={{
                              color: r.itcAvailability === 'Yes' ? '#15803d' : '#b91c1c',
                              fontWeight: 700
                            }}
                          >
                            {r.itcAvailability || 'No'}
                          </span>
                        </td>
                        <td style={{ padding: '7px 8px', borderRight: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                          {r.reason || (r.category === 'reversal' ? 'ITC reversal on account of 16(4)' : 'Available')}
                        </td>
                        <td style={{ padding: '7px 6px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(r)}
                              style={{ background: 'transparent', border: 'none', color: '#16325c', cursor: 'pointer', padding: '2px' }}
                              title="View"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditRecord(r)}
                              style={{ background: 'transparent', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '2px' }}
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRecord(r.id)}
                              style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '2px' }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SUB-VIEW 2: SUPPLIER WISE DETAILS TABLE */}
          {subTab === 'supplier' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                overflowX: 'auto',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#cfe2f3', color: '#16325c', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>S.No</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Supplier GSTIN</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left' }}>Supplier Legal / Trade Name</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center' }}>Invoice Count</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Taxable Value (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Integrated Tax (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Central Tax (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>State/UT Tax (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Cess (₹)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Tax (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierWiseRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        No supplier records available.
                      </td>
                    </tr>
                  ) : (
                    supplierWiseRecords.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#16325c' }}>{s.gstin}</td>
                        <td style={{ padding: '8px 10px' }}>{s.name}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'center' }}>{s.count}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{fmt(s.taxableValue)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmt(s.igst)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmt(s.cgst)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmt(s.sgst)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{fmt(s.cess)}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#00a29b' }}>{fmt(s.totalTax)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Pagination & Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
              <span>« Previous</span>
              <button
                type="button"
                style={{
                  backgroundColor: '#337ab7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '3px 8px',
                  fontWeight: 700
                }}
              >
                1
              </button>
              <span>Next »</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('SUMMARY')}
              style={{
                backgroundColor: '#ffffff',
                color: '#16325c',
                border: '1px solid #16325c',
                borderRadius: '2px',
                padding: '7px 20px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Back to Summary
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD / ENTER INVOICE DATA FORM (User Requested Feature)  */}
      {/* ============================================================== */}
      {recordModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => {
            setRecordModalOpen(false);
            setEditingRecordId(null);
          }}
          title={editingRecordId ? 'Edit Invoice Record (GSTR-2B)' : 'Add / Enter Inward Invoice Data (GSTR-2B)'}
          size="lg"
        >
          <form onSubmit={handleSaveRecord} style={{ padding: '6px' }}>
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '10px 14px',
                borderRadius: '4px',
                fontSize: '12.5px',
                color: '#1e40af',
                marginBottom: '16px'
              }}
            >
              Enter the supplier invoice details below. Once added, the data will immediately appear in the Document Details table and update the GSTR-2B Summary totals dynamically.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
              {/* Category Pill */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  ITC Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="available">ITC available (Part A/B)</option>
                  <option value="reversal">ITC Reversal (Section 16(4))</option>
                  <option value="rejected">ITC Rejected (IMS Dashboard)</option>
                  <option value="not_available">ITC Not Available (Section 17(5))</option>
                </select>
              </div>

              {/* Table Section */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Table / Section *
                </label>
                <select
                  value={formData.tableType}
                  onChange={(e) => setFormData({ ...formData, tableType: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="b2b">B2B - Invoices (Regular)</option>
                  <option value="b2ba">B2BA - Amendments to previously filed</option>
                  <option value="b2b_debit">B2B - Debit notes - IMS</option>
                  <option value="b2b_credit">B2B - Credit notes - IMS</option>
                  <option value="b2b_dnr">Debit notes(Original) - B2B DNR</option>
                  <option value="isd">Inward supplies from ISD</option>
                  <option value="rcm">Inward supplies liable to RCM</option>
                  <option value="impg">Import of Goods (IMPG / ICEGATE)</option>
                  <option value="itc_reversed">ITC Reversed - B2B</option>
                  <option value="itc_rejected">ITC Rejected - B2B</option>
                </select>
              </div>

              {/* Supplier GSTIN */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Supplier GSTIN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 27MAYAS0100JMZF"
                  value={formData.supplierGstin}
                  onChange={(e) => setFormData({ ...formData, supplierGstin: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Trade / Legal Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Trade / Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. GSTN / ABC TRADERS"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Invoice Number */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Invoice Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AER-023"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Invoice Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Invoice Date
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Original Invoice Number */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Original Invoice No (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ER-023 (for Amendments)"
                  value={formData.originalInvoiceNumber}
                  onChange={(e) => setFormData({ ...formData, originalInvoiceNumber: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Original Invoice Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Original Invoice Date (Optional)
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.originalInvoiceDate}
                  onChange={(e) => setFormData({ ...formData, originalInvoiceDate: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Invoice Type */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Invoice Type
                </label>
                <select
                  value={formData.invoiceType}
                  onChange={(e) => setFormData({ ...formData, invoiceType: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="Regular">Regular</option>
                  <option value="Debit Note">Debit Note</option>
                  <option value="Credit Note">Credit Note</option>
                  <option value="Amended">Amended</option>
                </select>
              </div>

              {/* Place of Supply */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Place of Supply
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tamil Nadu"
                  value={formData.pos}
                  onChange={(e) => setFormData({ ...formData, pos: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Reverse Charge */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Supply Attract Reverse Charge
                </label>
                <select
                  value={formData.reverseCharge}
                  onChange={(e) => setFormData({ ...formData, reverseCharge: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {/* Total Taxable Value */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Total Taxable Value (₹) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 5000.00"
                  value={formData.taxableValue}
                  onChange={(e) => {
                    const tv = e.target.value;
                    setFormData({
                      ...formData,
                      taxableValue: tv
                    });
                  }}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Integrated Tax IGST */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Integrated Tax IGST (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.igst}
                  onChange={(e) => setFormData({ ...formData, igst: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Central Tax CGST */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Central Tax CGST (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.cgst}
                  onChange={(e) => setFormData({ ...formData, cgst: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* State/UT Tax SGST */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  State/UT Tax SGST (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.sgst}
                  onChange={(e) => setFormData({ ...formData, sgst: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Cess */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Cess (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formData.cess}
                  onChange={(e) => setFormData({ ...formData, cess: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Total Invoice Value */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Total Invoice Value (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="Leave empty to auto-sum"
                  value={formData.invoiceValue}
                  onChange={(e) => setFormData({ ...formData, invoiceValue: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* ITC Availability */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  ITC Availability
                </label>
                <select
                  value={formData.itcAvailability}
                  onChange={(e) => setFormData({ ...formData, itcAvailability: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                >
                  <option value="Yes">Yes (Available)</option>
                  <option value="No">No (Ineligible / Reversed / Rejected)</option>
                </select>
              </div>

              {/* GSTR-1/IFF Filing Period */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Supplier GSTR-1 Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mar'23 / Apr'25"
                  value={formData.filingPeriod}
                  onChange={(e) => setFormData({ ...formData, filingPeriod: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* GSTR-1/IFF Filing Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Supplier Filing Date
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={formData.filingDate}
                  onChange={(e) => setFormData({ ...formData, filingDate: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>

              {/* Reason / Remarks */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Reason / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. ITC reversal on account of 16(4)"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12.5px', border: '1px solid #cbd5e1', borderRadius: '2px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  setRecordModalOpen(false);
                  setEditingRecordId(null);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #cbd5e1',
                  padding: '7px 18px',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#00a29b',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 22px',
                  borderRadius: '2px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {editingRecordId ? 'Update Record' : '+ Add Record to GSTR-2B'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: VIEW RECORD DETAILS                                   */}
      {/* ============================================================== */}
      {selectedRecord && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          title={`Inward Document Details — ${selectedRecord.invoiceNumber}`}
          size="md"
        >
          <div style={{ padding: '6px', fontSize: '13px' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div>Supplier GSTIN: <strong>{selectedRecord.supplierGstin}</strong></div>
                <div>Supplier Name: <strong>{selectedRecord.supplierName || 'GSTN'}</strong></div>
                <div>Invoice Number: <strong>{selectedRecord.invoiceNumber}</strong></div>
                <div>Invoice Date: <strong>{selectedRecord.invoiceDate}</strong></div>
                <div>Original Invoice No: <strong>{selectedRecord.originalInvoiceNumber || '-'}</strong></div>
                <div>Original Invoice Date: <strong>{selectedRecord.originalInvoiceDate || '-'}</strong></div>
                <div>Place of Supply: <strong>{selectedRecord.pos}</strong></div>
                <div>Reverse Charge: <strong>{selectedRecord.reverseCharge}</strong></div>
                <div>Supplier Filing Period: <strong>{selectedRecord.filingPeriod}</strong></div>
                <div>Filing Date: <strong>{selectedRecord.filingDate}</strong></div>
                <div>ITC Availability: <strong>{selectedRecord.itcAvailability}</strong></div>
                <div>Remarks: <strong>{selectedRecord.reason || 'None'}</strong></div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#00a29b', color: '#ffffff' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Taxable Value</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>IGST</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>CGST</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>SGST</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Cess</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Total Invoice Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 600 }}>{fmt(selectedRecord.taxableValue)}</td>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{fmt(selectedRecord.igst)}</td>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{fmt(selectedRecord.cgst)}</td>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{fmt(selectedRecord.sgst)}</td>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{fmt(selectedRecord.cess)}</td>
                  <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, color: '#16325c' }}>{fmt(selectedRecord.invoiceValue)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{ backgroundColor: '#16325c', color: '#fff', border: 'none', padding: '6px 20px', borderRadius: '2px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADVISORY MODAL                                        */}
      {/* ============================================================== */}
      {advisoryOpen && (
        <Modal
          isOpen={true}
          onClose={() => setAdvisoryOpen(false)}
          title="Advisory — Form GSTR-2B (Static Statement)"
          size="md"
        >
          <div style={{ padding: '6px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
            <p><strong>1. Static Nature:</strong> GSTR-2B is an auto-drafted ITC statement generated on the 14th of every month based on GSTR-1, IFF, and GSTR-5 filed by suppliers up to the 13th.</p>
            <p><strong>2. IMS Integration:</strong> Taxpayers can take actions (Accept, Reject, Pending) on invoice records on the Invoice Management System (IMS) dashboard. Records marked as Rejected appear under the <em>ITC Rejected</em> section.</p>
            <p><strong>3. GSTR-3B Auto-Population:</strong> The eligible ITC figures shown in Part A will auto-populate Table 4 of Form GSTR-3B for the tax period.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setAdvisoryOpen(false)}
                style={{ backgroundColor: '#00a29b', color: '#fff', border: 'none', padding: '6px 18px', borderRadius: '2px', fontWeight: 600, cursor: 'pointer' }}
              >
                Understood
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: HELP MODAL                                            */}
      {/* ============================================================== */}
      {helpOpen && (
        <Modal
          isOpen={true}
          onClose={() => setHelpOpen(false)}
          title="GSTR-2B Help & Guidelines"
          size="md"
        >
          <div style={{ padding: '6px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
            <p><strong>How to view specific tables:</strong> Select any table category from the <em>"Select table to view details"</em> dropdown to view individual B2B, B2BA, Debit Note, Credit Note, or ISD records.</p>
            <p><strong>Exporting:</strong> Use <em>DOWNLOAD GSTR-2B SUMMARY (PDF)</em> for statutory filing records or <em>DOWNLOAD GSTR-2B DETAILS (EXCEL)</em> for spreadsheet verification.</p>
            <p><strong>Data Field Option:</strong> Click <em>+ ADD / ENTER INVOICE DATA</em> to manually key in invoices as per your requirements. All summary calculations will update instantly.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                style={{ backgroundColor: '#16325c', color: '#fff', border: 'none', padding: '6px 18px', borderRadius: '2px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
