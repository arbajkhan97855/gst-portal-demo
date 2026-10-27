import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  KeyRound,
  FileBadge,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useNotification();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    name: currentUser.name || '',
    businessName: currentUser.businessName || '',
    tradeName: currentUser.tradeName || '',
    email: currentUser.email || '',
    mobile: currentUser.mobile || '',
    address: currentUser.address || ''
  });

  useEffect(() => {
    setEditForm({
      name: currentUser.name || '',
      businessName: currentUser.businessName || '',
      tradeName: currentUser.tradeName || '',
      email: currentUser.email || '',
      mobile: currentUser.mobile || '',
      address: currentUser.address || ''
    });
  }, [currentUser]);

  const [pwdForm, setPwdForm] = useState({
    oldPwd: '',
    newPwd: '',
    confirmPwd: ''
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setEditModalOpen(false);
    toast.success('Profile Updated', 'Taxpayer particulars have been updated successfully.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      toast.error('Validation Error', 'New password and confirmation do not match.');
      return;
    }
    setPwdModalOpen(false);
    setPwdForm({ oldPwd: '', newPwd: '', confirmPwd: '' });
    toast.success('Password Changed', 'Your security password has been changed successfully.');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Taxpayer Profile' }]} />
      <PageHeader
        title="Taxpayer Profile & Business Details"
        subtitle="Manage registered entity details, contact information, and principal place of business."
        actions={
          <>
            <button className="btn btn-outline" onClick={() => setPwdModalOpen(true)}>
              <KeyRound size={16} /> Change Password
            </button>
            <button className="btn btn-primary" onClick={() => setEditModalOpen(true)}>
              <Edit3 size={16} /> Edit Profile
            </button>
          </>
        }
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Core Tax Entity Information */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Building size={18} className="text-primary" />
              <span>Business Registration Particulars</span>
            </div>
            <span className="badge badge-success">Active Taxpayer</span>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span className="form-hint">Legal Name of Business</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{currentUser.businessName}</div>
              </div>

              <div>
                <span className="form-hint">Trade Name</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {currentUser.tradeName}
                </div>
              </div>

              <div className="form-row">
                <div>
                  <span className="form-hint">Goods & Services Tax Identification Number (GSTIN)</span>
                  <div className="mono" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {currentUser.gstin}
                  </div>
                </div>
                <div>
                  <span className="form-hint">Permanent Account Number (PAN)</span>
                  <div className="mono" style={{ fontSize: '1rem', fontWeight: 700 }}>
                    {currentUser.pan}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div>
                  <span className="form-hint">Constitution of Business</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.constitution || 'Company'}</div>
                </div>
                <div>
                  <span className="form-hint">Date of Registration</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.registrationDate}</div>
                </div>
              </div>

              <div className="form-row">
                <div>
                  <span className="form-hint">State / State Code</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.state} ({currentUser.stateCode})</div>
                </div>
                <div>
                  <span className="form-hint">District Division</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.district}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Authorized Signatory & Contact Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <User size={18} className="text-primary" />
              <span>Authorized Signatory & Communications</span>
            </div>
            <span className="badge badge-primary">Primary Signatory</span>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span className="form-hint">Authorized Signatory Name</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{currentUser.name}</div>
              </div>

              <div className="form-row">
                <div>
                  <span className="form-hint">Registered Email ID</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.email}</div>
                </div>
                <div>
                  <span className="form-hint">Registered Mobile No.</span>
                  <div style={{ fontWeight: 600 }}>{currentUser.mobile}</div>
                </div>
              </div>

              <div>
                <span className="form-hint">Principal Place of Business (Registered Address)</span>
                <div style={{ fontWeight: 500, lineHeight: '1.5', marginTop: '2px' }}>
                  {currentUser.address}
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                Aadhaar Authentication: <strong style={{ color: 'var(--success)' }}>VERIFIED ✓</strong> | DSC Registered: <strong style={{ color: 'var(--success)' }}>YES ✓</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Taxpayer Profile Particulars"
        size="md"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveProfile}>
              Save Profile Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Authorized Signatory Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Trade Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.tradeName}
              onChange={(e) => setEditForm({ ...editForm, tradeName: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                value={editForm.mobile}
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Principal Business Address</label>
            <textarea
              className="form-control"
              rows={3}
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={pwdModalOpen}
        onClose={() => setPwdModalOpen(false)}
        title="Change Security Password"
        size="sm"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setPwdModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleChangePassword}>
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter current password"
              value={pwdForm.oldPwd}
              onChange={(e) => setPwdForm({ ...pwdForm, oldPwd: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={pwdForm.newPwd}
              onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={pwdForm.confirmPwd}
              onChange={(e) => setPwdForm({ ...pwdForm, confirmPwd: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
