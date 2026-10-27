import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Info, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export default function Login() {
  const { login, credentials } = useAuth();
  const { toast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('@samyakcomputerclasses123');
  const [password, setPassword] = useState('samyak@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillQuickCreds = () => {
    setUsername(credentials.username);
    setPassword(credentials.password);
    setError('');
    toast.info('Credentials Applied', 'Student credentials filled.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = login(username, password, true);
      setLoading(false);

      if (res.success) {
        toast.success('Authentication Successful', `Welcome to GST Portal!`);
        const destination = location.state?.from?.pathname || '/dashboard';
        navigate(destination, { replace: true });
      } else {
        setError(res.error || 'Invalid username or password.');
        toast.error('Login Failed', 'Please verify your credentials.');
      }
    }, 400);
  };

  return (
    <div className="gst-login-page-root">
      {/* Official GST Breadcrumb */}
      <div className="gst-breadcrumb-wrapper">
        <div className="gst-breadcrumb-container">
          <Link to="/">Home</Link>
          <span className="gst-breadcrumb-separator">&gt;</span>
          <span className="gst-breadcrumb-current">Login</span>
        </div>
      </div>

      {/* Main Login Card (Matching official GST Portal) */}
      <div className="gst-login-wrapper">
        <div className="gst-login-container">
          <div className="gst-login-header-row">
            <h2 className="gst-login-title">Login</h2>
            <div className="gst-mandatory-notice">
              <span className="gst-mandatory-dot">•</span> indicates mandatory fields
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '3px',
                fontSize: '13px',
                marginBottom: '18px'
              }}
            >
              {error}
            </div>
          )}

          <div className="gst-login-form-area">
            <form onSubmit={handleSubmit}>
              <div className="gst-form-group">
                <label className="gst-form-label">
                  Username <span className="gst-required-star">*</span>
                </label>
                <input
                  type="text"
                  className="gst-input"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="gst-form-group">
                <label className="gst-form-label">
                  Password <span className="gst-required-star">*</span>
                </label>
                <input
                  type="password"
                  className="gst-input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div style={{ marginTop: '22px' }}>
                <button type="submit" className="gst-btn-submit" disabled={loading}>
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>

              <div className="gst-login-links-row">
                <a
                  href="#forgot-user"
                  onClick={(e) => {
                    e.preventDefault();
                    fillQuickCreds();
                  }}
                >
                  Forgot Username
                </a>
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    fillQuickCreds();
                  }}
                >
                  Forgot Password
                </a>
              </div>

            
            </form>

         
          </div>
        </div>
      </div>
    </div>
  );
}
