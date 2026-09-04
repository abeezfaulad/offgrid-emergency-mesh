const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

const app = express();
app.use(express.static(path.join(__dirname, '')));

let meshProcess = null;
let logs = [];

app.get('/start', (req, res) => {
  if (meshProcess) {
    return res.json({ status: 'already running' });
  }
  logs.push('[System] Starting mesh server...');
  meshProcess = spawn('node', ['server.js'], { cwd: __dirname });
  
  meshProcess.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => { if (line) logs.push(`[stdout] ${line}`); });
  });
  
  meshProcess.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => { if (line) logs.push(`[stderr] ${line}`); });
  });
  
  meshProcess.on('close', () => {
    logs.push('[System] Mesh server stopped.');
    meshProcess = null;
  });
  
  res.json({ status: 'started' });
});

app.get('/stop', (req, res) => {
  if (meshProcess) {
    meshProcess.kill();
    meshProcess = null;
    logs.push('[System] Stopping mesh server...');
    res.json({ status: 'stopped' });
  } else {
    res.json({ status: 'not running' });
  }
});

app.get('/logs', (req, res) => {
  res.json({ logs: logs.slice(-100) });
});

app.get('/status', (req, res) => {
  res.json({ running: !!meshProcess });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛠️ Admin panel running on port ${PORT}`);
  const ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   → Open http://${iface.address}:${PORT}/admin.html`);
      }
    });
  });
});