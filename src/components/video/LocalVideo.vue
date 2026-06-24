<template>
  <div class="local-video-pip">
    <div id="local-video-container" class="local-video"></div>
    <div v-if="!connected" class="pip-placeholder">
      <el-icon :size="20"><VideoCamera /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { VideoCamera } from '@element-plus/icons-vue'

defineProps({
  connected: { type: Boolean, default: false },
})
</script>

<style scoped>
.local-video-pip {
  position: absolute;
  bottom: 88px;
  right: 20px;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  overflow: hidden;
  z-index: 10;
  background: #1a2332;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.local-video { width: 100%; height: 100%; }
.local-video :deep(video) { width: 100%; height: 100%; object-fit: cover; }

.pip-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
}
</style>
