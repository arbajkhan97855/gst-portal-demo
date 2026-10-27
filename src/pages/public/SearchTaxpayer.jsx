import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Building2, ShieldCheck, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_TAXPAYERS } from '../../data/portalData';
import { usePortalData } from '../../context/PortalDataContext';

export default function SearchTaxpayer() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { taxpayers: portalTaxpayers } = usePortalData();
  const taxpayers = portalTaxpayers || SAMPLE_TAXPAYERS;

  const [searchType, setSearchType] = useState('gstin');
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState(() => {
    if (initialQuery) {
      return taxpayers.find(t =>
        t.gstin.toLowerCase().includes(initialQuery.toLowerCase()) ||
        t.legalName.toLowerCase().includes(initialQuery.toLowerCase())
      ) || null;
    }
    return taxpayers[0] || SAMPLE_TAXPAYERS[0];
  });
  const [searched, setSearched] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = searchValue.trim().toLowerCase();
    if (!val) return;

    setSearched(true);
    let found = null;
    if (searchType === 'gstin') {
      found = taxpayers.find(t => t.gstin.toLowerCase().includes(val));
    } else if (searchType === 'pan') {
      found = taxpayers.find(t => t.pan.toLowerCase().includes(val));
    } else {
      found = taxpayers.find(t => t.legalName.toLowerCase().includes(val) || t.tradeName.toLowerCase().includes(val));
    }
    setSearchResult(found || null);
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Search Taxpayer' }]} />
      <PageHeader
        title="Search Taxpayer Directory"
        subtitle="Verify GST registration particulars, business constitution, and active status using GSTIN, PAN, or Registered Business Name."
      />

      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: '#1e3a8a',
        marginBottom: '24px'
      }}>
        <strong>Search Directory:</strong> Verify legal taxpayer records, registered places of business, and active compliance standings.
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="searchType"
                  value="gstin"
                  checked={searchType === 'gstin'}
                  onChange={() => setSearchType('gstin')}
                />
                Search by GSTIN
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="searchType"
                  value="pan"
                  checked={searchType === 'pan'}
                  onChange={() => setSearchType('pan')}
                />
                Search by PAN
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="searchType"
                  value="name"
                  checked={searchType === 'name'}
                  onChange={() => setSearchType('name')}
                />
                Search by Trade / Legal Name
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-control"
                style={{ flex: 1, minWidth: '260px' }}
                placeholder={
                  searchType === 'gstin' ? 'Enter 15-digit GSTIN (e.g. 27AABCS1429B1Z8)...' :
                  searchType === 'pan' ? 'Enter 10-digit PAN (e.g. AABCS1429B)...' :
                  'Enter Legal or Trade Name (e.g. Samyak, Apex)...'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
                <Search size={16} /> Search Taxpayer
              </button>
            </div>
          </form>

          {/* Sample quick suggestions */}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Try Sample Queries:</span>
            {taxpayers.slice(0, 4).map(item => (
              <button
                key={item.gstin}
                type="button"
                className="badge badge-primary"
                onClick={() => {
                  setSearchType('gstin');
                  setSearchValue(item.gstin);
                  setSearchResult(item);
                  setSearched(true);
                }}
              >
                {item.gstin} ({item.tradeName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Display */}
      {searched && (
        searchResult ? (
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Building2 size={20} className="text-primary" />
                <span>Taxpayer Record Details</span>
              </div>
              <span className={`badge ${searchResult.status.includes('Active') ? 'badge-success' : 'badge-danger'}`}>
                {searchResult.status}
              </span>
            </div>
            <div className="card-body">
              <div className="form-row" style={{ gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Legal Name of Business</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {searchResult.legalName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trade Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)', marginTop: '2px' }}>
                    {searchResult.tradeName}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GST Identification Number (GSTIN)</div>
                  <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {searchResult.gstin}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Permanent Account Number (PAN)</div>
                  <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {searchResult.pan}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Constitution of Business</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                    {searchResult.constitution}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Taxpayer Type</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                    {searchResult.taxpayerType}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date of Registration</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                    {searchResult.registrationDate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Principal Jurisdiction / State</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '2px' }}>
                    {searchResult.state} (Code: {searchResult.stateCode}), {searchResult.district} - {searchResult.pincode}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: 'var(--surface-alt)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="var(--success)" />
                  <span style={{ fontSize: '0.85rem' }}>
                    Public record verification complete. Compliance rating: <strong>{searchResult.complianceRating}</strong>
                  </span>
                </div>
                <Link to={`/verify-gstin?gstin=${searchResult.gstin}`} className="btn btn-outline-primary btn-sm">
                  View Full Verification Card <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" style={{ color: 'var(--danger)' }} />
            <h4 className="empty-state-title">No Taxpayer Record Found</h4>
            <p className="empty-state-text">
              We could not find any active registration matching "{searchValue}". Try checking your input or use one of the suggested GSTINs above.
            </p>
          </div>
        )
      )}
    </div>
  );
}
