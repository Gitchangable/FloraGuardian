import React, { useState, useEffect } from 'react';
import dataService from './DataService';

export default function ControlPanel() {
  const [plants, setPlants] = useState([]);
  // Control state holds settings for each plant, keyed by plant id.
  const [controlState, setControlState] = useState({});

  useEffect(() => {
    const handleDataUpdate = (allPlants) => {
      setPlants(allPlants);
      // Initialize control state for any new plant
      setControlState((prev) => {
        const newState = { ...prev };
        allPlants.forEach((p) => {
          if (!newState[p.id]) {
            newState[p.id] = {
              masterOn: true,
              sensors: { temp: true, humidity: true, soilMoisture: true, light: true },
              offsets: { temp: 0, humidity: 0, soilMoisture: 0, light: 0 },
            };
          }
        });
        return newState;
      });
    };

    dataService.addListener(handleDataUpdate);
    return () => dataService.removeListener(handleDataUpdate);
  }, []);

  const toggleMaster = (id) => {
    setControlState((prev) => ({
      ...prev,
      [id]: { ...prev[id], masterOn: !prev[id].masterOn },
    }));
  };

  const toggleSensor = (id, sensor) => {
    setControlState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        sensors: { ...prev[id].sensors, [sensor]: !prev[id].sensors[sensor] },
      },
    }));
  };

  const handleOffsetChange = (id, sensor, value) => {
    setControlState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        offsets: { ...prev[id].offsets, [sensor]: Number(value) },
      },
    }));
  };

  return (
    <div className="control-container">
      <h2 className="section-title">Control Your Garden</h2>
      {plants.length === 0 ? (
        <p>No plants available.</p>
      ) : (
        <div className="control-list">
          {plants.map((p) => {
            const state = controlState[p.id] || {
              masterOn: true,
              sensors: { temp: true, humidity: true, soilMoisture: true, light: true },
              offsets: { temp: 0, humidity: 0, soilMoisture: 0, light: 0 },
            };
            return (
              <div key={p.id} className="control-card">
                <h3>{p.name}</h3>
                <button className="master-toggle" onClick={() => toggleMaster(p.id)}>
                  {state.masterOn ? 'Master ON' : 'Master OFF'}
                </button>
                <div className="sensor-controls">
                  {['temp', 'humidity', 'soilMoisture', 'light'].map((sensor) => (
                    <div key={sensor} className="sensor-control">
                      <button
                        className="sensor-toggle"
                        onClick={() => toggleSensor(p.id, sensor)}
                        disabled={!state.masterOn}
                      >
                        {sensor.charAt(0).toUpperCase() + sensor.slice(1)}: {state.sensors[sensor] ? 'ON' : 'OFF'}
                      </button>
                      <div className="offset-control">
                        <label>
                          Offset:
                          <input
                            type="number"
                            value={state.offsets[sensor]}
                            onChange={(e) => handleOffsetChange(p.id, sensor, e.target.value)}
                            disabled={!state.masterOn || !state.sensors[sensor]}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
