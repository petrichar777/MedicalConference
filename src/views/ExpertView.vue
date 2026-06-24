<template>
  <div class="entry-page">
    <div class="entry-card glass-panel">
      <div class="entry-icon-box">
        <el-icon :size="40"><Monitor /></el-icon>
      </div>
      <h1 class="entry-title">专家远程会诊端</h1>
      <p class="entry-subtitle">{{ store.expertName }}</p>

      <!-- IDLE -->
      <div v-if="store.state === 'IDLE' || store.state === 'EXPERT_IDLE'" class="waiting-state">
        <div class="waiting-dot"></div>
        <p class="waiting-text">等待会诊请求...</p>
        <p class="waiting-hint">当有医生发起会诊时，此处将弹出接听提示</p>
        <el-button type="success" size="large" @click="startWaiting">
          {{ wsReady ? '已就绪，等待呼叫' : '准备接听' }}
        </el-button>
      </div>

      <!-- INCOMING -->
      <IncomingCallDialog
        v-if="store.state === 'INCOMING'"
        :caller-name="store.requesterName"
        @answer="handleAnswer"
        @reject="handleReject"
      />

      <!-- Terminal -->
      <div v-else-if="terminalState" class="terminal-state">
        <p class="terminal-text">{{ terminalMessage }}</p>
        <el-button type="primary" @click="resetAndWait">继续等待</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor } from '@element-plus/icons-vue'
import { useConsultationStore } from '../stores/consultation.js'
import { useSignaling } from '../composables/useSignaling.js'
import { useRingtone } from '../composables/useRingtone.js'
import IncomingCallDialog from '../components/call/IncomingCallDialog.vue'

const router = useRouter()
const store = useConsultationStore()
const ringtone = useRingtone()
const wsReady = ref(false)

let waitingSignaling = null
let sessionSignaling = null

const terminalState = computed(() =>
  ['REJECTED', 'TIMEOUT', 'HANGUP'].includes(store.state)
)

const terminalMessage = computed(() => {
  switch (store.state) {
    case 'REJECTED': return '已拒绝本次会诊请求'
    case 'TIMEOUT': return '呼叫已超时'
    case 'HANGUP': return '会诊已结束'
    default: return ''
  }
})

function startWaiting() {
  store.role = 'EXPERT'
  store.state = 'IDLE'

  waitingSignaling = useSignaling()
  waitingSignaling.connect('expert-waiting', 'EXPERT')

  waitingSignaling.on('CALL_INCOMING', (payload, msg) => {
    store.sessionId = msg.sessionId
    store.setStateFromEvent('CALL_INCOMING')
    ringtone.start()
  })

  waitingSignaling.on('CALL_REJECTED', () => { ringtone.stop(); store.setStateFromEvent('CALL_REJECTED') })
  waitingSignaling.on('CALL_TIMEOUT', () => { ringtone.stop(); store.setStateFromEvent('CALL_TIMEOUT') })
  waitingSignaling.on('HANGUP', () => { ringtone.stop() })

  wsReady.value = true
}

async function handleAnswer() {
  if (!store.sessionId) return
  ringtone.stop()

  sessionSignaling = useSignaling()
  sessionSignaling.connect(store.sessionId, 'EXPERT')
  sessionSignaling.on('HANGUP', () => store.setStateFromEvent('HANGUP'))

  try {
    await store.answerCall()
    router.push(`/consultation/${store.sessionId}`)
  } catch (e) {
    store.error = e.message || '接听失败'
  }
}

async function handleReject() {
  if (!store.sessionId) return
  ringtone.stop()
  try { await store.rejectCall() } catch (e) { store.error = e.message || '操作失败' }
}

function resetAndWait() {
  store.resetState()
  store.role = 'EXPERT'
  store.state = 'IDLE'
  if (sessionSignaling) { sessionSignaling.disconnect(); sessionSignaling = null }
  wsReady.value = true
}

onUnmounted(() => {
  if (waitingSignaling) waitingSignaling.disconnect()
  if (sessionSignaling) sessionSignaling.disconnect()
})
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
  padding: 56px 72px;
  max-width: 460px;
  width: 100%;
  position: relative;
}

.entry-icon-box {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(59, 167, 160, 0.12), rgba(34, 167, 200, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--hx-green);
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

.waiting-state { margin-top: 28px; }

.waiting-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--hx-green);
  margin: 0 auto 20px;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 167, 160, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(59, 167, 160, 0); }
}

.waiting-text { font-size: 20px; font-weight: 600; color: var(--hx-text); margin: 0 0 8px; }
.waiting-hint { font-size: 14px; color: var(--hx-muted); margin-bottom: 28px; }

.terminal-state { margin-top: 28px; }
.terminal-text { font-size: 16px; color: var(--hx-muted); margin-bottom: 24px; }
</style>
