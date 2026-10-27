import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Download, Search, Eye } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';
import { useAuth } from '../../context/AuthContext';
import { downloadChallanReceipt } from '../../utils/downloadHelpers';

export default function PaymentHistory() {
  const notification = useNotification();
  const toast = notification?.toast || {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  };
  const { challans } = usePortalData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = challans.filter(c =>
    (c.cpin && c.cpin.includes(searchTerm)) ||
    (c.cin && c.cin.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.bank && c.bank.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { header: 'CPIN', field: 'cpin', render: (val) => <span className="mono"><strong>{val}</strong></span> },
    { header: 'CIN Reference', field: 'cin', render: (v) => v ? <span className="mono">{v}</span> : 'Pending' },
    { header: 'Created Date', field: 'createdDate' },
    { header: 'Collecting Bank', field: 'bank' },
    { header: 'Payment Channel', field: 'paymentMode' },
    {
      header: 'Total Paid (₹)',
      field: 'totalAmount',
      numeric: true,
      render: (v) => <strong style={{ color: 'var(--primary)' }}>₹{v.toLocaleString('en-IN')}</strong>
    },
    {
      header: 'Realization Status',
      field: 'status',
      render: (val) => (
        <span className={`badge ${val.includes('Paid') ? 'badge-success' : 'badge-warning'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Services', to: '/services' }, { label: 'Payments', to: '/payments' }, { label: 'Challan History' }]} />
      <PageHeader
        title="Challan History"
        subtitle="Complete archive of Form PMT-06 challans generated and credited into the Electronic Cash Ledger."
        actions={
          <Link to="/payments/challan" className="btn btn-primary">
            <CreditCard size={16} /> Create Challan
          </Link>
        }
      />

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-body">
          <div className="input-affix-wrapper">
            <span className="input-prefix">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control has-prefix"
              placeholder="Search by CPIN, CIN, or Bank Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={filtered}
            pageSize={10}
            actions={(row) => (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  downloadChallanReceipt(row, currentUser);
                  toast.success('Downloaded', `Receipt for CIN: ${row.cin || row.cpin} downloaded.`);
                }}
                title="Download Receipt"
              >
                <Download size={14} /> Receipt
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
