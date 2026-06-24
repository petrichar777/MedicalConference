<template>
  <div class="remote-video-wrapper">
    <div id="remote-video-container" class="remote-video"></div>
    <div v-if="!connected" class="video-placeholder">
      <div class="placeholder-icon">
        <el-icon :size="48"><VideoCamera /></el-icon>
      </div>
      <p>等待对方接入...</p>
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
.remote-video-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.remote-video {
  width: 100%;
  height: 100%;
}

.remote-video :deep(video) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0d1b2a;
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 16px;
}

.video-placeholder p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.25);
}
</style>
