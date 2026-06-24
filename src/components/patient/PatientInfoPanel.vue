<template>
  <div class="panel glass-panel">
    <p class="panel-eyebrow">患者信息</p>
    <h3 class="panel-title">患者基本信息（模拟）</h3>
    <div v-if="patient" class="info-grid">
      <div class="info-item">
        <span class="info-label">姓名</span>
        <span class="info-value">{{ patient.name }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">性别 / 年龄</span>
        <span class="info-value">{{ patient.gender }} / {{ patient.age }} 岁</span>
      </div>
      <div class="info-item">
        <span class="info-label">床号</span>
        <span class="info-value">{{ patient.bedNo }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">风险等级</span>
        <span :class="['risk-pill', riskClass]">{{ patient.riskLevel }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">初步诊断</span>
        <span class="info-value text-strong">{{ patient.diagnosis }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">主诉</span>
        <span class="info-value">{{ patient.chiefComplaint }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">过敏史</span>
        <span class="info-value text-danger">{{ patient.allergy }}</span>
      </div>
      <div class="info-item full-width">
        <span class="info-label">就诊号</span>
        <span class="info-value text-mono">{{ patient.visitId }}</span>
      </div>
    </div>
    <div v-else class="loading-state">
      <el-icon class="is-loading" :size="20"><Loading /></el-icon>
      <span>加载患者信息...</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({ patient: { type: Object, default: null } })

const riskClass = computed(() => {
  if (!props.patient) return ''
  switch (props.patient.riskLevel) {
    case '高危': return 'risk-high'
    case '中危': return 'risk-medium'
    default: return 'risk-low'
  }
})
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 18px;
}
.info-item { display: flex; flex-direction: column; gap: 4px; }
.info-item.full-width { grid-column: 1 / -1; }

.info-label { font-size: 12px; font-weight: 600; color: var(--hx-muted); }
.info-value { font-size: 14px; font-weight: 600; color: var(--hx-text); }
.text-strong { font-weight: 700; }
.text-danger { color: var(--hx-red); font-weight: 700; }
.text-mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; font-weight: 500; }

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--hx-muted);
  font-size: 14px;
}
</style>
