const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.static(path.join(__dirname, '')));

const server = app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 OffGrid Mesh Node active on port 3000');
  // Show local IP addresses for clients to connect
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   → Connect on http://${iface.address}:3000`);
      }
    });
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('📱 New device connected');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Broadcast to all clients
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (e) {
      console.warn('Invalid message');
    }
  });
  ws.on('close', () => console.log('📱 Device disconnected'));
});