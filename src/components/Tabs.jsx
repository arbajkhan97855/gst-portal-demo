import React from 'react';

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="tabs-nav" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && React.cloneElement(tab.icon, { size: 16 })}
          <span>{tab.label}</span>
          {tab.badge !== undefined && tab.badge !== null && (
            <span className="tab-badge">{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}
