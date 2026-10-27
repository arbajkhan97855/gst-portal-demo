import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  RotateCcw,
  Sparkles,
  BookOpen,
  Scale,
  BellRing,
  FileText,
  Download,
  BarChart3,
  HelpCircle,
  Settings,
  ShieldCheck,
  Clock,
  ShieldAlert,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Session Ended', 'Logged out successfully.');
    navigate('/login');
  };

  const navItem = (to, icon, label, badge = null) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    >
      <div className="sidebar-link-inner">
        {React.cloneElement(icon, { size: 17 })}
        <span>{label}</span>
      </div>
      {badge && <span className="tab-badge">{badge}</span>}
    </NavLink>
  );

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Taxpayer Portal Sidebar">
        <div className="sidebar-content">
          {/* Main Dashboard */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Overview</div>
            {navItem('/dashboard', <LayoutDashboard />, 'Dashboard')}
            {navItem('/profile', <UserCheck />, 'Taxpayer Profile')}
          </div>

          {/* Tax Filings & Invoices */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Returns & Invoicing</div>
            {navItem('/returns', <FileSpreadsheet />, 'Returns Filing', 'Due Soon')}
            {navItem('/returns/gstr1', <ChevronRight />, 'GSTR-1 (Outward)')}
            {navItem('/returns/gstr3b', <ChevronRight />, 'GSTR-3B (Summary)')}
            {navItem('/returns/gstr9', <ChevronRight />, 'Annual Return (GSTR-9)')}
            {navItem('/returns/history', <Clock />, 'Filing History')}
            {navItem('/invoices', <Receipt />, 'Invoices Management')}
            {navItem('/invoices/create', <ChevronRight />, 'Create Tax Invoice')}
          </div>

          {/* Payments & Financials */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Tax Payments & Funds</div>
            {navItem('/payments', <CreditCard />, 'Payments Overview')}
            {navItem('/payments/challan', <ChevronRight />, 'Create Challan (PMT-06)')}
            {navItem('/payments/history', <ChevronRight />, 'Challan History')}
            {navItem('/refunds', <RotateCcw />, 'Refunds (RFD-01)')}
          </div>

          {/* Ledgers & ITC */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Ledgers & Credits</div>
            {navItem('/itc', <Sparkles />, 'Input Tax Credit (ITC)')}
            {navItem('/ledgers', <BookOpen />, 'Electronic Ledgers')}
            {navItem('/liability', <Scale />, 'Demand & Liability')}
            {navItem('/notices', <BellRing />, 'Notices & Orders', '1 New')}
          </div>

          {/* Registration & Services */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Registration & Tools</div>
            {navItem('/registration', <UserCheck />, 'Registration Wizard')}
            {navItem('/registration/status', <ChevronRight />, 'Track Application (ARN)')}
            {navItem('/calculators', <Scale />, 'GST Tax Calculator')}
            {navItem('/reports', <BarChart3 />, 'Tax & Sales Reports')}
            {navItem('/documents', <FileText />, 'Document Center')}
            {navItem('/downloads', <Download />, 'Downloads')}
          </div>

          {/* Account & Administration */}
          <div className="sidebar-section">
            <div className="sidebar-heading">Account & System</div>
            {navItem('/notifications', <BellRing />, 'Notification Center')}
            {navItem('/activity', <Clock />, 'Activity Audit Log')}
            {navItem('/settings', <Settings />, 'Preferences & Theme')}
            {navItem('/security', <ShieldCheck />, 'Security & Sessions')}
            {navItem('/help', <HelpCircle />, 'Help & Support')}
            {navItem('/admin', <ShieldAlert />, 'Admin / Officer Portal', 'Admin')}
          </div>
        </div>

        {/* Sidebar Footer with quick profile card */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-details">
              <div className="sidebar-user-avatar">
                {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
              </div>
              <div className="sidebar-user-text">
                <span className="sidebar-user-title">{currentUser?.tradeName || currentUser?.name}</span>
                <span className="sidebar-user-sub">{currentUser?.gstin || '27AABCS1429B1Z8'}</span>
              </div>
            </div>
            <button
              className="logout-icon-btn"
              onClick={handleLogout}
              title="Logout Session"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
