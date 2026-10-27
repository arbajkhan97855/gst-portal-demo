import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Building } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function BusinessDetails() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [form, setForm] = useState({
    legalName: 'Samyak Infotech Solutions Pvt Ltd',
    tradeName: 'Samyak Tech Enterprises',
    pan: 'AABCS1429B',
    constitution: 'Private Limited Company',
    state: 'Maharashtra',
    stateCode: '27',
    district: 'Mumbai Suburban',
    commencementDate: '2024-04-01',
    reasonToRegister: 'Threshold Crossing (Section 22)'
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.legalName || !form.pan || !form.constitution) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }
    toast.success('Draft Saved', 'Business Details saved successfully.');
    navigate('/registration/promoter-details');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 1: Business Details' }]} />
      <PageHeader
        title="Form GST REG-01: Part-A Business Particulars"
        subtitle="Specify the legal constitution of your enterprise, PAN, and jurisdictional territory."
      />

      <RegistrationWizardNav currentStep={1} />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Building size={18} className="text-primary" />
            <span>Step 1: Business Identity & Legal Constitution</span>
          </div>
          <span className="badge badge-primary">Part-A</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleNext}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Legal Name of Business (as per PAN) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={form.legalName}
                  onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trade Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.tradeName}
                  onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                  placeholder="Operational commercial trade name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Permanent Account Number (PAN) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={10}
                  value={form.pan}
                  onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                  required
                />
                <span className="form-hint">Must match CBDT database verification.</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Constitution of Business <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  value={form.constitution}
                  onChange={(e) => setForm({ ...form, constitution: e.target.value })}
                  required
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Trust">Society / Trust / Association</option>
                </select>
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">State / UT <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="Maharashtra">Maharashtra (27)</option>
                  <option value="Delhi">Delhi (07)</option>
                  <option value="Gujarat">Gujarat (24)</option>
                  <option value="Karnataka">Karnataka (29)</option>
                  <option value="Tamil Nadu">Tamil Nadu (33)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District Jurisdiction <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reason to Obtain Registration</label>
                <select
                  className="form-control"
                  value={form.reasonToRegister}
                  onChange={(e) => setForm({ ...form, reasonToRegister: e.target.value })}
                >
                  <option value="Threshold Crossing (Section 22)">Turnover Crossing Threshold (Sec 22)</option>
                  <option value="Inter-State Sales (Section 24)">Inter-State Supplies (Sec 24)</option>
                  <option value="E-Commerce Operator">Selling via E-Commerce (Sec 24)</option>
                  <option value="Voluntary Basis">Voluntary Registration (Sec 25(3))</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => toast.info('Draft Saved', 'Draft state preserved.')}
              >
                <Save size={16} /> Save as Draft
              </button>
              <button type="submit" className="btn btn-primary">
                Save & Continue to Promoter Details <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
