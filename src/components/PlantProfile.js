import React, { useState, useEffect } from 'react';
import dataService from './DataService';

export default function PlantProfile() {
  const [plants, setPlants] = useState([]);
  const [alias, setAlias] = useState('');
  const [nickname, setNickname] = useState('');
  // Store image sizes per plant (in pixels)
  const [imageSizes, setImageSizes] = useState({});

  useEffect(() => {
    const handleUpdate = (allPlants) => {
      setPlants(allPlants);
      // Ensure each plant has an image size (default to 200px)
      setImageSizes((prev) => {
        const newSizes = { ...prev };
        allPlants.forEach((p) => {
          if (!newSizes[p.id]) {
            newSizes[p.id] = 200;
          }
        });
        return newSizes;
      });
    };
    dataService.addListener(handleUpdate);
    return () => dataService.removeListener(handleUpdate);
  }, []);

  const addPlant = async () => {
    if (!alias) return alert('Please enter a plant alias (e.g., mentha spicata).');
    try {
      await dataService.addPlant({ alias: alias.trim(), nickname: nickname.trim() });
      setAlias('');
      setNickname('');
    } catch (err) {
      alert(`Error adding plant: ${err.message}`);
    }
  };

  const removePlant = (id) => {
    // Remove plant from dataService and notify listeners.
    dataService.plants = dataService.plants.filter((p) => p.id !== id);
    dataService.notifyAll();
  };

  const handleSizeChange = (id, newSize) => {
    setImageSizes((prev) => ({ ...prev, [id]: newSize }));
  };

  return (
    <div className="plant-profile-container">
      <h2 className="section-title">Plant Overview</h2>
      <div className="detailed-plant-list">
        {plants.map((p) => (
          <div key={p.id} className="detailed-plant-card">
            <div className="plant-image-container">
              <img
                src={p.photo}
                alt={p.name}
                style={{ width: `${imageSizes[p.id]}px` }}
                className="detailed-plant-image"
              />
              <div className="resize-controls">
                <label>
                  Image Size:
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={imageSizes[p.id]}
                    onChange={(e) => handleSizeChange(p.id, e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="plant-info">
              <h3>{p.name}</h3>
              {p.apiData && (
                <div className="plant-api-details">
                  <p><strong>Official Name:</strong> {p.apiData.officialName}</p>
                  <p><strong>Alias:</strong> {p.apiData.alias}</p>
                  <p><strong>Category:</strong> {p.apiData.category}</p>
                  <p>
                    <strong>Temperature:</strong> {p.apiData.min_temp}°C - {p.apiData.max_temp}°C
                  </p>
                  <p>
                    <strong>Light (lux):</strong> {p.apiData.min_light_lux} - {p.apiData.max_light_lux}
                  </p>
                  <p>
                    <strong>Soil Moisture:</strong> {p.apiData.min_soil_moist}% - {p.apiData.max_soil_moist}%
                  </p>
                </div>
              )}
              <button className="btn remove-btn" onClick={() => removePlant(p.id)}>
                Remove Plant
              </button>
            </div>
          </div>
        ))}
      </div>
      <hr style={{ margin: '20px 0' }} />
      <h3>Add a New Plant</h3>
      <div className="add-plant-form">
        <input
          type="text"
          placeholder="Scientific name"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button onClick={addPlant} className="btn">Add</button>
      </div>
    </div>
  );
}
