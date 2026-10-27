import React, { useState } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Breadcrumb from '../../components/Breadcrumb';
import { SAMPLE_NOTIFICATIONS } from '../../data/portalData';
import { useNotification } from '../../context/NotificationContext';

export default function Notifications() {
  const { toast } = useNotification();
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [filterType, setFilterType] = useState('all');

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Updated', 'All notifications marked as read.');
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info('Removed', 'Notification deleted.');
  };

  const filtered = filterType === 'all'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="var(--success)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--warning)" />;
      case 'important': return <AlertCircle size={18} color="var(--danger)" />;
      default: return <Info size={18} color="var(--info)" />;
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Notification Center' }]} />
      <PageHeader
        title="Notification Center & Compliance Advisories"
        subtitle="Stay updated on statutory filing deadlines, payment realization receipts, and departmental intimations."
        actions={
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            <Check size={16} /> Mark All as Read
          </button>
        }
      />

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'important', label: 'Important' },
          { id: 'warning', label: 'Warnings' },
          { id: 'success', label: 'Success' },
          { id: 'info', label: 'Informational' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`btn btn-sm ${filterType === tab.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterType(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div
              key={item.id}
              className="card"
              style={{
                backgroundColor: item.read ? 'var(--surface)' : 'var(--surface-alt)',
                borderLeft: `4px solid ${
                  item.type === 'important' ? 'var(--danger)' :
                  item.type === 'warning' ? 'var(--warning)' :
                  item.type === 'success' ? 'var(--success)' : 'var(--secondary)'
                }`
              }}
            >
              <div className="card-body" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <div style={{ marginTop: '2px' }}>
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: item.read ? 600 : 700 }}>
                        {item.title}
                      </h4>
                      {!item.read && <span className="badge badge-primary">New</span>}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {item.message}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!item.read && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as read"
                    >
                      <Check size={14} /> Read
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(item.id)}
                    title="Delete notification"
                  >
                    <Trash2 size={14} color="var(--danger)" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Bell className="empty-state-icon" />
            <h4 className="empty-state-title">No Notifications</h4>
            <p className="empty-state-text">You have no pending notifications under this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
