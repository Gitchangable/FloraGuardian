// src/components/DataService.js
import localPlantData from '../localPlantData.json';
import { getGlobalNotificationFunctions } from './NotificationContext';

// Use your ngrok public URL:
const BASE_URL = "https://supreme-tomcat-heartily.ngrok-free.app";

class DataService {
  constructor() {
    this.plants = [];
    this.listeners = [];
    this.useLocalMode = false;
    this.currentUserId = null;
    this.serverStatus = 'unknown';
    this.serverPingToastId = null;
    this.guestMode = false;

    if (!this.guestMode) {
      this.monitorServerConnection();
    }
    
    this.interval = setInterval(() => {
      this.updateAllPlantsSensors();
    }, 5000);

    this.syncInterval = setInterval(() => {
      if (this.currentUserId) {
        this.fetchUserPlants();
      }
    }, 20000);
  }

  setGuestMode(isGuest) {
    this.guestMode = isGuest;
    if (isGuest) {
      console.warn('[Guest Mode] Enabled. All server calls are now disabled.');
      clearInterval(this.connectionInterval);
      this.serverStatus = 'offline';
      this.useLocalMode = true;
      this.notifyAll();
    } else {
      this.monitorServerConnection();
    }
  }

  monitorServerConnection() {
    if (this.guestMode) return;
    const pingServer = async () => {
      const { addNotification, updateNotification, removeNotification } =
        getGlobalNotificationFunctions() || {};

      try {
        const response = await fetch(`${BASE_URL}/api/ping`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const isOnline = response.ok;
        if (isOnline && this.serverStatus !== 'online') {
          this.serverStatus = 'online';
          console.log('[Connection] Server is ONLINE');
          if (
            this.serverPingToastId !== null &&
            typeof updateNotification === 'function' &&
            typeof removeNotification === 'function'
          ) {
            updateNotification(this.serverPingToastId, {
              type: 'success',
              message: 'Connected to server.',
            });
            setTimeout(() => {
              removeNotification(this.serverPingToastId);
              this.serverPingToastId = null;
            }, 2000);
          }
        }
        if (isOnline && this.useLocalMode) {
          this.useLocalMode = false;
          this.notifyAll();
        }
      } catch (err) {
        if (this.serverStatus !== 'offline') {
          this.serverStatus = 'offline';
          console.warn('[Connection] Server is OFFLINE');
          this.useLocalMode = true;
          this.notifyAll();
          if (typeof addNotification === 'function') {
            this.serverPingToastId = addNotification({
              id: 'server-connection',
              persist: true,
              type: 'error',
              message: 'Server unreachable, reconnecting...',
            });
          }
        }
      }
    };
    pingServer();
    this.connectionInterval = setInterval(pingServer, 5000);
  }

  async updateAllPlantsSensors() {
    if (this.guestMode || this.serverStatus !== 'online' || !this.currentUserId) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/sensors/${this.currentUserId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (!response.ok) {
        throw new Error(`Error fetching sensor data: ${response.statusText}`);
      }

      const json = await response.json();
      if (!json.success) {
        throw new Error(json.message || 'Failed to fetch sensor data.');
      }

      const sensorArray = json.sensors; 
      console.log(sensorArray);
      this.plants = this.plants.map((plant) => {
        const matching = sensorArray.find((s) => s.plantId === plant.id.toString());
        if (!matching) return plant;
        return {
          ...plant,
          sensors: {
            ...plant.sensors,
            ...matching.sensors,
          },
        };
      });

      this.notifyAll();
    } catch (err) {
      console.error('Error in updateAllPlantsSensors:', err);
    }
  }

  randomFluct(value, range, min, max) {
    let newValue = value + (Math.random() * range - range / 2);
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    return Math.round(newValue * 10) / 10;
  }

  addListener(callback) {
    this.listeners.push(callback);
    callback(this.getPlants());
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((cb) => cb !== callback);
  }

  notifyAll() {
    const data = this.getPlants();
    this.listeners.forEach((cb) => cb(data));
  }

  getPlants() {
    return JSON.parse(JSON.stringify(this.plants));
  }

  isGuestMode() {
    return this.guestMode;
  }

  getServerStatus() {
    return this.serverStatus;
  }

  // -----------------------
  // AUTH METHODS
  // -----------------------
  async login({ email, password }) {
    if (this.guestMode) {
      return { success: false, errorMessage: 'Login not available in Guest Mode.' };
    }
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errorMessage: errorData.message || 'Login failed' };
      }
      const data = await response.json();
      if (data.success) {
        this.currentUserId = data.uid;
        console.log("User logged in:", this.currentUserId);
        return { success: true };
      } else {
        return { success: false, errorMessage: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Error calling /api/login:', error);
      return { success: false, errorMessage: 'Server unreachable. Please try again later.' };
    }
  }

