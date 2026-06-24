const FMT = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})

export function generateLatest(baseline = null) {
  const b = baseline || { hr: 118, sbp: 92, dbp: 58, spo2: 93, rr: 24, temp: 37.6 }
  const hr = fluctuate(b.hr, 3, 50, 180)
  const sbp = fluctuate(b.sbp, 3, 60, 200)
  const dbp = fluctuate(b.dbp, 2, 30, 120)
  const spo2 = fluctuate(b.spo2, 1, 80, 100)
  const rr = fluctuate(b.rr, 2, 8, 40)
  const temp = Math.round(fluctuateFloat(b.temp, 0.1, 35.0, 42.0) * 10) / 10

  return {
    deviceId: 'MOCK-MINDRAY-001',
    deviceName: '迈瑞监护仪（模拟）',
    vendor: 'Mindray',
    online: true,
    updatedAt: FMT.format(new Date()),
    hr, sbp, dbp, spo2, rr, temp,
  }
}

function fluctuate(base, range, min, max) {
  const delta = Math.floor(Math.random() * (range * 2 + 1)) - range
  return Math.max(min, Math.min(max, base + delta))
}

function fluctuateFloat(base, range, min, max) {
  const delta = (Math.random() * 2 - 1) * range
  return Math.max(min, Math.min(max, base + delta))
}
