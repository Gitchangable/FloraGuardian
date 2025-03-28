import React from 'react';

export default function NavigationBar({ currentTab, setCurrentTab }) {
  return (
    <div className="nav-bar">
      <div className="nav-title">Floral Guardian</div>
      <div className="nav-links">
        <button className={`nav-btn ${currentTab === 'monitor' ? 'active' : ''}`} onClick={() => setCurrentTab('monitor')}>
          Monitor
        </button>
        <button className={`nav-btn ${currentTab === 'control' ? 'active' : ''}`} onClick={() => setCurrentTab('control')}>
          Control
        </button>
        <button className={`nav-btn ${currentTab === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentTab('analytics')}>
          Analytics
        </button>
        <button className={`nav-btn ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => setCurrentTab('profile')}>
          My Plants
        </button>
        <button className={`nav-btn ${currentTab === 'notifications' ? 'active' : ''}`} onClick={() => setCurrentTab('notifications')}>
          Alerts
        </button>
      </div>
    </div>
  );
}
