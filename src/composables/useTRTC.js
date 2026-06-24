import TRTC from 'trtc-js-sdk'
import { ref, onUnmounted } from 'vue'

export function useTRTC() {
  const client = ref(null)
  const localStream = ref(null)
  const remoteStream = ref(null)
  const isJoined = ref(false)
  const error = ref(null)

  async function joinRoom({ sdkAppId, userId, userSig, roomId }) {
    client.value = TRTC.createClient({
      mode: 'rtc',
      sdkAppId,
      userId,
      userSig,
    })

    client.value.on('stream-added', (event) => {
      const remote = event.stream
      client.value.subscribe(remote).catch((e) => {
        console.error('Subscribe error:', e)
      })
    })

    client.value.on('stream-subscribed', (event) => {
      remoteStream.value = event.stream
      event.stream.play('remote-video-container').catch((e) => {
        console.error('Remote play error:', e)
      })
    })

    client.value.on('stream-removed', () => {
      remoteStream.value = null
    })

    client.value.on('peer-leave', () => {
      remoteStream.value = null
    })

    client.value.on('error', (e) => {
      error.value = e
    })

    try {
      await client.value.join({ roomId })
      isJoined.value = true
    } catch (e) {
      error.value = e
      throw e
    }
  }

  async function publishLocalStream() {
    localStream.value = TRTC.createStream({
      userId: client.value.getUserId?.() || 'local',
      audio: true,
      video: true,
    })

    try {
      await localStream.value.initialize()
      localStream.value.play('local-video-container').catch((e) => {
        console.error('Local play error:', e)
      })
      await client.value.publish(localStream.value)
    } catch (e) {
      // Camera/mic permission errors surface here
      error.value = e
      throw e
    }
  }

  async function muteAudio() {
    if (localStream.value) {
      await localStream.value.muteAudio()
    }
  }

  async function unmuteAudio() {
    if (localStream.value) {
      await localStream.value.unmuteAudio()
    }
  }

  async function muteVideo() {
    if (localStream.value) {
      await localStream.value.muteVideo()
    }
  }

  async function unmuteVideo() {
    if (localStream.value) {
      await localStream.value.unmuteVideo()
    }
  }

  async function leaveRoom() {
    try {
      if (localStream.value) {
        localStream.value.stop()
        localStream.value.close()
        localStream.value = null
      }
      if (client.value && isJoined.value) {
        await client.value.leave()
        isJoined.value = false
      }
    } catch (e) {
      console.error('Leave room error:', e)
    }
    client.value = null
    remoteStream.value = null
  }

  onUnmounted(() => {
    leaveRoom()
  })

  return {
    client, localStream, remoteStream, isJoined, error,
    joinRoom, publishLocalStream, leaveRoom,
    muteAudio, unmuteAudio, muteVideo, unmuteVideo,
  }
}
