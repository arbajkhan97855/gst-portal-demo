import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Building } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function AddressDetails() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [form, setForm] = useState({
    buildingNo: 'Unit 402, Samyak IT Park',
    street: 'Saki Vihar Road',
    locality: 'Andheri East',
    city: 'Mumbai',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    pincode: '400069',
    possessionNature: 'Rented / Leased',
    proofType: 'Electricity Bill & Registered Rent Agreement'
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.buildingNo || !form.pincode || form.pincode.length !== 6) {
      toast.error('Validation Error', 'Please enter a valid 6-digit PIN code.');
      return;
    }
    toast.success('Address Saved', 'Principal place of business recorded.');
    navigate('/registration/bank-details');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 3: Principal Address' }]} />
      <PageHeader
        title="Form GST REG-01: Step 3 — Principal Place of Business"
        subtitle="Specify the primary commercial premises from which business activities are conducted."
      />

      <RegistrationWizardNav currentStep={3} />

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <MapPin size={18} className="text-primary" />
            <span>Principal Place of Business Location</span>
          </div>
          <span className="badge badge-primary">Step 3 of 6</span>
        </div>

        <div className="card-body">
          <form onSubmit={handleNext}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Building No. / Flat No. / Name of Premises <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.buildingNo}
                  onChange={(e) => setForm({ ...form, buildingNo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Road / Street <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Locality / Area <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.locality}
                  onChange={(e) => setForm({ ...form, locality: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / Town <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PIN Code <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nature of Possession of Premises <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={form.possessionNature}
                  onChange={(e) => setForm({ ...form, possessionNature: e.target.value })}
                >
                  <option value="Owned">Owned</option>
                  <option value="Rented / Leased">Rented / Leased</option>
                  <option value="Shared">Shared</option>
                  <option value="Consent">Consent / NOC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Documentary Proof of Address</label>
                <select
                  className="form-control"
                  value={form.proofType}
                  onChange={(e) => setForm({ ...form, proofType: e.target.value })}
                >
                  <option value="Electricity Bill & Registered Rent Agreement">Electricity Bill & Rent Agreement</option>
                  <option value="Municipal Khata Copy">Municipal Khata Copy / Property Tax Receipt</option>
                  <option value="Ownership Sale Deed">Registered Sale Deed</option>
                  <option value="Consent Letter with Proof">Consent Letter (NOC) + Electricity Bill</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Link to="/registration/promoter-details" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Promoters
              </Link>
              <button type="submit" className="btn btn-primary">
                Save & Continue to Bank Details <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
