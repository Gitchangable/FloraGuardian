import React, { useState, useEffect } from 'react';
import dataService from './DataService';

export default function SensorPanel() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const handleDataUpdate = (allPlants) => {
      setPlants(allPlants);
    };
    dataService.addListener(handleDataUpdate);
    return () => dataService.removeListener(handleDataUpdate);
  }, []);

  // Renders a progress bar given a current value and a max value.
  const renderProgressBar = (value, max) => (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );

  return (
    <div className="monitor-container">
      <h2 className="section-title">Live Overview</h2>
      {plants.length === 0 ? (
        <p>No plants available.</p>
      ) : (
        <div className="monitor-list">
          {plants.map((p) => (
            <div key={p.id} className="monitor-card">
              <img src={p.photo} alt={p.name} className="monitor-image" />
              <div className="monitor-details">
                <h3>{p.name}</h3>
                <div className="sensor-graphic">
                  <div className="sensor-item">
                    <span className="sensor-label">Temp: {p.sensors.temp}°C</span>
                    {renderProgressBar(p.sensors.temp, 40)}
                  </div>
                  <div className="sensor-item">
                    <span className="sensor-label">Humidity: {p.sensors.humidity}%</span>
                    {renderProgressBar(p.sensors.humidity, 100)}
                  </div>
                  <div className="sensor-item">
                    <span className="sensor-label">Moisture: {p.sensors.soilMoisture}%</span>
                    {renderProgressBar(p.sensors.soilMoisture, 100)}
                  </div>
                  <div className="sensor-item">
                    <span className="sensor-label">Light: {p.sensors.light} lux</span>
                    {renderProgressBar(p.sensors.light, 1000)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
