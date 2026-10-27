import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  Download,
  Info
} from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function InstalmentCalendar() {
  const { currentUser } = useAuth();
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const navigate = useNavigate();

  // DRC-20 Sanction Details
  const [sanctionOrder] = useState({
    orderNo: 'ZA0802260019482',
    orderDate: '15/02/2026',
    demandRef: 'DRC070801260049',
    totalSanctionedAmount: 240000,
    numberOfInstalments: 12,
    rateOfInterest: '18% p.a. (u/s 50)',
    issuingAuthority: 'Assistant Commissioner of State Tax, Circle-A, Jaipur'
  });

  // Schedule of 12 monthly instalments
  const [instalments, setInstalments] = useState([
    {
      instNo: 1,
      dueDate: '15/03/2026',
      principal: 20000,
      interest: 3600,
      totalPayable: 23600,
      cpin: '26032700142981',
      cin: 'SBIN260308001942',
      paymentDate: '14/03/2026',
      status: 'Paid'
    },
    {
      instNo: 2,
      dueDate: '15/04/2026',
      principal: 20000,
      interest: 3300,
      totalPayable: 23300,
      cpin: '26042700812940',
      cin: 'HDFC260408007129',
      paymentDate: '12/04/2026',
      status: 'Paid'
    },
    {
      instNo: 3,
      dueDate: '15/05/2026',
      principal: 20000,
      interest: 3000,
      totalPayable: 23000,
      cpin: '',
      cin: '',
      paymentDate: '',
      status: 'Upcoming'
    },
    {
      instNo: 4,
      dueDate: '15/06/2026',
      principal: 20000,
      interest: 2700,
      totalPayable: 22700,
      cpin: '',
      cin: '',
      paymentDate: '',
      status: 'Upcoming'
    },
    {
      instNo: 5,
      dueDate: '15/07/2026',
      principal: 20000,
      interest: 2400,
      totalPayable: 22400,
      cpin: '',
      cin: '',
      paymentDate: '',
      status: 'Upcoming'
    },
    {
      instNo: 6,
      dueDate: '15/08/2026',
      principal: 20000,
      interest: 2100,
      totalPayable: 22100,
      cpin: '',
      cin: '',
      paymentDate: '',
      status: 'Upcoming'
    }
  ]);

  const formatCurrency = (val) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePayInstalment = (inst) => {
    toast.success('Challan Pre-filled', `Generated PMT-06 challan for Instalment #${inst.instNo} (Amount: ${formatCurrency(inst.totalPayable)})`);
    navigate('/payments/challan');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>

      {/* Breadcrumb & Language */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Breadcrumb
          items={[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Services', to: '/services' },
            { label: 'Payments', to: '/payments' },
            { label: 'Instalment Calendar' }
          ]}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <span style={{ fontSize: '14px' }}>🌐</span>
          <select style={{ border: 'none', background: 'transparent', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <option>English</option>
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            backgroundColor: '#16325c',
            color: '#ffffff',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h1 style={{ fontSize: '16.5px', fontWeight: 700, margin: 0 }}>Instalment Calendar</h1>
            <p style={{ fontSize: '12px', margin: '3px 0 0', opacity: 0.85 }}>
              Payment of tax and other amounts in monthly instalments under Section 80 of the CGST Act.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info('Schedule Downloaded', 'Instalment Calendar statement downloaded in PDF.')}
            style={{
              backgroundColor: '#ffffff',
              color: '#16325c',
              border: 'none',
              borderRadius: '2px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> DOWNLOAD STATEMENT
          </button>
        </div>

        {/* Order Details Strip */}
        <div style={{ backgroundColor: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#1e293b' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div>Sanction Order No: <strong>{sanctionOrder.orderNo}</strong></div>
            <div>Order Date: <strong>{sanctionOrder.orderDate}</strong></div>
            <div>Sanctioned Demand: <strong style={{ color: '#16325c' }}>{formatCurrency(sanctionOrder.totalSanctionedAmount)}</strong></div>
            <div>No. of Instalments: <strong>{sanctionOrder.numberOfInstalments} Months</strong></div>
            <div>Interest Rate: <strong>{sanctionOrder.rateOfInterest}</strong></div>
            <div>Demand Ref (DRC-07): <strong>{sanctionOrder.demandRef}</strong></div>
            <div style={{ gridColumn: 'span 2' }}>Authority: <strong>{sanctionOrder.issuingAuthority}</strong></div>
          </div>
        </div>

        {/* Table of Instalments */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
            Monthly Payment Schedule
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Instalment #</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Due Date</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Principal (₹)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Interest (₹)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Total Payable (₹)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>CPIN / CIN</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {instalments.map((inst, idx) => (
                  <tr
                    key={inst.instNo}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: inst.status === 'Paid' ? '#ffffff' : '#fefce8'
                    }}
                  >
                    <td style={{ padding: '10px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {inst.instNo}
                    </td>
                    <td style={{ padding: '10px 14px', borderRight: '1px solid #e2e8f0', fontWeight: 600, color: '#1e293b' }}>
                      {inst.dueDate}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>
                      {formatCurrency(inst.principal)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #e2e8f0' }}>
                      {formatCurrency(inst.interest)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#16325c' }}>
                      {formatCurrency(inst.totalPayable)}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '11.5px', color: '#475569' }}>
                      {inst.cin || inst.cpin || '—'}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                      <span
                        style={{
                          backgroundColor: inst.status === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: inst.status === 'Paid' ? '#15803d' : '#b45309',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {inst.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {inst.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      {inst.status === 'Paid' ? (
                        <button
                          type="button"
                          onClick={() => toast.info('Receipt', `Payment receipt for Instalment #${inst.instNo} downloaded.`)}
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#16325c',
                            border: '1px solid #16325c',
                            borderRadius: '2px',
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          RECEIPT
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePayInstalment(inst)}
                          style={{
                            backgroundColor: '#16325c',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '2px',
                            padding: '5px 14px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          PAY NOW
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
