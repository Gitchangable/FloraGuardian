# Floral Guardian

Floral Guardian is a full-stack application for monitoring and managing plant growth using real-time sensor data. It supports both online (Firebase-backed) and offline (local simulation) modes, provides authentication via Firebase, and gives rich visual feedback through dynamic UI elements.

---

## Setup Instructions

1. **Install Dependencies**  
   Navigate to the root folder and run:
   ```bash
   npm install
   ```

2. **Start the API Server (Optional)**  
   For full Firebase and API integration, navigate to the `/server` folder and run:
   ```bash
   node server.js
   ```

3. **Launch the Application**  
   From the root directory:
   ```bash
   npm start
   ```

4. **Open in Browser**  
   Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## Features

- **Authentication System**
  - Email/password signup & login via Firebase Auth.
  - Each user has a dedicated Firestore document for their plants.

- **Cloud-Backed Plant Sync**
  - Add/remove plants, all changes are saved to Firestore in real-time.
  - Automatically fetches and loads your plants on login.

- **Resilient Offline Mode**
  - If the server or Firebase is unreachable, the app enters offline testing mode using `src/localPlantData.json`.
  - Attempts to reconnect every 5 seconds.

- **Live Sensor Simulation**
  - Each plant is updated every second with randomized temperature, light, humidity, and soil moisture values.

- **Smart UI Feedback**
  - Non-intrusive toast notifications for login success, form errors, and server issues.
  - Persistent toast with spinner when in offline mode; disappears automatically when reconnected.

---

## Important Notes

- **Server Folder**  
  The `/server` folder contains API keys and Firebase service credentials, and is intentionally excluded from version control.

- **Offline Mode Detection**  
  If the API server is not running or Firebase is down, the app will show a persistent notification and use local fallback plant data.
