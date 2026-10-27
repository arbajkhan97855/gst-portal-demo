import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ServicesMegaMenu({ isOpen, onClose, isAuthenticated }) {
  const navigate = useNavigate();

  // Define tabs before and after login
  const publicTabs = [
    { id: 'registration', label: 'Registration' },
    { id: 'ledgers', label: 'Ledgers' },
    { id: 'returns', label: 'Returns' },
    { id: 'payments', label: 'Payments' },
    { id: 'user_services', label: 'User Services' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'eway_bill', label: 'e-Way Bill System' },
    { id: 'track_status', label: 'Track Application Status' },
  ];

  const authenticatedTabs = [
    { id: 'registration', label: 'Registration' },
    { id: 'ledgers', label: 'Ledgers' },
    { id: 'returns', label: 'Returns' },
    { id: 'payments', label: 'Payments' },
    { id: 'user_services', label: 'User Services' },
    { id: 'refunds', label: 'Refunds' },
    { id: 'eway_bill', label: 'e-Way Bill System' },
    { id: 'track_status', label: 'Track Application Status' },
  ];

  const currentTabs = isAuthenticated ? authenticatedTabs : publicTabs;
  const [activeTab, setActiveTab] = useState('registration');

  useEffect(() => {
    // When switching auth state, ensure active tab is valid
    if (!currentTabs.some((t) => t.id === activeTab)) {
      setActiveTab(currentTabs[0].id);
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleLinkClick = (path, isExternal = false) => {
    onClose();
    if (isExternal) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="gst-mega-menu"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      {/* Tier 1: Horizontal Sub-categories bar */}
      <div className="gst-mega-tabs-bar">
        <div className="gst-mega-tabs-container">
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              className={`gst-mega-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveTab(tab.id)}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'track_status') {
                  handleLinkClick('/track-application');
                } else if (tab.id === 'eway_bill') {
                  handleLinkClick('https://ewaybillgst.gov.in', true);
                }
              }}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tier 2: Sub-items Content Area */}
      <div className="gst-mega-content-container">
        {/* 1. REGISTRATION TAB */}
        {activeTab === 'registration' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              {!isAuthenticated ? (
                <>
                  <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                    New Registration
                  </Link>
                  <Link to="/track-application" onClick={onClose} className="gst-mega-sublink">
                    Application for Filing Clarifications
                  </Link>
                  <Link to="/help" onClick={onClose} className="gst-mega-sublink">
                    Home State GSK selection for Promoter/Director of specific COBs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                    Application for Amendment of Core Fields
                  </Link>
                  <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                    Application for Amendment of Non-Core Fields
                  </Link>
                  <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                    Application for Cancellation of Registration
                  </Link>
                </>
              )}
            </div>
            <div className="gst-mega-link-col">
              {!isAuthenticated ? (
                <>
                  <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                    Multi-State Registration
                  </Link>
                  <Link to="/track-application" onClick={onClose} className="gst-mega-sublink">
                    Track Application Status
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/track-application" onClick={onClose} className="gst-mega-sublink">
                    Track Application Status
                  </Link>
                  <Link to="/track-application" onClick={onClose} className="gst-mega-sublink">
                    Application for Revocation of Cancelled Registration
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. LEDGERS TAB (Only When Logged In) */}
        {isAuthenticated && activeTab === 'ledgers' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              <Link to="/ledgers" onClick={onClose} className="gst-mega-sublink">
                Electronic Cash Ledger
              </Link>
              <Link to="/ledgers" onClick={onClose} className="gst-mega-sublink">
                Electronic Credit Ledger
              </Link>
            </div>
            <div className="gst-mega-link-col">
              <Link to="/liability" onClick={onClose} className="gst-mega-sublink">
                Electronic Liability Register
              </Link>
              <Link to="/payments/challan" onClick={onClose} className="gst-mega-sublink">
                Payment towards Demand
              </Link>
            </div>
          </div>
        )}

        {/* 3. RETURNS TAB */}
        {activeTab === 'returns' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              <Link to="/returns" onClick={onClose} className="gst-mega-sublink">
                Returns Dashboard
              </Link>
              <Link to="/returns/status" onClick={onClose} className="gst-mega-sublink">
                Track Return Status
              </Link>
              <Link to="/returns/itc-forms" onClick={onClose} className="gst-mega-sublink">
                ITC Forms
              </Link>
              <Link to="/returns/tds-tcs" onClick={onClose} className="gst-mega-sublink">
                TDS and TCS credit received
              </Link>
              <Link to="/returns/quarterly-opt-in" onClick={onClose} className="gst-mega-sublink">
                Opt-in for Quarterly Return
              </Link>
              <Link to="/returns/ims-dashboard" onClick={onClose} className="gst-mega-sublink">
                Invoice Management System (IMS) Dashboard
              </Link>
            </div>
            <div className="gst-mega-link-col">
              <Link to="/returns/history" onClick={onClose} className="gst-mega-sublink">
                View Filed Returns
              </Link>
              <Link to="/returns/transition-forms" onClick={onClose} className="gst-mega-sublink">
                Transition Forms
              </Link>
              <Link to="/returns/annual" onClick={onClose} className="gst-mega-sublink">
                Annual Return
              </Link>
              <Link to="/returns/liability-itc-comparison" onClick={onClose} className="gst-mega-sublink">
                Tax liabilities and ITC comparison
              </Link>
              <Link to="/returns/compliance" onClick={onClose} className="gst-mega-sublink">
                Return Compliance
              </Link>
              <Link to="/returns/unbarring-application" onClick={onClose} className="gst-mega-sublink">
                Application for Unbarring Returns
              </Link>
            </div>
          </div>
        )}

        {/* 4. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              <Link to="/payments/challan" onClick={onClose} className="gst-mega-sublink">
                Create Challan
              </Link>
              <Link to="/payments/history" onClick={onClose} className="gst-mega-sublink">
                Challan History
              </Link>
              <Link to="/payments/instalment-calendar" onClick={onClose} className="gst-mega-sublink">
                Instalment Calendar
              </Link>
            </div>
            <div className="gst-mega-link-col">
              <Link to="/payments/saved-challans" onClick={onClose} className="gst-mega-sublink">
                Saved Challans
              </Link>
              <Link to="/payments/deferred-payment" onClick={onClose} className="gst-mega-sublink">
                Application for Deferred Payment/Payment in Instalments
              </Link>
              <Link to="/payments/grievance-pmt07" onClick={onClose} className="gst-mega-sublink">
                Grievance against Payment(GST PMT-07)
              </Link>
            </div>
          </div>
        )}

        {/* 5. USER SERVICES TAB */}
        {activeTab === 'user_services' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              {isAuthenticated && (
                <>
                  <Link to="/returns/history" onClick={onClose} className="gst-mega-sublink">
                    View My Submissions
                  </Link>
                  <Link to="/notices" onClick={onClose} className="gst-mega-sublink">
                    View Notices and Orders
                  </Link>
                </>
              )}
              <Link to="/search-taxpayer" onClick={onClose} className="gst-mega-sublink">
                Search HSN Code
              </Link>
              {!isAuthenticated && (
                <Link to="/registration" onClick={onClose} className="gst-mega-sublink">
                  Generate User ID for Unregistered Applicant
                </Link>
              )}
              <Link to="/help" onClick={onClose} className="gst-mega-sublink">
                Cause List
              </Link>
              <Link to="/search-taxpayer" onClick={onClose} className="gst-mega-sublink">
                Verify RFN
              </Link>
            </div>
            <div className="gst-mega-link-col">
              {isAuthenticated && (
                <Link to="/profile" onClick={onClose} className="gst-mega-sublink">
                  View / Download Certificates
                </Link>
              )}
              <Link to="/help" onClick={onClose} className="gst-mega-sublink">
                Holiday List
              </Link>
              <Link to="/search-taxpayer" onClick={onClose} className="gst-mega-sublink">
                Locate GST Practitioner (GSTP)
              </Link>
              <Link to="/help" onClick={onClose} className="gst-mega-sublink">
                Search Advance Ruling
              </Link>
            </div>
          </div>
        )}

        {/* 6. REFUNDS TAB */}
        {activeTab === 'refunds' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              {isAuthenticated && (
                <>
                  <Link to="/refunds/apply" onClick={onClose} className="gst-mega-sublink">
                    Application for Refund
                  </Link>
                  <Link to="/refunds" onClick={onClose} className="gst-mega-sublink">
                    Saved / Submitted Applications
                  </Link>
                </>
              )}
              <Link to="/refunds/status" onClick={onClose} className="gst-mega-sublink">
                Track Application Status
              </Link>
            </div>
            <div className="gst-mega-link-col"></div>
          </div>
        )}

        {/* 7. e-WAY BILL SYSTEM */}
        {activeTab === 'eway_bill' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              <a
                href="https://ewaybillgst.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="gst-mega-sublink"
              >
                e-Way Bill System
              </a>
            </div>
            <div className="gst-mega-link-col"></div>
          </div>
        )}

        {/* 8. TRACK APPLICATION STATUS */}
        {activeTab === 'track_status' && (
          <div className="gst-mega-links-grid">
            <div className="gst-mega-link-col">
              <Link to="/track-application" onClick={onClose} className="gst-mega-sublink">
                Track Application Status
              </Link>
            </div>
            <div className="gst-mega-link-col"></div>
          </div>
        )}
      </div>
    </div>
  );
}
