import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import SensorPanel from './components/SensorPanel';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import PlantProfile from './components/PlantProfile';
import NotificationPanel from './components/NotificationPanel';
import MainMenu from './components/MainMenu';
import './styles.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); //Change to false when login function has been implemented
  const [currentTab, setCurrentTab] = useState('main');

  const renderTab = () => {
    switch (currentTab) {
      case 'main':
        return <MainMenu/>;
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
       <NavigationBar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAuthenticated={isAuthenticated}
      />
      <div className="content-container">{renderTab()}</div>
    </div>
  );
}
