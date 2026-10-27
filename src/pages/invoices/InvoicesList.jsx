import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, Plus, Eye, Printer, Download, Search, Filter, Edit3, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { useAuth } from '../../context/AuthContext';
import { downloadCsv, downloadTaxInvoice } from '../../utils/downloadHelpers';

export default function InvoicesList() {
  const { toast } = useNotification();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { invoices, deleteInvoice } = usePortalData();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = (invoices || []).filter(inv =>
    (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inv.customerName && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (inv.customerGstin && inv.customerGstin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCsv = () => {
    const headers = [
      'Invoice Number',
      'Date',
      'Customer Entity',
      'Customer GSTIN',
      'Invoice Type',
      'Taxable Amount (₹)',
      'CGST (₹)',
      'SGST (₹)',
      'IGST (₹)',
      'Total Value (₹)',
      'Status'
    ];

    const rows = filtered.map(i => [
      i.invoiceNumber,
      i.date,
      i.customerName,
      i.customerGstin,
      i.type,
      i.taxableAmount,
      i.cgst || 0,
      i.sgst || 0,
      i.igst || 0,
      i.totalAmount,
      i.status
    ]);

    downloadCsv(`GST_Invoices_Register_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    toast.success('Invoices Exported', `${filtered.length} invoice records downloaded as CSV.`);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    deleteInvoice(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  const columns = [
    { header: 'Invoice No.', field: 'invoiceNumber', render: (val, row) => <strong>{val}</strong> },
    { header: 'Date', field: 'date' },
    { header: 'Customer Entity', field: 'customerName' },
    { header: 'Customer GSTIN', field: 'customerGstin', render: (v) => <span className="mono">{v}</span> },
    { header: 'Type', field: 'type', render: (v) => <span className="badge badge-primary">{v}</span> },
    { header: 'Taxable (₹)', field: 'taxableAmount', numeric: true, render: (v) => `₹${Number(v || 0).toLocaleString('en-IN')}` },
    {
      header: 'Total Value (₹)',
      field: 'totalAmount',
      numeric: true,
      render: (v) => <strong style={{ color: 'var(--primary)' }}>₹{Number(v || 0).toLocaleString('en-IN')}</strong>
    },
    {
      header: 'Status',
      field: 'status',
      render: (val) => (
        <span className={`badge ${val === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Invoices' }]} />
      <PageHeader
        title="Tax Invoices Management"
        subtitle="Create, edit, delete, print, and track GST-compliant sales invoices stored directly in local storage."
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportCsv}
              title="Download CSV Spreadsheet"
            >
              <Download size={16} /> Export CSV
            </button>
            <Link to="/invoices/credit-note" className="btn btn-outline">
              Credit Notes
            </Link>
            <Link to="/invoices/debit-note" className="btn btn-outline">
              Debit Notes
            </Link>
            <Link to="/invoices/create" className="btn btn-primary">
              <Plus size={16} /> Create Tax Invoice
            </Link>
          </div>
        }
      />

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div className="input-affix-wrapper">
            <span className="input-prefix">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control has-prefix"
              placeholder="Search by Invoice number, Customer Name or GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={filtered}
            pageSize={10}
            actions={(row) => (
              <div style={{ display: 'flex', gap: '6px' }}>
                <Link
                  to={`/invoices/details?id=${row.id}`}
                  className="btn btn-outline btn-sm"
                  title="View Invoice"
                >
                  <Eye size={14} /> View
                </Link>
                <Link
                  to={`/invoices/create?edit=${encodeURIComponent(row.id)}`}
                  className="btn btn-outline-primary btn-sm"
                  title="Edit Invoice"
                >
                  <Edit3 size={14} /> Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => downloadTaxInvoice(row, currentUser, true)}
                  title="Print Invoice"
                >
                  <Printer size={14} />
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => downloadTaxInvoice(row, currentUser, false)}
                  title="Download File"
                >
                  <Download size={14} />
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--danger)', borderColor: 'var(--border)' }}
                  onClick={() => setDeleteConfirm(row)}
                  title="Delete Invoice"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Invoice Record"
          size="sm"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete Invoice
              </button>
            </>
          }
        >
          <div style={{ padding: '8px 0', fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6' }}>
            Are you sure you want to permanently delete invoice <strong>{deleteConfirm.invoiceNumber}</strong> issued to <strong>{deleteConfirm.customerName}</strong>?
            This will immediately remove it from your local storage records.
          </div>
        </Modal>
      )}
    </div>
  );
}
