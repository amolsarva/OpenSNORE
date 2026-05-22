function createPinkNoiseBuffer(ctx, duration) {
  const sampleRate = ctx.sampleRate
  const frameCount = Math.ceil(sampleRate * duration)
  const buffer = ctx.createBuffer(1, frameCount, sampleRate)
  const data = buffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < frameCount; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.96900 * b2 + white * 0.1538520
    b3 = 0.86650 * b3 + white * 0.3104856
    b4 = 0.55000 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.0168980
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) / 7
    b6 = white * 0.115926
  }
  return buffer
}

function makeDistortionCurve(amount) {
  const n = 512
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x))
  }
  return curve
}

export const PERSONALITIES = {
  gentleman: {
    id: 'gentleman',
    name: 'The Gentleman',
    emoji: '🎩',
    description: 'Subtle. Dignified. Almost apologetic.',
    color: '#8b5cf6',
    filterFreq: [180, 320],
    gain: 0.45,
    q: 1.8,
    duration: 2.0,
    pause: 700,
    distortion: 0,
    addTone: false,
  },
  chainsaw: {
    id: 'chainsaw',
    name: 'The Chainsaw',
    emoji: '⚡',
    description: 'Industrial. Relentless. A force of nature.',
    color: '#ef4444',
    filterFreq: [90, 520],
    gain: 0.92,
    q: 3.8,
    duration: 2.6,
    pause: 280,
    distortion: 65,
    addTone: false,
  },
  harmonist: {
    id: 'harmonist',
    name: 'The Harmonist',
    emoji: '🎵',
    description: 'Melodic. Almost musical. Deeply confusing.',
    color: '#10b981',
    filterFreq: [240, 430],
    gain: 0.55,
    q: 2.2,
    duration: 2.3,
    pause: 500,
    distortion: 0,
    addTone: true,
  },
  freight: {
    id: 'freight',
    name: 'The Freight Train',
    emoji: '🚂',
    description: 'Low. Deep. Geological. Basically tectonic.',
    color: '#f97316',
    filterFreq: [50, 190],
    gain: 1.0,
    q: 0.9,
    duration: 3.8,
    pause: 900,
    distortion: 22,
    addTone: false,
  },
}

export class SnoreEngine {
  constructor() {
    this.ctx = null
    this.active = false
    this.timer = null
    this.personality = 'gentleman'
    this.onSnore = null
  }

  _init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  _play() {
    const ctx = this.ctx
    const now = ctx.currentTime
    const p = PERSONALITIES[this.personality]
    const { filterFreq, gain, q, duration, distortion, addTone } = p
    const [freqLow, freqHigh] = filterFreq

    const noiseBuffer = createPinkNoiseBuffer(ctx, duration + 0.5)
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer

    // Primary resonance bandpass
    const bpf = ctx.createBiquadFilter()
    bpf.type = 'bandpass'
    bpf.frequency.setValueAtTime(freqLow, now)
    bpf.Q.value = q

    // Harmonic bandpass
    const bpf2 = ctx.createBiquadFilter()
    bpf2.type = 'bandpass'
    bpf2.frequency.value = freqHigh
    bpf2.Q.value = q * 0.6

    // Low shelf for body rumble
    const shelf = ctx.createBiquadFilter()
    shelf.type = 'lowshelf'
    shelf.frequency.value = 120
    shelf.gain.value = this.personality === 'freight' ? 9 : 3

    // Breathing envelope: quiet inhale → snore builds → sustain → decay
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, now)

    const inhale = 0.32
    const attack = 0.42
    const hold = Math.max(0, duration - inhale - attack - 0.5)

    env.gain.linearRampToValueAtTime(gain * 0.14, now + inhale)
    env.gain.linearRampToValueAtTime(gain, now + inhale + attack)
    if (hold > 0) {
      env.gain.setValueAtTime(gain, now + inhale + attack + hold)
    }
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    // Filter sweeps up during snore onset, drops at the end
    bpf.frequency.linearRampToValueAtTime(freqHigh, now + inhale + attack)
    bpf.frequency.linearRampToValueAtTime(freqLow * 0.7, now + duration)

    const mix = ctx.createGain()
    mix.gain.value = 0.65
    noise.connect(bpf)
    noise.connect(bpf2)
    bpf.connect(mix)
    bpf2.connect(mix)
    mix.connect(shelf)

    let lastNode = shelf
    if (distortion > 0) {
      const shaper = ctx.createWaveShaper()
      shaper.curve = makeDistortionCurve(distortion)
      shaper.oversample = '2x'
      lastNode.connect(shaper)
      lastNode = shaper
    }
    lastNode.connect(env)

    // Harmonist gets a pitched tone layered in
    if (addTone) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, now + inhale)
      osc.frequency.linearRampToValueAtTime(290, now + inhale + attack)
      osc.frequency.linearRampToValueAtTime(175, now + duration)

      const oscEnv = ctx.createGain()
      oscEnv.gain.setValueAtTime(0, now)
      oscEnv.gain.linearRampToValueAtTime(gain * 0.18, now + inhale + attack)
      oscEnv.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc.connect(oscEnv)
      oscEnv.connect(env)
      osc.start(now)
      osc.stop(now + duration + 0.2)
    }

    env.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + duration + 0.2)
  }

  _loop() {
    if (!this.active) return
    this._play()
    if (this.onSnore) this.onSnore()
    const p = PERSONALITIES[this.personality]
    this.timer = setTimeout(() => this._loop(), p.duration * 1000 + p.pause)
  }

  start(personalityId, onSnore) {
    this._init()
    this.personality = personalityId || 'gentleman'
    this.onSnore = onSnore
    this.active = true
    this._loop()
  }

  stop() {
    this.active = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  setPersonality(id) {
    this.personality = id
  }
}
