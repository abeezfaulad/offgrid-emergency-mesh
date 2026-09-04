const express = require('express');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('.'));

const server = app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Local OffGrid Mesh Server running at http://0.0.0.0:3000');
});

const wss = new WebSocketServer({ server });
const clients = new Map();

wss.on('connection', (ws) => {
  let userCode = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'REGISTER') {
        userCode = data.code;
        clients.set(userCode, ws);
        console.log(`Node registered: ${userCode}`);
      } else if (data.type === 'BROADCAST') {
        // Broadcast message to all connected local nodes
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (e) {
      console.error('Invalid payload:', e);
    }
  });

  ws.on('close', () => {
    if (userCode) clients.delete(userCode);
  });
});