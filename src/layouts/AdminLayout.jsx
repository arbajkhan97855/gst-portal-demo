import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  FileCheck,
  FileSpreadsheet,
  IndianRupee,
  BellRing,
  BarChart3,
  Settings,
  ArrowLeft,
  Menu
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminLink = (to, icon, label) => (
    <NavLink
      to={to}
      end={to === '/admin'}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
    >
      <div className="sidebar-link-inner">
        {React.cloneElement(icon, { size: 17 })}
        <span>{label}</span>
      </div>
    </NavLink>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="app-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-content">
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={16} /> OFFICER & TAX AUTHORITY PORTAL
              </div>
              <p style={{ fontSize: '0.72rem', color: '#78350f', marginTop: '4px' }}>
                Departmental GST Assessment & Scrutiny Portal.
              </p>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-heading">Administration</div>
              {adminLink('/admin', <ShieldAlert />, 'Admin Dashboard')}
              {adminLink('/admin/users', <Users />, 'Taxpayer Accounts')}
              {adminLink('/admin/applications', <FileCheck />, 'Registration Reviews')}
              {adminLink('/admin/returns', <FileSpreadsheet />, 'Filing Compliance')}
              {adminLink('/admin/payments', <IndianRupee />, 'Revenue Collections')}
              {adminLink('/admin/notices', <BellRing />, 'Notices & Demands')}
              {adminLink('/admin/reports', <BarChart3 />, 'State Analytics')}
              {adminLink('/admin/settings', <Settings />, 'Portal Config')}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <Link to="/dashboard" className="btn btn-outline btn-full btn-sm" style={{ gap: '6px' }}>
                <ArrowLeft size={14} /> Back to Taxpayer Portal
              </Link>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
