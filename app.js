let localConnection;
let sendChannel;

// Native WebRTC peer configuration with zero internet dependencies
const config = { iceServers: [] }; 

function initPeer() {
  localConnection = new RTCPeerConnection(config);

  localConnection.onicecandidate = (e) => {
    if (!e.candidate) {
      // ICE Gathering complete - display token
      document.getElementById('local-token').value = JSON.stringify(localConnection.localDescription);
    }
  };

  localConnection.ondatachannel = (e) => {
    receiveChannel = e.channel;
    setupChannelEvents(receiveChannel);
  };
}

// Host creates offer
async function createOffer() {
  initPeer();
  sendChannel = localConnection.createDataChannel("offgrid-mesh");
  setupChannelEvents(sendChannel);

  const offer = await localConnection.createOffer();
  await localConnection.setLocalDescription(offer);
}

// Joiner processes offer / Host processes answer
async function handleRemoteToken() {
  const tokenString = document.getElementById('remote-token').value.trim();
  if (!tokenString) return alert("Please paste a token!");

  const token = JSON.parse(tokenString);

  if (!localConnection) {
    // Device B receiving initial offer
    initPeer();
    await localConnection.setRemoteDescription(token);
    const answer = await localConnection.createAnswer();
    await localConnection.setLocalDescription(answer);
  } else {
    // Device A receiving answer back from Device B
    await localConnection.setRemoteDescription(token);
  }
}

function setupChannelEvents(channel) {
  channel.onopen = () => appendFeed("System", "Wireless P2P Pipe Connected!");
  channel.onmessage = (e) => appendFeed("Remote Peer", e.data);
}

function sendMessage() {
  const input = document.getElementById('msg-input');
  const msg = input.value.trim();
  if (!msg) return;

  if (sendChannel && sendChannel.readyState === "open") {
    sendChannel.send(msg);
  } else if (receiveChannel && receiveChannel.readyState === "open") {
    receiveChannel.send(msg);
  } else {
    alert("No active P2P connection found!");
    return;
  }

  appendFeed("Me", msg);
  input.value = "";
}

function appendFeed(sender, text) {
  const feed = document.getElementById('bulletin-feed');
  const entry = document.createElement('p');
  entry.innerText = `[${new Date().toLocaleTimeString()}] ${sender}: ${text}`;
  feed.appendChild(entry);
}