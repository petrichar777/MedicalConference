<template>
  <div class="consultation-room">
    <ConnectionStatus
      :state="store.state"
      :patient-name="store.patientInfo?.name"
      :call-start-time="store.callStartTime"
      :error="store.error"
    />

    <div class="room-main">
      <div class="video-area">
        <RemoteVideo :connected="store.state === 'CONNECTED'" />
        <LocalVideo :connected="store.state === 'CONNECTED'" />
        <MediaControls
          :connected="store.state === 'CONNECTED'"
          @hangup="handleHangup"
        />
      </div>

      <div v-if="store.state === 'CONNECTED'" class="info-panel">
        <PatientInfoPanel :patient="store.patientInfo" />
        <MindrayVitalsPanel
          :vitals="store.vitalsData"
          :trend="store.vitalsTrend"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useConsultationStore } from '../stores/consultation.js'
import { useMediaStore } from '../stores/media.js'
import { useTRTCStore } from '../stores/trtc.js'
import { useSignaling } from '../composables/useSignaling.js'
import RemoteVideo from '../components/video/RemoteVideo.vue'
import LocalVideo from '../components/video/LocalVideo.vue'
import MediaControls from '../components/video/MediaControls.vue'
import PatientInfoPanel from '../components/patient/PatientInfoPanel.vue'
import MindrayVitalsPanel from '../components/vitals/MindrayVitalsPanel.vue'
import ConnectionStatus from '../components/common/ConnectionStatus.vue'

const router = useRouter()
const store = useConsultationStore()
const mediaStore = useMediaStore()
const trtcStore = useTRTCStore()
const signaling = useSignaling()

onMounted(async () => {
  if (store.state !== 'CONNECTED') {
    router.replace('/requester')
    return
  }

  signaling.connect(store.sessionId, store.role)

  signaling.on('HANGUP', () => { onRemoteHangup() })
  signaling.on('VITALS_UPDATE', (payload) => { store.updateVitals(payload) })

  try {
    await trtcStore.joinRoom({
      sdkAppId: store.sdkAppId,
      userId: store.userId,
      userSig: store.userSig,
      roomId: store.roomId,
    })

    try {
      await trtcStore.publishLocalStream()
      mediaStore.cameraAvailable = true
      mediaStore.micAvailable = true
    } catch {
      mediaStore.cameraAvailable = false
      mediaStore.micAvailable = false
    }

    await store.loadMockData()
  } catch (e) {
    store.error = e.message || '加入房间失败'
  }
})

watch(() => store.state, async (newState) => {
  if (newState === 'HANGUP') {
    await cleanup()
    const target = store.role === 'REQUESTER' ? '/requester' : '/expert'
    store.resetState()
    router.replace(target)
  }
})

async function onRemoteHangup() {
  store.setStateFromEvent('HANGUP')
}

async function handleHangup() {
  try {
    await ElMessageBox.confirm('确定要结束本次会诊吗？', '结束会诊', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await store.hangup()
  } catch { /* cancelled */ }
}

async function cleanup() {
  await trtcStore.leaveRoom()
  signaling.disconnect()
}

onUnmounted(() => { cleanup() })
</script>

<style scoped>
.consultation-room {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.room-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.video-area {
  flex: 0 0 68%;
  position: relative;
  background: #0d1b2a;
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(24, 48, 68, 0.04),
    0 4px 12px rgba(24, 48, 68, 0.05),
    0 10px 28px rgba(24, 48, 68, 0.05);
}

.info-panel {
  flex: 0 0 calc(32% - 16px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}
</style>
