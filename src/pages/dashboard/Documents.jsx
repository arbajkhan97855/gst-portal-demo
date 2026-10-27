import React, { useState } from 'react';
import { FileText, Eye, Download, Printer, Search, Folder, Check } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useNotification } from '../../context/NotificationContext';

export default function Documents() {
  const { toast } = useNotification();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const docs = [
    {
      id: 'doc-1',
      category: 'certificates',
      title: 'Registration Certificate (Form GST REG-06)',
      date: '12-Jul-2017',
      ref: 'GST-REG-06-27AABCS1429B1Z8',
      type: 'Official Certificate'
    },
    {
      id: 'doc-2',
      category: 'returns',
      title: 'GSTR-1 Outward Supplies Filing Copy (Jan 2025)',
      date: '09-Feb-2025',
      ref: 'AA2701250102938',
      type: 'Statutory Return'
    },
    {
      id: 'doc-3',
      category: 'returns',
      title: 'GSTR-3B Summary Return Acknowledgment (Jan 2025)',
      date: '18-Feb-2025',
      ref: 'AA2701250119284',
      type: 'Statutory Return'
    },
    {
      id: 'doc-4',
      category: 'challans',
      title: 'Payment Challan Receipt (CIN: SBIN25022700142984)',
      date: '18-Feb-2025',
      ref: 'CPIN-25022700142984',
      type: 'Cash Receipt'
    },
    {
      id: 'doc-5',
      category: 'notices',
      title: 'Intimation Notice under Section 73 (SCN/2025/081)',
      date: '10-Feb-2025',
      ref: 'GST/27/AC/SCN/2025/081',
      type: 'Departmental Notice'
    },
    {
      id: 'doc-6',
      category: 'refunds',
      title: 'Refund Application RFD-01 Acknowledgment Slip',
      date: '02-Feb-2025',
      ref: 'AA2709240031950',
      type: 'Refund Application'
    }
  ];

  const filtered = activeCategory === 'all'
    ? docs
    : docs.filter(d => d.category === activeCategory);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Document Repository' }]} />
      <PageHeader
        title="Taxpayer Document Center"
        subtitle="Secure digital vault of all issued registration certificates, return summaries, challan receipts, notices, and refund applications."
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          { id: 'all', label: 'All Documents' },
          { id: 'certificates', label: 'Registration Certificates' },
          { id: 'returns', label: 'Return Summaries' },
          { id: 'challans', label: 'Payment Challans' },
          { id: 'notices', label: 'Notices & Orders' },
          { id: 'refunds', label: 'Refund Files' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map(doc => (
          <div key={doc.id} className="card">
            <div className="card-header">
              <div className="card-title" style={{ fontSize: '0.95rem' }}>
                <FileText size={18} className="text-primary" />
                <span>{doc.type}</span>
              </div>
              <span className="badge badge-neutral">{doc.date}</span>
            </div>
            <div className="card-body">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                {doc.title}
              </h4>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Ref: {doc.ref}
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedDoc(doc)}
              >
                <Eye size={14} /> View
              </button>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => toast.success('Printed', `Printing ${doc.title}`)}
                >
                  <Printer size={14} /> Print
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => toast.success('Downloaded', `Saved ${doc.title} to local disk.`)}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDoc(null)}
          title={`Document Viewer: ${selectedDoc.title}`}
          size="lg"
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedDoc(null)}>
              Close Viewer
            </button>
          }
        >
          <div style={{
            background: 'var(--surface-alt)',
            padding: '24px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <strong>Reference Number:</strong>
              <span className="mono">{selectedDoc.ref}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <strong>Date Generated:</strong>
              <span>{selectedDoc.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <strong>Document Classification:</strong>
              <span>{selectedDoc.type}</span>
            </div>
            <div style={{ padding: '16px', background: '#fff', border: '1px dashed var(--border)', borderRadius: '6px', textAlign: 'center', marginTop: '12px' }}>
              <FileText size={48} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedDoc.title}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Digitally authenticated and stored in the GST Tax Services Portal Document Center.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
