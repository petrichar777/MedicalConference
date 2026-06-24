<template>
  <div class="entry-page">
    <div class="role-card glass-panel">
      <div class="role-icon-box">
        <el-icon :size="44"><FirstAidKit /></el-icon>
      </div>
      <h1 class="role-title">远程视频会诊</h1>
      <p class="role-subtitle">请选择您的角色进入系统</p>

      <div class="role-options">
        <div class="role-option" @click="goRequester">
          <div class="role-option-icon requester">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="role-option-text">
            <span class="role-option-name">申请端</span>
            <span class="role-option-desc">{{ store.requesterName }}</span>
          </div>
          <el-icon :size="20" class="role-arrow"><ArrowRight /></el-icon>
        </div>

        <div class="role-option" @click="goExpert">
          <div class="role-option-icon expert">
            <el-icon :size="32"><StarFilled /></el-icon>
          </div>
          <div class="role-option-text">
            <span class="role-option-name">专家端</span>
            <span class="role-option-desc">{{ store.expertName }}</span>
          </div>
          <el-icon :size="20" class="role-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { FirstAidKit, User, StarFilled, ArrowRight } from '@element-plus/icons-vue'
import { useConsultationStore } from '../stores/consultation.js'

const router = useRouter()
const store = useConsultationStore()

function goRequester() { router.push('/requester') }
function goExpert() { router.push('/expert') }
</script>

<style scoped>
.entry-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.role-card {
  padding: 48px 56px;
  max-width: 440px;
  width: 100%;
  text-align: center;
}

.role-icon-box {
  width: 84px;
  height: 84px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(61, 126, 255, 0.12), rgba(59, 167, 160, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: var(--hx-blue);
}

.role-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--hx-text);
  margin: 0 0 6px;
}

.role-subtitle {
  font-size: 14px;
  color: var(--hx-muted);
  margin: 0 0 32px;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #f8fafb;
  border: 1px solid #eef2f5;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  background: #fff;
  border-color: #d6e4ed;
  box-shadow: 0 4px 16px rgba(24, 48, 68, 0.08);
  transform: translateY(-1px);
}

.role-option-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.role-option-icon.requester {
  background: linear-gradient(135deg, rgba(61, 126, 255, 0.15), rgba(61, 126, 255, 0.06));
  color: var(--hx-blue);
}

.role-option-icon.expert {
  background: linear-gradient(135deg, rgba(59, 167, 160, 0.15), rgba(59, 167, 160, 0.06));
  color: var(--hx-green);
}

.role-option-text {
  flex: 1;
  text-align: left;
}

.role-option-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--hx-text);
}

.role-option-desc {
  display: block;
  font-size: 13px;
  color: var(--hx-muted);
  margin-top: 2px;
}

.role-arrow {
  color: #c8d6e0;
  flex-shrink: 0;
}
</style>
