import React from 'react';

export default function StatCard({
  title,
  value,
  icon,
  iconBg = 'blue',
  meta,
  badge,
  badgeType = 'success',
  onClick
}) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-top">
        <span className="stat-label">{title}</span>
        <div className={`stat-icon stat-icon-${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {(meta || badge) && (
        <div className="stat-meta">
          {badge && <span className={`badge badge-${badgeType}`}>{badge}</span>}
          {meta && <span>{meta}</span>}
        </div>
      )}
    </div>
  );
}
