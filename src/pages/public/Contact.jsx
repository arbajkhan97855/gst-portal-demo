import React, { useState } from 'react';
import { Mail, PhoneCall, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { useNotification } from '../../context/NotificationContext';

export default function Contact() {
  const { toast } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Validation Error', 'Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Ticket Generated', 'Your support ticket #GST-TKT-8291 has been logged successfully.');
  };

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact Support' }]} />
      <PageHeader
        title="Contact Taxpayer Help Desk"
        subtitle="Reach out to the compliance support team for portal assistance, statutory queries, and technical help."
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        maxWidth: '1080px',
        margin: '0 auto'
      }}>
        {/* Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Help Desk Channels</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <PhoneCall size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Toll-Free National Helpline</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>1800-120-3366</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Toll-Free across all Indian operators</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Email Support</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>helpdesk@gstservices.in</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Typical response within 24 business hours</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Clock size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Operating Hours</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monday to Saturday: 09:00 AM – 09:00 PM IST</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Closed on National Holidays</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={20} color="var(--primary)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Training Coordination Center</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    GST Tax Services Portal Learning Labs, World Trade Center Tower B, Mumbai 400005
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Send Support Inquiry</span>
          </div>
          <div className="card-body">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Message Submitted Successfully!
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', marginBottom: '24px' }}>
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed to our support team. Reference ID: <strong>GST-TKT-8291</strong>.
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', mobile: '', subject: 'General Inquiry', message: '' });
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Category</label>
                  <select
                    className="form-control"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Portal Inquiry</option>
                    <option value="Registration Issue">GST Registration (REG-01)</option>
                    <option value="Return Filing">Returns Filing (GSTR-1 / 3B)</option>
                    <option value="Payment / Challan">Challan Payment Issue</option>
                    <option value="Refund Application">Refund Application Status</option>
                    <option value="Technical Bug">Technical Portal Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Message / Description <span className="required">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe your question or issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '8px' }}>
                  <Send size={16} /> Submit Support Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
