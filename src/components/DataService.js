import localPlantData from '../localPlantData.json';

class DataService {
  constructor() {
    this.plants = [];
    this.listeners = [];
    this.useLocalMode = false;

    // Check for proxy availability when the service is created.
    this.checkProxyAvailability();

    // Start sensor data updates.
    this.interval = setInterval(() => {
      this.updateAllPlantsSensors();
    }, 1000);
  }

  async checkProxyAvailability() {
    try {
      const response = await fetch('http://localhost:5000/api/ping');
      if (response.ok) {
        this.useLocalMode = false;
        console.log("Proxy available, using remote API.");
      } else {
        throw new Error("Proxy ping failed.");
      }
    } catch (error) {
      console.warn("Proxy not available, switching to local mode:", error.message);
      this.useLocalMode = true;
    }
    this.notifyAll();
  }

  updateAllPlantsSensors() {
    this.plants = this.plants.map((p) => {
      const { temp, humidity, soilMoisture, light } = p.sensors;
      return {
        ...p,
        sensors: {
          temp: this.randomFluct(temp, 1, 0, 40),
          humidity: this.randomFluct(humidity, 1, 0, 100),
          soilMoisture: this.randomFluct(soilMoisture, 2, 0, 100),
          light: this.randomFluct(light, 10, 0, 1000),
        },
      };
    });
    this.notifyAll();
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

  // -----------------------
  // AUTH METHODS
  // -----------------------
  async login({ email, password }) {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // 401 if credentials are invalid, etc.
        const errorData = await response.json();
        return { success: false, errorMessage: errorData.message || 'Login failed' };
      }

      const data = await response.json();
      if (data.success) {
        // Possibly store a token or user info in localStorage/cookies if needed
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
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Could be 400 if user already exists
        const errorData = await response.json();
        return { success: false, errorMessage: errorData.message || 'Sign up failed' };
      }

      const data = await response.json();
      if (data.success) {
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
  async addPlant({ alias, nickname }) {
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
          `http://localhost:5000/api/plantByAlias?alias=${encodeURIComponent(alias)}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching plant details: ${response.statusText}`);
        }
        detail = await response.json();
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

    this.plants.push(newPlant);
    this.notifyAll();
    return newPlant;
  }

  destroy() {
    clearInterval(this.interval);
    this.listeners = [];
  }
}

const dataService = new DataService();
export default dataService;
