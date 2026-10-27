import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function ITC() {
  const { toast } = useNotification();
  const [reconciling, setReconciling] = useState(false);

  const itcLedger = [
    {
      id: 'itc-1',
      date: '10-Feb-2025',
      ref: 'GSTR-2B Auto-Drafted',
      supplier: 'Apex Global Logistics LLP (07AAACG9821K1Z2)',
      invoice: 'APX/24-25/1109',
      cgst: 18000,
      sgst: 18000,
      igst: 0,
      total: 36000
    },
    {
      id: 'itc-2',
      date: '08-Feb-2025',
      ref: 'GSTR-2B Auto-Drafted',
      supplier: 'Bharat Electronics & Hardware Ltd (24AAECB8832L1Z4)',
      invoice: 'BEH/9012',
      cgst: 0,
      sgst: 0,
      igst: 54000,
      total: 54000
    },
    {
      id: 'itc-3',
      date: '02-Feb-2025',
      ref: 'GSTR-2B Auto-Drafted',
      supplier: 'Tech Cloud AWS India Pvt Ltd (27AABCT9982H1Z1)',
      invoice: 'AWS-MUM-892',
      cgst: 26425,
      sgst: 26425,
      igst: 0,
      total: 52850
    }
  ];

  const columns = [
    { header: 'Credit Date', field: 'date' },
    { header: 'Supplier Legal Name & GSTIN', field: 'supplier' },
    { header: 'Supplier Invoice', field: 'invoice', render: (val) => <span className="mono">{val}</span> },
    { header: 'CGST (₹)', field: 'cgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'SGST (₹)', field: 'sgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'IGST (₹)', field: 'igst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    {
      header: 'Total ITC (₹)',
      field: 'total',
      numeric: true,
      render: (v) => <strong style={{ color: 'var(--success)' }}>₹{v.toLocaleString('en-IN')}</strong>
    }
  ];

  const handleReconcile = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
      toast.success('Reconciliation Completed', 'GSTR-2B reconciled with Purchase Register: 100% matched.');
    }, 600);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Input Tax Credit (ITC)' }]} />
      <PageHeader
        title="Input Tax Credit (ITC) & GSTR-2B Statement"
        subtitle="Track available, utilized, and eligible Input Tax Credit auto-populated from suppliers' GSTR-1 filings."
        actions={
          <button className="btn btn-primary" onClick={handleReconcile} disabled={reconciling}>
            <RefreshCw size={16} className={reconciling ? 'btn-spinner' : ''} />
            {reconciling ? 'Reconciling 2B...' : 'Reconcile with GSTR-2B'}
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Total Available ITC"
          value="₹1,42,850"
          icon={<Sparkles size={20} />}
          iconBg="blue"
          badge="100% Eligible"
          badgeType="success"
          meta="Current Month GSTR-2B"
        />

        <StatCard
          title="Utilized in GSTR-3B"
          value="₹0.00"
          icon={<CheckCircle2 size={20} />}
          iconBg="green"
          meta="Pending Offset"
        />

        <StatCard
          title="Remaining ITC Balance"
          value="₹1,42,850"
          icon={<Sparkles size={20} />}
          iconBg="purple"
          meta="Carried Forward to PMT-02"
        />

        <StatCard
          title="Ineligible ITC (Sec 17(5))"
          value="₹0.00"
          icon={<FileText size={20} />}
          iconBg="orange"
          meta="Blocked Credit: Nil"
        />
      </div>

      {/* ITC Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Sparkles size={18} className="text-primary" />
            <span>Eligible Inward Supplies Auto-Drafted in GSTR-2B</span>
          </div>
          <span className="badge badge-success">Section 16(2)(aa) Compliant</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={itcLedger}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
