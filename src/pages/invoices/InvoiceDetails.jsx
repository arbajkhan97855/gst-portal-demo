import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Receipt, ArrowLeft, Printer, Download, CheckCircle2, Building } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_INVOICES } from '../../data/portalData';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { downloadTaxInvoice } from '../../utils/downloadHelpers';

export default function InvoiceDetails() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { invoices } = usePortalData();
  const invoiceId = searchParams.get('id') || 'INV-2024-001';

  const invoice = (invoices && invoices.find(i => i.id === invoiceId || i.invoiceNumber === invoiceId)) ||
    SAMPLE_INVOICES.find(i => i.id === invoiceId) ||
    SAMPLE_INVOICES[0];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Invoices', to: '/invoices' }, { label: invoice.invoiceNumber }]} />
      <PageHeader
        title={`Tax Invoice: ${invoice.invoiceNumber}`}
        subtitle={`Issued on ${invoice.date} to ${invoice.customerName}`}
        actions={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/invoices" className="btn btn-outline">
              <ArrowLeft size={16} /> Back to Invoices
            </Link>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                downloadTaxInvoice(invoice, currentUser, true);
                toast.info('Print Dialog', `Opening print preview for ${invoice.invoiceNumber}`);
              }}
            >
              <Printer size={16} /> Print
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                downloadTaxInvoice(invoice, currentUser, false);
                toast.success('Downloaded', `Saved ${invoice.invoiceNumber}.html (Print to PDF ready)`);
              }}
            >
              <Download size={16} /> Download PDF / HTML
            </button>
          </div>
        }
      />

      <div className="invoice-paper">
        <div className="invoice-header-row">
          <div>
            <div className="invoice-badge-title">TAX INVOICE</div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '12px', color: 'var(--primary)' }}>
              {currentUser.businessName}
            </div>
            <div style={{ fontSize: '0.85rem' }}>{currentUser.address}</div>
            <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>GSTIN: {currentUser.gstin}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Invoice #: {invoice.invoiceNumber}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {invoice.date}</div>
            <span className={`badge ${invoice.status === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '8px' }}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '6px' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Billed To:</strong>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{invoice.customerName}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{invoice.billingAddress}</div>
            <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>
              GSTIN: {invoice.customerGstin}
            </div>
          </div>
        </div>

        <table className="table" style={{ border: '1px solid var(--border)', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>HSN/SAC</th>
              <th className="numeric">Qty</th>
              <th className="numeric">Rate (₹)</th>
              <th className="numeric">Taxable (₹)</th>
              <th className="numeric">GST</th>
              <th className="numeric">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((it, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td><strong>{it.name}</strong></td>
                <td className="mono">{it.hsn}</td>
                <td className="numeric">{it.qty}</td>
                <td className="numeric">₹{it.rate.toLocaleString('en-IN')}</td>
                <td className="numeric">₹{invoice.taxableAmount.toLocaleString('en-IN')}</td>
                <td className="numeric">{it.taxRate}%</td>
                <td className="numeric mono" style={{ fontWeight: 700 }}>₹{invoice.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Taxable Value:</span>
              <strong className="mono">₹{invoice.taxableAmount.toLocaleString('en-IN')}</strong>
            </div>
            {invoice.igst > 0 ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Integrated Tax (IGST):</span>
                <strong className="mono">₹{invoice.igst.toLocaleString('en-IN')}</strong>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Central Tax (CGST):</span>
                  <strong className="mono">₹{invoice.cgst.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>State Tax (SGST):</span>
                  <strong className="mono">₹{invoice.sgst.toLocaleString('en-IN')}</strong>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #1e3a66', paddingTop: '8px', fontSize: '1.15rem' }}>
              <span style={{ fontWeight: 800 }}>Invoice Total:</span>
              <strong className="mono" style={{ color: 'var(--primary)' }}>₹{invoice.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
