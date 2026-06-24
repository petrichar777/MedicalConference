import { ref, onUnmounted } from 'vue'
import { generateLatest } from '../mock/vitals.js'

export function useMockVitals() {
  const vitals = ref(null)
  const trend = ref([])
  const running = ref(false)
  let timer = null

  function start() {
    if (running.value) return
    running.value = true
    tick()
    timer = setInterval(tick, 2000)
  }

  function stop() {
    running.value = false
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function tick() {
    const v = generateLatest(vitals.value)
    vitals.value = v
    trend.value.push(v)
    if (trend.value.length > 150) {
      trend.value = trend.value.slice(-150)
    }
  }

  onUnmounted(() => stop())

  return { vitals, trend, start, stop, running }
}
