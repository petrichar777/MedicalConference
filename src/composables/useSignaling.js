import { ref, onUnmounted } from 'vue'
import { WS_BASE } from '../config.js'

export function useSignaling() {
  const ws = ref(null)
  const connected = ref(false)
  const lastEvent = ref(null)

  const handlers = new Map()

  function connect(sessionId, role) {
    let url
    if (WS_BASE) {
      url = `${WS_BASE}/ws/signaling?sessionId=${sessionId}&role=${role}`
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      url = `${protocol}//${host}/ws/signaling?sessionId=${sessionId}&role=${role}`
    }

    ws.value = new WebSocket(url)

    ws.value.onopen = () => {
      connected.value = true
    }

    ws.value.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        lastEvent.value = msg
        const cbs = handlers.get(msg.type) || []
        cbs.forEach((cb) => cb(msg.payload, msg))
      } catch (e) {
        // ignore malformed messages
      }
    }

    ws.value.onclose = () => {
      connected.value = false
    }

    ws.value.onerror = () => {
      connected.value = false
    }
  }

  function on(eventType, callback) {
    if (!handlers.has(eventType)) {
      handlers.set(eventType, [])
    }
    handlers.get(eventType).push(callback)
    // Return unsubscribe function
    return () => {
      const cbs = handlers.get(eventType)
      if (cbs) {
        const idx = cbs.indexOf(callback)
        if (idx >= 0) cbs.splice(idx, 1)
      }
    }
  }

  function disconnect() {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    connected.value = false
    handlers.clear()
  }

  onUnmounted(() => {
    disconnect()
  })

  return { ws, connected, lastEvent, connect, on, disconnect }
}
