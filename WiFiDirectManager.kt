import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.wifi.p2p.*
import android.os.Looper
import android.util.Log

class WiFiDirectManager(
    private val context: Context,
    private val wifiP2pManager: WifiP2pManager,
    private val channel: WifiP2pManager.Channel
) {

    private val intentFilter = IntentFilter().apply {
        addAction(WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION)
        addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION)
        addAction(WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION)
        addAction(WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION)
    }

    private val peerList = mutableListOf<WifiP2pDevice>()

    // BroadcastReceiver to capture Wi-Fi Direct hardware events
    private val receiver = object : BroadcastReceiver() {
        @SuppressLint("MissingPermission")
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION -> {
                    val state = intent.getIntExtra(WifiP2pManager.EXTRA_WIFI_STATE, -1)
                    val isEnabled = state == WifiP2pManager.WIFI_P2P_STATE_ENABLED
                    Log.d("Wi-Fi Direct", "Wi-Fi P2P Enabled: $isEnabled")
                }

                WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION -> {
                    // Request updated list of discovered peers
                    wifiP2pManager.requestPeers(channel) { peers ->
                        peerList.clear()
                        peerList.addAll(peers.deviceList)
                        Log.d("Wi-Fi Direct", "Discovered ${peerList.size} peers")

                        // Automatically connect to the first available target peer
                        if (peerList.isNotEmpty()) {
                            autoConnectToPeer(peerList[0])
                        }
                    }
                }

                WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION -> {
                    // Connection state changed - request connection info to get IP address
                    wifiP2pManager.requestConnectionInfo(channel) { info ->
                        if (info.groupFormed && info.isGroupOwner) {
                            Log.d("Wi-Fi Direct", "Connected as Group Owner (Server IP: ${info.groupOwnerAddress.hostAddress})")
                        } else if (info.groupFormed) {
                            Log.d("Wi-Fi Direct", "Connected as Client to Group Owner: ${info.groupOwnerAddress.hostAddress}")
                        }
                    }
                }
            }
        }
    }

    // Step 1: Register Receiver and Trigger Discovery
    @SuppressLint("MissingPermission")
    fun startAutoDiscovery() {
        context.registerReceiver(receiver, intentFilter)

        wifiP2pManager.discoverPeers(channel, object : WifiP2pManager.ActionListener {
            override fun onSuccess() {
                Log.d("Wi-Fi Direct", "Auto-discovery initiated successfully.")
            }

            override fun onFailure(reasonCode: Int) {
                Log.e("Wi-Fi Direct", "Discovery failed with reason code: $reasonCode")
            }
        })
    }

    // Step 2: Auto-connect to a target device
    @SuppressLint("MissingPermission")
    private fun autoConnectToPeer(device: WifiP2pDevice) {
        val config = WifiP2pConfig().apply {
            deviceAddress = device.deviceAddress
            wps.setup = WpsInfo.PBC // Push Button Configuration (Automatic Handshake)
        }

        wifiP2pManager.connect(channel, config, object : WifiP2pManager.ActionListener {
            override fun onSuccess() {
                Log.d("Wi-Fi Direct", "Connecting automatically to: ${device.deviceName}")
            }

            override fun onFailure(reason: Int) {
                Log.e("Wi-Fi Direct", "Connection to ${device.deviceName} failed. Reason: $reason")
            }
        })
    }

    fun stop() {
        try {
            context.unregisterReceiver(receiver)
        } catch (e: IllegalArgumentException) {
            // Receiver not registered
        }
    }
}