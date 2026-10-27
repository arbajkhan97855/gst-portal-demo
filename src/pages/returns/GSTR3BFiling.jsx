import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Save,
  Calculator,
  Eye,
  CheckCircle2,
  Wallet,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePortalData } from '../../context/PortalDataContext';

export default function GSTR3BFiling() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const { fileReturnRecord } = usePortalData();
  const navigate = useNavigate();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Table 3.1: Outward supplies
  const [outward, setOutward] = useState({
    taxable: 4250000,
    igst: 185000,
    cgst: 290250,
    sgst: 290250,
    cess: 0
  });

  // Table 4: Eligible ITC
  const [itc, setItc] = useState({
    igst: 120000,
    cgst: 215000,
    sgst: 215000
  });

  // Calculations
  const netCgstPayable = Math.max(0, outward.cgst - itc.cgst);
  const netSgstPayable = Math.max(0, outward.sgst - itc.sgst);
  const netIgstPayable = Math.max(0, outward.igst - itc.igst);
  const totalCashRequired = netCgstPayable + netSgstPayable + netIgstPayable;

  const handleSaveDraft = () => {
    toast.success('Draft Saved', 'Form GSTR-3B saved to your portal passbook.');
  };

  const handleOffsetAndFile = async () => {
    setSubmitting(true);
    const generatedArn = `AA27022501${Math.floor(10000 + Math.random() * 90000)}`;
    const totalTaxVal = outward.cgst + outward.sgst + outward.igst;

    await fileReturnRecord({
      returnType: 'GSTR-3B',
      taxPeriod: 'February 2025',
      dueDate: '20-Mar-2025',
      filingDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Filed',
      arn: generatedArn,
      taxableValue: outward.taxable,
      cgst: outward.cgst,
      sgst: outward.sgst,
      igst: outward.igst,
      totalTax: totalTaxVal,
      mode: 'Digital Signature (DSC)'
    });

    setSubmitting(false);
    setPreviewOpen(false);
    toast.success(
      'Return Successfully Discharged & Filed',
      `GSTR-3B for February 2025 filed. ARN: ${generatedArn}`
    );
    navigate('/returns/history');
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Returns', to: '/returns' }, { label: 'Form GSTR-3B' }]} />
      <PageHeader
        title="Form GSTR-3B: Monthly Summary Return"
        subtitle="Self-assessed declaration of outward supplies, input tax credit utilization, and tax liability settlement."
        badge="Tax Period: Feb 2025"
        actions={
          <>
            <button className="btn btn-outline" onClick={handleSaveDraft}>
              <Save size={16} /> Save Draft
            </button>
            <button className="btn btn-primary" onClick={() => setPreviewOpen(true)}>
              <Eye size={16} /> Preview & Offset Liability
            </button>
          </>
        }
      />

      {/* 3-Column Summary Cards */}
      <div className="grid-3col" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-body">
            <span className="card-subtitle">Gross Output Tax Liability</span>
            <div className="stat-value" style={{ color: 'var(--primary)', marginTop: '4px' }}>
              ₹{(outward.cgst + outward.sgst + outward.igst).toLocaleString('en-IN')}
            </div>
            <div className="stat-meta">From Table 3.1 Outward supplies</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <span className="card-subtitle">Eligible ITC Offset Available</span>
            <div className="stat-value" style={{ color: 'var(--success)', marginTop: '4px' }}>
              ₹{(itc.cgst + itc.sgst + itc.igst).toLocaleString('en-IN')}
            </div>
            <div className="stat-meta">Matched with Form GSTR-2B</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <span className="card-subtitle">Net Cash Payable through PMT-05</span>
            <div className="stat-value" style={{ color: 'var(--accent)', marginTop: '4px' }}>
              ₹{totalCashRequired.toLocaleString('en-IN')}
            </div>
            <div className="stat-meta">Net cash liability after ITC offset</div>
          </div>
        </div>
      </div>

      {/* Table 3.1: Details of Outward Supplies */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Table 3.1: Details of Outward Supplies and Inward Supplies Liable to Reverse Charge</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nature of Supplies</th>
                  <th className="numeric">Total Taxable Value (₹)</th>
                  <th className="numeric">Integrated Tax (₹)</th>
                  <th className="numeric">Central Tax (₹)</th>
                  <th className="numeric">State / UT Tax (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>(a) Outward Taxable Supplies (other than zero rated, nil, exempt)</strong></td>
                  <td className="numeric">₹{outward.taxable.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{outward.igst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{outward.cgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{outward.sgst.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>(b) Outward Taxable Supplies (zero rated exports)</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                </tr>
                <tr>
                  <td>(c) Other Outward Supplies (Nil rated, exempt)</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                </tr>
                <tr>
                  <td>(d) Inward Supplies liable to Reverse Charge (RCM)</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Table 4: Eligible ITC */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Table 4: Eligible Input Tax Credit (ITC)</span>
          <span className="badge badge-success">GSTR-2B Auto-Drafted</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Details</th>
                  <th className="numeric">Integrated Tax (₹)</th>
                  <th className="numeric">Central Tax (₹)</th>
                  <th className="numeric">State / UT Tax (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>(A) ITC Available (whether in full or part)</strong></td>
                  <td className="numeric">₹{itc.igst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{itc.cgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{itc.sgst.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>(B) ITC Reversed (Rule 42/43)</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                  <td className="numeric">₹0.00</td>
                </tr>
                <tr>
                  <td><strong>(C) Net ITC Available (A - B)</strong></td>
                  <td className="numeric" style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ₹{itc.igst.toLocaleString('en-IN')}
                  </td>
                  <td className="numeric" style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ₹{itc.cgst.toLocaleString('en-IN')}
                  </td>
                  <td className="numeric" style={{ fontWeight: 700, color: 'var(--success)' }}>
                    ₹{itc.sgst.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Table 6.1: Payment of Tax & Offset Liability Modal */}
      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Form GSTR-3B: Payment of Tax & Electronic Ledger Offset"
        size="lg"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setPreviewOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleOffsetAndFile}
              disabled={submitting}
            >
              {submitting ? 'Offsetting Ledgers & Signing...' : 'Offset Liability & File GSTR-3B with EVC'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="alert alert-info">
            Your Electronic Credit Ledger will be debited by <strong>₹{(itc.cgst + itc.sgst + itc.igst).toLocaleString('en-IN')}</strong> and Electronic Cash Ledger will be debited by <strong>₹{totalCashRequired.toLocaleString('en-IN')}</strong>.
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tax Description</th>
                  <th className="numeric">Tax Payable (₹)</th>
                  <th className="numeric">Paid via ITC (₹)</th>
                  <th className="numeric">Paid in Cash (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Integrated Tax (IGST)</td>
                  <td className="numeric">₹{outward.igst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{itc.igst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{netIgstPayable.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>Central Tax (CGST)</td>
                  <td className="numeric">₹{outward.cgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{itc.cgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{netCgstPayable.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td>State Tax (SGST)</td>
                  <td className="numeric">₹{outward.sgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{itc.sgst.toLocaleString('en-IN')}</td>
                  <td className="numeric">₹{netSgstPayable.toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ background: 'var(--surface-alt)', fontWeight: 800 }}>
                  <td>Total Settlement</td>
                  <td className="numeric">₹{(outward.cgst + outward.sgst + outward.igst).toLocaleString('en-IN')}</td>
                  <td className="numeric" style={{ color: 'var(--success)' }}>₹{(itc.cgst + itc.sgst + itc.igst).toLocaleString('en-IN')}</td>
                  <td className="numeric" style={{ color: 'var(--primary)' }}>₹{totalCashRequired.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
