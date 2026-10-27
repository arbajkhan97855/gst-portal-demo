import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import Modal from '../../components/Modal';

// Helper function to calculate exact GST statutory due dates
export const getReturnDueDates = (periodMonth, fy) => {
  const startYear = parseInt((fy || '2025-26').split('-')[0], 10);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = months.indexOf(periodMonth);
  
  let returnYear = startYear;
  if (monthIndex >= 0 && monthIndex <= 2) {
    returnYear = startYear + 1;
  }

  let nextMonthIndex = (monthIndex + 1) % 12;
  let nextYear = returnYear;
  if (monthIndex === 11) {
    nextYear = returnYear + 1;
  }

  const nextMonthNum = String(nextMonthIndex + 1).padStart(2, '0');
  
  return {
    gstr1DueDate: `11/${nextMonthNum}/${nextYear}`,
    gstr3bDueDate: `20/${nextMonthNum}/${nextYear}`,
    taxPeriodDisplay: `${periodMonth} ${returnYear}`
  };
};

export default function ReturnsOverview() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { returns: cloudReturns } = usePortalData();

  // ONLY 2026-27 and 2025-26 strictly offered in dropdown
  const [financialYear, setFinancialYear] = useState('2026-27');
  const [quarter, setQuarter] = useState('Quarter 1 (Apr - Jun)');
  const [period, setPeriod] = useState('April');

  // By default, cards are NOT shown. They ONLY appear after clicking SEARCH.
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedData, setSearchedData] = useState({
    fy: '2026-27',
    quarter: 'Quarter 1 (Apr - Jun)',
    period: 'April'
  });

  const [showAlert, setShowAlert] = useState(true);
  const [gstr1aModalOpen, setGstr1aModalOpen] = useState(false);

  // Dynamic month list by selected quarter
  const getMonthsForQuarter = (q) => {
    switch (q) {
      case 'Quarter 1 (Apr - Jun)':
        return ['April', 'May', 'June'];
      case 'Quarter 2 (Jul - Sep)':
        return ['July', 'August', 'September'];
      case 'Quarter 3 (Oct - Dec)':
        return ['October', 'November', 'December'];
      case 'Quarter 4 (Jan - Mar)':
      default:
        return ['January', 'February', 'March'];
    }
  };

  const handleQuarterChange = (e) => {
    const newQuarter = e.target.value;
    setQuarter(newQuarter);
    const months = getMonthsForQuarter(newQuarter);
    setPeriod(months[0]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedData({
      fy: financialYear,
      quarter: quarter,
      period: period
    });
    setHasSearched(true);
    setShowAlert(true);
    toast.info('Search Completed', `Showing return filing status for ${period} (${financialYear}).`);
  };

  const handleDownload = (formName) => {
    toast.success('Download Initiated', `${formName} download started for ${searchedData.period} (${searchedData.fy}).`);
  };

  const { gstr1DueDate, gstr3bDueDate } = getReturnDueDates(
    searchedData.period,
    searchedData.fy
  );

  // REAL LOGIC:
  // For 2025-26: This period was already completed/filed by the taxpayer (Status- Filed, VIEW, DOWNLOAD).
  // For 2026-27: The taxpayer HAS NOT filed yet! So it shows Due Date + PREPARE ONLINE / PREPARE OFFLINE.
  // ONLY if the user actually files it in this session/database will 2026-27 switch to Status- Filed!
  const isGstr1Filed =
    searchedData.fy === '2025-26' ||
    (cloudReturns || []).some(
      (r) =>
        r.returnType === 'GSTR-1' &&
        r.status === 'Filed' &&
        (r.taxPeriod?.toLowerCase().includes(searchedData.period.toLowerCase()) ||
          r.period?.toLowerCase().includes(searchedData.period.toLowerCase())) &&
        (r.taxPeriod?.includes('2026') || r.taxPeriod?.includes('2027'))
    );

  const isGstr3bFiled =
    searchedData.fy === '2025-26' ||
    (cloudReturns || []).some(
      (r) =>
        r.returnType === 'GSTR-3B' &&
        r.status === 'Filed' &&
        (r.taxPeriod?.toLowerCase().includes(searchedData.period.toLowerCase()) ||
          r.period?.toLowerCase().includes(searchedData.period.toLowerCase())) &&
        (r.taxPeriod?.includes('2026') || r.taxPeriod?.includes('2027'))
    );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Official Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Returns' }
        ]}
      />

      {/* Main File Returns Box */}
      <div className="gst-returns-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="gst-returns-heading" style={{ margin: 0 }}>File Returns</h2>
          <Link
            to="/returns/gstr9"
            style={{
              backgroundColor: '#173059',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            File Annual Returns (GSTR-9) &rsaquo;
          </Link>
        </div>

        {/* Yellow Notice Banner */}
        <div className="gst-returns-notice-yellow">
          Nil return for GSTR-1, GSTR-3B and CMP-08 can now be filed through SMS
        </div>

        <div className="gst-returns-mandatory-note">
          ● Indicates Mandatory Fields
        </div>

        {/* Filter Form - strictly only 2026-27 and 2025-26 */}
        <form onSubmit={handleSearch} className="gst-returns-filter-grid">
          <div className="gst-returns-field">
            <label className="gst-returns-label">
              Financial Year <span>*</span>
            </label>
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="gst-returns-select"
            >
              <option value="2026-27">2026-27</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>

          <div className="gst-returns-field">
            <label className="gst-returns-label">
              Quarter <span>*</span>
            </label>
            <select
              value={quarter}
              onChange={handleQuarterChange}
              className="gst-returns-select"
            >
              <option value="Quarter 1 (Apr - Jun)">Quarter 1 (Apr - Jun)</option>
              <option value="Quarter 2 (Jul - Sep)">Quarter 2 (Jul - Sep)</option>
              <option value="Quarter 3 (Oct - Dec)">Quarter 3 (Oct - Dec)</option>
              <option value="Quarter 4 (Jan - Mar)">Quarter 4 (Jan - Mar)</option>
            </select>
          </div>

          <div className="gst-returns-field">
            <label className="gst-returns-label">
              Period <span>*</span>
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="gst-returns-select"
            >
              {getMonthsForQuarter(quarter).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit" className="gst-returns-search-btn">
              SEARCH
            </button>
          </div>
        </form>

        {/* CARDS ARE HIDDEN BY DEFAULT. ONLY SHOWN AFTER CLICKING SEARCH */}
        {hasSearched && (
          <div>
            {/* Blue Information Banner */}
            {showAlert && (
              <div className="gst-returns-blue-alert">
                <div>
                  <strong>ℹ</strong> You have selected to file the return on monthly frequency, GSTR-1 and GSTR-3B shall be required to be filed for each month of the quarter.
                </div>
                <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontSize: '16px' }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Official 5-Cards Grid matching government portal */}
            <div className="gst-returns-cards-grid">
              {/* CARD 1: Details of outward supplies of goods or services (GSTR-1) */}
              <div className="gst-return-card">
                <div className="gst-return-card-header">
                  <div className="gst-return-card-title">
                    Details of outward supplies of goods or services
                  </div>
                  <div className="gst-return-card-subtitle">GSTR-1</div>
                </div>
                <div className="gst-return-card-body">
                  {isGstr1Filed ? (
                    <>
                      {/* For 2025-26 or already filed periods: Status- Filed + VIEW + DOWNLOAD */}
                      <div className="gst-status-filed-text">
                        Status- <span>Filed</span>
                      </div>
                      <div className="gst-return-btn-group">
                        <Link
                          to={`/returns/gstr1?fy=${encodeURIComponent(searchedData.fy)}&quarter=${encodeURIComponent(searchedData.quarter)}&period=${encodeURIComponent(searchedData.period)}`}
                          className="gst-return-action-btn"
                        >
                          VIEW
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownload('GSTR-1')}
                          className="gst-return-action-btn"
                        >
                          DOWNLOAD
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* For 2026-27 (not filed yet): Due Date + PREPARE ONLINE + PREPARE OFFLINE */}
                      <div className="gst-return-due-date">
                        Due Date - {gstr1DueDate}
                      </div>
                      <div className="gst-return-btn-group">
                        <Link
                          to={`/returns/gstr1?fy=${encodeURIComponent(searchedData.fy)}&quarter=${encodeURIComponent(searchedData.quarter)}&period=${encodeURIComponent(searchedData.period)}`}
                          className="gst-return-action-btn"
                        >
                          PREPARE ONLINE
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownload('GSTR-1 JSON')}
                          className="gst-return-action-btn"
                        >
                          PREPARE OFFLINE
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 2: Amendment of outward supplies of goods or services for current tax period (GSTR-1A) */}
              <div className="gst-return-card gst-return-card-muted">
                <div className="gst-return-card-header">
                  <div className="gst-return-card-title">
                    Amendment of outward supplies of goods or services for current tax period
                  </div>
                  <div className="gst-return-card-subtitle">GSTR-1A</div>
                </div>
                <div className="gst-return-card-body">
                  <div style={{ height: '36px' }}></div>
                  <div className="gst-return-btn-group">
                    <button
                      type="button"
                      onClick={() => setGstr1aModalOpen(true)}
                      className="gst-return-action-btn-muted"
                    >
                      PREPARE ONLINE
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 3: Auto - drafted ITC Statement for the month (GSTR-2B) */}
              <div className="gst-return-card">
                <div className="gst-return-card-header">
                  <div className="gst-return-card-title">
                    Auto - drafted ITC Statement for the month
                  </div>
                  <div className="gst-return-card-subtitle">GSTR-2B</div>
                </div>
                <div className="gst-return-card-body">
                  <div style={{ height: '36px' }}></div>
                  <div className="gst-return-btn-group">
                    <Link
                      to={`/returns/gstr2b?fy=${encodeURIComponent(searchedData.fy)}&quarter=${encodeURIComponent(searchedData.quarter)}&period=${encodeURIComponent(searchedData.period)}`}
                      className="gst-return-action-btn"
                    >
                      VIEW
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDownload('GSTR-2B')}
                      className="gst-return-action-btn"
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 4: Monthly Return (GSTR-3B) */}
              <div className="gst-return-card">
                <div className="gst-return-card-header">
                  <div className="gst-return-card-title">
                    Monthly Return
                  </div>
                  <div className="gst-return-card-subtitle">GSTR-3B</div>
                </div>
                <div className="gst-return-card-body">
                  {isGstr3bFiled ? (
                    <>
                      {/* For 2025-26 or already filed periods: Status- Filed + VIEW GSTR3B + DOWNLOAD */}
                      <div className="gst-status-filed-text">
                        Status- <span>Filed</span>
                      </div>
                      <div className="gst-return-btn-group">
                        <Link
                          to={`/returns/gstr3b?fy=${encodeURIComponent(searchedData.fy)}&quarter=${encodeURIComponent(searchedData.quarter)}&period=${encodeURIComponent(searchedData.period)}`}
                          className="gst-return-action-btn"
                        >
                          VIEW GSTR3B
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownload('GSTR-3B')}
                          className="gst-return-action-btn"
                        >
                          DOWNLOAD
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* For 2026-27 (not filed yet): Due Date + PREPARE ONLINE + PREPARE OFFLINE */}
                      <div className="gst-return-due-date">
                        Due Date - {gstr3bDueDate}
                      </div>
                      <div className="gst-return-btn-group">
                        <Link
                          to={`/returns/gstr3b?fy=${encodeURIComponent(searchedData.fy)}&quarter=${encodeURIComponent(searchedData.quarter)}&period=${encodeURIComponent(searchedData.period)}`}
                          className="gst-return-action-btn"
                        >
                          PREPARE ONLINE
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDownload('GSTR-3B JSON')}
                          className="gst-return-action-btn"
                        >
                          PREPARE OFFLINE
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* CARD 5: Auto Drafted details (For view only) (GSTR-2A) */}
              <div className="gst-return-card">
                <div className="gst-return-card-header">
                  <div className="gst-return-card-title">
                    Auto Drafted details (For view only)
                  </div>
                  <div className="gst-return-card-subtitle">GSTR-2A</div>
                </div>
                <div className="gst-return-card-body">
                  <div style={{ height: '36px' }}></div>
                  <div className="gst-return-btn-group">
                    <Link to="/itc" className="gst-return-action-btn">
                      VIEW
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDownload('GSTR-2A')}
                      className="gst-return-action-btn"
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GSTR-1A Modal */}
      <Modal
        isOpen={gstr1aModalOpen}
        onClose={() => setGstr1aModalOpen(false)}
        title="Form GSTR-1A - Amendment of Outward Supplies"
        size="md"
      >
        <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#1e293b' }}>
          <p>
            Form GSTR-1A allows taxpayers to amend or add records to Form GSTR-1 after filing GSTR-1 and before filing Form GSTR-3B for the tax period <strong>{searchedData.period} ({searchedData.fy})</strong>.
          </p>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '4px', marginBottom: '14px', color: '#166534' }}>
            ✓ Both Form GSTR-1 and GSTR-3B are accessible for this tax period.
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              onClick={() => setGstr1aModalOpen(false)}
              className="gst-return-action-btn"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
