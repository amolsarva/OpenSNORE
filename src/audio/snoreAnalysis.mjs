const WINDOW_SECONDS = 0.5
const MIN_EVENT_SECONDS = 1.0
const MERGE_GAP_SECONDS = 1.25

function percentile(values, p) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)))
  return sorted[index]
}

export function analyzeAudioBuffer(buffer) {
  const sampleRate = buffer.sampleRate
  const channelCount = buffer.numberOfChannels
  const frameSize = Math.max(1, Math.floor(sampleRate * WINDOW_SECONDS))
  const totalWindows = Math.ceil(buffer.length / frameSize)
  const windows = []

  for (let windowIndex = 0; windowIndex < totalWindows; windowIndex += 1) {
    const start = windowIndex * frameSize
    const end = Math.min(buffer.length, start + frameSize)
    let sumSquares = 0
    let peak = 0
    let samples = 0

    for (let channel = 0; channel < channelCount; channel += 1) {
      const data = buffer.getChannelData(channel)
      for (let i = start; i < end; i += 1) {
        const value = data[i]
        sumSquares += value * value
        peak = Math.max(peak, Math.abs(value))
        samples += 1
      }
    }

    const rms = samples ? Math.sqrt(sumSquares / samples) : 0
    windows.push({
      start: start / sampleRate,
      end: end / sampleRate,
      rms,
      peak,
      score: Math.min(100, Math.round(rms * 420)),
    })
  }

  const rmsValues = windows.map((w) => w.rms)
  const floor = percentile(rmsValues, 35)
  const active = percentile(rmsValues, 85)
  const threshold = Math.max(0.012, floor * 2.8, active * 0.42)
  const activeWindows = windows.map((w) => ({ ...w, active: w.rms >= threshold }))
  const rawEvents = []

  activeWindows.forEach((window) => {
    const last = rawEvents[rawEvents.length - 1]
    if (!window.active) return
    if (last && window.start - last.end <= MERGE_GAP_SECONDS) {
      last.end = window.end
      last.peak = Math.max(last.peak, window.peak)
      last.energy += window.rms
      last.windows += 1
      return
    }
    rawEvents.push({
      start: window.start,
      end: window.end,
      peak: window.peak,
      energy: window.rms,
      windows: 1,
    })
  })

  const events = rawEvents
    .map((event) => ({
      ...event,
      duration: event.end - event.start,
      avgEnergy: event.energy / event.windows,
    }))
    .filter((event) => event.duration >= MIN_EVENT_SECONDS)

  const snoreSeconds = events.reduce((sum, event) => sum + event.duration, 0)
  const snorePercent = buffer.duration ? Math.round((snoreSeconds / buffer.duration) * 100) : 0
  const loudest = events.reduce((max, event) => Math.max(max, event.peak), 0)
  const avgGap =
    events.length > 1
      ? events.slice(1).reduce((sum, event, index) => sum + (event.start - events[index].end), 0) /
        (events.length - 1)
      : 0

  let label = 'Quiet sample'
  if (events.length >= 14 || snorePercent >= 35) label = 'Heavy snore pattern'
  else if (events.length >= 6 || snorePercent >= 15) label = 'Moderate snore pattern'
  else if (events.length >= 2) label = 'Light snore pattern'

  return {
    duration: buffer.duration,
    windows: activeWindows,
    events,
    threshold,
    snoreSeconds,
    snorePercent,
    loudest,
    avgGap,
    label,
  }
}
