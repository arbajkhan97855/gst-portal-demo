import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmblemOfIndia from './EmblemOfIndia';
import ServicesMegaMenu from './ServicesMegaMenu';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ChevronDown, ExternalLink } from 'lucide-react';

export default function OfficialGstHeader() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { toast } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [highContrast, setHighContrast] = useState(false);

  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  const handleLogout = () => {
    logout();
    toast.info('Logged Out', 'You have been safely logged out.');
    navigate('/login');
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  return (
    <header className="gst-header-root">
      {/* 1. Top Utility Accessibility Bar */}
      <div className="gst-topbar">
        <div className="gst-topbar-container">
          <a href="#main-content" className="gst-topbar-link">
            Skip to Main Content
          </a>
          <button
            onClick={toggleContrast}
            className="gst-accessibility-btn"
            title="Toggle High Contrast"
            aria-label="High Contrast"
          >
            ◐
          </button>
          <button
            onClick={() => document.body.style.fontSize = '15px'}
            className="gst-accessibility-btn"
            title="Increase Font Size"
            aria-label="Font Increase"
          >
            A+
          </button>
          <button
            onClick={() => document.body.style.fontSize = '14px'}
            className="gst-accessibility-btn"
            title="Standard Font Size"
            aria-label="Font Standard"
          >
            A-
          </button>
        </div>
      </div>

      {/* 2. Main National Header Banner */}
      <div className="gst-main-header">
        <div className="gst-header-container">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="gst-branding-group">
            <div className="gst-emblem-box">
              <EmblemOfIndia height={68} width={50} fill="#ffffff" />
            </div>
            <div className="gst-title-group">
              <h1>Goods and Services Tax</h1>
              <p>Government of India, States and Union Territories</p>
            </div>
          </Link>

          <div className="gst-header-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/registration" className="gst-header-btn">
                  REGISTER
                </Link>
                <Link to="/registration" className="gst-header-btn">
                  MULTI-STATE REGISTRATION
                </Link>
                <Link
                  to="/login"
                  className="gst-header-btn"
                  style={{
                    backgroundColor: isLoginPage ? '#ffffff' : '#f8fafc',
                    color: '#0b2246',
                    fontWeight: 800
                  }}
                >
                  LOGIN
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="gst-user-badge">
                  <span>Welcome, <strong>{currentUser.tradeName || currentUser.businessName}</strong></span>
                  <span style={{ color: '#93c5fd' }}>| GSTIN: <strong>{currentUser.gstin}</strong></span>
                </div>
                <button onClick={handleLogout} className="gst-header-btn" style={{ padding: '6px 14px' }}>
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Official Primary Navigation Bar */}
      <nav
        className="gst-navbar"
        aria-label="Official GST Navigation"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="gst-navbar-container">
          <ul className="gst-nav-menu">
            <li className="gst-nav-item">
              <Link
                to={isAuthenticated ? '/dashboard' : '/'}
                className={`gst-nav-link ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                {isAuthenticated ? 'Dashboard' : 'Home'}
              </Link>
            </li>

            {/* Services Mega Menu Nav Item */}
            <li
              className="gst-nav-item"
              onMouseEnter={() => setActiveDropdown('services')}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`gst-nav-link ${activeDropdown === 'services' ? 'mega-active' : ''} ${!activeDropdown && (isLoginPage || location.pathname.includes('/returns') || location.pathname.includes('/payments') || location.pathname.includes('/registration')) ? 'highlight-teal' : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                Services <span className="gst-dropdown-indicator">▾</span>
              </button>
            </li>

            <li className="gst-nav-item">
              <Link to="/help" className={`gst-nav-link ${location.pathname === '/help' ? 'active' : ''}`}>
                GST Law
              </Link>
            </li>

            {/* Downloads Dropdown */}
            <li
              className="gst-nav-item"
              onMouseEnter={() => setActiveDropdown('downloads')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/downloads"
                className={`gst-nav-link ${location.pathname === '/downloads' ? 'active' : ''}`}
              >
                Downloads <span className="gst-red-badge-dot"></span> <span className="gst-dropdown-indicator">▾</span>
              </Link>
              {activeDropdown === 'downloads' && (
                <ul className="gst-dropdown-menu">
                  <li><Link to="/downloads" className="gst-dropdown-item">Offline Returns Preparation Tool</Link></li>
                  <li><Link to="/downloads" className="gst-dropdown-item">Form GSTR-1 Excel Template</Link></li>
                  <li><Link to="/downloads" className="gst-dropdown-item">Form GSTR-3B Offline Utility</Link></li>
                  <li><Link to="/downloads" className="gst-dropdown-item">Matching Tool & Schema</Link></li>
                </ul>
              )}
            </li>

            {/* Search Taxpayer Dropdown */}
            <li
              className="gst-nav-item"
              onMouseEnter={() => setActiveDropdown('search')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/search-taxpayer"
                className={`gst-nav-link ${location.pathname === '/search-taxpayer' || location.pathname === '/verify-gstin' ? 'active' : ''}`}
              >
                Search Taxpayer <span className="gst-dropdown-indicator">▾</span>
              </Link>
              {activeDropdown === 'search' && (
                <ul className="gst-dropdown-menu">
                  <li><Link to="/search-taxpayer" className="gst-dropdown-item">Search by GSTIN / UIN</Link></li>
                  <li><Link to="/verify-gstin" className="gst-dropdown-item">Search by PAN</Link></li>
                  <li><Link to="/track-application" className="gst-dropdown-item">Track Application Status (ARN)</Link></li>
                  <li><Link to="/track-payment" className="gst-dropdown-item">Track Payment Status (CIN)</Link></li>
                </ul>
              )}
            </li>

            <li className="gst-nav-item">
              <Link to="/faq" className={`gst-nav-link ${location.pathname === '/faq' ? 'active' : ''}`}>
                Help and Taxpayer Facilities
              </Link>
            </li>

            <li className="gst-nav-item">
              <Link
                to={isAuthenticated ? '/invoices' : '/login'}
                className={`gst-nav-link ${location.pathname.includes('/invoices') ? 'active' : ''}`}
              >
                e-Invoice
              </Link>
            </li>

            <li className="gst-nav-item">
              <Link to="/notices" className={`gst-nav-link ${location.pathname === '/notices' ? 'active' : ''}`}>
                News and Updates
              </Link>
            </li>

            {isAuthenticated && (
              <li className="gst-nav-item">
                <Link
                  to="/invoices/create"
                  className={`gst-nav-link ${location.pathname === '/invoices/create' ? 'active' : ''}`}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  + Create Invoice
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* 2-Tier Official GST Mega Menu for Services */}
        <ServicesMegaMenu
          isOpen={activeDropdown === 'services'}
          onClose={() => setActiveDropdown(null)}
          isAuthenticated={isAuthenticated}
        />
      </nav>
    </header>
  );
}
