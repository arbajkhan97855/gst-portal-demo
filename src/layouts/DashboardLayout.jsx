import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import OfficialGstHeader from '../components/OfficialGstHeader';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const { isAuthenticated } = useAuth();

  // Protected route check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f6fa' }}>
      <OfficialGstHeader />
      <main id="dashboard-main" className="main-content" style={{ flex: 1, width: '100%', maxWidth: '1360px', margin: '0 auto', padding: '24px 20px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
