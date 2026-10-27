import React from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  FileText,
  CreditCard,
  UserCheck,
  Receipt,
  RotateCcw,
  BookOpen,
  ArrowRight,
  PhoneCall,
  Mail,
  Video
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';

export default function Help() {
  const helpSections = [
    {
      title: 'Registration Help & Documentation',
      icon: <UserCheck size={24} className="text-primary" />,
      topics: [
        'How to apply for new GST registration (Form REG-01)',
        'Mandatory documents required for Proprietorship vs Company',
        'Resolving clarification notices (Form REG-03 and REG-04)',
        'Core vs Non-Core amendment workflows'
      ],
      link: '/registration'
    },
    {
      title: 'Returns Filing (GSTR-1 & 3B)',
      icon: <FileText size={24} className="text-primary" />,
      topics: [
        'Understanding invoice upload requirements in GSTR-1',
        'Reconciling eligible Input Tax Credit with GSTR-2B',
        'Settling tax liabilities using Cash and Credit ledgers in GSTR-3B',
        'Late fee and interest calculation under Section 50'
      ],
      link: '/returns'
    },
    {
      title: 'Payments & Challan Generation',
      icon: <CreditCard size={24} className="text-primary" />,
      topics: [
        'Generating payment challan Form PMT-06',
        'Supported payment modes: Net Banking, NEFT/RTGS, OTC, UPI',
        'Tracking bank realization using CIN (Challan Identification Number)',
        'Rectifying failed transaction debits'
      ],
      link: '/payments/challan'
    },
    {
      title: 'Tax Invoice & Credit/Debit Notes',
      icon: <Receipt size={24} className="text-primary" />,
      topics: [
        'Mandatory particulars under Rule 46 of CGST Rules',
        'HSN 4-digit vs 6-digit classification requirements',
        'Issuing Credit Notes for sales returns and discounts',
        'Debit Note adjustments for upward price changes'
      ],
      link: '/invoices'
    },
    {
      title: 'Refund Claims (RFD-01)',
      icon: <RotateCcw size={24} className="text-primary" />,
      topics: [
        'Filing refund for accumulated unutilized cash ledger balance',
        'Inverted duty structure refund formula and calculations',
        'Export of goods/services without payment of tax under LUT',
        'Responding to deficiency memos (RFD-08)'
      ],
      link: '/refunds'
    },
    {
      title: 'Login & Account Access Support',
      icon: <BookOpen size={24} className="text-primary" />,
      topics: [
        'Taxpayer credentials format: @samyakcomputerclasses123 / samyak@123',
        'Resetting forgotten passwords securely',
        'Two-factor authentication setup guidance',
        'Managing authorized signatories and user roles'
      ],
      link: '/login'
    }
  ];

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Help & Knowledge Center' }]} />
      <PageHeader
        title="Help & Support Desk"
        subtitle="Step-by-step guidance manuals, compliance explanations, and training resources for all portal modules."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {helpSections.map((sec, idx) => (
          <div key={idx} className="card">
            <div className="card-header">
              <div className="card-title">
                {sec.icon}
                <span style={{ fontSize: '1.05rem' }}>{sec.title}</span>
              </div>
            </div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sec.topics.map((t, tIdx) => (
                  <li key={tIdx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <Link to={sec.link} className="btn btn-outline-primary btn-sm">
                Open Module <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Box */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
            Need Personalized Assistance?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Our national support desk is ready to answer questions regarding taxpayer services and portal operations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/contact" className="btn btn-primary">
            <Mail size={16} /> Contact Support Desk
          </Link>
          <Link to="/faq" className="btn btn-outline">
            Browse All FAQs
          </Link>
        </div>
      </div>
    </div>
  );
}
