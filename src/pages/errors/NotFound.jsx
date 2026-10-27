import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <FileQuestion size={64} color="var(--primary)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '8px 0 12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
          The requested GST portal resource, filing form, or document URL does not exist or has been relocated to another section.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/dashboard" className="btn btn-outline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
