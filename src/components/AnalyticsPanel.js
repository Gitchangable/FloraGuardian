import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import dataService from './DataService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AnalyticsPanel() {
  // histories stores time-series data for each plant (by plant id)
  const [histories, setHistories] = useState({});

  useEffect(() => {
    const updateHistories = (plants) => {
      const now = new Date().toLocaleTimeString();
      setHistories((prev) => {
        const newHistories = { ...prev };
        plants.forEach((p) => {
          if (!newHistories[p.id]) {
            newHistories[p.id] = {
              timestamps: [],
              temp: [],
              soilMoisture: [],
              light: [],
              name: p.name,
            };
          }
          const history = newHistories[p.id];
          history.timestamps = [...history.timestamps, now].slice(-20);
          history.temp = [...history.temp, p.sensors.temp].slice(-20);
          history.soilMoisture = [...history.soilMoisture, p.sensors.soilMoisture].slice(-20);
          history.light = [...history.light, p.sensors.light].slice(-20);
        });
        return newHistories;
      });
    };

    dataService.addListener(updateHistories);
    return () => dataService.removeListener(updateHistories);
  }, []);

  // Mini chart options – hide legends and axes for a compact look.
  const miniChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="analytics-container">
      <h2 className="section-title">Historical Trends</h2>
      {Object.keys(histories).length === 0 ? (
        <p>No plant history available.</p>
      ) : (
        <div className="analytics-list">
          {Object.keys(histories).map((id) => {
            const h = histories[id];
            return (
              <div key={id} className="analytics-plant-block">
                <h3>{h.name}</h3>
                <div className="mini-charts">
                  <div className="mini-chart">
                    <Line
                      data={{
                        labels: h.timestamps,
                        datasets: [
                          {
                            label: 'Temp',
                            data: h.temp,
                            borderColor: '#FF5733',
                            backgroundColor: 'rgba(255,87,51,0.2)',
                          },
                        ],
                      }}
                      options={miniChartOptions}
                    />
                  </div>
                  <div className="mini-chart">
                    <Line
                      data={{
                        labels: h.timestamps,
                        datasets: [
                          {
                            label: 'Light',
                            data: h.light,
                            borderColor: '#F1C40F',
                            backgroundColor: 'rgba(241,196,15,0.2)',
                          },
                        ],
                      }}
                      options={miniChartOptions}
                    />
                  </div>
                  <div className="mini-chart">
                    <Line
                      data={{
                        labels: h.timestamps,
                        datasets: [
                          {
                            label: 'Moisture',
                            data: h.soilMoisture,
                            borderColor: '#27AE60',
                            backgroundColor: 'rgba(39,174,96,0.2)',
                          },
                        ],
                      }}
                      options={miniChartOptions}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
