<template>
  <div v-if="show" class="perm-banner">
    <el-icon :size="18"><WarningFilled /></el-icon>
    <div class="perm-body">
      <p class="perm-title">
        {{ cameraDenied && micDenied ? '摄像头和麦克风' : cameraDenied ? '摄像头' : '麦克风' }}
        权限未开启
      </p>
      <p class="perm-desc">
        请在浏览器设置中允许本站使用{{ cameraDenied ? '摄像头' : '' }}{{ cameraDenied && micDenied ? '和' : '' }}{{ micDenied ? '麦克风' : '' }}，或点击浏览器地址栏左侧的权限图标。
      </p>
      <el-button size="small" type="primary" @click="retry">重新检测</el-button>
    </div>
    <el-button text circle :icon="Close" @click="dismiss" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { WarningFilled, Close } from '@element-plus/icons-vue'

const props = defineProps({
  cameraDenied: { type: Boolean, default: false },
  micDenied: { type: Boolean, default: false },
})

const emit = defineEmits(['retry'])
const show = ref(false)

watch(() => props.cameraDenied || props.micDenied, (val) => {
  if (val) show.value = true
}, { immediate: true })

function retry() {
  emit('retry')
}

function dismiss() {
  show.value = false
}
</script>

<style scoped>
.perm-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: #fff7e6;
  border: 1px solid #f5dab1;
  border-radius: 12px;
  margin: 12px 16px 0;
  color: var(--hx-amber);
}

.perm-body {
  flex: 1;
}

.perm-title {
  font-size: 14px;
  font-weight: 700;
  color: #b87a14;
  margin: 0 0 4px;
}

.perm-desc {
  font-size: 12px;
  color: var(--hx-muted);
  margin: 0 0 10px;
  line-height: 1.5;
}
</style>
