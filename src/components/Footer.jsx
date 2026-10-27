import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="gst-footer">
      <div className="gst-footer-container">
        {/* 5-Column Grid as in Official GST Portal */}
        <div className="gst-footer-grid">
          {/* Column 1: About GST */}
          <div className="gst-footer-col">
            <h3>About GST</h3>
            <ul className="gst-footer-list">
              <li>
                <Link to="/help">GST Council Structure</Link>
              </li>
              <li>
                <Link to="/help">GST History</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Website Policies */}
          <div className="gst-footer-col">
            <h3>Website Policies</h3>
            <ul className="gst-footer-list">
              <li>
                <Link to="/help">Website Policy</Link>
              </li>
              <li>
                <Link to="/help">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/help">Hyperlink Policy</Link>
              </li>
              <li>
                <Link to="/help">Disclaimer</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Related Sites */}
          <div className="gst-footer-col">
            <h3>Related Sites</h3>
            <ul className="gst-footer-list">
              <li>
                <a href="https://www.cbic.gov.in" target="_blank" rel="noopener noreferrer">
                  Central Board of Indirect Taxes and Customs <span style={{ fontSize: '10px' }}>↗</span>
                </a>
              </li>
              <li>
                <Link to="/services">State Tax Websites</Link>
              </li>
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">
                  National Portal <span style={{ fontSize: '10px' }}>↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Help and Taxpayer Facilities */}
          <div className="gst-footer-col">
            <h3>Help and Taxpayer Facilities</h3>
            <ul className="gst-footer-list">
              <li>
                <Link to="/faq">System Requirements</Link>
              </li>
              <li>
                <Link to="/help">GST Knowledge Portal</Link>
              </li>
              <li>
                <Link to="/faq">
                  GST Media <span style={{ fontSize: '10px' }}>↗</span>
                </Link>
              </li>
              <li>
                <Link to="/services">Site Map</Link>
              </li>
              <li>
                <Link to="/contact">Grievance Nodal Officers</Link>
              </li>
              <li>
                <Link to="/services">
                  Free Accounting and Billing Services <span style={{ fontSize: '10px' }}>↗</span>
                </Link>
              </li>
              <li>
                <Link to="/services">
                  GST Suvidha Providers <span style={{ fontSize: '10px' }}>↗</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="gst-footer-col">
            <h3>Contact Us</h3>
            <div className="gst-footer-contact-item">
              <div>Help Desk Number:</div>
              <strong style={{ color: '#ffffff', fontSize: '13px' }}>1800-103-4786</strong>
            </div>

            <div className="gst-footer-contact-item" style={{ marginTop: '12px' }}>
              <div>Log/Track Your Issue:</div>
              <Link to="/contact" style={{ color: '#93c5fd' }}>
                Grievance Redressal Portal for GST <span style={{ fontSize: '10px' }}>↗</span>
              </Link>
            </div>

            <div className="gst-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="gst-footer-social-icon" title="Facebook" aria-label="Facebook">
                f
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="gst-footer-social-icon" title="YouTube" aria-label="YouTube">
                ▶
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="gst-footer-social-icon" title="X (Twitter)" aria-label="X Twitter">
                𝕏
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="gst-footer-social-icon" title="LinkedIn" aria-label="LinkedIn">
                in
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright & student training note */}
        <div className="gst-footer-bottom">
          <div>
            © 2026 Goods and Services Tax Network (GSTN). Designed for statutory compliance training and practice.
          </div>
          <div>
            <span>Version: 3.4.1</span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span>Site Best Viewed in Chrome / Edge / Firefox</span>
          </div>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className="gst-top-floating-btn"
        title="Back to Top"
        aria-label="Back to Top"
      >
        <ChevronUp size={16} />
        <span>Top</span>
      </button>
    </footer>
  );
}
