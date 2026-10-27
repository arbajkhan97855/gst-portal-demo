import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RotateCcw, ArrowRight, Upload, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function ApplyRefund() {
  const { currentUser } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();

  const [refundType, setRefundType] = useState('Excess Balance in Electronic Cash Ledger');
  const [claimAmount, setClaimAmount] = useState('48520');
  const [reason, setReason] = useState('Excess deposit made via Challan PMT-06 not required for current period tax liability.');
  const [bankAccount, setBankAccount] = useState('HDFC Bank Ltd — A/C: 50200049281729 (IFSC: HDFC0000060)');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      toast.error('Validation Error', 'Please enter a valid refund amount.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const generatedArn = `AA27092400${Math.floor(20000 + Math.random() * 80000)}`;
      toast.success('Refund Claim Submitted', `Form RFD-01 filed successfully. ARN: ${generatedArn}`);
      navigate(`/refunds/status?arn=${generatedArn}`);
    }, 700);
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Refunds', to: '/refunds' }, { label: 'Apply for Refund (RFD-01)' }]} />
      <PageHeader
        title="Application for Refund (Form GST RFD-01)"
        subtitle="Claim tax refunds under Section 54 of the CGST Act with direct bank account remittance."
      />

      <div className="card" style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div className="card-header">
          <span className="card-title">Form RFD-01: Claim Particulars</span>
          <span className="badge badge-primary">Section 54</span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Grounds of Refund Claim <span className="required">*</span>
              </label>
              <select
                className="form-control"
                value={refundType}
                onChange={(e) => setRefundType(e.target.value)}
                required
              >
                <option value="Excess Balance in Electronic Cash Ledger">Refund of Excess Balance in Electronic Cash Ledger</option>
                <option value="Exports without Payment of Tax (under LUT)">Export of Services/Goods without Payment of Tax (accumulated ITC)</option>
                <option value="Inverted Duty Structure">Refund on account of Inverted Duty Structure</option>
                <option value="Deemed Exports">On account of Supplies to SEZ Unit / Developer</option>
                <option value="Excess Tax Paid">Excess Payment of Tax inadvertently deposited</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Refund Claim Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  className="form-control mono"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Account for Refund Credit <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={bankAccount}
                  readOnly
                  style={{ backgroundColor: 'var(--surface-hover)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Explanation & Grounds for Claim <span className="required">*</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Attach Supporting Statement / Annexure</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                <span style={{ fontSize: '0.85rem', flex: 1 }}>Annexure_Statement_1_InvertedDuty.xlsx</span>
                <span className="badge badge-success">Attached ✓</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Link to="/refunds" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting Claim...' : 'Sign & Submit Refund Claim (RFD-01)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
