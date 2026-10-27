import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCheck,
  FileText,
  CreditCard,
  RotateCcw,
  Receipt,
  Search,
  Scale,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 'reg',
      category: 'registration',
      title: 'New GST Registration',
      code: 'REG-01',
      desc: 'Application for registration as a regular taxpayer, composition scheme, casual taxable person, or non-resident.',
      link: '/registration'
    },
    {
      id: 'reg-status',
      category: 'registration',
      title: 'Track Registration Status',
      code: 'ARN-01',
      desc: 'Real-time status check using 15-character Application Reference Number (ARN) for pending, approved, or rejected applications.',
      link: '/track-application'
    },
    {
      id: 'ret-gstr1',
      category: 'returns',
      title: 'GSTR-1 Outward Supplies',
      code: 'GSTR-1',
      desc: 'Monthly/quarterly details of outward supplies of goods and services including B2B, B2C, credit notes, and HSN summary.',
      link: '/returns/gstr1'
    },
    {
      id: 'ret-gstr3b',
      category: 'returns',
      title: 'GSTR-3B Summary Return',
      code: 'GSTR-3B',
      desc: 'Monthly self-declaration of summary outward supplies, input tax credit claimed, and tax liability settlement.',
      link: '/returns/gstr3b'
    },
    {
      id: 'ret-gstr9',
      category: 'returns',
      title: 'GSTR-9 Annual Return',
      code: 'GSTR-9',
      desc: 'Comprehensive annual consolidation of all monthly/quarterly returns filed throughout the financial year.',
      link: '/returns/gstr9'
    },
    {
      id: 'pay-challan',
      category: 'payments',
      title: 'Create Payment Challan',
      code: 'PMT-06',
      desc: 'Generate electronic challan for cash deposit via Net Banking, Over the Counter (OTC), NEFT/RTGS, or UPI.',
      link: '/payments/challan'
    },
    {
      id: 'pay-history',
      category: 'payments',
      title: 'Track Challan History',
      code: 'PMT-07',
      desc: 'View status of generated challans, search by CPIN/CIN, and download official payment acknowledgment slips.',
      link: '/payments/history'
    },
    {
      id: 'inv-create',
      category: 'invoices',
      title: 'Tax Invoice Generator',
      code: 'INV-TAX',
      desc: 'Generate standard GST Tax Invoices compliant with Section 31 rules, featuring dynamic tax splits and printable layout.',
      link: '/invoices/create'
    },
    {
      id: 'rfd-apply',
      category: 'refund',
      title: 'Application for Refund',
      code: 'RFD-01',
      desc: 'File claims for refund of excess cash ledger balance, inverted duty structure, or zero-rated export supplies.',
      link: '/refunds/apply'
    },
    {
      id: 'srch-taxpayer',
      category: 'search',
      title: 'Search Taxpayer by GSTIN / PAN',
      code: 'SRCH-01',
      desc: 'Verify taxpayer details, state jurisdiction, active status, filing frequency, and compliance rating.',
      link: '/search-taxpayer'
    },
    {
      id: 'calc-gst',
      category: 'compliance',
      title: 'GST Rate Calculator',
      code: 'CALC-01',
      desc: 'Quick calculation of CGST, SGST, and IGST for amounts at standard tax slabs (0%, 5%, 12%, 18%, 28%).',
      link: '/calculators'
    },
    {
      id: 'rep-sales',
      category: 'reports',
      title: 'Compliance Reports & Analytics',
      code: 'REP-01',
      desc: 'Generate sales, purchase, ITC utilization, and liability reconciliation reports by financial year and quarter.',
      link: '/reports'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'registration', label: 'Registration' },
    { id: 'returns', label: 'Returns' },
    { id: 'payments', label: 'Payments' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'refund', label: 'Refunds' },
    { id: 'search', label: 'Search' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'reports', label: 'Reports' }
  ];

  const filtered = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Taxpayer Services Directory' }]} />
      <PageHeader
        title="Taxpayer Services Directory"
        subtitle="Explore the exhaustive catalog of digital GST compliance workflows, filing modules, and public verification tools."
      />

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of services */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="card-title" style={{ fontSize: '1rem' }}>{item.title}</span>
              <span className="badge badge-primary">{item.code}</span>
            </div>
            <div className="card-body" style={{ flex: 1 }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {item.desc}
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '0.78rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                {item.category}
              </span>
              <Link to={item.link} className="btn btn-outline-primary btn-sm">
                Access Service <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
