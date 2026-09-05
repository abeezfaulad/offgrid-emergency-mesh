# 📘 OffGrid Emergency Mesh – Complete Instructions

**Version:** 1.0  
**Last Updated:** September 2026  
**For:** Hackathon Submission (Make-A-Ton OffGrid)

---

## 📌 Table of Contents

1. [What Is This Project?](#what-is-this-project)
2. [How It Works (Concept)](#how-it-works-concept)
3. [What You Need](#what-you-need)
4. [Quick Setup (5 Minutes)](#quick-setup-5-minutes)
5. [Detailed Step-by-Step Setup](#detailed-step-by-step-setup)
   - [On a Laptop (Linux/macOS/Windows)](#on-a-laptop-linuxmacoswindows)
   - [On Android (Termux)](#on-android-termux)
6. [Using the Application](#using-the-application)
   - [Create a Room (Host)](#create-a-room-host)
   - [Join a Room (Guest)](#join-a-room-guest)
   - [Chat & Participant List](#chat--participant-list)
7. [Admin Panel (Control Server)](#admin-panel-control-server)
8. [Troubleshooting](#troubleshooting)
9. [How It Works in a Disaster](#how-it-works-in-a-disaster)
10. [Future Enhancements](#future-enhancements)
11. [Technical Architecture](#technical-architecture)

---

## What Is This Project?

**OffGrid Emergency Mesh** is a **zero-internet, browser-based emergency communication system**.

It turns any Wi‑Fi hotspot into a local communication hub where:
- Anyone with a smartphone can join by opening a web page.
- No app installation required.
- No internet connection needed – works entirely offline.
- Messages are sent instantly to everyone in the room.
- Participants can see who else is connected.

**Why this matters:**
When disasters strike – earthquakes, floods, storms – cellular towers fail. Internet is down. There is no way to coordinate rescue, share urgent updates, or ask for help. Our system fills that gap with a solution that costs nothing and can be deployed by anyone with a phone and a power bank.

---

## How It Works (Concept)

Host Device]
│
│ Creates a Wi-Fi hotspot
│ Runs Node.js server (port 3000)
│ Serves a web page
│ Generates a 6-digit room code
▼
[Wi-Fi Hotspot] ←─────── All clients connect here
│
├─────────────▶ [Client 1: Phone] opens browser → enters room code
├─────────────▶ [Client 2: Phone] opens browser → enters room code
├─────────────▶ [Client 3: Laptop] opens browser → enters room code
│
▼
[WebSocket Server] ←── Messages are broadcast to all connected clients
│
▼
[All Clients] ←─────── Everyone sees the message instantly


**Key components:**
- **Host:** Runs the Node.js server and hosts the Wi‑Fi hotspot.
- **Clients:** Any device with a browser, connected to the hotspot.
- **Room Code:** A 6-digit alphanumeric code (e.g., `A3F9K2`) that pairs clients together.
- **WebSocket:** Real‑time communication channel between all devices.

---

## What You Need

### Hardware
| Item | Purpose |
| :--- | :--- |
| **Host Device** | Laptop or Android phone (with Termux) to run the server. |
| **Wi-Fi Hotspot** | The host device must be able to create a hotspot. |
| **Client Devices** | Any smartphone, tablet, or laptop with a browser. |

### Software
| Software | Where to Get It |
| :--- | :--- |
| **Node.js** (v14+) | [nodejs.org](https://nodejs.org/) or `pkg install nodejs` (Termux) |
| **Git** (optional) | [git-scm.com](https://git-scm.com/) or `pkg install git` (Termux) |
| **A Web Browser** | Chrome, Firefox, Edge, Safari (any modern browser) |

---

## Quick Setup (5 Minutes)

If you already have Node.js installed:

```bash
# 1. Clone or download the project
git clone https://github.com/abeezfaulad/offline-mesh.git
cd offline-mesh

# 2. Install dependencies
npm install

# 3. Start the server
node server.js

# 4. Open your browser
#    → On the host: http://localhost:3000
#    → On other devices: http://<HOST_IP>:3000