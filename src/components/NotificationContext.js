// src/components/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

let globalNotificationFunctions = {};

export function setGlobalNotificationFunctions(functions) {
  globalNotificationFunctions = functions;
}

export function getGlobalNotificationFunctions() {
  return globalNotificationFunctions;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = ({ type = 'info', message, duration = 4000, id = null, persist = false }) => {
    const newId = id || Date.now();
    const toast = { id: newId, type, message, persist };

    setNotifications((prev) => [...prev, toast]);

    if (!persist) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newId));
      }, duration);
    }

    return newId;
  };

  const updateNotification = (id, updates) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Set the global functions on mount.
  useEffect(() => {
    setGlobalNotificationFunctions({ addNotification, updateNotification, removeNotification });
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, updateNotification, removeNotification }}>
      {children}
      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast toast-${n.type}`}>
            {n.persist && n.type === 'error' && <span className="toast-spinner" />}
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
