import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  FileCheck,
  FileSpreadsheet,
  IndianRupee,
  BellRing,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { SAMPLE_APPLICATIONS, SAMPLE_TAXPAYERS, SAMPLE_RETURNS } from '../../data/portalData';

export default function AdminDashboard() {
  const pendingApps = SAMPLE_APPLICATIONS.filter(a => a.status !== 'Approved');

  const appColumns = [
    { header: 'ARN Reference', field: 'arn', render: (val) => <span className="mono"><strong>{val}</strong></span> },
    { header: 'Applicant Legal Name', field: 'applicantName' },
    { header: 'Application Type', field: 'formType', render: (v) => <span className="badge badge-primary">{v}</span> },
    { header: 'Date Filed', field: 'submissionDate' },
    {
      header: 'Review Status',
      field: 'status',
      render: (v) => (
        <span className={`badge ${v === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
          {v}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="GST Tax Officer & Administration Command Center"
        subtitle="Simulated departmental jurisdiction management, registration scrutinies, return filings compliance, and statutory tax assessments."
        badge="OFFICER COMMAND SUITE"
        actions={
          <Link to="/dashboard" className="btn btn-outline">
            View as Taxpayer
          </Link>
        }
      />

      {/* KPI Cards Grid */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Registered Taxpayers"
          value="1,42,910"
          icon={<Users size={20} />}
          iconBg="blue"
          badge="+4.2% MoM"
          badgeType="success"
          meta="Maharashtra Jurisdiction"
        />

        <StatCard
          title="Pending Registration Reviews"
          value="24 Applications"
          icon={<FileCheck size={20} />}
          iconBg="orange"
          badge="High Priority"
          badgeType="warning"
          meta="Average SLA: 3 Days"
        />

        <StatCard
          title="Monthly Returns Filed"
          value="1,38,450"
          icon={<FileSpreadsheet size={20} />}
          iconBg="green"
          badge="96.8% Compliance"
          badgeType="success"
          meta="GSTR-3B Current Cycle"
        />

        <StatCard
          title="State Revenue Collections"
          value="₹4,120 Cr"
          icon={<IndianRupee size={20} />}
          iconBg="purple"
          badge="+8.5% Growth"
          badgeType="info"
          meta="Net SGST + IGST Share"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid-2col" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} className="text-primary" />
              <span>Taxpayer Registration Growth (Monthly)</span>
            </div>
            <span className="badge badge-primary">FY 2024-25</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="bar-chart">
                {[
                  { m: 'Sep', val: '2.4K', h: '60%' },
                  { m: 'Oct', val: '2.8K', h: '70%' },
                  { m: 'Nov', val: '2.6K', h: '65%' },
                  { m: 'Dec', val: '3.1K', h: '80%' },
                  { m: 'Jan', val: '3.5K', h: '90%' },
                  { m: 'Feb', val: '3.9K', h: '100%' }
                ].map((b, idx) => (
                  <div key={idx} className="bar-col">
                    <span className="bar-tooltip">{b.val}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: b.h }}></div>
                    </div>
                    <span className="bar-label">{b.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <IndianRupee size={18} className="text-primary" />
              <span>Monthly Tax Collection Trends (₹ in Thousands of Cr)</span>
            </div>
            <span className="badge badge-success">Target Exceeded</span>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <div className="bar-chart">
                {[
                  { m: 'Sep', val: '₹3.4K Cr', h: '65%' },
                  { m: 'Oct', val: '₹3.6K Cr', h: '72%' },
                  { m: 'Nov', val: '₹3.8K Cr', h: '78%' },
                  { m: 'Dec', val: '₹4.0K Cr', h: '84%' },
                  { m: 'Jan', val: '₹4.2K Cr', h: '92%' },
                  { m: 'Feb', val: '₹4.1K Cr', h: '88%' }
                ].map((b, idx) => (
                  <div key={idx} className="bar-col">
                    <span className="bar-tooltip">{b.val}</span>
                    <div className="bar-track">
                      <div className="bar-fill bar-fill-accent" style={{ height: b.h }}></div>
                    </div>
                    <span className="bar-label">{b.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Scrutinies Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <FileCheck size={18} className="text-primary" />
            <span>Applications Requiring Officer Scrutiny (Form REG-01 / RFD-01)</span>
          </div>
          <Link to="/admin/applications" className="btn btn-outline-primary btn-sm">
            View All Scrutinies <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <Table
            columns={appColumns}
            data={pendingApps}
            pageSize={5}
            actions={(row) => (
              <Link to="/admin/applications" className="btn btn-primary btn-sm">
                Scrutinize
              </Link>
            )}
          />
        </div>
      </div>
    </div>
  );
}
