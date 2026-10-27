import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ServerError() {
  return (
    <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <AlertTriangle size={64} color="var(--warning)" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning)' }}>500</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 12px' }}>
          Portal Service Temporarily Unavailable
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
          The common portal system encountered an internal execution anomaly while validating the filing payload. Please refresh or retry.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Retry Operation
          </button>
          <Link to="/" className="btn btn-outline">
            <Home size={16} /> Back to Portal Home
          </Link>
        </div>
      </div>
    </div>
  );
}
