import React from 'react';
import { BarChart3, TrendingUp, Users, Download, FileSpreadsheet } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useNotification } from '../../context/NotificationContext';

export default function AdminReports() {
  const { toast } = useNotification();

  const handleExport = (title) => {
    toast.success('Report Exported', `${title} data exported to Excel/CSV.`);
  };

  return (
    <div>
      <PageHeader
        title="Departmental Analytics & Revenue Intelligence"
        subtitle="Executive reporting dashboard on taxpayer registrations, filing compliance indices, and state tax realization."
        actions={
          <button
            className="btn btn-primary"
            onClick={() => handleExport('State Executive Tax Intelligence')}
          >
            <Download size={16} /> Export Consolidated Report (PDF)
          </button>
        }
      />

      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Monthly Registration Growth</span>
            <span className="badge badge-success">+14% Growth</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="bar-chart">
                {[
                  { m: 'Q1', v: '9.2K', h: '60%' },
                  { m: 'Q2', v: '11.5K', h: '75%' },
                  { m: 'Q3', v: '13.2K', h: '85%' },
                  { m: 'Q4', v: '15.4K', h: '100%' }
                ].map((item, idx) => (
                  <div key={idx} className="bar-col">
                    <span className="bar-tooltip">{item.v}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: item.height || item.h }}></div>
                    </div>
                    <span className="bar-label">{item.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Filing Compliance Index (GSTR-3B)</span>
            <span className="badge badge-primary">97.2% Average</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="bar-chart">
                {[
                  { m: 'Oct', v: '96.2%', h: '92%' },
                  { m: 'Nov', v: '96.8%', h: '94%' },
                  { m: 'Dec', v: '97.5%', h: '97%' },
                  { m: 'Jan', v: '97.9%', h: '99%' }
                ].map((item, idx) => (
                  <div key={idx} className="bar-col">
                    <span className="bar-tooltip">{item.v}</span>
                    <div className="bar-track">
                      <div className="bar-fill bar-fill-accent" style={{ height: item.h }}></div>
                    </div>
                    <span className="bar-label">{item.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
