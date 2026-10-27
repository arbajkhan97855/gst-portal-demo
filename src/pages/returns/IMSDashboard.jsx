import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function IMSDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'rejected'
  const [selectedIds, setSelectedIds] = useState([]);
  const [computing, setComputing] = useState(false);

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';

  const [invoices, setInvoices] = useState([
    {
      id: 'inv-1',
      supplierGstin: '07AAACG9821K1Z2',
      supplierName: 'Apex Global Logistics LLP',
      docType: 'Invoice',
      docNumber: 'APX/25/1044',
      docDate: '2025-01-14',
      taxableValue: 320000,
      totalTax: 57600,
      igst: 57600,
      cgst: 0,
      sgst: 0,
      action: 'Pending',
      gstr1FilingDate: '2025-01-18'
    },
    {
      id: 'inv-2',
      supplierGstin: '24AAECB8832L1Z4',
      supplierName: 'Bharat Electronics & Hardware Ltd',
      docType: 'Invoice',
      docNumber: 'BEH/9012',
      docDate: '2025-01-16',
      taxableValue: 450000,
      totalTax: 81000,
      igst: 0,
      cgst: 40500,
      sgst: 40500,
      action: 'Accepted',
      gstr1FilingDate: '2025-01-19'
    },
    {
      id: 'inv-3',
      supplierGstin: '27AABCT9982H1Z1',
      supplierName: 'Tech Cloud AWS India Pvt Ltd',
      docType: 'Invoice',
      docNumber: 'AWS-MUM-892',
      docDate: '2025-01-20',
      taxableValue: 125000,
      totalTax: 22500,
      igst: 22500,
      cgst: 0,
      sgst: 0,
      action: 'Accepted',
      gstr1FilingDate: '2025-01-21'
    },
    {
      id: 'inv-4',
      supplierGstin: '08BAPPG4412J1Z3',
      supplierName: 'Sunrise Textiles & Fabrics',
      docType: 'Credit Note',
      docNumber: 'CN/25/08',
      docDate: '2025-01-22',
      taxableValue: -50000,
      totalTax: -6000,
      igst: 0,
      cgst: -3000,
      sgst: -3000,
      action: 'Pending',
      gstr1FilingDate: '2025-01-24'
    },
    {
      id: 'inv-5',
      supplierGstin: '06AAACR1112D1Z9',
      supplierName: 'Reliance Polymers Pvt Ltd',
      docType: 'Invoice',
      docNumber: 'REL/25/441',
      docDate: '2025-01-10',
      taxableValue: 750000,
      totalTax: 135000,
      igst: 135000,
      cgst: 0,
      sgst: 0,
      action: 'Pending',
      gstr1FilingDate: '2025-01-12'
    }
  ]);

  const handleAction = (id, newAction) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, action: newAction } : inv)));
    toast.info('Action Updated', `Invoice ${id} marked as ${newAction}.`);
  };

  const handleBulkAction = (newAction) => {
    if (selectedIds.length === 0) {
      toast.warning('No Invoices Selected', 'Please select at least one invoice to perform bulk action.');
      return;
    }
    setInvoices(
      invoices.map((inv) => (selectedIds.includes(inv.id) ? { ...inv, action: newAction } : inv))
    );
    setSelectedIds([]);
    toast.success('Bulk Action Complete', `${selectedIds.length} invoice(s) marked as ${newAction}.`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredInvoices.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleComputeGstr2B = () => {
    setComputing(true);
    setTimeout(() => {
      setComputing(false);
      toast.success('GSTR-2B Recomputed', 'GSTR-2B draft recomputed incorporating your IMS invoice actions.');
    }, 1200);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeFilter === 'pending') return inv.action === 'Pending';
    if (activeFilter === 'accepted') return inv.action === 'Accepted';
    if (activeFilter === 'rejected') return inv.action === 'Rejected';
    return true;
  });

  const totalCount = invoices.length;
  const acceptedCount = invoices.filter((i) => i.action === 'Accepted').length;
  const rejectedCount = invoices.filter((i) => i.action === 'Rejected').length;
  const pendingCount = invoices.filter((i) => i.action === 'Pending').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'Invoice Management System (IMS) Dashboard' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Taxpayer Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', fontSize: '13px', color: '#1e293b' }}>
          <div>GSTIN: <strong>{gstin}</strong></div>
          <div>Legal Name: <strong>{legalName}</strong></div>
          <div>Period: <strong>January 2025 (FY 2025-26)</strong></div>
          <div>IMS Facility: <strong style={{ color: '#16a34a' }}>Active (Recipient View)</strong></div>
        </div>
      </div>

      {/* IMS Summary Header */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>
              Invoice Management System (IMS) Dashboard
            </h2>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Review invoices & credit notes saved/filed by suppliers and take action before 14th of the month to auto-populate GSTR-2B.
            </div>
          </div>
          <button
            type="button"
            onClick={handleComputeGstr2B}
            disabled={computing}
            style={{
              backgroundColor: '#173059',
              color: '#ffffff',
              border: 'none',
              borderRadius: '3px',
              padding: '9px 22px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} /> {computing ? 'Recomputing 2B...' : 'Recompute GSTR-2B'}
          </button>
        </div>

        {/* 4 Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '16px',
              border: activeFilter === 'all' ? '2px solid #173059' : '1px solid #cbd5e1',
              borderRadius: '4px',
              backgroundColor: '#f8fafc',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TOTAL INVOICES</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>{totalCount}</div>
          </div>
          <div
            onClick={() => setActiveFilter('accepted')}
            style={{
              padding: '16px',
              border: activeFilter === 'accepted' ? '2px solid #16a34a' : '1px solid #cbd5e1',
              borderRadius: '4px',
              backgroundColor: '#f0fdf4',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>ACCEPTED (ELIGIBLE IN 2B)</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>{acceptedCount}</div>
          </div>
          <div
            onClick={() => setActiveFilter('pending')}
            style={{
              padding: '16px',
              border: activeFilter === 'pending' ? '2px solid #ea580c' : '1px solid #cbd5e1',
              borderRadius: '4px',
              backgroundColor: '#fff7ed',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '12px', color: '#c2410c', fontWeight: 600 }}>NO ACTION TAKEN (PENDING)</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#ea580c', marginTop: '4px' }}>{pendingCount}</div>
          </div>
          <div
            onClick={() => setActiveFilter('rejected')}
            style={{
              padding: '16px',
              border: activeFilter === 'rejected' ? '2px solid #dc2626' : '1px solid #cbd5e1',
              borderRadius: '4px',
              backgroundColor: '#fef2f2',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: 600 }}>REJECTED (INELIGIBLE)</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#dc2626', marginTop: '4px' }}>{rejectedCount}</div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px 4px 0 0', padding: '12px 18px', borderBottom: 'none' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
          {selectedIds.length > 0 ? `${selectedIds.length} item(s) selected` : 'Select invoices to apply bulk actions:'}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleBulkAction('Accepted')}
            style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Accept Selected
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('Rejected')}
            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Reject Selected
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction('Pending')}
            style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Keep Pending
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '0 0 4px 4px', overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#173059', color: '#ffffff' }}>
              <th style={{ padding: '10px', width: '36px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedIds.length === filteredInvoices.length && filteredInvoices.length > 0}
                  style={{ width: '15px', height: '15px' }}
                />
              </th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Supplier Details</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Doc Type & No</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Taxable Val (₹)</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Tax Amount (₹)</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Action Status</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => {
              const isChecked = selectedIds.includes(inv.id);
              return (
                <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isChecked ? '#f0f9ff' : 'transparent' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedIds((prev) =>
                          prev.includes(inv.id) ? prev.filter((id) => id !== inv.id) : [...prev, inv.id]
                        );
                      }}
                      style={{ width: '15px', height: '15px' }}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{inv.supplierName}</div>
                    <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '11.5px' }}>{inv.supplierGstin}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ fontWeight: 600 }}>{inv.docType}</span>
                    <div style={{ fontFamily: 'monospace', color: '#0284c7' }}>{inv.docNumber}</div>
                  </td>
                  <td style={{ padding: '10px', color: '#475569' }}>{inv.docDate}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600 }}>
                    ₹{inv.taxableValue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                    ₹{inv.totalTax.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor:
                          inv.action === 'Accepted'
                            ? '#dcfce7'
                            : inv.action === 'Rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          inv.action === 'Accepted'
                            ? '#166534'
                            : inv.action === 'Rejected'
                            ? '#991b1b'
                            : '#92400e'
                      }}
                    >
                      {inv.action}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleAction(inv.id, 'Accepted')}
                        style={{ backgroundColor: '#15803d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(inv.id, 'Rejected')}
                        style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(inv.id, 'Pending')}
                        style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Pending
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
