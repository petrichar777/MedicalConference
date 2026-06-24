import { defineStore } from 'pinia'
import { ref } from 'vue'
import TRTC from 'trtc-js-sdk'

export const useTRTCStore = defineStore('trtc', () => {
  const client = ref(null)
  const localStream = ref(null)
  const remoteStream = ref(null)
  const isJoined = ref(false)
  const error = ref(null)

  async function joinRoom({ sdkAppId, userId, userSig, roomId }) {
    const trtcClient = TRTC.createClient({
      mode: 'rtc',
      sdkAppId,
      userId,
      userSig,
    })

    trtcClient.on('stream-added', (event) => {
      trtcClient.subscribe(event.stream).catch((e) => {
        console.error('Subscribe error:', e)
      })
    })

    trtcClient.on('stream-subscribed', (event) => {
      remoteStream.value = event.stream
      event.stream.play('remote-video-container').catch((e) => {
        console.error('Remote play error:', e)
      })
    })

    trtcClient.on('stream-removed', () => {
      remoteStream.value = null
    })

    trtcClient.on('peer-leave', () => {
      remoteStream.value = null
    })

    trtcClient.on('error', (e) => {
      error.value = e
    })

    await trtcClient.join({ roomId })
    client.value = trtcClient
    isJoined.value = true
  }

  async function publishLocalStream() {
    const stream = TRTC.createStream({
      userId: 'local-user',
      audio: true,
      video: true,
    })

    await stream.initialize()
    stream.play('local-video-container').catch((e) => {
      console.error('Local play error:', e)
    })
    await client.value.publish(stream)
    localStream.value = stream
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

  return {
    client, localStream, remoteStream, isJoined, error,
    joinRoom, publishLocalStream, leaveRoom,
    muteAudio, unmuteAudio, muteVideo, unmuteVideo,
  }
})
