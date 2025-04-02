# Floral Guardian

Floral Guardian is an application designed to manage plant devices and provide accurate, real-time growth data. This repository contains the core application code, while server credentials and sensitive files are kept private.

---

## Setup Instructions

1. Install Dependencies:  
   Navigate to the root folder and run:
   ```bash
   npm install
   ```

2. (Optional) Start the API Server:  
   To enable API-backed plant data, open a terminal in the `/server` folder and run:
   ```bash
   node server.js
   ```

3. Launch the Application:  
   Run the following command to start the app:
   ```bash
   npm start
   ```

4. Access the Application:  
   Open your browser and go to [http://localhost:3000](http://localhost:3000).

---

## Important Notes

- Server Folder:  
  The `/server` folder is excluded from this repository due to sensitive credentials.
  
- Fallback Mode:  
  If the server is not running, the app will automatically switch to local mode using preloaded example plants from `src/localPlantData.json`.
  
- Local Images:  
  When operating in local mode, images are sourced from `public/local-images/`.

---

## Theoretical Workflow

### Step 1: User Account Setup

- Abstract:  
  Users create an account to securely manage and pair their plant devices.

- Technical Details:  
  - Backend: Users register using their email and password via the website or mobile app.
  - Database: Account details are stored securely in a dedicated user management database.
  - Security: Authentication tokens are generated for subsequent requests.

---

### Step 2: Device Boot and Secure Registration

- Abstract:  
  Upon booting, the Raspberry Pi registers itself with the backend via a secure proxy server and receives a temporary pairing token.

- Technical Details:  
  - Device Registration: The Raspberry Pi sends its unique hardware ID to the secure proxy server using pre-installed credentials.
  - Pairing Token: A one-time, short-lived pairing token (or QR code) is generated and linked to the device’s ID.
  - Firestore Setup: The proxy server creates a device document in Firestore with restricted read/write permissions.

---

### Step 3: Device Pairing with User Account

- Abstract:  
  The user pairs the registered device with their account using the provided pairing token.

- Technical Details:  
  - Pairing Process: The user logs into the website/app and inputs the pairing token (or scans the QR code) displayed by the Raspberry Pi.
  - Verification: The proxy server validates the token and links the device’s Firestore document with the user’s account.
  - Access Control: After pairing, only the user and the secure proxy server can modify the device’s settings in Firestore.

---

### Step 4: Plant Type Selection and Growth Requirements Retrieval

- Abstract:  
  Once paired, the user selects a plant type, and the system retrieves the appropriate growth requirements from a trusted backend source.

- Technical Details:  
  - User Selection: The website/app presents a list of plant types.
  - Data Retrieval: Upon selection, the proxy server fetches or references cached, validated growth condition data (e.g., temperature, humidity, light) from an internal database or trusted API.
  - Firestore Update: The proxy server updates the device’s Firestore document with these verified growth requirements.

---

### Step 5: Device Operation & Sensor Data Upload

- Abstract:  
  The Raspberry Pi continuously monitors sensor data, adjusts environmental conditions based on growth requirements, and uploads updates to Firestore.

- Technical Details:  
  - Sensor Management: The Raspberry Pi reads data from connected sensors (temperature, humidity, soil moisture, light).
  - Actuation: It adjusts connected actuators (heaters, humidifiers, watering systems) based on the plant’s requirements.
  - Data Upload: Sensor readings and a timestamp are regularly written to the device’s Firestore document.
  - Offline Handling: In case of connectivity issues, the system flags the device status and alerts the user.

---

### Step 6: Monitoring, Dashboard, and Notifications

- Abstract:  
  Users can monitor real-time sensor data and receive alerts for any deviations from optimal plant conditions.

- Technical Details:  
  - Dashboard: The website/app displays current sensor data with timestamps for the last update.
  - Notifications: Alerts (e.g., push notifications, emails) are triggered if sensor readings deviate from the established thresholds.
  - Data Integrity: Safeguards are in place to ensure data remains current and accurate, preventing user misinterpretation.

---
