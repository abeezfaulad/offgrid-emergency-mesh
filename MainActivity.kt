val wifiP2pManager = getSystemService(Context.WIFI_P2P_SERVICE) as WifiP2pManager
val channel = wifiP2pManager.initialize(this, mainLooper, null)

val p2pController = WiFiDirectManager(this, wifiP2pManager, channel)

// Start auto-discovery and auto-connection
p2pController.startAutoDiscovery()