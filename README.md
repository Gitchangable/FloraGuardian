# Floral Guardian

## Setup Instructions

1. Run `npm install` in the root project folder to install dependencies.
2. (Optional) Start a terminal in `/server` and run `node server.js` to enable API-backed plant data.
3. Run `npm start` to launch the app.
4. Open your browser and go to `http://localhost:3000`.

## Notes

- The `/server` folder is not included in this repository because it contains personal credentials.
- If the server is not running, the app will fall back to local mode using preloaded example plants stored in `src/localPlantData.json`.
- Images for local mode are located in `public/local-images/`.

## Theoretical use

Step 1: User Account Setup

Abstract:
Users create an account on the system to manage and pair their plant devices securely.

Technical:

Backend: Users sign up with credentials (e.g., email, password) on your website or mobile app.

Database: Account details are stored securely in your user management database.

Security: Authentication tokens are issued for future requests.

Web user:
Analogy: Imagine visiting a secure registration desk at a community center where you fill out a form to receive a membership card.

App user:
Analogy: Think of downloading an app and setting up your profile like creating a digital passport before accessing any personalized services.
Step 2: Device Boot and Secure Registration

Abstract:
The plant's Raspberry Pi boots up and securely registers itself with the backend via the proxy server, receiving a temporary pairing token.

Technical:

Device Registration: On boot, the Raspberry Pi contacts the secure proxy server (using pre-installed credentials) to register its unique hardware ID.

Pairing Token: The proxy server generates a short-lived, one-time pairing token (or QR code) and associates it with the device’s ID.

Firestore Setup: The proxy sets up the device’s document in Firestore with appropriate read/write permissions (restricted to backend operations).

Web user:
Analogy: Think of the device as a new member arriving at the center, receiving a temporary visitor’s badge from the registration desk.

App user:
Analogy: Similar to a new device pairing with your phone via a QR code, the device displays a code for secure registration.
Step 3: Device Pairing with User Account

Abstract:
The user securely pairs the registered device to their account using the pairing token provided by the Raspberry Pi.

Technical:

Pairing Process: The user logs into the website or app and is prompted to enter the pairing token (or scan the QR code) displayed by the Raspberry Pi.

Verification: The proxy server validates the token and binds the device’s Firestore document to the user’s account.

Access Control: Post-pairing, only the paired user and the secure proxy server can modify the device’s settings in Firestore.

Web user:
Analogy: The user takes the visitor’s badge code from the new member and enters it at a kiosk to officially register them as part of your community.

App user:
Analogy: You scan a QR code from a new gadget to instantly add it to your digital collection, ensuring it’s linked to your account.
Step 4: Plant Type Selection and Retrieval of Growth Requirements

Abstract:
Once the device is paired, the user selects the plant type, and the system retrieves validated growth requirements from a backend source.

Technical:

User Selection: The website/app presents a list of plant types.

Data Retrieval: When a plant type is selected, the proxy server fetches or references cached, validated growth condition data (e.g., temperature, humidity, light) from an internal database or trusted API.

Firestore Update: The proxy server writes the growth requirements to the device’s Firestore document, ensuring only validated data is used.

Web user:
Analogy: Imagine selecting a plant species from a catalog at the community center, where each selection comes with pre-approved care instructions.

App user:
Analogy: Think of browsing a digital library of plant care guides on your phone and selecting one to automatically update your device’s care profile.
Step 5: Device Operation & Sensor Data Upload

Abstract:
The Raspberry Pi continuously monitors sensor data and adjusts environmental parameters according to the growth requirements, while regularly uploading status updates to Firestore.

Technical:

Sensor Management: The Raspberry Pi reads temperature, humidity, soil moisture, and light levels using connected sensors.

Actuation: Based on the growth requirements, it adjusts actuators (e.g., heaters, humidifiers, watering systems).

Data Upload: The device writes sensor readings and a heartbeat timestamp to its Firestore document, ensuring the data includes an “updated at” field for freshness checks.

Offline Handling: If the Pi goes offline, the system marks its status, alerting users that data may be outdated.

Web user:
Analogy: Picture the plant as a self-regulating greenhouse in the community center that adjusts its environment automatically and sends periodic reports to a bulletin board.

App user:
Analogy: It’s like having a smart device that continually sends updates to your phone, so you know exactly how your plant is doing at any moment.
Step 6: Monitoring, Dashboard, and Notifications

Abstract:
Users can monitor real-time sensor data and receive alerts if any conditions deviate from the optimal range, ensuring proactive plant care.

Technical:

Dashboard: The website/app displays current sensor data, including timestamps for the last update.

Notifications: The proxy server or app logic monitors sensor thresholds and can trigger alerts (e.g., push notifications, emails) if conditions fall outside safe ranges.

Data Integrity: The system includes safeguards to prevent stale or incorrect data from misleading the user.

Web user:
Analogy: Imagine checking a community center notice board where the status of each plant is updated in real-time, with warnings if any plant needs attention.

App user:
Analogy: Think of a dashboard on your smartphone that shows live updates from your plant’s sensors and sends you an alert if it’s time to water or adjust the light.
