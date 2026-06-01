class FakeAudioParam {
  value = 0

  setValueAtTime(value) {
    this.value = value
  }

  linearRampToValueAtTime(value) {
    this.value = value
  }

  exponentialRampToValueAtTime(value) {
    this.value = value
  }
}

class FakeAudioNode {
  connect() {
    return this
  }
}

class FakeAudioContext {
  constructor() {
    this.currentTime = 0
    this.destination = new FakeAudioNode()
    this.sampleRate = 100
    this.state = 'running'
  }

  createBiquadFilter() {
    return Object.assign(new FakeAudioNode(), {
      frequency: new FakeAudioParam(),
      gain: new FakeAudioParam(),
      Q: new FakeAudioParam(),
      type: '',
    })
  }

  createBuffer(_channels, frameCount) {
    const data = new Float32Array(frameCount)
    return { getChannelData: () => data }
  }

  createBufferSource() {
    return Object.assign(new FakeAudioNode(), {
      start() {},
      stop() {},
    })
  }

  createGain() {
    return Object.assign(new FakeAudioNode(), { gain: new FakeAudioParam() })
  }

  createOscillator() {
    return Object.assign(new FakeAudioNode(), {
      frequency: new FakeAudioParam(),
      start() {},
      stop() {},
      type: '',
    })
  }

  createWaveShaper() {
    return Object.assign(new FakeAudioNode(), {
      curve: null,
      oversample: '',
    })
  }

  resume() {
    this.state = 'running'
    return Promise.resolve()
  }
}

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: { userAgent: 'OpenSnoRE verifier' },
})
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { AudioContext: FakeAudioContext },
})

const { SnoreEngine } = await import('../src/audio/snoreEngine.js')

let callbackCount = 0
const engine = new SnoreEngine()
const state = await engine.start('gentleman', () => {
  callbackCount += 1
})

if (state !== 'running') {
  throw new Error(`verify-snore-engine: expected running state, received ${state}`)
}

if (callbackCount !== 1) {
  throw new Error(`verify-snore-engine: expected one immediate snore callback, received ${callbackCount}`)
}

engine.setPersonality('chainsaw')
engine.setIntensity(0.4)
engine.setExecutiveMode(true)
engine.stop()

if (engine.active || engine.timer) {
  throw new Error('verify-snore-engine: stop() did not clear the active loop')
}

console.log('verify-snore-engine: synthetic audio loop starts and stops with a fake Web Audio context')
