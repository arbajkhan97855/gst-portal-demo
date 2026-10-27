import React from 'react';
import { Outlet } from 'react-router-dom';
import OfficialGstHeader from '../components/OfficialGstHeader';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <OfficialGstHeader />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
