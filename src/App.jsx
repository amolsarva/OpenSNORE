import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import SleepingCharacter from './components/SleepingCharacter.jsx'
import SituationPicker, { SITUATIONS } from './components/SituationPicker.jsx'
import StopSnoringPage from './components/StopSnoringPage.jsx'
import { SnoreEngine, PERSONALITIES } from './audio/snoreEngine.js'

const ZZZ_POOL = ['z', 'z', 'Z', 'Z', 'ZZ', 'Zz', 'ZZZ', 'z z']
const ATTENTIVENESS_LINES = [
  'mm-hmm',
  'yep',
  'that makes sense',
  'totally',
  'happy to take that offline',
  'I think there are really two issues here',
]
const WAKE_PATTERNS = ['questions?', 'any thoughts', 'can you hear me', 'you there']
const QUICK_MEETINGS = [
  { id: 'zoom', label: 'Zoom', url: 'https://zoom.us/join' },
  { id: 'meet', label: 'Meet', url: 'https://meet.google.com' },
  { id: 'teams', label: 'Teams', url: 'https://teams.microsoft.com' },
]
let nextBubbleId = 0

const IS_IOS =
  typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.2 + 0.8,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    [],
  )
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function formatSurvived(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${String(s).padStart(2, '0')}s`
}

function normalizeHeard(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function App() {
  const [activeTab, setActiveTab] = useState('snore')
  const [isSnoring, setIsSnoring] = useState(false)
  const [personality, setPersonality] = useState('gentleman')
  const [situation, setSituation] = useState(null)
  const [snoreCount, setSnoreCount] = useState(0)
  const [boredomLevel, setBoredomLevel] = useState(0)
  const [survived, setSurvived] = useState(0)
  const [bubbles, setBubbles] = useState([])
  const [intensity, setIntensity] = useState(0.72)
  const [executiveMode, setExecutiveMode] = useState(false)
  const [meetingUrl, setMeetingUrl] = useState('')
  const [holdMode, setHoldMode] = useState(false)
  const [holdSeconds, setHoldSeconds] = useState(0)
  const [agentLine, setAgentLine] = useState('ambient corporate presence detected')
  const [monitorName, setMonitorName] = useState('Amol')
  const [heardPhrase, setHeardPhrase] = useState('')
  const [wakeStatus, setWakeStatus] = useState('sleeping through it')
  const [autoResume, setAutoResume] = useState(false)
  const [audioStatus, setAudioStatus] = useState('tap SNORE to enable audio')
  const [meetingStatus, setMeetingStatus] = useState('opens a meeting page; auto-join is coming soon')
  const [holdEvent, setHoldEvent] = useState('hold music visualizer is ready')
  const [demoStatus, setDemoStatus] = useState('ready to stage the 20-second joke')
  const [listening, setListening] = useState(false)
  const [micStatus, setMicStatus] = useState(
    SpeechRecognition
      ? 'speech wake detection available'
      : 'speech wake detection unsupported here',
  )
  const [lastTranscript, setLastTranscript] = useState('')

  const engineRef = useRef(null)
  const resumeTimerRef = useRef(null)
  const demoTimersRef = useRef([])
  const recognitionRef = useRef(null)

  useEffect(() => {
    engineRef.current = new SnoreEngine()
    return () => engineRef.current?.stop()
  }, [])

  const handleSnore = useCallback(() => {
    setSnoreCount((c) => c + 1)
    const letter = ZZZ_POOL[Math.floor(Math.random() * ZZZ_POOL.length)]
    const id = ++nextBubbleId
    const x = Math.random() * 80 - 40
    setBubbles((prev) => [...prev.slice(-14), { id, letter, x }])
  }, [])

  const startSnoring = useCallback(async (nextLine = 'delegated attendance active') => {
    if (!engineRef.current) return
    try {
      const state = await engineRef.current.start(personality, handleSnore, {
        intensity,
        executiveMode,
      })
      setIsSnoring(true)
      setWakeStatus('sleeping through it')
      setAudioStatus(
        state === 'running'
          ? IS_IOS
            ? 'audio playing; raise volume and disable silent mode'
            : 'audio playing'
          : `audio ${state}`,
      )
      setAgentLine(nextLine)
    } catch {
      setAudioStatus('audio blocked by browser')
      setAgentLine('audio needs a direct tap')
    }
  }, [executiveMode, handleSnore, intensity, personality])

  const toggleSnore = () => {
    if (!engineRef.current) return
    if (isSnoring) {
      engineRef.current.stop()
      setIsSnoring(false)
      setAudioStatus('stopped')
      setAgentLine('ambient corporate presence paused')
    } else {
      startSnoring()
    }
  }

  const handlePersonality = (id) => {
    setPersonality(id)
    engineRef.current?.setPersonality(id)
    setAgentLine(`${PERSONALITIES[id].name} selected`)
  }

  const handleIntensity = (event) => {
    const value = Number(event.target.value)
    setIntensity(value)
    engineRef.current?.setIntensity(value)
    setAgentLine(`snore intensity set to ${Math.round(value * 100)}%`)
  }

  const handleExecutiveMode = (event) => {
    const enabled = event.target.checked
    setExecutiveMode(enabled)
    engineRef.current?.setExecutiveMode(enabled)
    setAgentLine(enabled ? 'executive breathing enabled' : 'executive breathing disabled')
  }

  const launchMeeting = (url = meetingUrl) => {
    const target = url.trim()
    if (!target) {
      setMeetingStatus('paste a meeting link first')
      setAgentLine('no meeting link detected')
      return
    }
    const withProtocol = /^https?:\/\//i.test(target) ? target : `https://${target}`
    let meetingHost = 'meeting page'
    try {
      meetingHost = new URL(withProtocol).hostname
    } catch {
      setMeetingStatus('that link does not look valid yet')
      setAgentLine('meeting link rejected by corporate IT')
      return
    }
    window.open(withProtocol, '_blank', 'noopener,noreferrer')
    if (!isSnoring) {
      startSnoring('joining call, lowering expectations')
    }
    setMeetingUrl(withProtocol)
    setMeetingStatus(`opened ${meetingHost}; auto lobby handling is coming soon`)
    setAgentLine('joining call, lowering expectations')
  }

  const toggleHoldMode = () => {
    setHoldMode((prev) => {
      const next = !prev
      if (next && !isSnoring) {
        startSnoring('waiting on hold')
      }
      setAgentLine(next ? 'waiting on hold' : 'back to ordinary meeting survival')
      setHoldEvent(next ? 'tracking hold time' : 'hold timer paused')
      return next
    })
  }

  const celebrateHuman = () => {
    setHoldMode(false)
    setHoldEvent(`human appeared after ${formatSurvived(holdSeconds)}`)
    setAgentLine('human detected, pretending to be alert')
  }

  const testAudio = async () => {
    if (!engineRef.current) return
    try {
      const state = await engineRef.current.unlock()
      setAudioStatus(
        state === 'running'
          ? IS_IOS
            ? 'test beep sent; check volume and silent mode'
            : 'test beep played'
          : `audio ${state}`,
      )
      setAgentLine('audio test complete')
    } catch {
      setAudioStatus('audio blocked; tap SNORE and check iPhone silent mode')
    }
  }

  const triggerWake = useCallback((reason) => {
    setWakeStatus(`awake: ${reason}`)
    setAgentLine('Sorry, I was on mute.')
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    if (isSnoring) {
      engineRef.current?.stop()
      setIsSnoring(false)
      setAutoResume(true)
      resumeTimerRef.current = setTimeout(() => {
        startSnoring('mm-hmm')
        setAutoResume(false)
        setWakeStatus('sleeping through it')
        setAgentLine('mm-hmm')
      }, 8000)
    }
  }, [isSnoring, startSnoring])

  const queueDemoTimer = (fn, delay) => {
    const timer = setTimeout(fn, delay)
    demoTimersRef.current.push(timer)
  }

  const stopDemo = () => {
    demoTimersRef.current.forEach(clearTimeout)
    demoTimersRef.current = []
    setDemoStatus('demo reset')
  }

  const runDemoMode = () => {
    stopDemo()
    setDemoStatus('demo running')
    setSituation('vibes')
    setHeardPhrase('')
    startSnoring('joining recurring status meeting')
    queueDemoTimer(() => {
      setAgentLine('mm-hmm')
      setDemoStatus('pretending to listen')
    }, 2500)
    queueDemoTimer(() => {
      setHeardPhrase(`${monitorName}, any thoughts?`)
      setWakeStatus(`${monitorName} mentioned`)
      setDemoStatus('someone made the mistake of asking')
    }, 5200)
    queueDemoTimer(() => {
      triggerWake(`${monitorName} mentioned`)
      setDemoStatus('recovered with plausible excuse')
    }, 6600)
    queueDemoTimer(() => {
      setDemoStatus('demo complete')
    }, 10500)
  }

  const handleTranscript = useCallback((text) => {
    setLastTranscript(text)
    setHeardPhrase(text)
    const phrase = normalizeHeard(text)
    const name = normalizeHeard(monitorName)
    if (name && phrase.includes(name)) {
      triggerWake(`${monitorName} mentioned`)
      return
    }
    const match = WAKE_PATTERNS.find((pattern) => phrase.includes(pattern))
    if (match) triggerWake(match)
  }, [monitorName, triggerWake])

  const toggleListening = () => {
    if (!SpeechRecognition) {
      setMicStatus('speech recognition is not supported in this browser')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      setMicStatus('mic wake detection paused')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onstart = () => {
      setListening(true)
      setMicStatus('listening for your name and meeting bait')
    }
    recognition.onerror = (event) => {
      setListening(false)
      setMicStatus(`mic error: ${event.error}`)
    }
    recognition.onend = () => {
      setListening(false)
    }
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim()
      if (transcript) handleTranscript(transcript)
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  const scanHeardPhrase = () => {
    const phrase = normalizeHeard(heardPhrase)
    const name = normalizeHeard(monitorName)
    if (!phrase) return
    if (name && phrase.includes(name)) {
      triggerWake(`${monitorName} mentioned`)
    } else {
      const match = WAKE_PATTERNS.find((pattern) => phrase.includes(pattern))
      if (match) triggerWake(match)
      else setWakeStatus('no action required')
    }
    setHeardPhrase('')
  }

  // Clean up bubbles after their animation completes
  useEffect(() => {
    if (bubbles.length === 0) return
    const oldest = bubbles[0]
    const t = setTimeout(
      () => setBubbles((prev) => prev.filter((b) => b.id !== oldest.id)),
      3300,
    )
    return () => clearTimeout(t)
  }, [bubbles])

  // Boredom accumulation and survival timer
  useEffect(() => {
    if (!isSnoring) return
    const situationData = SITUATIONS.find((s) => s.id === situation)
    const rate = situationData ? situationData.rate : 2.0
    const interval = setInterval(() => {
      setBoredomLevel((prev) => Math.min(100, prev + rate / 10))
      setSurvived((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isSnoring, situation])

  useEffect(() => {
    if (!holdMode) return
    const interval = setInterval(() => setHoldSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [holdMode])

  useEffect(() => {
    if (!isSnoring) return
    const interval = setInterval(() => {
      const line = ATTENTIVENESS_LINES[Math.floor(Math.random() * ATTENTIVENESS_LINES.length)]
      setAgentLine(line)
    }, 13000)
    return () => clearInterval(interval)
  }, [isSnoring])

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
      demoTimersRef.current.forEach(clearTimeout)
      demoTimersRef.current = []
      recognitionRef.current?.stop()
    }
  }, [])

  const boredomStatus =
    boredomLevel >= 100
      ? { label: '🏆 MAXIMUM BOREDOM', css: 'boredom-label max' }
      : boredomLevel >= 75
        ? { label: '🥱 Critically Bored', css: 'boredom-label high' }
        : boredomLevel >= 50
          ? { label: '😴 Deeply Uninterested', css: 'boredom-label mid' }
          : boredomLevel >= 25
            ? { label: '🙄 Getting There', css: 'boredom-label low' }
            : { label: '😑 Mildly Tedious', css: 'boredom-label' }

  const pConfig = PERSONALITIES[personality]

  return (
    <div className="app">
      <Stars />

      <header className="header">
        <div className="header-left">
          <span className="logo-moon">🌙</span>
          <div>
            <div className="logo-title">OpenSnoRE</div>
            <div className="logo-sub">The AI Agent for Boring Situations</div>
          </div>
        </div>
        <div className="header-right">
          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-num">{snoreCount}</span>
              <span className="stat-label">snores</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{formatSurvived(survived)}</span>
              <span className="stat-label">endured</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'snore' ? 'active' : ''}`}
          onClick={() => setActiveTab('snore')}
        >
          💤 Snore Mode
        </button>
        <button
          className={`tab-btn ${activeTab === 'train' ? 'active' : ''}`}
          onClick={() => setActiveTab('train')}
        >
          💪 Stop Snoring
        </button>
      </nav>

      <div className="download-banner">
        <a
          className="dl-btn mac"
          href="https://github.com/amolsarva/OpenSNORE/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="dl-icon">🍎</span>
          <span className="dl-text">
            <span className="dl-label">Download for</span>
            <span className="dl-platform">Mac</span>
          </span>
        </a>
        <div className="dl-divider" />
        <div className="dl-iphone">
          <span className="dl-icon">📱</span>
          <span className="dl-text">
            <span className="dl-label">iPhone — open in Safari, tap</span>
            <span className="dl-platform">Share → Add to Home Screen</span>
          </span>
        </div>
      </div>

      {activeTab === 'snore' ? (
        <main className="main">
          <section className="reality-panel">
            <div>
              <h1>OpenSnoRE attends boring situations so you do not have to.</h1>
              <p>
                Live: synthetic snores, hold timer, fake attentiveness, demo wakeups.
                Experimental: speech wake detection in browsers that support it.
                Roadmap: actual meeting auto-join.
              </p>
            </div>
            <button className="demo-btn" onClick={runDemoMode}>
              Run meeting demo
            </button>
          </section>

          {/* Character + floating ZZZs */}
          <div className="character-area">
            <SleepingCharacter isSnoring={isSnoring} />
            <div className="zzz-container" aria-hidden="true">
              {bubbles.map((b) => (
                <span
                  key={b.id}
                  className="zzz-bubble"
                  style={{ '--x-offset': `${b.x}px` }}
                >
                  {b.letter}
                </span>
              ))}
            </div>
          </div>

          {/* Big snore button */}
          <div className="button-area">
            <button
              className={`snore-btn ${isSnoring ? 'active' : ''}`}
              style={{ '--p-color': pConfig.color }}
              onClick={toggleSnore}
              aria-label={isSnoring ? 'Stop snoring' : 'Start snoring'}
            >
              <span className="snore-btn-icon">{isSnoring ? '😴' : '💤'}</span>
              <span className="snore-btn-text">{isSnoring ? 'STOP' : 'SNORE'}</span>
            </button>
          </div>

          <div className="agent-console" aria-live="polite">
            <div className="agent-status">
              <span className={`agent-dot ${isSnoring ? 'online' : ''}`} />
              <span>{autoResume ? 'briefly conscious' : isSnoring ? 'delegated attendance active' : 'idle'}</span>
            </div>
            <div className="agent-line">"{agentLine}"</div>
            <div className="audio-row">
              <span>{audioStatus}</span>
              <button className="inline-action" onClick={testAudio}>
                Test audio
              </button>
            </div>
            <div className="demo-status">{demoStatus}</div>
          </div>

          {/* Personality selector */}
          <div className="section">
            <h3 className="section-label">Snore Personality</h3>
            <div className="personality-grid">
              {Object.values(PERSONALITIES).map((p) => (
                <button
                  key={p.id}
                  className={`personality-chip ${personality === p.id ? 'active' : ''}`}
                  style={{ '--p-color': p.color }}
                  onClick={() => handlePersonality(p.id)}
                >
                  <span className="p-emoji">{p.emoji}</span>
                  <span className="p-name">{p.name}</span>
                  <span className="p-desc">{p.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="phase-grid">
            <section className="phase-panel">
              <div className="phase-panel-head">
                <h3 className="section-label">Snore Engine</h3>
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={executiveMode}
                    onChange={handleExecutiveMode}
                  />
                  <span>Executive breathing</span>
                </label>
              </div>
              <label className="range-row">
                <span>Intensity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.25"
                  step="0.05"
                  value={intensity}
                  onChange={handleIntensity}
                />
                <strong>{Math.round(intensity * 100)}%</strong>
              </label>
              <p className="phase-note">
                Live now: generated Web Audio snores. On iPhone, use Test audio first,
                turn volume up, and disable silent mode if the beep is muted.
              </p>
              <ul className="mini-list">
                <li>Safari requires a tap before audio can play.</li>
                <li>Silent mode may mute generated audio on some devices.</li>
              </ul>
            </section>

            <section className="phase-panel">
              <div className="phase-panel-head">
                <h3 className="section-label">Meeting Launcher</h3>
                <span className="soon-pill">auto-join soon</span>
              </div>
              <div className="meeting-row">
                <input
                  className="meeting-input"
                  type="url"
                  value={meetingUrl}
                  onChange={(event) => setMeetingUrl(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') launchMeeting()
                  }}
                  placeholder="meet.google.com/..."
                  aria-label="Meeting URL"
                />
                <button className="small-action" onClick={() => launchMeeting()}>
                  Join
                </button>
              </div>
              <div className="quick-meetings">
                {QUICK_MEETINGS.map((meeting) => (
                  <button
                    key={meeting.id}
                    className="quick-meeting"
                    onClick={() => launchMeeting(meeting.url)}
                  >
                    {meeting.label}
                  </button>
                ))}
              </div>
              <p className="phase-note">{meetingStatus}</p>
            </section>

            <section className="phase-panel">
              <div className="phase-panel-head">
                <h3 className="section-label">Wait On Hold</h3>
                <button
                  className={`small-action ${holdMode ? 'active' : ''}`}
                  onClick={toggleHoldMode}
                >
                  {holdMode ? 'Stop' : 'Start'}
                </button>
              </div>
              <div className="hold-display">
                <div className={`hold-bars ${holdMode ? 'active' : ''}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <strong>{formatSurvived(holdSeconds)}</strong>
              </div>
              <p className="phase-note">{holdEvent}</p>
              <button className="ghost-action" onClick={celebrateHuman}>
                Human appeared
              </button>
            </section>

            <section className="phase-panel">
              <div className="phase-panel-head">
                <h3 className="section-label">Name Detection</h3>
                <span className="wake-pill">{wakeStatus}</span>
              </div>
              <p className="phase-note">
                Manual scan works everywhere. Mic wake detection works only where the
                browser exposes speech recognition.
              </p>
              <button
                className={`small-action ${listening ? 'active' : ''}`}
                onClick={toggleListening}
              >
                {listening ? 'Stop mic' : 'Start mic'}
              </button>
              <p className="phase-note">{micStatus}</p>
              <div className="name-row">
                <input
                  className="name-input"
                  value={monitorName}
                  onChange={(event) => setMonitorName(event.target.value)}
                  aria-label="Name to monitor"
                />
                <input
                  className="phrase-input"
                  value={heardPhrase}
                  onChange={(event) => setHeardPhrase(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') scanHeardPhrase()
                  }}
                  placeholder="Amol, any thoughts?"
                  aria-label="Heard phrase"
                />
                <button className="small-action" onClick={scanHeardPhrase}>
                  Scan
                </button>
              </div>
              {lastTranscript && (
                <p className="transcript-line">Heard: "{lastTranscript}"</p>
              )}
            </section>
          </div>

          {/* Situation picker */}
          <SituationPicker selected={situation} onSelect={setSituation} />

          {/* Bored-O-Meter */}
          <div className="boredom-section">
            <div className="boredom-header">
              <span className="section-label">Bored-O-Meter</span>
              <span className={boredomStatus.css}>{boredomStatus.label}</span>
            </div>
            <div className="boredom-track" role="progressbar" aria-valuenow={Math.round(boredomLevel)} aria-valuemin="0" aria-valuemax="100">
              <div
                className={`boredom-fill ${boredomLevel >= 100 ? 'full' : ''}`}
                style={{ width: `${boredomLevel}%` }}
              />
            </div>
            <div className="boredom-footer">
              <span>{Math.round(boredomLevel)}% bored</span>
              {boredomLevel >= 100 && (
                <button
                  className="reset-btn"
                  onClick={() => {
                    setBoredomLevel(0)
                    setSurvived(0)
                    setSnoreCount(0)
                  }}
                >
                  Accept Fate &amp; Reset
                </button>
              )}
            </div>
          </div>
        </main>
      ) : (
        <StopSnoringPage />
      )}
    </div>
  )
}
