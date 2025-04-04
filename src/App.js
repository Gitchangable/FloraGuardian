import React, { useState } from 'react';
import NavigationBar from './components/NavigationBar';
import SensorPanel from './components/SensorPanel';
import ControlPanel from './components/ControlPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import PlantProfile from './components/PlantProfile';
import NotificationPanel from './components/NotificationPanel';
import MainMenu from './components/MainMenu';
import AuthModal from './components/AuthModal';
import './styles.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('main');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogin = (userData) => {
    // In a real application, validate credentials here.
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setCurrentTab('monitor');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentTab('main');
  };

  const renderTab = () => {
    if (!isAuthenticated) {
      // When not authenticated, show the main menu.
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
