import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Send
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function UnbarringApplication() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();

  const [submitting, setSubmitting] = useState(false);
  const [submittedArn, setSubmittedArn] = useState(null);
  const [unbarReason, setUnbarReason] = useState('Technical Glitch on Portal preventing timely submission');
  const [detailedRemarks, setDetailedRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!detailedRemarks.trim()) {
      toast.warning('Remarks Required', 'Please provide detailed grounds/reasons for your unbarring application.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const generatedArn = `UN${gstin.slice(0, 2)}25${Math.floor(1000000 + Math.random() * 9000000)}`;
      setSubmittedArn(generatedArn);
      setSubmitting(false);
      toast.success('Application Submitted', `Application for Unbarring Returns submitted successfully with ARN: ${generatedArn}`);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'Application for Unbarring Returns' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Taxpayer Info */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', fontSize: '13px', color: '#1e293b' }}>
          <div>GSTIN: <strong>{gstin}</strong></div>
          <div>Legal Name: <strong>{legalName}</strong></div>
          <div>Trade Name: <strong>{tradeName}</strong></div>
          <div>Filing Status: <strong style={{ color: '#16a34a' }}>Normal (No Active Bar)</strong></div>
        </div>
      </div>

      {/* Application Form */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Application for Unbarring / Unblocking Return Filing Facility
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <span style={{ color: '#ef4444', fontWeight: 700 }}>• </span>Indicates Mandatory Fields
          </div>
        </div>

        {submittedArn ? (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '24px', textAlign: 'center' }}>
            <div style={{ color: '#16a34a', display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle2 size={48} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#166534', margin: '0 0 8px 0' }}>
              Application for Unbarring Returns Successfully Submitted
            </h3>
            <p style={{ fontSize: '14px', color: '#14532d', margin: '0 0 16px 0' }}>
              Your application has been forwarded to the Jurisdictional Tax Officer for verification.
            </p>
            <div style={{ display: 'inline-block', backgroundColor: '#ffffff', border: '1px solid #86efac', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 700, color: '#15803d' }}>
              Application Reference Number (ARN): {submittedArn}
            </div>
            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setSubmittedArn(null)}
                style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '8px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitApplication}>
            <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '4px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6', color: '#0369a1' }}>
              <strong>Notice under Rule 59(6) of CGST Rules:</strong>
              <div style={{ marginTop: '4px' }}>
                Taxpayers whose filing facility for GSTR-1 / IFF has been restricted due to non-filing of GSTR-3B for preceding periods or violation of Rule 86B may submit this application explaining reasons for revoking the bar.
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Grounds / Primary Reason for Requesting Unbarring <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={unbarReason}
                onChange={(e) => setUnbarReason(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#ffffff' }}
              >
                <option value="Technical Glitch on Portal preventing timely submission">Technical Glitch on Portal preventing timely submission</option>
                <option value="Pending GSTR-3B filed and all tax dues deposited">Pending GSTR-3B filed and all tax dues deposited</option>
                <option value="Bank account attachment or freeze subsequently lifted">Bank account attachment or freeze subsequently lifted</option>
                <option value="Natural calamity / Force Majeure event">Natural calamity / Force Majeure event</option>
                <option value="Rectification of Rule 86B cash payment threshold">Rectification of Rule 86B cash payment threshold</option>
              </select>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Detailed Explanation & Submissions <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={4}
                value={detailedRemarks}
                onChange={(e) => setDetailedRemarks(e.target.value)}
                placeholder="Enter detailed facts, dates of compliance, challan payment references, or exceptional circumstances..."
                style={{ width: '100%', padding: '10px 12px', fontSize: '13px', border: '1px solid #cbd5e1', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Upload Supporting Evidence / Document (PDF / JPEG up to 5MB)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="file"
                  id="unbar-file"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0].name);
                      toast.info('File Attached', `${e.target.files[0].name} attached.`);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('unbar-file').click()}
                  style={{ backgroundColor: '#ffffff', color: '#173059', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '8px 18px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Upload size={14} /> CHOOSE FILE
                </button>
                <span style={{ fontSize: '12.5px', color: selectedFile ? '#16a34a' : '#64748b' }}>
                  {selectedFile ? `Attached: ${selectedFile}` : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Declaration */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '14px 18px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#334155' }}>
                <input type="checkbox" defaultChecked style={{ marginTop: '2px', width: '16px', height: '16px' }} />
                <span>
                  I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDetailedRemarks('')}
                style={{ backgroundColor: '#ffffff', color: '#173059', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '9px 24px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                RESET
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '9px 28px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                {submitting ? 'SUBMITTING APPLICATION...' : 'FILE WITH EVC / DSC'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
