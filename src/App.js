import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import SensorPanel from './components/SensorPanel';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import PlantProfile from './components/PlantProfile';
import NotificationPanel from './components/NotificationPanel';
import MainMenu from './components/MainMenu';
import AuthModal from './components/AuthModal';
import dataService, {resetDataServiceInstance} from './components/DataService';
import './styles.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('main');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  // eslint-disable-next-line
  const [connectionStatus, setConnectionStatus] = useState(dataService.getServerStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(dataService.getServerStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (authData) => {
    if (authData?.mode === 'guest') {
      setIsGuest(true);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setCurrentTab('monitor');
  
      const { getGlobalNotificationFunctions } = require('./components/NotificationContext');
      const { addNotification } = getGlobalNotificationFunctions() || {};
      if (typeof addNotification === 'function') {
        addNotification({
          type: 'info',
          message: 'Logged in as Guest',
          duration: 5000,
        });
      }
      dataService.setGuestMode(true);
      return;
    }
  
    // Normal login
    setIsGuest(false);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setCurrentTab('monitor');
  };  

  const handleLogout = () => {
    resetDataServiceInstance();
    setIsAuthenticated(false);
    setIsGuest(false);
    setCurrentTab('main');
  
    const { getGlobalNotificationFunctions } = require('./components/NotificationContext');
    const { addNotification } = getGlobalNotificationFunctions() || {};
    if (typeof addNotification === 'function') {
      addNotification({
        type: 'info',
        message: 'Logged out successfully.',
        duration: 3000,
      });
    }
  };   

  const renderTab = () => {
    if (!isAuthenticated) {
      return <MainMenu />;
    }
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
      <NavigationBar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      {isAuthenticated && (
        <div className="mode-banner">
          {isGuest ? (
            <div className="banner guest">
              Guest Mode Active — Data is not synced to the cloud.
            </div>
          ) : dataService.getServerStatus() !== 'online' ? (
            <div className="banner offline">
              Server Offline — Data is read-only until connection is restored.
            </div>
          ) : null}
        </div>
      )}
      <div className="content-container">{renderTab()}</div>
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onAuth={handleLogin}
        />
      )}
    </div>
  );
}
