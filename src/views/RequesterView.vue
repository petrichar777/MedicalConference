<template>
  <div class="entry-page">
    <div class="entry-card glass-panel">
      <div class="entry-icon-box">
        <el-icon :size="40"><VideoCamera /></el-icon>
      </div>
      <h1 class="entry-title">远程视频会诊</h1>
      <p class="entry-subtitle">申请端 — {{ store.requesterName }}</p>

      <!-- IDLE -->
      <div v-if="store.state === 'IDLE'" class="entry-action">
        <DeviceCheckPanel class="device-panel" @ready="onDevicesReady" />
        <el-button
          type="primary"
          size="large"
          :icon="VideoPlay"
          :loading="loading"
          class="call-btn"
          @click="handleCall"
        >
          一键远程会诊
        </el-button>
      </div>

      <!-- CALLING -->
      <div v-else-if="store.state === 'CALLING'" class="calling-state">
        <div class="pulse-ring">
          <el-icon :size="36"><Phone /></el-icon>
        </div>
        <p class="calling-text">正在呼叫专家...</p>
        <p class="calling-target">{{ store.expertName }}</p>
        <el-button type="danger" plain @click="cancelCall">取消呼叫</el-button>
      </div>

      <!-- Terminal -->
      <div v-else-if="terminalState" class="terminal-state">
        <p class="terminal-text">{{ terminalMessage }}</p>
        <el-button type="primary" @click="resetAndRetry">重新呼叫</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VideoCamera, VideoPlay, Phone } from '@element-plus/icons-vue'
import { useConsultationStore } from '../stores/consultation.js'
import { useSignaling } from '../composables/useSignaling.js'
import DeviceCheckPanel from '../components/common/DeviceCheckPanel.vue'

const router = useRouter()
const store = useConsultationStore()
const signaling = useSignaling()
const loading = ref(false)

const terminalState = computed(() =>
  ['REJECTED', 'TIMEOUT', 'HANGUP'].includes(store.state)
)

const terminalMessage = computed(() => {
  switch (store.state) {
    case 'REJECTED': return '专家暂时无法接听，请稍后再试'
    case 'TIMEOUT': return `专家${store.callTimeout}秒内未接听，可重新呼叫`
    case 'HANGUP': return '会诊已结束'
    default: return ''
  }
})

async function handleCall() {
  loading.value = true
  try {
    await store.createSession()
    signaling.connect(store.sessionId, 'REQUESTER')
    signaling.on('CALL_ANSWERED', () => {
      store.setStateFromEvent('CALL_ANSWERED')
      router.push(`/consultation/${store.sessionId}`)
    })
    signaling.on('CALL_REJECTED', () => store.setStateFromEvent('CALL_REJECTED'))
    signaling.on('CALL_TIMEOUT', () => store.setStateFromEvent('CALL_TIMEOUT'))
    signaling.on('HANGUP', () => store.setStateFromEvent('HANGUP'))
    await store.initiateCall()
  } catch (e) {
    store.error = e.message || '发起呼叫失败'
    store.state = 'IDLE'
  } finally {
    loading.value = false
  }
}

function onDevicesReady() {
  // Devices checked and OK
}

async function cancelCall() {
  await store.hangup()
}

function resetAndRetry() {
  store.resetState()
  signaling.disconnect()
}
</script>

<style scoped>
.entry-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.entry-card {
  text-align: center;
  padding: 40px 36px;
  max-width: 480px;
  width: 100%;
}

.device-panel {
  text-align: left;
  margin-bottom: 24px;
}

.entry-icon-box {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(61, 126, 255, 0.1), rgba(34, 167, 200, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--hx-blue);
}

.entry-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--hx-text);
  margin: 0 0 8px;
}

.entry-subtitle {
  font-size: 14px;
  color: var(--hx-muted);
  margin: 0 0 36px;
}

.call-btn {
  font-size: 18px !important;
  padding: 18px 48px !important;
  border-radius: 16px !important;
}

.device-hint {
  font-size: 13px;
  color: var(--hx-muted);
  margin-top: 16px;
}

.calling-state { margin-top: 28px; }

.pulse-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(61, 126, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: var(--hx-blue);
  animation: ringPulse 1.6s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(61, 126, 255, 0.3); }
  50% { box-shadow: 0 0 0 16px rgba(61, 126, 255, 0); }
}

.calling-text { font-size: 20px; font-weight: 600; color: var(--hx-blue); margin: 20px 0 8px; }
.calling-target { font-size: 15px; color: var(--hx-muted); margin-bottom: 28px; }

.terminal-state { margin-top: 28px; }
.terminal-text { font-size: 16px; color: var(--hx-muted); margin-bottom: 24px; }
</style>
