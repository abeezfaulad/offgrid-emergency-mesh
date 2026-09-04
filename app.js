// Initialize WebRTC Peer connection
const peer = new Peer();
let activeConnections = [];

// Display your unique Peer ID when connected
peer.on('open', (id) => {
  document.getElementById('my-id').innerText = id;
});

// Handle incoming peer connections over local wireless network
peer.on('connection', (conn) => {
  setupConnectionHandlers(conn);
});

// Connect to another peer via their Peer ID
function connectToPeer() {
  const targetId = document.getElementById('peer-id-input').value;
  if (!targetId) return alert('Enter a Peer ID');
  
  const conn = peer.connect(targetId);
  setupConnectionHandlers(conn);
}

// Manage message passing and peer lifecycle
function setupConnectionHandlers(conn) {
  conn.on('open', () => {
    activeConnections.push(conn);
    appendFeed("System", `Connected directly to node: ${conn.peer}`);
  });

  conn.on('data', (data) => {
    // Receive message payload directly over local wireless network
    appendFeed(`Node (${conn.peer.substring(0, 5)})`, data.message);
  });

  conn.on('close', () => {
    activeConnections = activeConnections.filter(c => c !== conn);
  });
}

// Broadcast message to all connected peers
function broadcastMessage() {
  const input = document.getElementById('msg-input');
  const messageText = input.value;
  if (!messageText) return;

  const payload = { message: messageText, timestamp: new Date().toLocaleTimeString() };

  // Send payload to every connected wireless peer
  activeConnections.forEach(conn => conn.send(payload));

  // Render locally
  appendFeed("Me", messageText);
  input.value = "";
}

// Append messages to local UI
function appendFeed(sender, text) {
  const feed = document.getElementById('bulletin-feed');
  const entry = document.createElement('p');
  entry.innerText = `[${new Date().toLocaleTimeString()}] ${sender}: ${text}`;
  feed.appendChild(entry);
}