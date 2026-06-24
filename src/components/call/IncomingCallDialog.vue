<template>
  <div class="incoming-overlay">
    <div class="incoming-card glass-panel">
      <div class="incoming-icon-box">
        <el-icon :size="36"><PhoneFilled /></el-icon>
      </div>
      <h2 class="incoming-title">远程会诊请求</h2>
      <p class="incoming-caller">{{ callerName }}</p>
      <p class="incoming-hint">发起视频会诊邀请</p>
      <div class="incoming-actions">
        <el-button type="danger" :icon="Close" size="large" @click="$emit('reject')">
          拒绝
        </el-button>
        <el-button type="success" :icon="Phone" size="large" @click="$emit('answer')">
          接听
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PhoneFilled, Phone, Close } from '@element-plus/icons-vue'

defineProps({
  callerName: { type: String, default: '急诊科 陈医生' },
})

defineEmits(['answer', 'reject'])
</script>

<style scoped>
.incoming-overlay {
  position: fixed;
  inset: 0;
  background: rgba(24, 48, 68, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
}

.incoming-card {
  padding: 48px 64px;
  text-align: center;
  animation: slideIn 0.3s ease-out;
  background: var(--hx-surface-solid);
  border-radius: 24px;
  box-shadow:
    0 4px 8px rgba(24, 48, 68, 0.06),
    0 12px 28px rgba(24, 48, 68, 0.12),
    0 24px 52px rgba(24, 48, 68, 0.14);
}

@keyframes slideIn {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.incoming-icon-box {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(61, 126, 255, 0.12), rgba(34, 167, 200, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--hx-blue);
  animation: iconRing 1s ease-in-out infinite;
}

@keyframes iconRing {
  0%, 100% { transform: rotate(0); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-4deg); }
  20%, 40%, 60%, 80% { transform: rotate(4deg); }
}

.incoming-title { font-size: 24px; font-weight: 700; color: var(--hx-text); margin: 0 0 8px; }
.incoming-caller { font-size: 18px; font-weight: 600; color: var(--hx-blue); margin: 8px 0; }
.incoming-hint { font-size: 14px; color: var(--hx-muted); margin-bottom: 36px; }

.incoming-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
}
</style>
