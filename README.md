# ⚡ OffGrid Emergency Mesh

**Zero-infrastructure emergency communication over local Wi-Fi.**

[![Hackathon](https://img.shields.io/badge/Make--A--Ton-OffGrid-blue)](https://offgrid.makeaton.in)

## 📌 The Problem We Solve

In disaster scenarios – earthquakes, floods, storms, or remote rural areas – the first thing to fail is cellular infrastructure. Mobile towers are damaged, internet backhauls are cut, and power is out. 

When that happens:
- **No calls** 📵
- **No SMS** ✉️
- **No WhatsApp / Telegram / Signal** (they all require the cloud)
- **No way to coordinate rescue**, share urgent updates, or ask for help.

Walkie-talkies are short-range, expensive, and don't share text/data reliably.

---

## 💡 Our Solution

**OffGrid Emergency Mesh** turns any Wi-Fi hotspot into a local, browser-based communication hub.

- 🔥 **Works 100% offline** – no internet required.
- 📱 **Zero app installation** – any smartphone browser works.
- 🔗 **Instant pairing** – 6-digit room code joins participants instantly.
- 👥 **Live participant list** – see exactly who is connected.
- 🛠️ **Built-in admin panel** – start/stop the server and view logs.

---

## 📡 What Kind of Wi-Fi Do I Need?

- **Any Wi-Fi hotspot** (from a phone, laptop, or travel router) works.
- **No internet connection** is required – the router just needs to assign IP addresses (DHCP) to connected devices.
- **Range:** Typically 30–100 meters with a phone hotspot; 200+ meters with a dedicated outdoor router.
---

## 🎯 How It Works

1. **Host** enables a Wi-Fi hotspot on a laptop/Android (via Termux).
2. **Host** runs the Node.js server (`node server.js`).
3. **Users** connect their phones to the hotspot and open the host's IP in a browser.
4. **Host** creates a room, gets a 6-digit code (e.g., `A3F9K2`).
5. **Guests** enter the code and join the same room.
6. **Everyone chats** – messages appear instantly on all connected devices.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js + Express |
| **Realtime** | WebSocket (`ws` library) |
| **Frontend** | HTML5, CSS3 (embedded in HTML), Vanilla JS |
| **Admin Panel** | Separate Node.js server with HTTP endpoints |
| **Protocol** | HTTP + WebSocket over TCP/IP (local Wi-Fi) |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/abeezfaulad/offline-mesh.git
cd offline-mesh
