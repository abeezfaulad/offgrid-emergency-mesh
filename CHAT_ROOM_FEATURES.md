# 💬 Chat & Room Features – OffGrid Emergency Mesh

This document explains how the **chat** and **room** systems work under the hood, from the user interface to the server logic.

---

## 📌 Overview

The OffGrid Emergency Mesh provides a **real-time, room-based chat** over a local Wi-Fi network.  
- Users join a room using a **6-digit alphanumeric code**.  
- Messages are sent instantly to **all participants** via WebSockets.  
- A **live participant list** shows who is currently connected.

---

## 🏠 Room System

### How Rooms Work

| Concept | Description |
| :--- | :--- |
| **Room Code** | A 6-character alphanumeric string (e.g., `A3F9K2`). Generated randomly by the server when a host creates a room. |
| **Room Creation** | The first user (host) clicks "Create Room". The server generates a unique code, creates a room, and adds the host as the first participant. |
| **Room Joining** | Other users (guests) enter the code and click "Join". The server adds them to the existing room. |
| **Room Lifecycle** | A room exists as long as at least one participant is connected. When the last person leaves, the room is automatically deleted from the server memory. |
| **Maximum Participants** | Technically unlimited, but practically limited by the host device's Wi‑Fi hotspot capacity (typically 8–15 clients on a phone hotspot). |

### Room Code Generation

```javascript
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}