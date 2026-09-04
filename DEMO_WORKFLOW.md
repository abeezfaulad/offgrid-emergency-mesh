# ⏱️ Live Demo Workflow – OffGrid Emergency Mesh

This is the **exact sequence** to follow when demonstrating the system, whether to judges, first responders, or friends.

---

## 🧭 The Big Picture (2‑Minute Summary)

1. **Host** turns on Wi‑Fi hotspot.
2. **Host** starts the Node.js server.
3. **Host** opens the webpage, creates a room, and gets a 6‑digit code.
4. **Guests** connect their phones to the **same** hotspot.
5. **Guests** open the Host's IP address in their browser.
6. **Guests** enter the room code.
7. **Everyone** chats – messages appear on all screens instantly.

---

## 📋 Detailed Step‑by‑Step (Do This, Then This)

### Phase 1: Preparation (Host Device)

| Step | Action | Why |
| :--- | :--- | :--- |
| **1** | **Turn on the Wi‑Fi hotspot** on your laptop or phone. | This creates the local network that all devices will join. |
| **2** | **Make sure your laptop/phone is connected to that hotspot** (if you're using a separate router, connect to it). | The Node.js server needs to be reachable on this network. |
| **3** | **Open a terminal** on your host device. | You'll run the server here. |
| **4** | **Navigate to the project folder:** `cd offgrid-emergency-mesh` | Your code is here. |
| **5** | **Install dependencies:** `npm install` | This only needs to be done once. |
| **6** | **Start the server:** `node server.js` | This fires up the WebSocket hub. |
| **7** | **Note the IP address** shown in the terminal (e.g., `192.168.43.1`). | This is what guests will type in their browser. |

---

### Phase 2: Host Creates a Room

| Step | Action | Why |
| :--- | :--- | :--- |
| **8** | **On the host device**, open a browser and go to `http://localhost:3000`. | This loads the mesh interface. |
| **9** | **Enter your name** (e.g., "Commander"). | So others know who they're talking to. |
| **10** | **Click "Create Room"**. | This generates a unique 6‑digit code. |
| **11** | **Copy the room code** (e.g., `A3F9K2`) and **share it** with your team (verbally or via SMS). | Guests need this to join. |
| **12** | Wait. The screen shows: *"Waiting for others to join..."* | The room is now active. |

---

### Phase 3: Guests Join the Room

| Step | Action | Why |
| :--- | :--- | :--- |
| **13** | **On each guest device**, turn on Wi‑Fi and **connect to the same hotspot** as the host. | This puts them on the same local network. |
| **14** | **Open a browser** on the guest device. | Any browser (Chrome, Safari, Firefox) works. |
| **15** | **Type the host's IP address** into the address bar, followed by `:3000` (e.g., `http://192.168.43.1:3000`). | This loads the same mesh interface from the host's server. |
| **16** | **Enter your name** (e.g., "Rescue 1"). | So the host knows who joined. |
| **17** | **Click "Join Room"**. | Switches to the join screen. |
| **18** | **Enter the 6‑digit room code** (the one the host shared) and click **"Join"**. | This links the guest to the host's room. |
| **19** | **Success!** The guest sees the chat feed and the participant list (with the host and other guests). | Everyone is now connected. |

---

### Phase 4: Communication

| Step | Action | Why |
| :--- | :--- | :--- |
| **20** | **Any participant** types a message and presses Send. | The message appears instantly on every connected screen. |
| **21** | **System messages** appear automatically (e.g., "Alice joined the room", "Bob left the room"). | Keeps everyone aware of who is online. |
| **22** | **To leave**, click the red "Leave" button. | The participant list updates for everyone. |

---

## 📌 Critical Requirements (Checklist Before You Start)

- [ ] All devices are **on the same Wi‑Fi hotspot/router**.
- [ ] The **host's server is running** (`node server.js`).
- [ ] The **host's IP address** is correctly typed (no trailing spaces).
- [ ] The **room code** is typed in **uppercase** and exactly as shown.

---

## ⚠️ Common Demo Mistakes & How to Avoid Them

| Mistake | Solution |
| :--- | :--- |
| Guests type `localhost` instead of the host's IP. | Only the host can use `localhost`. Guests must use the IP address shown in the host's terminal. |
| Guests forget the `:3000` port number. | Remind them to type `http://<IP>:3000`, not just the IP. |
| Host changes hotspot or turns it off. | Keep the hotspot on at all times during the demo. |
| Guests don't see the chat. | Refresh the page, or check that they entered the correct room code. |

---

## 🎯 Final Check – The Whole Flow in 3 Sentences

1. **Host:** hotspot ON → `node server.js` → create room → share code.
2. **Guest:** connect to hotspot → open `http://<host-ip>:3000` → enter code → join.
3. **All:** start chatting instantly – no internet required.
