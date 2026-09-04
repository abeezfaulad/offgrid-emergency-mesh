const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.static(path.join(__dirname, '')));

const server = app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 OffGrid Mesh Node active on port 3000');
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

// Store rooms: { roomCode: [ws1, ws2, ...] }
const rooms = {};

// Generate a random 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Broadcast to all clients in a room, optionally excluding one
function broadcastToRoom(room, data, exclude = null) {
  if (rooms[room]) {
    rooms[room].forEach(client => {
      if (client !== exclude && client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, room, sender, text } = data;

      if (type === 'create') {
        // Host creates a new room
        let roomCode = generateRoomCode();
        while (rooms[roomCode]) {
          roomCode = generateRoomCode();
        }
        rooms[roomCode] = [ws];
        currentRoom = roomCode;
        ws.send(JSON.stringify({ type: 'created', room: roomCode }));
        console.log(`📢 Room ${roomCode} created`);
      }

      else if (type === 'join') {
        // Guest joins an existing room
        const roomCode = room;
        if (rooms[roomCode]) {
          rooms[roomCode].push(ws);
          currentRoom = roomCode;
          ws.send(JSON.stringify({ type: 'joined', room: roomCode }));
          
          // Notify everyone in the room that someone joined
          broadcastToRoom(roomCode, {
            type: 'system',
            text: `🔹 Node ${sender || 'Guest'} joined the room`
          });
          console.log(`👤 Node joined room ${roomCode}`);
        } else {
          ws.send(JSON.stringify({ type: 'error', text: 'Room not found!' }));
        }
      }

      else if (type === 'message') {
        // Chat message - broadcast to everyone EXCEPT the sender
        if (currentRoom && rooms[currentRoom]) {
          broadcastToRoom(currentRoom, {
            type: 'message',
            sender: sender || 'Anonymous',
            text: text,
            timestamp: new Date().toLocaleTimeString()
          }, ws);  // <--- exclude the sender
        }
      }

    } catch (e) {
      console.warn('Invalid message:', e);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom] = rooms[currentRoom].filter(client => client !== ws);
      if (rooms[currentRoom].length === 0) {
        delete rooms[currentRoom];
        console.log(`🗑️ Room ${currentRoom} closed (empty)`);
      } else {
        broadcastToRoom(currentRoom, {
          type: 'system',
          text: '🔸 A node left the room'
        });
      }
    }
  });
});