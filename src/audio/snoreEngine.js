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

function isLikelyIPhone() {
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPod/.test(navigator.userAgent)
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
  espresso: {
    id: 'espresso',
    name: 'The Espresso Machine',
    emoji: '☕',
    description: 'Hissing. Gurgling. Over-caffeinated.',
    color: '#f59e0b',
    filterFreq: [260, 920],
    gain: 0.62,
    q: 4.7,
    duration: 1.35,
    pause: 210,
    distortion: 42,
    addTone: false,
  },
  foghorn: {
    id: 'foghorn',
    name: 'The Harbor Fog Horn',
    emoji: '📣',
    description: 'Long. Low. Maritime. Deeply inconvenient.',
    color: '#38bdf8',
    filterFreq: [42, 155],
    gain: 1.08,
    q: 0.72,
    duration: 4.5,
    pause: 1250,
    distortion: 8,
    addTone: true,
  },
  polite: {
    id: 'polite',
    name: 'The Tiny Polite Nap',
    emoji: '🤏',
    description: 'Small. Courteous. Barely unionized.',
    color: '#f9a8d4',
    filterFreq: [420, 780],
    gain: 0.28,
    q: 2.1,
    duration: 1.15,
    pause: 850,
    distortion: 0,
    addTone: false,
  },
  subwoofer: {
    id: 'subwoofer',
    name: 'The Subwoofer',
    emoji: '🔊',
    description: 'Wall-rattling bass from under a mattress.',
    color: '#22d3ee',
    filterFreq: [35, 125],
    gain: 1.15,
    q: 0.58,
    duration: 3.1,
    pause: 520,
    distortion: 34,
    addTone: false,
  },
}

export class SnoreEngine {
  constructor() {
    this.ctx = null
    this.active = false
    this.timer = null
    this.personality = 'gentleman'
    this.intensity = 0.72
    this.executiveMode = false
    this.onSnore = null
    this.master = null
    this.mobilePresence = isLikelyIPhone()
  }

  _init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.95
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      return this.ctx.resume()
    }
    return Promise.resolve()
  }

  async unlock() {
    await this._init()
    this._playPing()
    return this.ctx?.state || 'unknown'
  }

  _playPing() {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(660, now)
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.18)
    env.gain.setValueAtTime(0.0001, now)
    env.gain.exponentialRampToValueAtTime(0.24, now + 0.03)
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
    osc.connect(env)
    env.connect(this.master || ctx.destination)
    osc.start(now)
    osc.stop(now + 0.24)
  }

  _play() {
    const ctx = this.ctx
    const now = ctx.currentTime
    const p = PERSONALITIES[this.personality]
    const { filterFreq, gain, q, duration, distortion, addTone } = p
    const intensityGain = Math.max(0.15, Math.min(1.4, this.intensity))
    const executiveGain = this.executiveMode ? 0.55 : 1
    const activeGain = gain * intensityGain * executiveGain * 1.18
    const activeDuration = this.executiveMode ? duration * 1.18 : duration
    const [freqLow, freqHigh] = filterFreq

    const noiseBuffer = createPinkNoiseBuffer(ctx, activeDuration + 0.5)
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

    // iPhone speakers roll off low rumble heavily, so add a quiet midrange
    // presence band while preserving the low-frequency snore body.
    const presence = ctx.createBiquadFilter()
    presence.type = 'bandpass'
    presence.frequency.value = this.mobilePresence ? 840 : 620
    presence.Q.value = 1.2

    const presenceGain = ctx.createGain()
    presenceGain.gain.value = this.mobilePresence ? 0.22 : 0.09

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
    const hold = Math.max(0, activeDuration - inhale - attack - 0.5)

    env.gain.linearRampToValueAtTime(activeGain * 0.14, now + inhale)
    env.gain.linearRampToValueAtTime(activeGain, now + inhale + attack)
    if (hold > 0) {
      env.gain.setValueAtTime(activeGain, now + inhale + attack + hold)
    }
    env.gain.exponentialRampToValueAtTime(0.0001, now + activeDuration)

    // Filter sweeps up during snore onset, drops at the end
    bpf.frequency.linearRampToValueAtTime(freqHigh, now + inhale + attack)
    bpf.frequency.linearRampToValueAtTime(freqLow * 0.7, now + activeDuration)

    const mix = ctx.createGain()
    mix.gain.value = 0.65
    noise.connect(bpf)
    noise.connect(bpf2)
    noise.connect(presence)
    bpf.connect(mix)
    bpf2.connect(mix)
    presence.connect(presenceGain)
    presenceGain.connect(mix)
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
      osc.frequency.linearRampToValueAtTime(175, now + activeDuration)

      const oscEnv = ctx.createGain()
      oscEnv.gain.setValueAtTime(0, now)
      oscEnv.gain.linearRampToValueAtTime(activeGain * 0.18, now + inhale + attack)
      oscEnv.gain.exponentialRampToValueAtTime(0.0001, now + activeDuration)

      osc.connect(oscEnv)
      oscEnv.connect(env)
      osc.start(now)
      osc.stop(now + activeDuration + 0.2)
    }

    env.connect(this.master || ctx.destination)
    noise.start(now)
    noise.stop(now + activeDuration + 0.2)
  }

  _loop() {
    if (!this.active) return
    this._play()
    if (this.onSnore) this.onSnore()
    const p = PERSONALITIES[this.personality]
    const executivePause = this.executiveMode ? 1150 : 0
    this.timer = setTimeout(
      () => this._loop(),
      p.duration * 1000 + p.pause + executivePause,
    )
  }

  async start(personalityId, onSnore, options = {}) {
    await this._init()
    this.personality = personalityId || 'gentleman'
    this.intensity = options.intensity ?? this.intensity
    this.executiveMode = options.executiveMode ?? this.executiveMode
    this.onSnore = onSnore
    this.active = true
    this._loop()
    return this.ctx?.state || 'unknown'
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

  setIntensity(value) {
    this.intensity = value
  }

  setExecutiveMode(value) {
    this.executiveMode = value
  }
}
