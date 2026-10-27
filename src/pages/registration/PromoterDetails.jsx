import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, User, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function PromoterDetails() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [form, setForm] = useState({
    name: 'Rajesh Ramniklal Sharma',
    pan: 'AABCS1429B',
    din: '08429184',
    email: 'rajesh.sharma@samyakinfotech.com',
    mobile: '9876543210',
    designation: 'Managing Director',
    gender: 'Male',
    isPrimarySignatory: true
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      toast.error('Validation Error', 'Please complete promoter contact particulars.');
      return;
    }
    toast.success('Draft Saved', 'Promoter particulars validated.');
    navigate('/registration/address');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 2: Promoter Details' }]} />
      <PageHeader
        title="Form GST REG-01: Step 2 — Promoters & Directors"
        subtitle="Provide individual particulars of Directors, Managing Partners, or Sole Proprietors."
      />

      <RegistrationWizardNav currentStep={2} />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <User size={18} className="text-primary" />
            <span>Promoter / Partner / Director Particulars</span>
          </div>
          <span className="badge badge-primary">Step 2 of 6</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleNext}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Full Name of Promoter <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Director Identification Number (DIN)</label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={8}
                  value={form.din}
                  onChange={(e) => setForm({ ...form, din: e.target.value })}
                  placeholder="8-digit DIN (if applicable)"
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Promoter PAN <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={10}
                  value={form.pan}
                  onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email ID <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number <span className="required">*</span></label>
                <input
                  type="tel"
                  className="form-control"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Designation / Status</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', margin: '16px 0' }}>
              <label className="form-check" style={{ marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={form.isPrimarySignatory}
                  onChange={(e) => setForm({ ...form, isPrimarySignatory: e.target.checked })}
                />
                <span className="form-check-label">
                  <strong>Designate as Primary Authorized Signatory</strong> (Will hold electronic filing authority)
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Link to="/registration/business-details" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Business Details
              </Link>
              <button type="submit" className="btn btn-primary">
                Save & Continue to Address <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
