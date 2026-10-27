import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, HelpCircle, PhoneCall, Globe, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TopBar() {
  const { theme, toggleTheme, fontSize, setFontSize, language, changeLanguage } = useTheme();
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="container topbar-container">
        <div className="topbar-left">
          <span className="topbar-link">
            <Clock size={13} />
            <span className="mono">{currentDateTime}</span>
          </span>
          <Link to="/help" className="topbar-link">
            <HelpCircle size={13} /> Help Desk
          </Link>
          <Link to="/contact" className="topbar-link">
            <PhoneCall size={13} /> Toll-Free Support (1800-120-3366)
          </Link>
        </div>

        <div className="topbar-right">
          {/* Accessibility text zoom */}
          <div className="accessibility-controls" title="Adjust Text Size">
            <button
              className={`font-btn ${fontSize === 'small' ? 'active' : ''}`}
              onClick={() => setFontSize('small')}
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              className={`font-btn ${fontSize === 'normal' ? 'active' : ''}`}
              onClick={() => setFontSize('normal')}
              aria-label="Normal Font Size"
            >
              A
            </button>
            <button
              className={`font-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setFontSize('large')}
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Theme switcher */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Dark / Light Theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          {/* Language selector */}
          <div className="topbar-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              style={{
                background: 'transparent',
                color: '#cbd5e1',
                border: 'none',
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer'
              }}
              aria-label="Select Language"
            >
              <option value="en" style={{ color: '#000' }}>English</option>
              <option value="hi" style={{ color: '#000' }}>हिंदी (Hindi)</option>
              <option value="mr" style={{ color: '#000' }}>मराठी (Marathi)</option>
              <option value="gu" style={{ color: '#000' }}>ગુજરાતી (Gujarati)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
