import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Receipt,
  Plus,
  Trash2,
  Calculator,
  Eye,
  Printer,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function CreateInvoice() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { invoices, addInvoice, updateInvoice } = usePortalData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [saving, setSaving] = useState(false);
  const [invNumber, setInvNumber] = useState(`INV/24-25/08${Math.floor(50 + Math.random() * 40)}`);
  const [invDate, setInvDate] = useState('2025-02-28');
  const [customerName, setCustomerName] = useState('Infosys BPM Technologies');
  const [customerGstin, setCustomerGstin] = useState('29AAACI4749Q1ZM');
  const [billingAddress, setBillingAddress] = useState('Electronic City, Phase 1, Bengaluru, Karnataka - 560100');
  const [shippingAddress, setShippingAddress] = useState('Electronic City, Phase 1, Bengaluru, Karnataka - 560100');
  const [placeOfSupply, setPlaceOfSupply] = useState('Karnataka (29)');
  const [isInterState, setIsInterState] = useState(true);

  // Dynamic Product line items
  const [items, setItems] = useState([
    { id: 1, name: 'Custom AI Automation License', hsn: '998315', qty: 1, rate: 500000, discount: 25000, taxRate: 18 }
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);

  // Load existing invoice data if editing
  useEffect(() => {
    if (editId && invoices && invoices.length > 0) {
      const existing = invoices.find(inv => inv.id === editId || inv.invoiceNumber === editId);
      if (existing) {
        setInvNumber(existing.invoiceNumber || '');
        setInvDate(existing.date || '2025-02-28');
        setCustomerName(existing.customerName || '');
        setCustomerGstin(existing.customerGstin || '');
        setBillingAddress(existing.billingAddress || '');
        setShippingAddress(existing.shippingAddress || existing.billingAddress || '');
        setPlaceOfSupply(existing.placeOfSupply || 'Karnataka (29)');
        setIsInterState(
          existing.type ? existing.type.includes('Inter-State') : existing.placeOfSupply !== 'Maharashtra (27)'
        );
        if (Array.isArray(existing.items) && existing.items.length > 0) {
          setItems(existing.items.map((it, idx) => ({
            id: it.id || idx + 1,
            name: it.name || 'Service Item',
            hsn: it.hsn || '998314',
            qty: it.qty || 1,
            rate: it.rate || 0,
            discount: it.discount || 0,
            taxRate: it.taxRate || 18
          })));
        }
      }
    }
  }, [editId, invoices]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: 'IT Infrastructure Integration Service', hsn: '998314', qty: 1, rate: 100000, discount: 0, taxRate: 18 }
    ]);
  };

  const removeItem = (id) => {
    if (items.length <= 1) {
      toast.warning('Minimum Item Required', 'Invoice must have at least one product.');
      return;
    }
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // Calculations
  const calculateTotals = () => {
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    items.forEach(item => {
      const taxable = (item.qty * item.rate) - (item.discount || 0);
      totalTaxable += Math.max(0, taxable);

      if (isInterState) {
        totalIgst += (taxable * (item.taxRate / 100));
      } else {
        totalCgst += (taxable * ((item.taxRate / 2) / 100));
        totalSgst += (taxable * ((item.taxRate / 2) / 100));
      }
    });

    const totalTax = totalCgst + totalSgst + totalIgst;
    const grandTotal = totalTaxable + totalTax;

    return { totalTaxable, totalCgst, totalSgst, totalIgst, totalTax, grandTotal };
  };

  const totals = calculateTotals();

  const handleSaveInvoice = () => {
    setSaving(true);
    const invoicePayload = {
      invoiceNumber: invNumber,
      date: invDate,
      customerName,
      customerGstin,
      billingAddress,
      shippingAddress,
      placeOfSupply,
      type: isInterState ? 'B2B Inter-State' : 'B2B Intra-State',
      taxableAmount: totals.totalTaxable,
      cgst: totals.totalCgst,
      sgst: totals.totalSgst,
      igst: totals.totalIgst,
      totalAmount: totals.grandTotal,
      status: 'Issued',
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        hsn: i.hsn,
        qty: Number(i.qty),
        rate: Number(i.rate),
        discount: Number(i.discount || 0),
        taxRate: Number(i.taxRate)
      }))
    };

    if (editId) {
      updateInvoice(editId, invoicePayload);
    } else {
      addInvoice(invoicePayload);
    }

    setSaving(false);
    navigate('/invoices');
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Invoices', to: '/invoices' },
          { label: editId ? 'Edit Tax Invoice' : 'Create Tax Invoice' }
        ]}
      />
      <PageHeader
        title={editId ? `Edit GST Tax Invoice: ${invNumber}` : "Create GST Tax Invoice (Section 31)"}
        subtitle="Generate standard compliance tax invoices with dynamic HSN codes, multi-item tax computations, and print preview."
        actions={
          <button className="btn btn-primary" onClick={() => setPreviewOpen(true)}>
            <Eye size={16} /> Preview & Print Invoice
          </button>
        }
      />

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Invoice Header & Customer Particulars</span>
          <span className="badge badge-primary">Tax Invoice (Rule 46)</span>
        </div>
        <div className="card-body">
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Invoice Number <span className="required">*</span></label>
              <input
                type="text"
                className="form-control mono"
                value={invNumber}
                onChange={(e) => setInvNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Date <span className="required">*</span></label>
              <input
                type="date"
                className="form-control"
                value={invDate}
                onChange={(e) => setInvDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Place of Supply (POS) <span className="required">*</span></label>
              <select
                className="form-control"
                value={placeOfSupply}
                onChange={(e) => {
                  setPlaceOfSupply(e.target.value);
                  setIsInterState(e.target.value !== 'Maharashtra (27)');
                }}
              >
                <option value="Karnataka (29)">Karnataka (29) — Inter-State IGST</option>
                <option value="Maharashtra (27)">Maharashtra (27) — Intra-State CGST+SGST</option>
                <option value="Delhi (07)">Delhi (07) — Inter-State IGST</option>
                <option value="Gujarat (24)">Gujarat (24) — Inter-State IGST</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer Legal / Trade Name <span className="required">*</span></label>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Customer GSTIN (15-digit)</label>
              <input
                type="text"
                className="form-control mono"
                maxLength={15}
                value={customerGstin}
                onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29AAACI4749Q1ZM"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Billing Address</label>
              <textarea
                className="form-control"
                rows={2}
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shipping / Consignee Address</label>
              <textarea
                className="form-control"
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Products / Line Items Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Goods / Services Line Items</span>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={addItem}>
            <Plus size={14} /> Add Line Item
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product / Service Description</th>
                  <th style={{ width: '110px' }}>HSN/SAC</th>
                  <th style={{ width: '80px' }} className="numeric">Qty</th>
                  <th style={{ width: '130px' }} className="numeric">Rate (₹)</th>
                  <th style={{ width: '110px' }} className="numeric">Discount (₹)</th>
                  <th style={{ width: '100px' }} className="numeric">GST Rate</th>
                  <th className="numeric">Net Taxable (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const net = (item.qty * item.rate) - (item.discount || 0);
                  return (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control mono"
                          value={item.hsn}
                          onChange={(e) => updateItem(item.id, 'hsn', e.target.value)}
                        />
                      </td>
                      <td className="numeric">
                        <input
                          type="number"
                          className="form-control numeric"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="numeric">
                        <input
                          type="number"
                          className="form-control numeric"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="numeric">
                        <input
                          type="number"
                          className="form-control numeric"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="numeric">
                        <select
                          className="form-control"
                          value={item.taxRate}
                          onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value))}
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </td>
                      <td className="numeric mono" style={{ fontWeight: 700 }}>
                        ₹{net.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Strip */}
        <div className="card-footer" style={{ justifyContent: 'flex-end', gap: '32px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Net Taxable Value: </span>
            <strong className="mono">₹{totals.totalTaxable.toLocaleString('en-IN')}</strong>
          </div>
          {isInterState ? (
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Integrated Tax (IGST): </span>
              <strong className="mono" style={{ color: 'var(--primary)' }}>₹{totals.totalIgst.toLocaleString('en-IN')}</strong>
            </div>
          ) : (
            <>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CGST: </span>
                <strong className="mono">₹{totals.totalCgst.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SGST: </span>
                <strong className="mono">₹{totals.totalSgst.toLocaleString('en-IN')}</strong>
              </div>
            </>
          )}
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Invoice Grand Total: </span>
            <strong className="mono" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
              ₹{totals.grandTotal.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Link to="/invoices" className="btn btn-outline">
          Cancel
        </Link>
        <button type="button" className="btn btn-primary btn-lg" onClick={handleSaveInvoice} disabled={saving}>
          {editId ? 'Update Invoice' : 'Save & Issue Invoice'} <ArrowRight size={18} />
        </button>
      </div>

      {/* Invoice Preview & Print Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`Tax Invoice Preview: ${invNumber}`}
        size="xl"
        footer={
          <>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                window.print();
              }}
            >
              <Printer size={16} /> Print Tax Invoice
            </button>
            <button className="btn btn-primary" onClick={() => setPreviewOpen(false)}>
              Close Preview
            </button>
          </>
        }
      >
        <div className="invoice-paper">
          <div className="invoice-header-row">
            <div>
              <div className="invoice-badge-title">TAX INVOICE</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Issued under Rule 46 of CGST Rules, 2017</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '12px', color: 'var(--primary)' }}>
                {currentUser.businessName}
              </div>
              <div style={{ fontSize: '0.85rem' }}>{currentUser.address}</div>
              <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>GSTIN: {currentUser.gstin}</div>
              <div className="mono" style={{ fontSize: '0.85rem' }}>PAN: {currentUser.pan}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Invoice #: {invNumber}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date: {invDate}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Place of Supply: {placeOfSupply}</div>
            </div>
          </div>

          {/* Bill to */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bill To:</strong>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{customerName}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{billingAddress}</div>
              <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>
                GSTIN: {customerGstin || 'Unregistered'}
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--surface-alt)', borderRadius: '6px' }}>
              <strong style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ship To:</strong>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '4px' }}>{customerName}</div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{shippingAddress}</div>
            </div>
          </div>

          {/* Items */}
          <table className="table" style={{ border: '1px solid var(--border)', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>HSN/SAC</th>
                <th className="numeric">Qty</th>
                <th className="numeric">Rate (₹)</th>
                <th className="numeric">Taxable (₹)</th>
                <th className="numeric">GST</th>
                <th className="numeric">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const taxable = (it.qty * it.rate) - (it.discount || 0);
                const tax = (taxable * it.taxRate) / 100;
                return (
                  <tr key={it.id}>
                    <td>{idx + 1}</td>
                    <td><strong>{it.name}</strong></td>
                    <td className="mono">{it.hsn}</td>
                    <td className="numeric">{it.qty}</td>
                    <td className="numeric">₹{it.rate.toLocaleString('en-IN')}</td>
                    <td className="numeric">₹{taxable.toLocaleString('en-IN')}</td>
                    <td className="numeric">{it.taxRate}%</td>
                    <td className="numeric mono" style={{ fontWeight: 700 }}>₹{(taxable + tax).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Grand Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Taxable Value:</span>
                <strong className="mono">₹{totals.totalTaxable.toLocaleString('en-IN')}</strong>
              </div>
              {isInterState ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Integrated Tax (IGST):</span>
                  <strong className="mono">₹{totals.totalIgst.toLocaleString('en-IN')}</strong>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CGST:</span>
                    <strong className="mono">₹{totals.totalCgst.toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SGST:</span>
                    <strong className="mono">₹{totals.totalSgst.toLocaleString('en-IN')}</strong>
                  </div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #1e3a66', paddingTop: '8px', fontSize: '1.15rem' }}>
                <span style={{ fontWeight: 800 }}>Invoice Total:</span>
                <strong className="mono" style={{ color: 'var(--primary)' }}>₹{totals.grandTotal.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>This is a digitally generated computer invoice requiring no physical signature.</div>
            <div>Authorized Signatory for {currentUser.businessName}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
