// Function to generate or prompt for a short, user-friendly ID
function getSimpleId() {
  const customId = prompt("Enter a short ID for this node (e.g., 101, node1):");
  return customId ? customId.trim() : "node-" + Math.floor(100 + Math.random() * 900);
}

// Initialize PeerJS with the short custom ID
const mySimpleId = getSimpleId();
const peer = new Peer(mySimpleId);

let activeConnections = [];

// Display assigned short ID on interface once connection opens
peer.on('open', (id) => {
  const idDisplay = document.getElementById('my-id');
  if (idDisplay) {
    idDisplay.innerText = id;
  }
});

// Listen for incoming peer connections over the local network
peer.on('connection', (conn) => {
  setupConnectionHandlers(conn);
});

// Handle peer connection errors gracefully
peer.on('error', (err) => {
  console.error("PeerJS Error:", err);
  alert("Connection error: " + err.message);
});

// Initiate connection to another target peer ID
function connectToPeer() {
  const targetInput = document.getElementById('peer-id-input');
  const targetId = targetInput ? targetInput.value.trim() : "";

  if (!targetId) {
    alert('Please enter a target Node ID to connect.');
    return;
  }

  if (targetId === mySimpleId) {
    alert('You cannot connect to your own Node ID.');
    return;
  }

  const conn = peer.connect(targetId);
  setupConnectionHandlers(conn);
}

// Bind connection lifecycle and data handlers
function setupConnectionHandlers(conn) {
  conn.on('open', () => {
    // Avoid duplicate connections
    if (!activeConnections.some(c => c.peer === conn.peer)) {
      activeConnections.push(conn);
    }
    appendFeed("System", `Successfully linked to Node: ${conn.peer}`);
  });

  conn.on('data', (data) => {
    // Handle incoming broadcast payload
    if (data && data.message) {
      appendFeed(`Node (${conn.peer})`, data.message);
    }
  });

  conn.on('close', () => {
    activeConnections = activeConnections.filter(c => c.peer !== conn.peer);
    appendFeed("System", `Disconnected from Node: ${conn.peer}`);
  });

  conn.on('error', (err) => {
    console.error("Connection error with peer:", conn.peer, err);
  });
}

// Broadcast emergency message to all active peer connections
function broadcastMessage() {
  const input = document.getElementById('msg-input');
  if (!input) return;

  const messageText = input.value.trim();
  if (!messageText) return;

  const payload = { 
    message: messageText, 
    timestamp: new Date().toLocaleTimeString() 
  };

  // Transmit payload across all connected peer datachannels
  activeConnections.forEach(conn => {
    if (conn.open) {
      conn.send(payload);
    }
  });

  // Display message in local feed
  appendFeed("Me", messageText);
  input.value = "";
}

// Render entries into the local bulletin feed UI
function appendFeed(sender, text) {
  const feed = document.getElementById('bulletin-feed');
  if (!feed) return;

  const entry = document.createElement('p');
  entry.style.margin = "5px 0";
  entry.style.borderBottom = "1px solid #334155";
  entry.style.paddingBottom = "5px";
  entry.innerText = `[${new Date().toLocaleTimeString()}] ${sender}: ${text}`;
  
  feed.appendChild(entry);
  feed.scrollTop = feed.scrollHeight; // Auto-scroll to latest message
}