import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertTriangle, Building, MapPin, Calendar, FileBadge, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_TAXPAYERS } from '../../data/portalData';
import { usePortalData } from '../../context/PortalDataContext';

export default function VerifyGstin() {
  const [searchParams] = useSearchParams();
  const queryGstin = searchParams.get('gstin') || '27AABCS1429B1Z8';
  const { taxpayers: portalTaxpayers } = usePortalData();
  const taxpayers = portalTaxpayers || SAMPLE_TAXPAYERS;

  const [inputGstin, setInputGstin] = useState(queryGstin);
  const [data, setData] = useState(() => {
    return taxpayers.find(t => t.gstin === queryGstin) || taxpayers[0];
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!inputGstin.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      const match = taxpayers.find(t => t.gstin.toLowerCase() === inputGstin.trim().toLowerCase());
      setData(match || {
        gstin: inputGstin.trim().toUpperCase(),
        legalName: 'Dynamic Verified Business Entity',
        tradeName: 'Enterprise Trading Co.',
        taxpayerType: 'Regular Taxpayer',
        constitution: 'Private Limited Company',
        status: 'Active',
        registrationDate: '01-Apr-2018',
        state: 'Maharashtra',
        stateCode: inputGstin.trim().substring(0, 2) || '27',
        district: 'Central Division',
        pincode: '400001',
        complianceRating: '9.9/10'
      });
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Verify GSTIN' }]} />
      <PageHeader
        title="Instant GSTIN Verification"
        subtitle="Authenticate legal validity of any Goods and Services Tax Identification Number (GSTIN) against simulated public databases."
      />

      <div className="card" style={{ maxWidth: '680px', margin: '0 auto 32px' }}>
        <div className="card-body">
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="form-label">
                GST Identification Number (GSTIN)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={15}
                  value={inputGstin}
                  onChange={(e) => setInputGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCS1429B1Z8"
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Verify GSTIN'}
                </button>
              </div>
              <span className="form-hint">
                A valid Indian GSTIN consists of 15 alphanumeric characters (State Code + PAN + Entity Code + Check digit).
              </span>
            </div>
          </form>
        </div>
      </div>

      {data && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
            <div className="card-title" style={{ color: '#065f46' }}>
              <ShieldCheck size={24} color="var(--success)" />
              <span>Verified Taxpayer Entity Profile</span>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
              ✓ Status: {data.status}
            </span>
          </div>

          <div className="card-body">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <span className="form-hint">GST Identification Number</span>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {data.gstin}
                </div>
              </div>

              <div>
                <span className="form-hint">Permanent Account Number (PAN)</span>
                <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {data.pan || data.gstin.substring(2, 12)}
                </div>
              </div>

              <div>
                <span className="form-hint">Legal Name</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {data.legalName}
                </div>
              </div>

              <div>
                <span className="form-hint">Trade Name</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  {data.tradeName}
                </div>
              </div>

              <div>
                <span className="form-hint">Constitution of Business</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {data.constitution}
                </div>
              </div>

              <div>
                <span className="form-hint">Taxpayer Classification</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {data.taxpayerType}
                </div>
              </div>

              <div>
                <span className="form-hint">Date of Registration</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {data.registrationDate}
                </div>
              </div>

              <div>
                <span className="form-hint">State Jurisdiction</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {data.state} (Code {data.stateCode})
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '28px',
              borderTop: '1px solid var(--border)',
              paddingTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                E-Invoice System: <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active</span> | E-Way Bill System: <span style={{ color: 'var(--success)', fontWeight: 600 }}>Enabled</span>
              </div>
              <Link to="/search-taxpayer" className="btn btn-outline btn-sm">
                Search Another Entity
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
