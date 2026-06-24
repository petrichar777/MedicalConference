import { ref } from 'vue'

export function useDeviceCheck() {
  const cameraOk = ref(null)    // null=unchecked, true=ok, false=denied
  const micOk = ref(null)
  const isSecure = ref(true)    // HTTP (non-localhost) = false
  const checking = ref(false)
  const errorMsg = ref('')

  // Detect if current context is secure enough for getUserMedia
  function detectSecureContext() {
    if (window.location.protocol === 'https:') return true
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return true
    if (window.location.hostname.startsWith('192.168.')) return true
    return false
  }

  async function check() {
    checking.value = true
    errorMsg.value = ''
    isSecure.value = detectSecureContext()

    if (!isSecure.value) {
      cameraOk.value = false
      micOk.value = false
      errorMsg.value = '当前页面通过 HTTP 访问，浏览器禁止使用摄像头和麦克风。请通过 HTTPS 访问，或在本地 localhost 测试。'
      checking.value = false
      return
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraOk.value = false
      micOk.value = false
      errorMsg.value = '当前浏览器不支持摄像头/麦克风，请使用 Chrome 或 Edge 最新版本。'
      checking.value = false
      return
    }

    // Check camera
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true })
      camStream.getTracks().forEach(t => t.stop())
      cameraOk.value = true
    } catch (e) {
      cameraOk.value = false
      if (e.name === 'NotAllowedError') {
        errorMsg.value = '摄像头权限被拒绝，请在浏览器设置中允许本站使用摄像头。'
      } else if (e.name === 'NotFoundError') {
        errorMsg.value = '未检测到摄像头设备。'
      } else {
        errorMsg.value = '摄像头检测失败: ' + (e.message || '未知错误')
      }
    }

    // Check mic
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStream.getTracks().forEach(t => t.stop())
      micOk.value = true
    } catch (e) {
      micOk.value = false
      if (!errorMsg.value || cameraOk.value) {
        if (e.name === 'NotAllowedError') {
          errorMsg.value = '麦克风权限被拒绝，请在浏览器设置中允许本站使用麦克风。'
        } else if (e.name === 'NotFoundError') {
          errorMsg.value = '未检测到麦克风设备。'
        } else {
          errorMsg.value = '麦克风检测失败: ' + (e.message || '未知错误')
        }
      }
    }

    checking.value = false
    return cameraOk.value || micOk.value
  }

  function reset() {
    cameraOk.value = null
    micOk.value = null
    errorMsg.value = ''
    checking.value = false
  }

  return { cameraOk, micOk, isSecure, checking, errorMsg, check, reset }
}