  async signup({ email, password }) {
    if (this.guestMode) {
      return { success: false, errorMessage: 'Signup not available in Guest Mode.' };
    }
    try {
      const response = await fetch(`${BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, errorMessage: errorData.message || 'Sign up failed' };
      }
      const data = await response.json();
      if (data.success) {
        this.currentUserId = data.uid;
        console.log("User signed up:", this.currentUserId);
        return { success: true };
      } else {
        return { success: false, errorMessage: data.message || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Error calling /api/signup:', error);
      return { success: false, errorMessage: 'Server unreachable. Please try again later.' };
    }
  }

  // -----------------------
  // PLANT METHODS
  // -----------------------
  buildLocalPlant(detail, nickname = '') {
    return {
      id: Date.now(),
      name: nickname || detail.display_pid,
      apiData: {
        officialName: detail.display_pid,
        alias: detail.alias,
        category: detail.category,
        max_light_mmol: detail.max_light_mmol,
        min_light_mmol: detail.min_light_mmol,
        max_light_lux: detail.max_light_lux,
        min_light_lux: detail.min_light_lux,
        max_temp: detail.max_temp,
        min_temp: detail.min_temp,
        max_env_humid: detail.max_env_humid,
        min_env_humid: detail.min_env_humid,
        max_soil_moist: detail.max_soil_moist,
        min_soil_moist: detail.min_soil_moist,
        max_soil_ec: detail.max_soil_ec,
        min_soil_ec: detail.min_soil_ec,
      },
      photo: detail.image_url || '',
      sensors: {
        temp: 22,
        humidity: 40,
        soilMoisture: 50,
        light: 300,
      },
    };
  }
  
  async addPlant({ alias, nickname }) {
    if (this.guestMode) {
      const detail = localPlantData.find(
        (plant) => plant.alias.toLowerCase() === alias.toLowerCase()
      );
      if (!detail) {
        throw new Error(`Local plant data not found for alias: ${alias}`);
      }
      const newPlant = this.buildLocalPlant(detail, nickname);
      this.plants.push(newPlant);
      this.notifyAll();
      return newPlant;
    }
    let detail;
    if (this.useLocalMode) {
      console.log("Using local mode to fetch plant details.");
      detail = localPlantData.find(
        (plant) => plant.alias.toLowerCase() === alias.toLowerCase()
      );
      if (!detail) {
        throw new Error(`Local plant data not found for alias: ${alias}`);
      }
    } else {
      try {
        const response = await fetch(
          `${BASE_URL}/api/plantByAlias?alias=${encodeURIComponent(alias)}`,
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        if (!response.ok) {
          throw new Error(`Error fetching plant details: ${response.statusText}`);
        }
        detail = await response.json();
        console.log('[DEBUG] detail from server:', detail);
      } catch (error) {
        console.error("Error fetching from proxy, falling back to local mode.", error);
        this.useLocalMode = true;
        detail = localPlantData.find(
          (plant) => plant.alias.toLowerCase() === alias.toLowerCase()
        );
        if (!detail) {
          throw new Error(`Local plant data not found for alias: ${alias}`);
        }
      }
    }
    const newPlant = {
      id: Date.now(),
      name: nickname || detail.display_pid,
      apiData: {
        officialName: detail.display_pid,
        alias: detail.alias,
        category: detail.category,
        max_light_mmol: detail.max_light_mmol,
        min_light_mmol: detail.min_light_mmol,
        max_light_lux: detail.max_light_lux,
        min_light_lux: detail.min_light_lux,
        max_temp: detail.max_temp,
        min_temp: detail.min_temp,
        max_env_humid: detail.max_env_humid,
        min_env_humid: detail.min_env_humid,
        max_soil_moist: detail.max_soil_moist,
        min_soil_moist: detail.min_soil_moist,
        max_soil_ec: detail.max_soil_ec,
        min_soil_ec: detail.min_soil_ec,
      },
      photo: detail.image_url || '',
      sensors: {
        temp: 22,
        humidity: 40,
        soilMoisture: 50,
        light: 300,
      },
    };    
    if (this.currentUserId) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/userPlants/${this.currentUserId}`, 
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify(newPlant),
          }
        );
        const result = await response.json();
        if (!result.success) {
          console.warn("Failed to save plant to Firestore:", result.message);
        } else {
          console.log("Plant saved to Firestore:", newPlant.name);
        }
      } catch (err) {
        console.error("Error saving plant to Firestore:", err);
      }
    }
    await this.fetchUserPlants();
    return newPlant;
  }

  async removePlant(id) {
    if (this.guestMode) {
      this.plants = this.plants.filter((p) => p.id !== id);
      this.notifyAll();
      return;
    }
    if (this.currentUserId) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/userPlants/${this.currentUserId}/${id}`,
          {
            method: 'DELETE',
            headers: { 'ngrok-skip-browser-warning': 'true' },
          }
        );
        const result = await response.json();
        if (!result.success) {
          console.warn("Failed to delete plant from Firestore:", result.message);
        } else {
          console.log("Plant deleted from Firestore:", id);
        }
      } catch (err) {
        console.error("Error deleting plant from Firestore:", err);
      }
    }
    await this.fetchUserPlants();
  }

  async fetchUserPlants() {
    if (this.guestMode) return;
    if (!this.currentUserId) {
      console.warn("No user ID set. Cannot fetch plants.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/userPlants/${this.currentUserId}`,
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      const data = await response.json();
      if (data.success) {
        this.plants = data.plants;
        this.notifyAll();
        console.log("Fetched plants from Firestore:", this.plants);
      } else {
        console.warn("Failed to fetch user plants:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user plants:", error);
    }
  }

  async resetPassword(email) {
    // If you want to handle this via the same Node server:
    try {
      const response = await fetch(`${BASE_URL}/api/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling /api/resetPassword:', error);
      return { success: false, message: 'Server unreachable.' };
    }
  }

  destroy() {
    clearInterval(this.interval);
    clearInterval(this.syncInterval);
    clearInterval(this.connectionInterval);
    this.plants = [];
    this.listeners = [];
  }

  reset() {
    this.destroy();
    this.plants = [];
    this.listeners = [];
    this.guestMode = false;
    this.useLocalMode = false;
    this.currentUserId = null;
    this.serverStatus = 'unknown';
    this.serverPingToastId = null;
    console.log('[DataService] Reset complete.');
  }
}

let dataService = new DataService();

export function resetDataServiceInstance() {
  dataService.destroy();
  dataService = new DataService();
  return dataService;
}

export default dataService;
