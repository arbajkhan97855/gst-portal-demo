import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Plus } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function DebitNote() {
  const { toast } = useNotification();
  const [formOpen, setFormOpen] = useState(false);

  const [notes, setNotes] = useState([
    { id: 1, dbnNo: 'DBN/24-25/0008', date: '22-Feb-2025', origInv: 'INV/24-25/0844', customer: 'Reliance Retail Ventures', reason: 'Upward Price Revision (Server Components)', taxable: 20000, tax: 3600, total: 23600 }
  ]);

  const [form, setForm] = useState({
    dbnNo: 'DBN/24-25/0009',
    date: '2025-02-28',
    origInv: 'INV/24-25/0845',
    customer: 'Aaditya Digital Systems',
    reason: 'Upward Price Revision',
    taxable: '12000',
    taxRate: 18
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const taxVal = (parseFloat(form.taxable) || 0) * (form.taxRate / 100);
    const newNote = {
      id: Date.now(),
      dbnNo: form.dbnNo,
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
    toast.success('Debit Note Issued', `Debit Note ${form.dbnNo} generated successfully.`);
  };

  const columns = [
    { header: 'Debit Note No.', field: 'dbnNo', render: (v) => <strong>{v}</strong> },
    { header: 'Original Invoice', field: 'origInv', render: (v) => <span className="mono">{v}</span> },
    { header: 'Date', field: 'date' },
    { header: 'Customer Entity', field: 'customer' },
    { header: 'Reason for Issue', field: 'reason' },
    { header: 'Additional Taxable (₹)', field: 'taxable', numeric: true, render: (v) => `+₹${v.toLocaleString('en-IN')}` },
    { header: 'Additional Tax (₹)', field: 'tax', numeric: true, render: (v) => <span style={{ color: 'var(--primary)', fontWeight: 600 }}>+₹${v.toLocaleString('en-IN')}</span> },
    { header: 'Net Debit Total (₹)', field: 'total', numeric: true, render: (v) => <strong style={{ color: 'var(--primary)' }}>+₹${v.toLocaleString('en-IN')}</strong> }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Invoices', to: '/invoices' }, { label: 'Debit Notes (Section 34)' }]} />
      <PageHeader
        title="Debit Notes Register (Section 34)"
        subtitle="Issue supplementary debit notes for upward price escalation and additional tax liability."
        actions={
          <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> Issue New Debit Note
          </button>
        }
      />

      {formOpen && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <span className="card-title">Create Debit Note (Form GST INV-03)</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreate}>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Debit Note Number</label>
                  <input
                    type="text"
                    className="form-control mono"
                    value={form.dbnNo}
                    onChange={(e) => setForm({ ...form, dbnNo: e.target.value })}
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
                    <option value="Upward Price Revision">Upward Price Revision</option>
                    <option value="Extra Goods Supplied">Extra Goods / Services Supplied</option>
                    <option value="Exchange Rate Fluctuations">Exchange Rate Adjustment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Taxable Value (₹)</label>
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
