import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CreditCard, Building2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function BankDetails() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [form, setForm] = useState({
    accountNumber: '50200049281729',
    confirmAccountNumber: '50200049281729',
    accountType: 'Current Account',
    ifsc: 'HDFC0000060',
    bankName: 'HDFC Bank Ltd',
    branch: 'Andheri Kurla Road Branch, Mumbai'
  });

  const handleIfscLookup = (code) => {
    const clean = code.toUpperCase();
    setForm(prev => ({
      ...prev,
      ifsc: clean,
      bankName: clean.startsWith('SBIN') ? 'State Bank of India' :
                clean.startsWith('ICIC') ? 'ICICI Bank Ltd' :
                clean.startsWith('HDFC') ? 'HDFC Bank Ltd' : 'Nationalized Commercial Bank',
      branch: clean ? 'Commercial Metro Branch' : ''
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (form.accountNumber !== form.confirmAccountNumber) {
      toast.error('Validation Error', 'Bank account numbers do not match.');
      return;
    }
    if (!form.ifsc || form.ifsc.length !== 11) {
      toast.error('Validation Error', 'Please enter a valid 11-digit IFSC code.');
      return;
    }
    toast.success('Bank Details Verified', 'Bank account validated successfully.');
    navigate('/registration/documents');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 4: Bank Details' }]} />
      <PageHeader
        title="Form GST REG-01: Step 4 — Bank Accounts"
        subtitle="Furnish operational commercial bank accounts for tax payments and direct credit of refunds."
      />

      <RegistrationWizardNav currentStep={4} />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <CreditCard size={18} className="text-primary" />
            <span>Primary Commercial Bank Account</span>
          </div>
          <span className="badge badge-primary">Step 4 of 6</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleNext}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Account Number <span className="required">*</span>
                </label>
                <input
                  type="password"
                  className="form-control mono"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Re-enter Account Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control mono"
                  value={form.confirmAccountNumber}
                  onChange={(e) => setForm({ ...form, confirmAccountNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Type of Account <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={form.accountType}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                >
                  <option value="Current Account">Current Account</option>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Cash Credit Account">Cash Credit / Overdraft</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">IFSC Code (11-digit) <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={11}
                  value={form.ifsc}
                  onChange={(e) => handleIfscLookup(e.target.value)}
                  placeholder="e.g. HDFC0000060"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.bankName}
                  readOnly
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Branch Address</label>
              <input
                type="text"
                className="form-control"
                value={form.branch}
                readOnly
                style={{ backgroundColor: 'var(--surface-hover)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Link to="/registration/address" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Address
              </Link>
              <button type="submit" className="btn btn-primary">
                Save & Continue to Documents <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
