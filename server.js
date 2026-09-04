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

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Broadcast to everyone EXCEPT a specific client
function broadcastToRoom(room, data, exclude = null) {
  if (rooms[room]) {
    rooms[room].forEach(client => {
      if (client !== exclude && client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Send the list of participants to everyone in the room
function sendParticipantList(room) {
  if (!rooms[room]) return;
  const names = rooms[room]
    .filter(client => client.readyState === 1 && client.username)
    .map(client => client.username);
  
  const data = { type: 'participants', names };
  rooms[room].forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  let currentRoom = null;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, room, name, text } = data;

      if (type === 'create') {
        // Host creates a new room
        let roomCode = generateRoomCode();
        while (rooms[roomCode]) {
          roomCode = generateRoomCode();
        }
        rooms[roomCode] = [ws];
        currentRoom = roomCode;
        ws.username = name || 'Anonymous';
        ws.room = roomCode;
        
        ws.send(JSON.stringify({ type: 'created', room: roomCode }));
        // Send participant list (just themselves)
        sendParticipantList(roomCode);
        console.log(`📢 Room ${roomCode} created by ${ws.username}`);
      }

      else if (type === 'join') {
        const roomCode = room;
        if (rooms[roomCode]) {
          rooms[roomCode].push(ws);
          currentRoom = roomCode;
          ws.username = name || 'Anonymous';
          ws.room = roomCode;
          
          ws.send(JSON.stringify({ type: 'joined', room: roomCode }));
          
          // Notify everyone (including new user) about participant list
          sendParticipantList(roomCode);
          
          // System message
          broadcastToRoom(roomCode, {
            type: 'system',
            text: `🔹 ${ws.username} joined the room`
          }, ws);
          
          console.log(`👤 ${ws.username} joined room ${roomCode}`);
        } else {
          ws.send(JSON.stringify({ type: 'error', text: 'Room not found!' }));
        }
      }

      else if (type === 'message') {
        if (currentRoom && rooms[currentRoom]) {
          broadcastToRoom(currentRoom, {
            type: 'message',
            sender: ws.username || 'Anonymous',
            text: text,
            timestamp: new Date().toLocaleTimeString()
          }, ws); // Exclude sender (they already see their own message locally)
        }
      }

    } catch (e) {
      console.warn('Invalid message:', e);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      // Remove the client
      rooms[currentRoom] = rooms[currentRoom].filter(client => client !== ws);
      
      if (rooms[currentRoom].length === 0) {
        delete rooms[currentRoom];
        console.log(`🗑️ Room ${currentRoom} closed (empty)`);
      } else {
        // Update participant list for remaining clients
        sendParticipantList(currentRoom);
        broadcastToRoom(currentRoom, {
          type: 'system',
          text: `🔸 ${ws.username || 'A node'} left the room`
        });
      }
    }
  });
});