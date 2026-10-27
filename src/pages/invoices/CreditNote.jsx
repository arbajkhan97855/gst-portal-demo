import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Receipt, Plus, ArrowLeft, ArrowRight, Save, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function CreditNote() {
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([
    { id: 1, cdnNo: 'CDN/24-25/0014', date: '20-Feb-2025', origInv: 'INV/24-25/0842', customer: 'Tata Consultancy & Infra Works', reason: 'Post-Sale Volume Discount', taxable: 25000, tax: 4500, total: 29500 }
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    cdnNo: 'CDN/24-25/0015',
    date: '2025-02-28',
    origInv: 'INV/24-25/0843',
    customer: 'Infosys BPM Technologies',
    reason: 'Deficiency in Service',
    taxable: '15000',
    taxRate: 18
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const taxVal = (parseFloat(form.taxable) || 0) * (form.taxRate / 100);
    const newNote = {
      id: Date.now(),
      cdnNo: form.cdnNo,
      date: form.date,
      origInv: form.origInv,
      customer: form.customer,
      reason: form.reason,
      taxable: parseFloat(form.taxable) || 0,
      tax: taxVal,
      total: (parseFloat(form.taxable) || 0) + taxVal
    };
    setNotes([newNote, ...notes]);
    setFormOpen(false);
    toast.success('Credit Note Issued', `Credit Note ${form.cdnNo} generated successfully.`);
  };

  const columns = [
    { header: 'Credit Note No.', field: 'cdnNo', render: (v) => <strong>{v}</strong> },
    { header: 'Original Invoice', field: 'origInv', render: (v) => <span className="mono">{v}</span> },
    { header: 'Date', field: 'date' },
    { header: 'Customer Entity', field: 'customer' },
    { header: 'Reason for Issue', field: 'reason' },
    { header: 'Taxable Reduction (₹)', field: 'taxable', numeric: true, render: (v) => `-₹${v.toLocaleString('en-IN')}` },
    { header: 'Tax Reversal (₹)', field: 'tax', numeric: true, render: (v) => <span style={{ color: 'var(--danger)', fontWeight: 600 }}>-₹{v.toLocaleString('en-IN')}</span> },
    { header: 'Net Credit Total (₹)', field: 'total', numeric: true, render: (v) => <strong style={{ color: 'var(--primary)' }}>-₹{v.toLocaleString('en-IN')}</strong> }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Invoices', to: '/invoices' }, { label: 'Credit Notes (Section 34)' }]} />
      <PageHeader
        title="Credit Notes Register (Section 34)"
        subtitle="Issue credit notes for sales returns, post-sale volume discounts, and reductions in taxable supply value."
        actions={
          <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> Issue New Credit Note
          </button>
        }
      />

      {formOpen && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <span className="card-title">Create Credit Note (Form GST INV-02)</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Credit Note Number</label>
                  <input
                    type="text"
                    className="form-control mono"
                    value={form.cdnNo}
                    onChange={(e) => setForm({ ...form, cdnNo: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Issue</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Tax Invoice Ref</label>
                  <input
                    type="text"
                    className="form-control mono"
                    value={form.origInv}
                    onChange={(e) => setForm({ ...form, origInv: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.customer}
                    onChange={(e) => setForm({ ...form, customer: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Note</label>
                  <select
                    className="form-control"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  >
                    <option value="Deficiency in Service">Deficiency in Service</option>
                    <option value="Sales Return of Goods">Sales Return of Goods</option>
                    <option value="Post-Sale Volume Discount">Post-Sale Volume Discount</option>
                    <option value="Clerical Correction">Correction of Invoice Value</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Taxable Value Reduction (₹)</label>
                  <input
                    type="number"
                    className="form-control mono"
                    value={form.taxable}
                    onChange={(e) => setForm({ ...form, taxable: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Issue Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={notes}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
}
