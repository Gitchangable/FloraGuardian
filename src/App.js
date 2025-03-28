import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import SensorPanel from './components/SensorPanel';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import PlantProfile from './components/PlantProfile';
import NotificationPanel from './components/NotificationPanel';
import './styles.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('monitor');

  const renderTab = () => {
    switch (currentTab) {
      case 'monitor':
        return <SensorPanel />;
      case 'control':
        return <ControlPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'profile':
        return <PlantProfile />;
      case 'notifications':
        return <NotificationPanel />;
      default:
        return <SensorPanel />;
    }
  };

  return (
    <div className="app-container">
      <NavigationBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="content-container">{renderTab()}</div>
    </div>
  );
}
