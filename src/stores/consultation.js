import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { API_BASE } from '../config.js'

const api = axios.create({ baseURL: API_BASE })

export const useConsultationStore = defineStore('consultation', () => {
  // --- State ---
  const sessionId = ref(null)
  const roomId = ref(null)
  const role = ref(null)      // 'REQUESTER' | 'EXPERT'
  const state = ref('IDLE')   // IDLE | CALLING | INCOMING | CONNECTED | REJECTED | TIMEOUT | HANGUP

  const sdkAppId = ref(null)
  const userSig = ref(null)
  const userId = ref(null)

  const requesterName = ref('急诊科 陈医生')
  const expertName = ref('心内科 周主任')

  const patientInfo = ref(null)
  const vitalsData = ref(null)
  const vitalsTrend = ref([])

  const callStartTime = ref(null)
  const callTimeout = ref(60)
  const error = ref(null)

  // --- Actions ---
  async function createSession() {
    role.value = 'REQUESTER'
    const { data } = await api.post('/api/sessions')
    sessionId.value = data.sessionId
    roomId.value = data.roomId
    sdkAppId.value = data.sdkAppId
    userSig.value = data.userSig
    userId.value = data.userId
    state.value = 'IDLE'
    return data
  }

  async function initiateCall() {
    const { data } = await api.post(`/api/sessions/${sessionId.value}/call`)
    state.value = 'CALLING'
    return data
  }

  async function answerCall() {
    const { data } = await api.post(`/api/sessions/${sessionId.value}/answer`)
    sdkAppId.value = data.sdkAppId
    userSig.value = data.userSig
    userId.value = data.userId
    roomId.value = data.roomId
    state.value = 'CONNECTED'
    callStartTime.value = Date.now()
    return data
  }

  async function rejectCall() {
    await api.post(`/api/sessions/${sessionId.value}/reject`)
    state.value = 'IDLE'
  }

  async function hangup() {
    const by = role.value === 'REQUESTER' ? 'REQUESTER' : 'EXPERT'
    await api.post(`/api/sessions/${sessionId.value}/hangup?by=${by}`)
    state.value = 'HANGUP'
  }

  async function loadMockData() {
    const [patientRes, vitalsRes] = await Promise.all([
      api.get('/api/mock/patient'),
      api.get('/api/mock/vitals/latest'),
    ])
    patientInfo.value = patientRes.data
    vitalsData.value = vitalsRes.data
  }

  function updateVitals(data) {
    vitalsData.value = data
    vitalsTrend.value.push(data)
    if (vitalsTrend.value.length > 150) {
      vitalsTrend.value = vitalsTrend.value.slice(-150)
    }
  }

  function setStateFromEvent(eventType) {
    switch (eventType) {
      case 'CALL_INCOMING':
        state.value = 'INCOMING'
        break
      case 'CALL_ANSWERED':
        state.value = 'CONNECTED'
        callStartTime.value = Date.now()
        break
      case 'CALL_REJECTED':
        state.value = 'REJECTED'
        break
      case 'CALL_TIMEOUT':
        state.value = 'TIMEOUT'
        break
      case 'HANGUP':
        state.value = 'HANGUP'
        break
    }
  }

  function resetState() {
    state.value = 'IDLE'
    sessionId.value = null
    roomId.value = null
    userSig.value = null
    userId.value = null
    patientInfo.value = null
    vitalsData.value = null
    vitalsTrend.value = []
    error.value = null
    callStartTime.value = null
  }

  return {
    sessionId, roomId, role, state, sdkAppId, userSig, userId,
    requesterName, expertName, patientInfo, vitalsData, vitalsTrend,
    callStartTime, callTimeout, error,
    createSession, initiateCall, answerCall, rejectCall, hangup,
    loadMockData, updateVitals, setStateFromEvent, resetState,
  }
})
