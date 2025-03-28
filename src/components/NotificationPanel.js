import React, { useState, useEffect } from 'react';

export default function NotificationPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const alertProbability = Math.random();
      if (alertProbability < 0.3) {
        const alertTypes = [
          'Soil moisture below threshold!',
          'Water tank running low!',
          'Temperature too high!',
          'Fertilizer level critically low!',
          'Light intensity insufficient!',
          'High humidity detected!',
        ];
        const randomIndex = Math.floor(Math.random() * alertTypes.length);
        const newAlert = {
          id: Date.now(),
          message: alertTypes[randomIndex],
          time: new Date().toLocaleTimeString(),
        };
        setAlerts((prev) => [newAlert, ...prev]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notification-container">
      <h2 className="section-title">System Alerts & Notifications</h2>
      <p>Automatic alerts appear whenever the system detects anomalies.</p>
      <div className="notification-list">
        {alerts.length === 0 ? (
          <p>No alerts yet.</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="notification-item">
              <strong>{alert.time}</strong> – {alert.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
