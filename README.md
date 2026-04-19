# Smart LoadMate: AI-Assisted Driver-Load Matching & Logistics Coordination

**Smart LoadMate** is a mobile-based logistics platform designed to optimize driver-load matching, minimize empty return trips, and provide real-time shipment transparency. This project utilizes a scalable cloud architecture with AI-driven routing and real-time GPS tracking.

---

## 🚀 Tech Stack

- **Frontend:** React Native (Expo)
- **Backend:** Python (FastAPI)
- **Database:** MongoDB (User & Load data) & Firebase (Real-time tracking)
- **APIs:** Google Maps API (Route Optimization & Mapping)
- **Tunneling:** Ngrok (For local development and mobile testing)

---

## 📂 Project Structure

```text
LoadMate/
├── lm-frontend/      # React Native / Expo Mobile App
└── lm-backend/       # FastAPI / Python Backend
```

---

## 🛠️ Setup & Installation

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up a virtual environment.

```bash
cd lm-backend
python -m venv venv
# Activate the environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn motor pymongo python-dotenv
```

### 2. Database Configuration
* **MongoDB:** Ensure your MongoDB URI is added to your `.env` file in the backend folder.
* **Firebase:** Configure your Firebase project for real-time data updates.

### 3. Frontend Setup (React Native + Expo)
Navigate to the frontend directory and install the necessary modules.

```bash
cd lm-frontend
npm install
```

---

## 🌐 Connectivity & Tunneling (Ngrok)

To allow the **Expo Go** app on your physical mobile device to communicate with your local backend, you must use a tunnel.

1.  **Start your Backend:**
    ```bash
    python -m uvicorn main:app --host 0.0.0.0 --port 8000
    ```
2.  **Start Ngrok:**
    ```bash
    ngrok http 8000
    ```
3.  **Update API URL:**
    Copy the `https://xxxx.ngrok-free.dev` link and paste it into your frontend configuration file (e.g., `api/index.js`):
    ```javascript
    const BASE_URL = "https://your-ngrok-url.ngrok-free.dev";
    ```
    *Note: Remember to add the `ngrok-skip-browser-warning: true` header to your Axios config.*

---

## 📱 Running the App

1.  **Start Expo:**
    ```bash
    npx expo start
    ```
2.  **Open Expo Go:**
    * Open the **Expo Go** app on your Android/iOS device.
    * Scan the QR code displayed in your terminal.
    * Ensure your phone has internet access to reach the Ngrok tunnel.

---

## 🔑 Key Features & Algorithms

- **AI-Based Matching:** Intelligent pairing of drivers with suitable loads based on vehicle capacity and location.
- **Route Optimization:** Utilizes **Dijkstra’s** and **A-Star (A*)** algorithms via Google Maps API for real-time traffic-aware routing.
- **Secure Authentication:** OTP-based verification for drivers and customers.
- **Real-Time Tracking:** Live GPS updates powered by Firebase.
- **Load Balancing:** Integrated logic to reduce empty backhauls and maximize driver earnings.

---

## 👥 Contributors
* **Team G14**
* **Department:** Computer Science and Engineering (CSE)
* **College:** MLR Institute of Technology