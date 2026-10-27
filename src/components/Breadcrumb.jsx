import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb-container" aria-label="Breadcrumb">
      <div className="breadcrumb-item">
        <Link to="/dashboard" aria-label="Home / Dashboard">
          <Home size={14} style={{ verticalAlign: 'middle' }} />
        </Link>
      </div>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span className="breadcrumb-separator">
              <ChevronRight size={13} />
            </span>
            <div className="breadcrumb-item">
              {isLast || !item.to ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
