import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CreditCard,
  Trash2,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function SavedChallans() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const navigate = useNavigate();
  const { savedChallans, deleteSavedChallan } = usePortalData();

  const [deleteModal, setDeleteModal] = useState(null);

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteSavedChallan(deleteModal.id);
    toast.success('Challan Deleted', `Draft challan ${deleteModal.cpin} has been removed.`);
    setDeleteModal(null);
  };

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* Breadcrumb & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Services', to: '/services' },
            { label: 'Payments', to: '/payments' },
            { label: 'Saved Challans' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#16325c',
            color: '#ffffff',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Saved Challans</h1>
            <p style={{ fontSize: '12px', margin: '3px 0 0', opacity: 0.85 }}>
              Draft challans are retained for 15 days from creation date before expiry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/payments/challan')}
            style={{
              backgroundColor: '#0e8a7d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '2px',
              padding: '7px 18px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} /> CREATE NEW CHALLAN
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {savedChallans.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>No Saved Challans Found</div>
              <p style={{ fontSize: '13px', margin: 0 }}>
                You do not have any pending draft challans. Click "CREATE NEW CHALLAN" to initiate a tax payment.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>CPIN / Draft ID</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Description</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Created Date</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Valid Till</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Total Amount</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedChallans.map((challan, idx) => (
                    <tr
                      key={challan.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                      }}
                    >
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace', fontWeight: 700, color: '#16325c' }}>
                        {challan.cpin}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                        {challan.reason}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#334155' }}>
                        {challan.createdDate}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', color: '#dc2626', fontWeight: 600 }}>
                        {challan.expiryDate}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                        {formatCurrency(challan.totalAmount)}
                      </td>
                      <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <span
                          style={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '11.5px',
                            fontWeight: 700
                          }}
                        >
                          {challan.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => navigate('/payments/challan')}
                            style={{
                              backgroundColor: '#16325c',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '2px',
                              padding: '5px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            PAY NOW
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModal(challan)}
                            style={{
                              backgroundColor: '#ffffff',
                              color: '#dc2626',
                              border: '1px solid #fecdd3',
                              borderRadius: '2px',
                              padding: '5px 8px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                            title="Delete Draft Challan"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteModal(null)}
          title="Delete Saved Challan"
          size="sm"
        >
          <div style={{ padding: '8px 4px' }}>
            <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, marginBottom: '20px' }}>
              Are you sure you want to permanently delete draft challan <strong>{deleteModal.cpin}</strong> for amount <strong>{formatCurrency(deleteModal.totalAmount)}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#16325c',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '7px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '2px',
                  padding: '7px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
