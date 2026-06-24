let audioCtx = null
let timer = null

export function useRingtone() {
  let playing = false

  function start() {
    if (playing) return
    playing = true

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      scheduleBeeps()
    } catch {
      // Web Audio not available
    }
  }

  function stop() {
    playing = false
    if (timer) { clearInterval(timer); timer = null }
    if (audioCtx) { audioCtx.close(); audioCtx = null }
  }

  function scheduleBeeps() {
    // Two-tone ring pattern: 800Hz + 1000Hz alternating, every 1.6s
    let high = false
    beep(800)
    timer = setInterval(() => {
      if (!playing) return
      beep(high ? 1000 : 800)
      high = !high
    }, 800)
  }

  function beep(freq) {
    if (!audioCtx || audioCtx.state === 'closed') return
    try {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(audioCtx.currentTime)
      osc.stop(audioCtx.currentTime + 0.35)
    } catch { /* ignore */ }
  }

  return { start, stop }
}
