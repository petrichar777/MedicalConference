<template>
  <div class="status-bar">
    <div class="status-left">
      <span :class="['status-dot', statusClass]"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
    <div class="status-center">
      <span v-if="patientName" class="patient-name">{{ patientName }}</span>
      <span v-if="error" class="error-tag">{{ error }}</span>
    </div>
    <div class="status-right">
      <span v-if="elapsed" class="elapsed">{{ elapsed }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  state: { type: String, default: 'IDLE' },
  patientName: { type: String, default: null },
  callStartTime: { type: Number, default: null },
  error: { type: String, default: null },
})

const elapsed = ref('')
let timer = null

const statusClass = computed(() => {
  switch (props.state) {
    case 'CONNECTED': return 'online'
    case 'CALLING':
    case 'INCOMING': return 'connecting'
    default: return 'idle'
  }
})

const statusText = computed(() => {
  switch (props.state) {
    case 'CONNECTED': return '已接通'
    case 'CALLING': return '呼叫中...'
    case 'INCOMING': return '来电中...'
    case 'REJECTED': return '已拒绝'
    case 'TIMEOUT': return '已超时'
    case 'HANGUP': return '已挂断'
    default: return '未连接'
  }
})

onMounted(() => {
  timer = setInterval(() => {
    if (props.callStartTime) {
      const diff = Math.floor((Date.now() - props.callStartTime) / 1000)
      const m = String(Math.floor(diff / 60)).padStart(2, '0')
      const s = String(diff % 60).padStart(2, '0')
      elapsed.value = `${m}:${s}`
    }
  }, 1000)
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--hx-surface-solid);
  border-bottom: 1px solid #e6eef3;
}

.status-left, .status-center, .status-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot.online { background: var(--hx-green); }
.status-dot.connecting { background: var(--hx-amber); animation: blink 1s infinite; }
.status-dot.idle { background: #c8d6e0; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-text { font-size: 14px; font-weight: 600; color: var(--hx-muted); }
.patient-name { font-size: 15px; font-weight: 700; color: var(--hx-text); }

.error-tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--hx-red);
  background: #fef5f5;
  padding: 3px 10px;
  border-radius: 999px;
}

.elapsed {
  font-size: 16px;
  font-weight: 700;
  color: var(--hx-text);
  font-family: 'SF Mono', 'Fira Code', monospace;
}
</style>
