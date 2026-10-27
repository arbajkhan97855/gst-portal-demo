import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, IndianRupee, AlertCircle, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';

export default function Liability() {
  const liabilityBreakdown = [
    { head: 'Central Tax (CGST)', tax: 11000, interest: 0, penalty: 0, lateFee: 0, total: 11000 },
    { head: 'State Tax (SGST)', tax: 11000, interest: 0, penalty: 0, lateFee: 0, total: 11000 },
    { head: 'Integrated Tax (IGST)', tax: 2500, interest: 0, penalty: 0, lateFee: 0, total: 2500 },
    { head: 'Total Payable', tax: 24500, interest: 0, penalty: 0, lateFee: 0, total: 24500, isTotal: true }
  ];

  const columns = [
    {
      header: 'Tax Head',
      field: 'head',
      render: (val, row) => <strong>{val}</strong>
    },
    { header: 'Tax (₹)', field: 'tax', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Interest (₹)', field: 'interest', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Penalty (₹)', field: 'penalty', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Late Fee (₹)', field: 'lateFee', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    {
      header: 'Total Liability (₹)',
      field: 'total',
      numeric: true,
      render: (v, row) => (
        <strong style={{ color: row.isTotal ? 'var(--primary)' : 'inherit', fontSize: row.isTotal ? '1.05rem' : 'inherit' }}>
          ₹{v.toLocaleString('en-IN')}
        </strong>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Demand & Tax Liability' }]} />
      <PageHeader
        title="Tax Liability & Outstanding Demand Register"
        subtitle="Summary of assessed tax liabilities, statutory interest, penalties, and late fees under Part-I of Electronic Liability Register."
        actions={
          <Link to="/payments/challan" className="btn btn-primary">
            <CreditCard size={16} /> Pay Liability via Challan (PMT-06)
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Assessed Tax"
          value="₹24,500"
          icon={<IndianRupee size={20} />}
          iconBg="blue"
          meta="Current Period Liability"
        />
        <StatCard
          title="Statutory Interest"
          value="₹0.00"
          icon={<Scale size={20} />}
          iconBg="green"
          meta="Section 50 Interest"
        />
        <StatCard
          title="Penalties / Demands"
          value="₹0.00"
          icon={<ShieldCheck size={20} />}
          iconBg="green"
          meta="Nil Active SCN Demands"
        />
        <StatCard
          title="Late Fee Accrued"
          value="₹0.00"
          icon={<AlertCircle size={20} />}
          iconBg="green"
          meta="All Returns Filed In-Time"
        />
      </div>

      {/* Liability Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Scale size={18} className="text-primary" />
            <span>Form GST PMT-01: Electronic Liability Register (Return Related)</span>
          </div>
          <span className="badge badge-warning">Payable Before 20-Mar-2025</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={liabilityBreakdown}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
