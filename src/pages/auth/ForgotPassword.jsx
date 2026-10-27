import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function ForgotPassword() {
  const { toast } = useNotification();
  const [identifier, setIdentifier] = useState('@samyakcomputerclasses123');
  const [pan, setPan] = useState('AABCS1429B');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier || !pan) {
      toast.error('Validation Error', 'Please enter your username and PAN');
      return;
    }
    setStep(2);
    setOtp('582109');
    toast.success('OTP Dispatched', 'Verification OTP 582109 sent to registered mobile/email.');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    setSuccess(true);
    toast.success('Password Updated', 'Your password has been reset successfully.');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header-icon">
            <Lock size={26} color="#ffffff" />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Verify registered identity to recover access</p>
        </div>

        <div className="auth-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 12px' }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                Password Reset Successful!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
                You can now sign in using your new password.
              </p>
              <Link to="/login" className="btn btn-primary btn-full">
                Proceed to Login
              </Link>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label className="form-label">Username or Registered Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. @samyakcomputerclasses123"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="10-character PAN (e.g. AABCS1429B)"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                Generate Verification OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="alert alert-info">
                Verification OTP sent to registered mobile: <strong>582109</strong>
              </div>

              <div className="form-group">
                <label className="form-label">Enter 6-Digit Verification OTP</label>
                <input
                  type="text"
                  className="form-control mono"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                Confirm Password Reset
              </button>
            </form>
          )}
        </div>

        <div className="auth-footer">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
