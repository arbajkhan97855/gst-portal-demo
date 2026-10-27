import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calendar,
  Building
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function TransitionForms() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();

  const gstin = currentUser?.gstin || '08NSGPS8609G1ZY';
  const legalName = currentUser?.legalName || 'RAVI SAINI';
  const tradeName = currentUser?.tradeName || 'FACTORY OUTLETS';

  const forms = [
    {
      id: 'tran-1',
      code: 'GST TRAN-1',
      title: 'GST TRAN-1 : Declaration for transition of ITC / stock on migration to GST',
      description: 'Credit carried forward in the return furnished under the erstwhile existing law, unavailed cenvat credit on capital goods, inputs held in stock.',
      status: 'Filed',
      arn: 'AA0807170029103',
      filedDate: '27/12/2017',
      totalClaimed: '₹4,85,200'
    },
    {
      id: 'tran-2',
      code: 'GST TRAN-2',
      title: 'GST TRAN-2 : Details of inputs held in stock on appointment day (Duty paying document unavailable)',
      description: 'Statement of outward supplies of goods on which credit is admissible u/s 140(3) where invoices/duty paying documents were not available.',
      status: 'Filed',
      arn: 'AA0806180018420',
      filedDate: '30/06/2018',
      totalClaimed: '₹1,24,500'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Returns', to: '/returns' },
            { label: 'Transition Forms' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Taxpayer Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px 24px', fontSize: '13px', color: '#1e293b' }}>
          <div>GSTIN: <strong>{gstin}</strong></div>
          <div>Legal Name: <strong>{legalName}</strong></div>
          <div>Trade Name: <strong>{tradeName}</strong></div>
          <div>Transition Status: <strong style={{ color: '#16a34a' }}>Completed & Transition Credit Settled</strong></div>
        </div>
      </div>

      {/* Header Banner */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '20px 24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
          Transition Forms (Form GST TRAN-1 & Form GST TRAN-2)
        </h2>
        <div style={{ fontSize: '13px', color: '#64748b' }}>
          Forms submitted under Chapter XX (Transitional Provisions) of CGST / SGST Act 2017 to migrate credit from erstwhile Central Excise, Service Tax, and State VAT.
        </div>
      </div>

      {/* Transition Forms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
        {forms.map((f) => (
          <div
            key={f.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ backgroundColor: '#173059', color: '#ffffff', padding: '14px 18px', fontWeight: 700, fontSize: '14px' }}>
                {f.title}
              </div>
              <div style={{ padding: '18px 20px', fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 14px 0' }}>{f.description}</p>
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '4px', color: '#166534', fontSize: '12.5px' }}>
                  <div><strong>Status:</strong> Filed ({f.arn})</div>
                  <div><strong>Filing Date:</strong> {f.filedDate}</div>
                  <div><strong>Credit Credited to Electronic Credit Ledger:</strong> <strong style={{ color: '#15803d' }}>{f.totalClaimed}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => toast.info('View Form', `Displaying archived filing details for ${f.code}.`)}
                style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '8px 22px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                VIEW FILED FORM
              </button>
              <button
                type="button"
                onClick={() => toast.success('Downloaded', `Acknowledged copy of ${f.code} downloaded.`)}
                style={{ backgroundColor: '#173059', color: '#ffffff', border: 'none', borderRadius: '3px', padding: '8px 22px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                DOWNLOAD SUMMARY (PDF)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
