<template>
  <div class="device-check glass-panel">
    <p class="panel-eyebrow">设备检测</p>
    <h3 class="panel-title" style="margin-bottom:12px">摄像头 / 麦克风</h3>

    <div class="check-items">
      <div class="check-row" @click="runCheck">
        <div class="check-left">
          <span :class="['check-dot', cameraStatus]"></span>
          <span class="check-label">摄像头</span>
        </div>
        <span class="check-state">{{ cameraText }}</span>
      </div>
      <div class="check-row" @click="runCheck">
        <div class="check-left">
          <span :class="['check-dot', micStatus]"></span>
          <span class="check-label">麦克风</span>
        </div>
        <span class="check-state">{{ micText }}</span>
      </div>
    </div>

    <!-- HTTPS warning -->
    <div v-if="!deviceCheck.isSecure.value" class="https-warning">
      <el-icon><WarningFilled /></el-icon>
      <div>
        <p class="warn-title">需要 HTTPS 或 localhost</p>
        <p class="warn-desc">浏览器安全策略禁止在 HTTP 下使用摄像头/麦克风（本地测试除外）。部署到服务器时请使用 HTTPS 访问。</p>
      </div>
    </div>

    <!-- Error message -->
    <div v-else-if="deviceCheck.errorMsg.value" class="perm-hint">
      <el-icon><InfoFilled /></el-icon>
      <span>{{ deviceCheck.errorMsg.value }}</span>
    </div>

    <el-button
      type="primary"
      :loading="deviceCheck.checking.value"
      :disabled="deviceCheck.checking.value"
      class="check-btn"
      @click="runCheck"
    >
      <el-icon v-if="!deviceCheck.checking.value"><Refresh /></el-icon>
      {{ deviceCheck.checking.value ? '检测中...' : allOk ? '设备就绪' : '检测摄像头和麦克风' }}
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { WarningFilled, InfoFilled, Refresh } from '@element-plus/icons-vue'
import { useDeviceCheck } from '../../composables/useDeviceCheck.js'

const deviceCheck = useDeviceCheck()

const cameraStatus = computed(() => {
  if (deviceCheck.cameraOk.value === null) return ''
  return deviceCheck.cameraOk.value ? 'ok' : 'fail'
})

const micStatus = computed(() => {
  if (deviceCheck.micOk.value === null) return ''
  return deviceCheck.micOk.value ? 'ok' : 'fail'
})

const cameraText = computed(() => {
  if (deviceCheck.cameraOk.value === null) return '未检测'
  return deviceCheck.cameraOk.value ? '可用' : '不可用'
})

const micText = computed(() => {
  if (deviceCheck.micOk.value === null) return '未检测'
  return deviceCheck.micOk.value ? '可用' : '不可用'
})

const allOk = computed(() => deviceCheck.cameraOk.value && deviceCheck.micOk.value)

const emit = defineEmits(['ready'])

function runCheck() {
  deviceCheck.check().then(ok => {
    if (ok) emit('ready')
  })
}

// Auto-check on mount
runCheck()
</script>

<style scoped>
.device-check { margin-bottom: 0; }

.check-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.check-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.check-row:hover { background: #eef2f5; }

.check-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.check-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c8d6e0;
}

.check-dot.ok { background: var(--hx-green); }
.check-dot.fail { background: var(--hx-red); }

.check-label { font-size: 14px; font-weight: 600; color: var(--hx-text); }
.check-state { font-size: 13px; color: var(--hx-muted); }

.https-warning {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #fff5f5;
  border: 1px solid #fbc4c4;
  border-radius: 10px;
  margin-bottom: 14px;
  color: var(--hx-red);
  font-size: 13px;
}

.warn-title { font-weight: 700; color: #d95b5b; margin: 0 0 4px; }
.warn-desc { color: var(--hx-muted); margin: 0; line-height: 1.5; }

.perm-hint {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #fff7e6;
  border: 1px solid #f5dab1;
  border-radius: 10px;
  margin-bottom: 14px;
  color: var(--hx-amber);
  font-size: 13px;
}

.check-btn {
  width: 100%;
  border-radius: 12px !important;
}
</style>
