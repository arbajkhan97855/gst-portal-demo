import React, { useState } from 'react';
import { BellRing, Plus, Trash2, Eye, Send, Check } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { SAMPLE_NOTICES } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function AdminNotices() {
  const { toast } = useNotification();
  const { notices: portalNotices, addNotice, deleteNotice } = usePortalData();
  const notices = portalNotices || SAMPLE_NOTICES;
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    noticeNumber: `GST/27/AC/SCN/2025/0${Math.floor(82 + Math.random() * 20)}`,
    section: 'Section 73(1)',
    subject: 'Show Cause Notice regarding Input Tax Credit mismatch in GSTR-2B',
    dueDate: '2025-03-31',
    amountInvolved: '35000',
    details: 'Discrepancy observed between outward supply filed by inward vendor and credit claimed in Table 4.'
  });

  const handleCreateNotice = (e) => {
    e.preventDefault();
    const newNotice = {
      id: `NOT-${Date.now()}`,
      noticeNumber: form.noticeNumber,
      section: form.section,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      subject: form.subject,
      issuingAuthority: 'Assistant Commissioner of State Tax, Circle-3, Mumbai',
      dueDate: form.dueDate,
      status: 'New',
      amountInvolved: parseFloat(form.amountInvolved) || 0,
      details: form.details
    };
    addNotice(newNotice);
    setModalOpen(false);
    toast.success('Notice Issued', `Notice ${form.noticeNumber} dispatched to taxpayer.`);
  };

  const handleDelete = (id) => {
    deleteNotice(id);
    toast.info('Deleted', 'Notice draft removed.');
  };

  const columns = [
    { header: 'Notice No.', field: 'noticeNumber', render: (v) => <span className="mono"><strong>{v}</strong></span> },
    { header: 'Section', field: 'section', render: (v) => <span className="badge badge-primary">{v}</span> },
    { header: 'Date', field: 'date' },
    { header: 'Subject', field: 'subject' },
    { header: 'Demanded (₹)', field: 'amountInvolved', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    {
      header: 'Status',
      field: 'status',
      render: (v) => <span className={`badge ${v === 'New' ? 'badge-danger' : 'badge-warning'}`}>{v}</span>
    }
  ];

  return (
    <div>
      <PageHeader
        title="Departmental Notice & Order Management"
        subtitle="Draft, issue, and adjudicate statutory show cause notices (DRC-01) and assessment orders."
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Issue Statutory Notice
          </button>
        }
      />

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={notices}
            pageSize={10}
            actions={(row) => (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDelete(row.id)}
                title="Delete"
              >
                <Trash2 size={14} color="var(--danger)" />
              </button>
            )}
          />
        </div>
      </div>

      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title="Draft & Issue Notice (Form GST DRC-01)"
          size="md"
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateNotice}>
                Publish & Dispatch Notice
              </button>
            </>
          }
        >
          <form onSubmit={handleCreateNotice}>
            <div className="form-group">
              <label className="form-label">Notice Reference Number</label>
              <input
                type="text"
                className="form-control mono"
                value={form.noticeNumber}
                onChange={(e) => setForm({ ...form, noticeNumber: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Governing Section</label>
                <select
                  className="form-control"
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                >
                  <option value="Section 73(1)">Section 73(1) Non-Fraud Scrutiny</option>
                  <option value="Section 74(1)">Section 74(1) Willful Misstatement</option>
                  <option value="Rule 88C">Rule 88C (GSTR-1 vs 3B)</option>
                  <option value="Rule 88D">Rule 88D (GSTR-2B vs 3B)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Response Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tax Demanded (₹)</label>
              <input
                type="number"
                className="form-control mono"
                value={form.amountInvolved}
                onChange={(e) => setForm({ ...form, amountInvolved: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Statutory Grounds & Officer Findings</label>
              <textarea
                className="form-control"
                rows={3}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
