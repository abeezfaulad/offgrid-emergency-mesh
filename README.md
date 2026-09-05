# ⚡ OffGrid Emergency Mesh

Zero‑internet, browser‑based emergency communication over local Wi‑Fi.

https://img.shields.io/badge/Make--A--Ton-OffGrid-0ea5e9
https://img.shields.io/badge/License-MIT-yellow.svg
https://img.shields.io/badge/Node.js-18.x-339933

---
## 📌 What Is This?

OffGrid Emergency Mesh turns any Wi‑Fi hotspot into a local communication hub.

    🔥 Works 100% offline – no internet, no cellular, no cloud.

    📱 Zero app installation – just a browser (already on every phone).

    🔗 Instant pairing – 6‑digit room code joins participants in seconds.

    👥 Live participant list – see exactly who is connected.

    🛠️ Built‑in admin panel – start/stop the server and view live logs.
---
## 🧠 The Problem We Solve

In a disaster – earthquake, flood, hurricane, or rural area with no coverage:

    📵 Cellular towers fail – no calls, no SMS.

    🌐 Internet backhaul is cut – no WhatsApp, Telegram, or Signal.

    📡 Satellite phones are expensive, bulky, and limited.

    📻 Walkie‑talkies are short‑range and can't share text/data.

Our solution fills the gap with a system that costs nothing and can be deployed by anyone with a phone and a power bank.

---

## 💡 How It Works

### Architecture overview

```
HOST DEVICE
  │
  ├── Node.js Server (port 3000)
  │   ├── Serves web interface
  │   ├── Manages WebSocket connections
  │   ├── Creates rooms & 6-digit codes
  │   └── Broadcasts messages
  │
  └── Wi‑Fi Hotspot (IP: 192.168.43.1)
         │
         ▼
  All clients connect to the SAME hotspot
         │
         ▼
CLIENT DEVICES
  ├── Phone A (Browser at http://<IP>)
  ├── Phone B (Browser at http://<IP>)
  └── Laptop C (Browser at http://<IP>)
```

### Step-by-step

1. **Host:** turns on hotspot → runs `node server.js` → creates a room → shares the 6-digit code

2. **Guest:** connects to the hotspot → opens `http://<host-ip>:3000` → enters the code → joins

3. **Everyone:** chats instantly – no internet required
---
## 📡 Wi‑Fi Requirement

    Any Wi‑Fi hotspot (phone, laptop, travel router) works.

    No internet connection is required – the hotspot just assigns IP addresses.

    Range: ~30–100m with phone hotspot; 200+ meters with a dedicated router.
---
## 🚀 Quick Start (5 Minutes)
Prerequisites

    Node.js (v14 or higher) installed on the host device.

    A device that can create a Wi‑Fi hotspot (laptop, Android phone, or a travel router).
---
## Setup
```bash

git clone https://github.com/abeezfaulad/offgrid-emergency-mesh.git
cd offgrid-emergency-mesh
npm install
node server.js
```
---

## Connect Clients

    Enable a Wi‑Fi hotspot on the host device.

    Connect your clients (phones, tablets, other laptops) to that hotspot.

    Open a browser on each client and go to http://<host-ip>:3000.

    Enter your name, then Create or Join a room using the 6‑digit code.

    Start messaging.
---
## 🛠️ Admin Panel
```bash

node admin.js
```
Open http://<host-ip>:3001/admin.html in your browser.

    ▶️ Start – Launches the mesh server.

    ⏹️ Stop – Stops the mesh server.

    🔄 Restart – Restarts the mesh server.

    📋 Live Logs – See everything the mesh server prints in real‑time.
---
## 📚 Full Documentation
File	Description
INSTRUCTIONS.md	Complete step‑by‑step setup & usage guide.
DEMO_WORKFLOW.md	Minute‑by‑minute live demo sequence.
CHAT_ROOM_FEATURES.md	Deep dive into chat mechanics and room logic.
USE_CASES.md	Real‑world scenarios – disasters, remote areas, events.
FUTURE_ENHANCEMENTS.md	Roadmap for scaling to a disaster‑ready mesh network.
CONTRIBUTING.md	How to contribute to the project.
##🛠️ Tech Stack
Layer	Technology
Backend	Node.js + Express
Realtime	WebSocket (ws library)
Frontend	HTML5, CSS3 (embedded), Vanilla JavaScript
Admin Panel	Separate HTTP server with endpoints
Protocol	HTTP + WebSocket over TCP/IP (local Wi‑Fi)
##🔧 Troubleshooting
Problem	Solution
node: command not found	Install Node.js.
Port 3000 already in use	Kill the old process: pkill node.
Other devices can't connect	Check they're on the same hotspot and use the exact IP.
WebSocket connection fails	Allow port 3000 in your firewall.
Duplicate messages	Update to the latest server.js.
Blank page / white screen	Hard refresh: Ctrl+Shift+R.

---
## 🚀 Future Roadmap

### Phase 1: Hardware Deployment
- Replace laptop with Raspberry Pi 4 / Zero 2 W
- Add GL.iNet travel router (200m+ range, 50+ clients)
- Solar + battery power (24‑48 hours runtime)
- IP67 rugged enclosure for weatherproofing

### Phase 2: True Mesh Networking
- Implement BATMAN‑adv / OLSR routing protocols
- Multi‑node self‑healing mesh
- No single point of failure

### Phase 3: Long-Range Backhaul
- Integrate LoRa radios (2‑10 km node links)
- Wi‑Fi + LoRa bridging for village/campus coverage

### Phase 4: Offline Maps & GPS
- Pre‑cached OpenStreetMap tiles
- GPS location sharing between responders
- Real‑time position visibility on map

### Phase 5: Message Prioritisation
- Red (Distress) – pinned, highlighted in red
- Amber (Urgent) – highlighted in yellow
- Green (Normal) – standard chat

### Phase 6: Persistent Storage
- SQLite database for message history
- New clients get last 50 messages
- Useful for shift handover

### Phase 7: Cross-Platform & Mobile
- Standalone executable (pkg / nexe)
- Native Android app (Kotlin)
- One‑click installer for non‑technical users

### Phase 8: Advanced Features
- File sharing (images, small files)
- Voice messages
- End‑to‑end encryption
- AI‑powered real‑time translation
  
---
### 🤝 Contributing

Please read CONTRIBUTING.md for details.

---
### 📄 License

MIT License. See LICENSE for more information.

---
### 👤 Author

Abeez Faulad – GitHub: @abeezfaulad

---
