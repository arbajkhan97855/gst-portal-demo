import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/Modal';

export default function TurnoverDeclaration() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [status, setStatus] = useState('Not Submitted');
  const [arn, setArn] = useState(null);
  const [isAffirmed, setIsAffirmed] = useState(true);
  const [authorizedSignatory, setAuthorizedSignatory] = useState('RAVI SAINI');
  const [reportedTurnover, setReportedTurnover] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Modals
  const [advisoryOpen, setAdvisoryOpen] = useState(false);
  const [panLevelOpen, setPanLevelOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [firstSubOpen, setFirstSubOpen] = useState(false);
  const [evcModalOpen, setEvcModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [finalApprovedOpen, setFinalApprovedOpen] = useState(false);

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';
  const fy = '2025-26';
  const closureDate = '31/07/2026';
  const systemTurnover = '5,55,443.20';

  const handleEvcSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Validation Error', 'Please enter 6-digit OTP.');
      return;
    }
    const generatedArn = `TD08072600${Math.floor(10000 + Math.random() * 90000)}`;
    setArn(generatedArn);
    setStatus('Submitted');
    setEvcModalOpen(false);
    toast.success('Declaration Submitted', `Turnover declaration submitted successfully. ARN: ${generatedArn}`);
  };

  const handleDownloadDeclaration = () => {
    toast.success('Download Initiated', 'Final Turnover Declaration PDF download started.');
  };

  return (
    <div className="gov-dashboard-root">
      {/* 1. Page Title & Top Right Links (Matching image.png) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Declaration of Turnover
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <button
            type="button"
            onClick={() => setPanLevelOpen(true)}
            className="gov-blue-link"
          >
            PAN level declaration of a FY
          </button>
          <span style={{ color: '#94a3b8' }}>|</span>
          <button
            type="button"
            onClick={() => setAdvisoryOpen(true)}
            className="gov-blue-link"
          >
            Advisory
          </button>
        </div>
      </div>

      {/* 2. Taxpayer Info Box (3 Columns) */}
      <div className="turnover-box-info">
        <div>
          <div style={{ marginBottom: '8px' }}>
            GSTIN: <strong>{gstin}</strong>
          </div>
          <div>
            FY: <strong>{fy}</strong>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>
            Legal Name: <strong>{legalName}</strong>
          </div>
          <div>
            Closure Date: <strong>{closureDate}</strong>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: '8px' }}>
            Trade Name: <strong>{tradeName}</strong>
          </div>
          <div>
            Status:{' '}
            <strong style={{ color: status === 'Submitted' ? '#16a34a' : '#1e293b' }}>
              {status}
            </strong>
            {arn && (
              <span style={{ marginLeft: '6px', fontSize: '11px', color: '#2563eb' }}>
                ({arn})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sub-header with Aggregate Turnover and Methodology Links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 4px 0', fontSize: '13px' }}>
        <div>
          <strong>Aggregate Turnover (PAN Based)</strong>{' '}
          <span
            title="Aggregated across all GSTINs registered under this PAN"
            style={{ cursor: 'pointer', color: '#64748b' }}
          >
            🛈
          </span>{' '}
          <strong style={{ color: '#0f172a', marginLeft: '4px' }}>₹ {systemTurnover}</strong>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setFirstSubOpen(true)}
            className="gov-blue-link"
          >
            View First Submitted Declaration
          </button>
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="gov-blue-link"
          >
            Turnover Calculation Methodology
          </button>
        </div>
      </div>

      {/* Amount in Rs label */}
      <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
        (Amount in ₹)
      </div>

      {/* 4. Official Turnover Declaration Table (Matching image.png) */}
      <table className="turnover-decl-table">
        <thead>
          <tr>
            <th style={{ width: '22%' }}>
              System Computed Turnover <span title="Auto-calculated from outward returns">🛈</span>
            </th>
            <th style={{ width: '22%' }}>Turnover reported by Taxpayer</th>
            <th style={{ width: '22%' }}>
              Annual Aggregate Turnover <span title="Consolidated annual aggregate turnover">🛈</span>
            </th>
            <th style={{ width: '18%' }}>Remarks</th>
            <th style={{ width: '16%' }}>File Upload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{systemTurnover}</td>
            <td>
              {status === 'Submitted' ? (
                <span>{reportedTurnover || systemTurnover}</span>
              ) : (
                <input
                  type="text"
                  placeholder="-"
                  value={reportedTurnover}
                  onChange={(e) => setReportedTurnover(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12.5px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    textAlign: 'center'
                  }}
                />
              )}
            </td>
            <td>{systemTurnover}</td>
            <td>
              {status === 'Submitted' ? (
                <span>{remarks || '-'}</span>
              ) : (
                <input
                  type="text"
                  placeholder="-"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    fontSize: '12.5px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '2px',
                    textAlign: 'center'
                  }}
                />
              )}
            </td>
            <td>
              {status === 'Submitted' ? (
                <span>-</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <label
                    style={{
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      color: '#0066cc',
                      fontWeight: 600
                    }}
                  >
                    <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          toast.success('File Selected', e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  {!selectedFile && <span style={{ color: '#94a3b8' }}>-</span>}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 5. Declaration Checkbox */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: '18px 0 16px 0', fontSize: '13px', color: '#1e293b' }}>
        <input
          type="checkbox"
          id="affirmCheck"
          checked={isAffirmed}
          onChange={(e) => setIsAffirmed(e.target.checked)}
          style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer' }}
        />
        <label htmlFor="affirmCheck" style={{ cursor: 'pointer', lineHeight: '1.45' }}>
          I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge and belief and nothing has been concealed therefrom.
        </label>
      </div>

      {/* 6. Authorized Signatory Dropdown */}
      <div style={{ marginBottom: '24px', maxWidth: '320px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
          Authorized Signatory
        </label>
        <select
          value={authorizedSignatory}
          onChange={(e) => setAuthorizedSignatory(e.target.value)}
          style={{
            width: '100%',
            padding: '7px 12px',
            fontSize: '13px',
            border: '1px solid #cbd5e1',
            borderRadius: '2px',
            backgroundColor: '#ffffff'
          }}
        >
          <option value="RAVI SAINI">RAVI SAINI</option>
          <option value="AUTHORIZED REPRESENTATIVE">AUTHORIZED REPRESENTATIVE</option>
        </select>
      </div>

      {/* 7. Bottom Action Buttons Strip (Matching image.png) */}
      <div className="turnover-actions-strip">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="turnover-btn-navy"
        >
          BACK
        </button>

        <button
          type="button"
          onClick={() => setFinalApprovedOpen(true)}
          className="turnover-btn-navy"
        >
          FINAL APPROVED TURNOVER
        </button>

        <button
          type="button"
          onClick={handleDownloadDeclaration}
          className="turnover-btn-navy"
        >
          FINAL TURNOVER DECLARATION
        </button>

        <button
          type="button"
          onClick={() => toast.info('DSC Notice', 'Digital Signature Certificate driver is not detected.')}
          className="turnover-btn-disabled"
        >
          SUBMIT WITH DSC
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isAffirmed) {
              toast.error('Affirmation Required', 'Please check the affirmation box to proceed.');
              return;
            }
            setEvcModalOpen(true);
          }}
          disabled={status === 'Submitted' || !isAffirmed}
          className={status === 'Submitted' || !isAffirmed ? 'turnover-btn-disabled' : 'turnover-btn-navy'}
        >
          {status === 'Submitted' ? 'SUBMITTED WITH EVC' : 'SUBMIT WITH EVC'}
        </button>
      </div>

      {/* MODAL 1: Advisory */}
      <Modal
        isOpen={advisoryOpen}
        onClose={() => setAdvisoryOpen(false)}
        title="Advisory - Declaration of Turnover"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b' }}>
          <p>
            The turnover shown in this window is computed by the GST system based on the outward taxable supplies declared in Form GSTR-1, Form GSTR-3B, and statements filed across all GSTINs under the same PAN.
          </p>
          <p>
            In case you notice any discrepancy or pending amendments, you may report your estimated turnover along with valid documentary justification.
          </p>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setAdvisoryOpen(false)}
              className="turnover-btn-navy"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: PAN Level Declaration */}
      <Modal
        isOpen={panLevelOpen}
        onClose={() => setPanLevelOpen(false)}
        title="PAN Level Declaration of FY 2025-26"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div>PAN: <strong>{gstin.substring(2, 12)}</strong></div>
            <div>Legal Name: <strong>{legalName}</strong></div>
            <div>Total Active GSTINs under this PAN: <strong>1</strong></div>
            <div>Aggregated PAN Turnover: <strong>₹ {systemTurnover}</strong></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setPanLevelOpen(false)}
              className="turnover-btn-navy"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Calculation Methodology */}
      <Modal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
        title="Turnover Calculation Methodology"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <ul style={{ paddingLeft: '18px', margin: '0 0 14px 0' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Table 4 (B2B):</strong> Total value of interstate and intrastate taxable supplies to registered persons.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Table 5 & 7 (B2C):</strong> Total interstate supplies to unregistered persons where invoice value &gt; ₹2.5 Lakhs and other intrastate supplies.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Table 6A (Exports):</strong> Zero-rated supplies and exports under bond / letter of undertaking.
            </li>
          </ul>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setMethodologyOpen(false)}
              className="turnover-btn-navy"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: First Submitted Declaration */}
      <Modal
        isOpen={firstSubOpen}
        onClose={() => setFirstSubOpen(false)}
        title="First Submitted Turnover Declaration"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <p>Initial declaration was auto-generated by GST System on 01/04/2026 based on Form GSTR-1 / 3B filings.</p>
          <div style={{ backgroundColor: '#f1f5f9', padding: '12px', borderRadius: '2px', marginBottom: '14px' }}>
            <div>Declared Amount: <strong>₹ {systemTurnover}</strong></div>
            <div>Status: <strong>System Validated</strong></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setFirstSubOpen(false)}
              className="turnover-btn-navy"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 5: Final Approved Turnover */}
      <Modal
        isOpen={finalApprovedOpen}
        onClose={() => setFinalApprovedOpen(false)}
        title="Final Approved Turnover Details"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <div>Final Approved Turnover: <strong>₹ {systemTurnover}</strong></div>
            <div>Tax Jurisdiction: <strong>Rajasthan State Ward 01</strong></div>
            <div>Approval Status: <strong>Approved by Tax Authority</strong></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setFinalApprovedOpen(false)}
              className="turnover-btn-navy"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: Submit With EVC (OTP) */}
      <Modal
        isOpen={evcModalOpen}
        onClose={() => setEvcModalOpen(false)}
        title="Submit Declaration of Turnover with EVC"
        size="md"
      >
        <form onSubmit={handleEvcSubmit} style={{ fontSize: '13px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '12px', border: '1px solid #bfdbfe', borderRadius: '2px', marginBottom: '16px' }}>
            An OTP has been dispatched to the registered mobile number and email ID of <strong>{authorizedSignatory}</strong>.
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Enter One Time Password (OTP):
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP (e.g. 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                letterSpacing: '2px',
                border: '1px solid #cbd5e1',
                borderRadius: '2px'
              }}
              required
            />
            <span style={{ fontSize: '11px', color: '#64748b' }}>For demo testing, enter 123456 or any 6-digit code.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setEvcModalOpen(false)}
              className="turnover-btn-disabled"
              style={{ cursor: 'pointer' }}
            >
              CANCEL
            </button>
            <button type="submit" className="turnover-btn-navy">
              VERIFY & SUBMIT
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
