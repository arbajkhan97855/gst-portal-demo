import React from 'react';
import { IndianRupee, Download, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function AdminPayments() {
  const { toast } = useNotification();

  const collections = [
    { month: 'January 2025', sgst: 1420, cgst: 1410, igst: 1120, cess: 170, total: 4120 },
    { month: 'December 2024', sgst: 1380, cgst: 1375, igst: 1090, cess: 155, total: 4000 },
    { month: 'November 2024', sgst: 1310, cgst: 1300, igst: 1050, cess: 140, total: 3800 },
    { month: 'October 2024', sgst: 1250, cgst: 1240, igst: 1010, cess: 130, total: 3630 }
  ];

  const columns = [
    { header: 'Month', field: 'month', render: (v) => <strong>{v}</strong> },
    { header: 'State GST (₹ Cr)', field: 'sgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Central GST (₹ Cr)', field: 'cgst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Integrated GST (₹ Cr)', field: 'igst', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    { header: 'Compensation Cess (₹ Cr)', field: 'cess', numeric: true, render: (v) => `₹${v.toLocaleString('en-IN')}` },
    {
      header: 'Total Gross Collections (₹ Cr)',
      field: 'total',
      numeric: true,
      render: (v) => <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>₹{v.toLocaleString('en-IN')} Cr</strong>
    }
  ];

  return (
    <div>
      <PageHeader
        title="State Tax Revenue Collections Register"
        subtitle="Gross revenue realization analytics broken down into Central, State, and Integrated Tax headers."
        actions={
          <button
            className="btn btn-outline-primary"
            onClick={() => toast.success('Exported', 'Monthly revenue collections statement downloaded.')}
          >
            <Download size={16} /> Export Revenue Report (XLSX)
          </button>
        }
      />

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={collections}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
}
