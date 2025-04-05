Below is a draft README that follows a structured format for the repository:

---

# Floral Guardian

Floral Guardian is a web application designed to monitor and manage your indoor garden. It features real-time sensor data updates, user authentication (including Firebase integration), and a robust offline/guest mode for development and testing. The application uses a secure server for handling cloud-based operations while maintaining a clean separation of concerns with a React front-end and a Node/Express back-end.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Guest Mode & Offline Support](#guest-mode--offline-support)
- [Development Phases](#development-phases)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Real-Time Sensor Monitoring:**  
  Plants update every second with simulated sensor data (temperature, humidity, soil moisture, and light).

- **User Authentication:**  
  - Email/password login and signup via Firebase.
  - Secure server endpoints for authentication and plant data operations.
  
- **Cloud Sync:**  
  Plant data is persisted to a Firestore database for authenticated users.

- **Guest Mode:**  
  An offline-only experience for testing and development with no server communication.

- **Server Connectivity Monitoring:**  
  The app pings the server every 5 seconds to display dynamic connection status notifications and automatically switch to a local mode if the server is unreachable.

- **Responsive UI & Notifications:**  
  Non-intrusive toast notifications for success, warnings, and errors. Persistent banners indicate offline or guest mode.

---

## Architecture

The application is divided into two separate projects:

### Front-End (React)
- **Components:**
  - **AuthModal:** Handles login, signup, and guest login.
  - **DataService:** Acts as a client-side cache and mediator for plant data, server sync, and sensor updates.
  - **PlantProfile, SensorPanel, ControlPanel, AnalyticsPanel, NotificationPanel:** Provide the UI for managing and visualizing plant data.
  - **NotificationContext:** Global context for non-blocking toast notifications.
- **State Management:**  
  Uses local state and context for managing authentication status, guest mode, and server connection status.

### Back-End (Node/Express)
- **Server:**  
  Provides endpoints for:
  - Authentication (`/api/login`, `/api/signup`)
  - Plant data retrieval and manipulation (`/api/plantByAlias`, `/api/userPlants/:uid`, DELETE `/api/userPlants/:uid/:plantId`)
  - A simple ping endpoint (`/api/ping`) to monitor connectivity.
- **Firebase Integration:**  
  - Uses Firebase Admin SDK for secure user creation and Firestore access.
  - Uses the Firebase REST API for email/password sign-in.
  
---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Front-End Setup

1. Navigate to the front-end folder:
   ```bash
   cd src
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

### Back-End Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Place your Firebase service key (`firebaseServiceKey.json`) in the server directory.
4. Start the server:
   ```bash
   node server.js
   ```

---

## Usage

1. **Authentication:**
   - Users can log in or sign up using email/password.
   - Alternatively, choose **Guest Mode** for an offline experience.
   
2. **Managing Plants:**
   - Authenticated users have their plants synced to Firestore.
   - Guest users work purely with local data.
   - Plant sensor data updates automatically, and users can add or remove plants.
   
3. **Server Connectivity:**
   - The app pings the server every 5 seconds.
   - If the server is unreachable, a persistent error toast and a banner will notify you and switch the app to offline mode.
   - When the server reconnects, a success toast appears and the banner is removed.

---

## Guest Mode & Offline Support

- **Guest Mode:**  
  Designed for development and testing. When in Guest Mode, server pings and all communication with the cloud are disabled. Data is stored locally.
  
- **Offline User Mode:**  
  For authenticated users, if the server becomes unreachable, the app enters read-only mode, disabling add/remove plant operations until the connection is restored.
