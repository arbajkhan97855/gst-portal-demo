import React, { useState } from 'react';
import { Search, CreditCard, CheckCircle2, Clock, FileText } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_CHALLANS } from '../../data/portalData';
import { usePortalData } from '../../context/PortalDataContext';

export default function PaymentStatus() {
  const { challans: portalChallans } = usePortalData();
  const challans = portalChallans || SAMPLE_CHALLANS;
  const [cpin, setCpin] = useState('25022700142984');
  const [challan, setChallan] = useState(challans[0] || SAMPLE_CHALLANS[0]);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = cpin.trim();
    const match = challans.find(c => c.cpin === clean || (c.cin && c.cin.toUpperCase() === clean.toUpperCase()));
    if (match) {
      setChallan(match);
      setNotFound(false);
    } else {
      setChallan(null);
      setNotFound(true);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Payments', to: '/payments' }, { label: 'Payment Status' }]} />
      <PageHeader
        title="Check Challan Payment Status"
        subtitle="Verify whether bank payment realization has updated your Electronic Cash Ledger (PMT-05)."
      />

      <div className="card" style={{ maxWidth: '640px', margin: '0 auto 28px' }}>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">14-digit CPIN or 17-character CIN</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control mono"
                  value={cpin}
                  onChange={(e) => setCpin(e.target.value)}
                  placeholder="e.g. 25022700142984..."
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <Search size={16} /> Check Status
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

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
            <div className="form-row" style={{ marginBottom: '20px' }}>
              <div>
                <span className="form-hint">CIN Number</span>
                <div className="mono" style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '2px', color: 'var(--primary)' }}>
                  {challan.cin || 'Pending Realization'}
                </div>
              </div>
              <div>
                <span className="form-hint">Deposit Amount</span>
                <div className="mono" style={{ fontWeight: 800, fontSize: '1.15rem', marginTop: '2px', color: 'var(--success)' }}>
                  ₹{challan.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span className="form-hint">Bank Channel</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{challan.bank} ({challan.paymentMode})</div>
              </div>
              <div>
                <span className="form-hint">Realization Date</span>
                <div style={{ fontWeight: 600, marginTop: '2px' }}>{challan.paidDate || 'Under Bank Processing'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
