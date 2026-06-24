import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMediaStore = defineStore('media', () => {
  const cameraEnabled = ref(true)
  const micEnabled = ref(true)
  const cameraAvailable = ref(null)    // null = unknown
  const micAvailable = ref(null)

  function toggleCamera() { cameraEnabled.value = !cameraEnabled.value }
  function toggleMic() { micEnabled.value = !micEnabled.value }

  return { cameraEnabled, micEnabled, cameraAvailable, micAvailable, toggleCamera, toggleMic }
})
