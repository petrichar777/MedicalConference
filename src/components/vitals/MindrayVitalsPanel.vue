<template>
  <div class="panel glass-panel">
    <div class="head-row">
      <div>
        <p class="panel-eyebrow">监护设备</p>
        <h3 class="panel-title" style="border:none;margin-bottom:0;padding-bottom:0;">
          迈瑞监护数据（模拟）
        </h3>
      </div>
      <span :class="['status-dot', vitals?.online ? 'online' : 'offline']">
        {{ vitals?.online ? '在线' : '离线' }}
      </span>
    </div>

    <div v-if="vitals" class="vitals-grid">
      <div :class="['vital-card', { 'vital-alert': isAlert('hr', vitals.hr, 60, 100, 40, 150) }]">
        <span class="vital-label">HR 心率</span>
        <span class="vital-value">{{ vitals.hr }}</span>
        <span class="vital-unit">次/分</span>
      </div>
      <div :class="['vital-card', { 'vital-alert': isAlert('sbp', vitals.sbp, 90, 120, 70, 180) }]">
        <span class="vital-label">NIBP 收缩压</span>
        <span class="vital-value">{{ vitals.sbp }}</span>
        <span class="vital-unit">mmHg</span>
      </div>
      <div :class="['vital-card', { 'vital-alert': isAlert('dbp', vitals.dbp, 60, 80, 40, 110) }]">
        <span class="vital-label">NIBP 舒张压</span>
        <span class="vital-value">{{ vitals.dbp }}</span>
        <span class="vital-unit">mmHg</span>
      </div>
      <div :class="['vital-card', { 'vital-alert': isAlert('spo2', vitals.spo2, 95, 100, 85, 100) }]">
        <span class="vital-label">SpO2 血氧</span>
        <span class="vital-value">{{ vitals.spo2 }}</span>
        <span class="vital-unit">%</span>
      </div>
      <div :class="['vital-card', { 'vital-alert': isAlert('rr', vitals.rr, 12, 20, 8, 40) }]">
        <span class="vital-label">RR 呼吸</span>
        <span class="vital-value">{{ vitals.rr }}</span>
        <span class="vital-unit">次/分</span>
      </div>
      <div :class="['vital-card', { 'vital-alert': isAlert('temp', vitals.temp, 36.0, 37.0, 35.0, 42.0) }]">
        <span class="vital-label">TEMP 体温</span>
        <span class="vital-value">{{ vitals.temp }}</span>
        <span class="vital-unit">℃</span>
      </div>
    </div>
    <div v-else class="loading-state">
      <el-icon class="is-loading" :size="20"><Loading /></el-icon>
      <span>等待设备数据...</span>
    </div>

    <div class="vitals-footer">
      <span v-if="vitals" class="update-time">更新于 {{ vitals.updatedAt }}</span>
      <span class="mock-badge">模拟数据</span>
    </div>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  vitals: { type: Object, default: null },
  trend: { type: Array, default: () => [] },
})

function isAlert(key, value, low, high, criticalLow, criticalHigh) {
  if (value < criticalLow || value > criticalHigh) return true
  return value < low || value > high
}
</script>

<style scoped>
.head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.status-dot {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
}
.status-dot.online { background: #e9f8f5; color: var(--hx-green); }
.status-dot.offline { background: #fef5f5; color: var(--hx-red); }

.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 4px;
}

.vital-card {
  background: #f8fafb;
  border: 1px solid #eef2f5;
  border-radius: 14px;
  padding: 16px 14px;
  text-align: center;
  transition: all 0.25s ease;
}

.vital-card.vital-alert {
  background: #fff5f5;
  border-color: #fbc4c4;
  box-shadow: 0 0 0 1px rgba(217, 91, 91, 0.15);
  animation: alertGlow 2s ease-in-out infinite;
}

@keyframes alertGlow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(217, 91, 91, 0.15); }
  50% { box-shadow: 0 0 0 4px rgba(217, 91, 91, 0.12), 0 0 16px rgba(217, 91, 91, 0.1); }
}

.vital-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--hx-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.vital-value {
  display: block;
  font-size: 30px;
  font-weight: 800;
  color: var(--hx-text);
  font-family: 'SF Mono', 'Fira Code', monospace;
  line-height: 1.1;
}

.vital-card.vital-alert .vital-value { color: var(--hx-red); }

.vital-unit {
  display: block;
  font-size: 11px;
  color: var(--hx-muted);
  margin-top: 4px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: var(--hx-muted);
  font-size: 14px;
}

.vitals-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.update-time {
  font-size: 12px;
  color: var(--hx-muted);
}

.mock-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--hx-amber);
  background: #fff7e6;
  border: 1px solid #f5dab1;
  border-radius: 6px;
  padding: 3px 8px;
}
</style>
