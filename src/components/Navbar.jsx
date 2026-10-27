import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  HelpCircle,
  Calculator,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Navbar({ onToggleSidebar }) {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    toast.info('Logged Out', 'You have been safely logged out.');
    navigate('/login');
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    setSearchModalOpen(false);

    if (query.includes('return') || query.includes('gstr')) {
      navigate(isAuthenticated ? '/returns' : '/login');
    } else if (query.includes('pay') || query.includes('challan')) {
      navigate(isAuthenticated ? '/payments' : '/track-payment');
    } else if (query.includes('reg') || query.includes('apply')) {
      navigate('/registration');
    } else if (query.includes('inv') || query.includes('bill')) {
      navigate(isAuthenticated ? '/invoices' : '/login');
    } else if (query.includes('calc')) {
      navigate('/calculators');
    } else if (query.includes('faq')) {
      navigate('/faq');
    } else {
      navigate(`/search-taxpayer?q=${encodeURIComponent(query)}`);
    }
    setSearchQuery('');
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Left: Mobile hamburger & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && onToggleSidebar && (
            <button
              className="mobile-toggle"
              onClick={onToggleSidebar}
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu size={22} />
            </button>
          )}

          <Link to="/" className="navbar-brand">
            <div className="brand-icon-box" title="GST Tax Services Portal">
              GST
            </div>
            <div className="brand-info">
              <span className="brand-title">TAX SERVICES PORTAL</span>
              <span className="brand-subtitle">Taxpayer & Compliance Portal</span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/registration" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Registration
          </NavLink>
          <NavLink to="/returns" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Returns
          </NavLink>
          <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Payments
          </NavLink>
          <NavLink to="/search-taxpayer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Search Taxpayer
          </NavLink>
          <NavLink to="/calculators" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Calculator
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Help
          </NavLink>
        </nav>

        {/* Right: Actions, Search, Notifications, Profile/Login */}
        <div className="navbar-actions">
          {/* Quick Search Button */}
          <button
            className="icon-button"
            onClick={() => setSearchModalOpen(true)}
            title="Global Search"
            aria-label="Search portal"
          >
            <Search size={18} />
          </button>

          {/* Notifications link if logged in */}
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="icon-button" title="Notifications">
                <Bell size={18} />
                <span className="notification-badge-dot"></span>
              </Link>

              {/* User Dropdown / Trigger */}
              <Link to="/dashboard" className="user-menu-trigger" title="Go to Dashboard">
                <div className="user-avatar">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="user-meta" style={{ display: 'none', minWidth: '80px' }}>
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-gstin-tag">{currentUser.gstin}</span>
                </div>
              </Link>

              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                title="Logout"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <LogOut size={14} />
                <span style={{ fontSize: '0.8rem' }}>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <User size={14} />
              <span>Login</span>
            </Link>
          )}

          {/* Public Mobile menu toggle if not logged in */}
          {!isAuthenticated && (
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu for Public navigation */}
      {!isAuthenticated && mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="nav-link">Services</Link>
          <Link to="/registration" onClick={() => setMobileMenuOpen(false)} className="nav-link">GST Registration</Link>
          <Link to="/returns" onClick={() => setMobileMenuOpen(false)} className="nav-link">Returns Filing</Link>
          <Link to="/payments" onClick={() => setMobileMenuOpen(false)} className="nav-link">Payments</Link>
          <Link to="/search-taxpayer" onClick={() => setMobileMenuOpen(false)} className="nav-link">Search Taxpayer</Link>
          <Link to="/verify-gstin" onClick={() => setMobileMenuOpen(false)} className="nav-link">Verify GSTIN</Link>
          <Link to="/track-application" onClick={() => setMobileMenuOpen(false)} className="nav-link">Track ARN Application</Link>
          <Link to="/calculators" onClick={() => setMobileMenuOpen(false)} className="nav-link">GST Tax Calculator</Link>
          <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="nav-link">Help & FAQs</Link>
          <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ color: 'var(--accent)' }}>Officer / Admin Portal</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ marginTop: '8px' }}>
            Taxpayer Login
          </Link>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="modal-overlay" onClick={() => setSearchModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">
                <Search size={18} /> Global Portal Search
              </div>
              <button className="modal-close" onClick={() => setSearchModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleGlobalSearch}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by module (e.g. returns, challan, registration, invoice, GSTIN)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Suggestions:</span>
                  <button type="button" className="badge badge-primary" onClick={() => { setSearchQuery('returns'); }}>GSTR-1 & 3B</button>
                  <button type="button" className="badge badge-primary" onClick={() => { setSearchQuery('challan'); }}>Tax Payment Challan</button>
                  <button type="button" className="badge badge-primary" onClick={() => { setSearchQuery('registration'); }}>New Registration</button>
                  <button type="button" className="badge badge-primary" onClick={() => { setSearchQuery('invoices'); }}>Invoices</button>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setSearchModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Search Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
