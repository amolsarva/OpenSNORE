import { analyzeAudioBuffer } from '../src/audio/snoreAnalysis.mjs'

function createBuffer({ seconds, sampleRate = 8000, segments = [] }) {
  const length = seconds * sampleRate
  const data = new Float32Array(length)

  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate
    const segment = segments.find((candidate) => t >= candidate.start && t < candidate.end)
    const amp = segment?.amp ?? 0.002
    data[i] = Math.sin(2 * Math.PI * 110 * t) * amp + Math.sin(2 * Math.PI * 230 * t) * amp * 0.2
  }

  return {
    sampleRate,
    numberOfChannels: 1,
    length,
    duration: seconds,
    getChannelData: () => data,
  }
}

function assert(condition, message) {
  if (!condition) {
    console.error(`verify-analysis: ${message}`)
    process.exitCode = 1
  }
}

const quiet = analyzeAudioBuffer(createBuffer({ seconds: 8 }))
assert(quiet.events.length === 0, `quiet sample produced ${quiet.events.length} events`)
assert(quiet.label === 'Quiet sample', `quiet sample was labeled ${quiet.label}`)

const snoreLike = analyzeAudioBuffer(
  createBuffer({
    seconds: 12,
    segments: [
      { start: 1, end: 3, amp: 0.35 },
      { start: 5, end: 7.5, amp: 0.4 },
      { start: 9, end: 11, amp: 0.32 },
    ],
  }),
)

assert(snoreLike.events.length >= 2, `snore-like sample produced ${snoreLike.events.length} events`)
assert(snoreLike.snorePercent >= 15, `snore-like sample active percent was ${snoreLike.snorePercent}`)
assert(snoreLike.windows.some((window) => window.active), 'snore-like sample had no active windows')

if (!process.exitCode) {
  console.log('verify-analysis: analyzer separates quiet and snore-like samples')
}
