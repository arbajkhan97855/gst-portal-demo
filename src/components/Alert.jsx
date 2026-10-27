import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function Alert({ type = 'info', title, children, style }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} className="text-success" />;
      case 'warning': return <AlertTriangle size={20} className="text-warning" />;
      case 'danger': return <AlertCircle size={20} className="text-danger" />;
      case 'info':
      default: return <Info size={20} className="text-info" />;
    }
  };

  return (
    <div className={`alert alert-${type}`} style={style} role="alert">
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '2px' }}>{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
