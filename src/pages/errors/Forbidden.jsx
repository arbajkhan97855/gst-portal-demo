import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Lock } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <ShieldAlert size={64} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--danger)' }}>403</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 12px' }}>
          Access Denied / Insufficient Jurisdiction
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
          You do not have the statutory clearance or authorized signatory privileges required to access this departmental module.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/login" className="btn btn-primary">
            Sign In to Taxpayer Portal
          </Link>
          <Link to="/" className="btn btn-outline">
            <Home size={16} /> Public Home
          </Link>
        </div>
      </div>
    </div>
  );
}
