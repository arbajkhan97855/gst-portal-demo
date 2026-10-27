import React, { useState } from 'react';
import { Users, Search, Eye, Power, CheckCircle2, ShieldAlert } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { SAMPLE_TAXPAYERS } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function AdminUsers() {
  const { toast } = useNotification();
  const { taxpayers: portalTaxpayers, updateTaxpayer } = usePortalData();
  const taxpayers = portalTaxpayers || SAMPLE_TAXPAYERS;
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleStatus = (gstin) => {
    const user = taxpayers.find(t => t.gstin === gstin);
    if (!user) return;
    const nextStatus = user.status.includes('Active') ? 'Suspended (Officer Order)' : 'Active';
    updateTaxpayer(gstin, { status: nextStatus });
    toast.info('Status Updated', `${user.tradeName} status updated to ${nextStatus}`);
  };

  const filtered = taxpayers.filter(t =>
    t.legalName.toLowerCase().includes(search.toLowerCase()) ||
    t.gstin.toLowerCase().includes(search.toLowerCase()) ||
    t.tradeName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: 'GSTIN Identifier', field: 'gstin', render: (v) => <span className="mono"><strong>{v}</strong></span> },
    { header: 'Legal Entity Name', field: 'legalName' },
    { header: 'Trade Name', field: 'tradeName' },
    { header: 'State Jurisdiction', field: 'state', render: (v, r) => `${v} (${r.stateCode})` },
    { header: 'Taxpayer Type', field: 'taxpayerType' },
    {
      header: 'Status',
      field: 'status',
      render: (v) => (
        <span className={`badge ${v.includes('Active') ? 'badge-success' : 'badge-danger'}`}>
          {v}
        </span>
      )
    },
    { header: 'Rating', field: 'complianceRating', render: (v) => <span className="badge badge-primary">{v}</span> }
  ];

  return (
    <div>
      <PageHeader
        title="Taxpayer Account Management"
        subtitle="Inspect registered taxpayers, monitor compliance ratings, and initiate statutory suspensions or reactivations."
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
              placeholder="Search by Legal Name, Trade Name or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedUser(row)}
                  title="View Profile"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  className={`btn btn-sm ${row.status.includes('Active') ? 'btn-outline-primary' : 'btn-success'}`}
                  onClick={() => toggleStatus(row.gstin)}
                  title="Toggle Status"
                >
                  <Power size={14} /> {row.status.includes('Active') ? 'Suspend' : 'Activate'}
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title={`Taxpayer Record: ${selectedUser.legalName}`}
          size="md"
          footer={
            <button className="btn btn-primary" onClick={() => setSelectedUser(null)}>
              Close
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>GSTIN:</span>
              <strong className="mono">{selectedUser.gstin}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>PAN:</span>
              <strong className="mono">{selectedUser.pan}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>Constitution:</span>
              <strong>{selectedUser.constitution}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>District Jurisdiction:</span>
              <strong>{selectedUser.district} - {selectedUser.pincode}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span>Registration Date:</span>
              <strong>{selectedUser.registrationDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Current Status:</span>
              <span className={`badge ${selectedUser.status.includes('Active') ? 'badge-success' : 'badge-danger'}`}>
                {selectedUser.status}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
