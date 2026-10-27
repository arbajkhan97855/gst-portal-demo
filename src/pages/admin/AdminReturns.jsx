import React from 'react';
import { FileSpreadsheet, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { useNotification } from '../../context/NotificationContext';

export default function AdminReturns() {
  const { toast } = useNotification();

  const complianceData = [
    { period: 'January 2025', returnType: 'GSTR-3B', expected: 142000, filed: 137450, nonFilers: 4550, rate: '96.8%' },
    { period: 'January 2025', returnType: 'GSTR-1', expected: 142000, filed: 139100, nonFilers: 2900, rate: '97.9%' },
    { period: 'December 2024', returnType: 'GSTR-3B', expected: 141500, filed: 138200, nonFilers: 3300, rate: '97.6%' },
    { period: 'December 2024', returnType: 'GSTR-1', expected: 141500, filed: 139500, nonFilers: 2000, rate: '98.5%' }
  ];

  const handleIssueGstr3a = (period) => {
    toast.warning('Defaulter Notices Issued', `Form GSTR-3A non-filer notices dispatched for ${period}.`);
  };

  const columns = [
    { header: 'Tax Period', field: 'period' },
    { header: 'Return Form', field: 'returnType', render: (v) => <strong>{v}</strong> },
    { header: 'Eligible Taxpayers', field: 'expected', numeric: true, render: (v) => v.toLocaleString('en-IN') },
    { header: 'Returns Filed', field: 'filed', numeric: true, render: (v) => <span style={{ color: 'var(--success)', fontWeight: 600 }}>{v.toLocaleString('en-IN')}</span> },
    { header: 'Non-Filers', field: 'nonFilers', numeric: true, render: (v) => <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{v.toLocaleString('en-IN')}</span> },
    { header: 'Compliance Rate', field: 'rate', render: (v) => <span className="badge badge-success">{v}</span> }
  ];

  return (
    <div>
      <PageHeader
        title="Filing Compliance & Return Monitoring"
        subtitle="Track aggregate return filings across jurisdictions, identify default non-filers, and issue automated Form GSTR-3A notices."
      />

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={columns}
            data={complianceData}
            pageSize={5}
            actions={(row) => (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleIssueGstr3a(row.period)}
              >
                <Send size={14} /> Issue GSTR-3A Notice
              </button>
            )}
          />
        </div>
      </div>
    </div>
  );
}
