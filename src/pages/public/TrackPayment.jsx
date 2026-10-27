import React, { useState } from 'react';
import { Search, CreditCard, CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_CHALLANS } from '../../data/portalData';
import { usePortalData } from '../../context/PortalDataContext';

export default function TrackPayment() {
  const { challans: portalChallans } = usePortalData();
  const challans = portalChallans || SAMPLE_CHALLANS;
  const [cinInput, setCinInput] = useState('SBIN25022700142984');
  const [challan, setChallan] = useState(challans[0] || SAMPLE_CHALLANS[0]);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    const query = cinInput.trim().toUpperCase();
    const match = challans.find(c =>
      (c.cin && c.cin.toUpperCase() === query) ||
      (c.cpin && c.cpin.toUpperCase() === query)
    );
    if (match) {
      setChallan(match);
      setNotFound(false);
    } else {
      setChallan(null);
      setNotFound(true);
    }
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Track Payment Status' }]} />
      <PageHeader
        title="Track Payment Status (CIN / CPIN)"
        subtitle="Verify the bank realization and cash ledger credit status of GST tax payment challans."
      />

      <div className="card" style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
        <div className="card-body">
          <form onSubmit={handleTrack}>
            <div className="form-group">
              <label className="form-label">Challan Identification Number (CIN) or CPIN</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control mono"
                  value={cinInput}
                  onChange={(e) => setCinInput(e.target.value)}
                  placeholder="Enter CIN or 14-digit CPIN..."
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Search size={16} /> Track Challan
                </button>
              </div>
            </div>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample Numbers:</span>
            {challans.slice(0, 4).map(c => (
              <button
                key={c.cpin}
                type="button"
                className="badge badge-primary"
                onClick={() => {
                  setCinInput(c.cin || c.cpin);
                  setChallan(c);
                  setNotFound(false);
                }}
              >
                {c.cin || c.cpin}
              </button>
            ))}
          </div>
        </div>
      </div>

      {notFound && (
        <div className="empty-state" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Clock className="empty-state-icon" style={{ color: 'var(--warning)' }} />
          <h4 className="empty-state-title">Challan Record Not Found</h4>
          <p className="empty-state-text">
            No tax challan matched "{cinInput}". Please verify the CPIN / CIN from your bank transaction receipt.
          </p>
        </div>
      )}

      {challan && (
        <div className="card" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="card-header" style={{ backgroundColor: challan.status.includes('Paid') ? '#ecfdf5' : '#fffbeb' }}>
            <div className="card-title">
              <CreditCard size={20} className="text-primary" />
              <span>Challan Status: {challan.cpin}</span>
            </div>
            <span className={`badge ${challan.status.includes('Paid') ? 'badge-success' : 'badge-warning'}`}>
              {challan.status}
            </span>
          </div>

          <div className="card-body">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <div>
                <span className="form-hint">CPIN (Common Portal Identification Number)</span>
                <div className="mono" style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '2px' }}>
                  {challan.cpin}
                </div>
              </div>

              <div>
                <span className="form-hint">CIN (Bank Challan Identification Number)</span>
                <div className="mono" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)', marginTop: '2px' }}>
                  {challan.cin || 'Awaiting realization'}
                </div>
              </div>

              <div>
                <span className="form-hint">Total Amount Paid</span>
                <div className="mono" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--success)', marginTop: '2px' }}>
                  ₹{challan.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <span className="form-hint">Payment Mode</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {challan.paymentMode}
                </div>
              </div>

              <div>
                <span className="form-hint">Collecting Bank</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {challan.bank}
                </div>
              </div>

              <div>
                <span className="form-hint">Payment Realization Date</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>
                  {challan.paidDate || 'Pending'}
                </div>
              </div>
            </div>

            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Amount reflects directly in your Electronic Cash Ledger upon CIN generation.
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => alert(`Receipt downloaded for CIN: ${challan.cin || challan.cpin}`)}
              >
                <FileText size={14} /> Download Payment Receipt (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
