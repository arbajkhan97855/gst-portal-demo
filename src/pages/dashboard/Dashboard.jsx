import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../../components/Modal';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  // Active side tab: 'notices' or 'saved_forms'
  const [activeSideTab, setActiveSideTab] = useState('notices');

  // Turnover FY selection
  const [turnoverFY, setTurnoverFY] = useState('2025-26');

  // Modals
  const [advisoryOpen, setAdvisoryOpen] = useState(false);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [turnoverModalOpen, setTurnoverModalOpen] = useState(false);
  const [estimatedTurnover, setEstimatedTurnover] = useState('5,55,443.20');
  const [editTurnoverInput, setEditTurnoverInput] = useState('555443.20');

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const taxpayerName = currentUser?.tradeName || currentUser?.legalName || currentUser?.businessName || 'RAVI SAINI';

  // Date format DD/MM/YYYY matching screenshot
  const currentDateStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleDownloadLedger = () => {
    toast.success('Download Initiated', 'Electronic Ledger Statement PDF/Excel download started.');
  };

  const handleUpdateTurnover = (e) => {
    e.preventDefault();
    const val = parseFloat(editTurnoverInput) || 0;
    const formatted = val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setEstimatedTurnover(formatted);
    setTurnoverModalOpen(false);
    toast.success('Turnover Updated', `Estimated turnover updated to ₹ ${formatted}`);
  };

  return (
    <div className="gov-dashboard-root">
      {/* 1. TOP SECTION: LEDGER BALANCE & TAXPAYER PROFILE (Screenshot image.png 1) */}
      <div className="gov-top-grid">
        {/* Left Column: Ledger Balance (~73%) */}
        <div className="gov-ledger-col">
          <div className="gov-section-header-row">
            <h2 className="gov-section-title">Ledger Balance</h2>
            <span style={{ color: '#94a3b8' }}>|</span>
            <span className="gov-header-date">{currentDateStr}</span>
            <button
              type="button"
              onClick={handleDownloadLedger}
              className="gov-blue-link"
              style={{ marginLeft: '6px' }}
            >
              Download &rsaquo;
            </button>
          </div>

          <table className="gov-ledger-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}></th>
                <th>IGST (₹)</th>
                <th>CGST(₹)</th>
                <th>SGST (₹)</th>
                <th>CESS (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Electronic Liability Register (Return related)</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Electronic Cash Ledger</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Electronic Credit Ledger</td>
                <td>0</td>
                <td>730</td>
                <td>1917</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Electronic Credit Reversal and Re-claimed Statement</td>
                <td>0</td>
                <td>27000</td>
                <td>27000</td>
                <td>0</td>
              </tr>
              <tr>
                <td>RCM Liability/ITC Statement</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Negative liability statement - Regular Taxpayers</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Taxpayer Card (~25%) */}
        <div className="gov-profile-col">
          <div className="gov-taxpayer-name">{taxpayerName}</div>
          <div className="gov-taxpayer-gstin">{gstin}</div>
          <div>
            <Link to="/profile" className="gov-blue-link">
              View Profile &rsaquo;
            </Link>
          </div>

          <hr className="gov-taxpayer-divider" />

          {/* Sub-tabs: Notices/Orders vs Saved Forms */}
          <div className="gov-tab-headers">
            <button
              type="button"
              className={`gov-tab-btn ${activeSideTab === 'notices' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('notices')}
            >
              Notices/Orders
            </button>
            <button
              type="button"
              className={`gov-tab-btn ${activeSideTab === 'saved_forms' ? 'active' : ''}`}
              onClick={() => setActiveSideTab('saved_forms')}
            >
              Saved Forms
            </button>
          </div>

          <div className="gov-tab-content-text">
            {activeSideTab === 'notices' ? (
              <p style={{ margin: 0 }}>
                To view all the notices and orders issued by the tax authorities, kindly click on this hyperlink:{' '}
                <Link to="/notices" className="gov-blue-link">
                  Notices and Orders &rsaquo;
                </Link>
              </p>
            ) : (
              <p style={{ margin: 0 }}>
                You have no pending saved draft forms.{' '}
                <Link to="/returns" className="gov-blue-link">
                  View Returns Dashboard &rsaquo;
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ACTION BUTTONS: FILE RETURNS > | PAY TAX > (Screenshot image.png 2) */}
      <div className="gov-action-btn-row">
        <Link to="/returns" className="gov-primary-btn">
          FILE RETURNS &rsaquo;
        </Link>
        <Link to="/payments/challan" className="gov-primary-btn">
          PAY TAX &rsaquo;
        </Link>
      </div>

      {/* 3. LOWER SECTION: VIEW TURNOVER DETAILS (Screenshot image.png 2 & 3) */}
      <div>
        <div className="gov-turnover-header-row">
          <h3 className="gov-turnover-title">
            View Turnover Details of {gstin}
          </h3>
          <span style={{ color: '#94a3b8' }}>|</span>
          <button
            type="button"
            onClick={() => setAdvisoryOpen(true)}
            className="gov-blue-link"
          >
            Advisory
          </button>
        </div>

        {/* Financial Year Selector */}
        <div className="gov-fy-select-row">
          <label htmlFor="turnoverFYSelect" className="gov-fy-label">
            Financial Year
          </label>
          <select
            id="turnoverFYSelect"
            value={turnoverFY}
            onChange={(e) => setTurnoverFY(e.target.value)}
            className="gov-fy-select"
          >
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </select>
        </div>

        {/* Two Light Grey Bars */}
        <div className="gov-turnover-bar">
          Final Turnover : ₹ {estimatedTurnover}
        </div>
        <div className="gov-turnover-bar">
          Final Aggregate Turnover : ₹ {estimatedTurnover}
        </div>

        {/* Amount in Rs label */}
        <div className="gov-amount-in-inr">
          (Amount in ₹)
        </div>

        {/* Turnover Comparison Table */}
        <table className="gov-turnover-table">
          <thead>
            <tr>
              <th></th>
              <th>Estimated</th>
              <th>Based on Returns Filed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Turnover</td>
              <td>
                <div>{estimatedTurnover}</div>
                <Link
                  to="/turnover/edit"
                  className="gov-small-action-btn"
                  style={{ textDecoration: 'none' }}
                >
                  View/Update
                </Link>
              </td>
              <td>{estimatedTurnover}</td>
            </tr>
            <tr>
              <td>Aggregate Turnover (PAN Based)</td>
              <td>{estimatedTurnover}</td>
              <td>{estimatedTurnover}</td>
            </tr>
          </tbody>
        </table>

        {/* Methodology & Grievance Links */}
        <div className="gov-methodology-link-row">
          <button
            type="button"
            onClick={() => setMethodologyOpen(true)}
            className="gov-blue-link"
          >
            Click here to know Turnover Calculation Methodology
          </button>
        </div>

        <div style={{ fontSize: '12.5px', color: '#1e293b', marginBottom: '12px' }}>
          In case of any discrepancy in the turnover displayed, please lodge your grievance at{' '}
          <a
            href="https://selfservice.gstsystem.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="gov-blue-link"
          >
            https://selfservice.gstsystem.in/
          </a>
        </div>

        {/* Red Official Disclaimer Note */}
        <div className="gov-red-disclaimer">
          Note - The values displayed above are as on 23/04/2026. Turnover value is updated dynamically as per filing of returns. Aggregate turnover is updated dynamically based upon the filings done by all the GSTINs under the same PAN. Final Turnover & Aggregate Turnover will be made available post tax-officer's verification.
        </div>
      </div>

      {/* Advisory Modal */}
      <Modal
        isOpen={advisoryOpen}
        onClose={() => setAdvisoryOpen(false)}
        title="Advisory - Annual & Aggregate Turnover Calculation"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b' }}>
          <p>
            The turnover shown on the dashboard is computed based on outward taxable supplies reported in Form GSTR-1, Form GSTR-3B, and validated e-way bills.
          </p>
          <p>
            Taxpayers may verify or submit their estimated turnover if their returns are under processing or if amendments in Table 9/10 are pending.
          </p>
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setAdvisoryOpen(false)}
              className="gov-primary-btn"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      {/* Methodology Modal */}
      <Modal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
        title="Turnover Calculation Methodology"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b' }}>
          <ul style={{ paddingLeft: '18px', margin: '0 0 16px 0' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>GSTIN Level Turnover:</strong> Sum of all outward taxable supplies, zero-rated exports, and nil-rated supplies reported in Table 4, 5, 6, 7 of Form GSTR-1.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>PAN-based Aggregate Turnover:</strong> Aggregation of turnover reported across all GST registrations linked to the identical PAN nationwide under Section 2(6) of the CGST Act.
            </li>
          </ul>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setMethodologyOpen(false)}
              className="gov-primary-btn"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>

      {/* View / Update Estimated Turnover Modal */}
      <Modal
        isOpen={turnoverModalOpen}
        onClose={() => setTurnoverModalOpen(false)}
        title="View / Update Estimated Turnover"
        size="sm"
      >
        <form onSubmit={handleUpdateTurnover} style={{ fontSize: '13px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
              Estimated Turnover for {turnoverFY} (₹):
            </label>
            <input
              type="number"
              step="0.01"
              value={editTurnoverInput}
              onChange={(e) => setEditTurnoverInput(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                border: '1px solid #cbd5e1',
                borderRadius: '2px'
              }}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setTurnoverModalOpen(false)}
              className="gov-primary-btn"
              style={{ backgroundColor: '#64748b' }}
            >
              Cancel
            </button>
            <button type="submit" className="gov-primary-btn">
              Save Turnover
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
