<template>
  <div class="media-controls">
    <div class="controls-center">
      <el-tooltip :content="mediaStore.micEnabled ? '关闭麦克风' : '打开麦克风'" placement="top">
        <el-button
          :class="['ctrl-btn', { 'ctrl-off': !mediaStore.micEnabled }]"
          circle
          size="large"
          @click="toggleMic"
        >
          <el-icon :size="20">
            <Microphone v-if="mediaStore.micEnabled" />
            <Mute v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip :content="mediaStore.cameraEnabled ? '关闭摄像头' : '打开摄像头'" placement="top">
        <el-button
          :class="['ctrl-btn', { 'ctrl-off': !mediaStore.cameraEnabled }]"
          circle
          size="large"
          @click="toggleCamera"
        >
          <el-icon :size="20">
            <VideoCamera v-if="mediaStore.cameraEnabled" />
            <VideoPause v-else />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="结束会诊" placement="top">
        <el-button
          class="hangup-btn"
          circle
          @click="$emit('hangup')"
        >
          <el-icon :size="24"><Phone /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { Microphone, VideoCamera, VideoPause, Phone } from '@element-plus/icons-vue'
import { useMediaStore } from '../../stores/media.js'
import { useTRTCStore } from '../../stores/trtc.js'

const mediaStore = useMediaStore()
const trtcStore = useTRTCStore()

defineEmits(['hangup'])
defineProps({ connected: { type: Boolean, default: false } })

async function toggleMic() {
  mediaStore.toggleMic()
  if (mediaStore.micEnabled) await trtcStore.unmuteAudio()
  else await trtcStore.muteAudio()
}

async function toggleCamera() {
  mediaStore.toggleCamera()
  if (mediaStore.cameraEnabled) await trtcStore.unmuteVideo()
  else await trtcStore.muteVideo()
}
</script>

<style scoped>
.media-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.controls-center {
  display: flex;
  align-items: center;
  gap: 24px;
}

.ctrl-btn {
  width: 48px !important;
  height: 48px !important;
  background: rgba(255, 255, 255, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  transition: all 0.2s ease;
}

.ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

.ctrl-btn.ctrl-off {
  background: rgba(217, 91, 91, 0.6) !important;
  border-color: rgba(217, 91, 91, 0.5) !important;
}

.hangup-btn {
  width: 56px !important;
  height: 56px !important;
  background: #e04545 !important;
  border: none !important;
  color: #fff !important;
  transform: rotate(135deg);
  box-shadow: 0 4px 16px rgba(224, 69, 69, 0.45);
  transition: all 0.2s ease;
}

.hangup-btn:hover {
  background: #c93030 !important;
  box-shadow: 0 6px 24px rgba(224, 69, 69, 0.6);
  transform: rotate(135deg) scale(1.05);
}
</style>
