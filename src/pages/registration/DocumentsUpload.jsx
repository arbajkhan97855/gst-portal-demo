import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, FileCheck, CheckCircle2, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import RegistrationWizardNav from './RegistrationWizardNav';
import { useNotification } from '../../context/NotificationContext';

export default function DocumentsUpload() {
  const navigate = useNavigate();
  const { toast } = useNotification();

  const [files, setFiles] = useState({
    pan: { name: 'Company_PAN_Card_AABCS1429B.pdf', size: '340 KB', uploaded: true },
    address: { name: 'Electricity_Bill_Dec2024.pdf', size: '512 KB', uploaded: true },
    bank: { name: 'Cancelled_Cheque_HDFC.jpg', size: '210 KB', uploaded: true },
    photo: { name: 'Promoter_Photograph_Rajesh.jpg', size: '98 KB', uploaded: true },
    businessProof: { name: 'Certificate_of_Incorporation_MCA.pdf', size: '640 KB', uploaded: true }
  });

  const handleSimulateUpload = (key, defaultName) => {
    setFiles(prev => ({
      ...prev,
      [key]: { name: defaultName, size: '240 KB', uploaded: true }
    }));
    toast.success('Document Attached', `${defaultName} attached successfully.`);
  };

  const handleRemove = (key) => {
    setFiles(prev => ({
      ...prev,
      [key]: null
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!files.pan || !files.address || !files.bank) {
      toast.error('Validation Error', 'Please upload mandatory documents (PAN, Address Proof, Bank Proof).');
      return;
    }
    toast.success('Documents Saved', 'All required proofs verified for submission.');
    navigate('/registration/verification');
  };

  const uploadBox = (key, label, required, hint, defaultFileName) => {
    const file = files[key];
    return (
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{label}</span>
                {required && <span className="required">*</span>}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {hint} (Max 1 MB, PDF/JPEG)
              </div>
            </div>

            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#065f46' }}>{file.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({file.size})</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleRemove(key)}
                  title="Remove file"
                >
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSimulateUpload(key, defaultFileName)}
              >
                <Upload size={14} /> Attach File
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Registration', to: '/registration' }, { label: 'Step 5: Document Uploads' }]} />
      <PageHeader
        title="Form GST REG-01: Step 5 — Upload Supporting Documents"
        subtitle="Attach statutory verification files for PAN, identity proofs, address, and bank accounts."
      />

      <RegistrationWizardNav currentStep={5} />

      <form onSubmit={handleNext}>
        {uploadBox('pan', 'PAN Card Copy of the Entity', true, 'Permanent Account Number verification document', 'Company_PAN_AABCS1429B.pdf')}
        {uploadBox('address', 'Proof of Principal Place of Business', true, 'Electricity bill, Municipal tax receipt, or registered lease deed', 'Address_Electricity_Bill.pdf')}
        {uploadBox('bank', 'Proof of Commercial Bank Account', true, 'Cancelled cheque leaf with printed entity name or bank passbook first page', 'Bank_Cancelled_Cheque.jpg')}
        {uploadBox('photo', 'Passport Size Photograph of Primary Promoter', true, 'Recent photograph of Authorized Signatory', 'Promoter_Photo.jpg')}
        {uploadBox('businessProof', 'Proof of Constitution / Certificate of Incorporation', false, 'MCA COI, Partnership deed, or Trust registration deed', 'Certificate_of_Incorporation.pdf')}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <Link to="/registration/bank-details" className="btn btn-outline">
            <ArrowLeft size={16} /> Back to Bank Details
          </Link>
          <button type="submit" className="btn btn-primary">
            Save & Continue to Final Verification <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
