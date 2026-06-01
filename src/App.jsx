import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import SleepingCharacter from './components/SleepingCharacter.jsx'
import SituationPicker, { SITUATIONS } from './components/SituationPicker.jsx'
import StopSnoringPage from './components/StopSnoringPage.jsx'
import SnoreLabPage from './components/SnoreLabPage.jsx'
import InstallPage from './components/InstallPage.jsx'
import { SnoreEngine, PERSONALITIES } from './audio/snoreEngine.js'

const LIVE_APP_URL = 'https://amolsarva.github.io/OpenSNORE/'
const GITHUB_URL = 'https://github.com/amolsarva/OpenSNORE'
const RELEASES_URL = `${GITHUB_URL}/releases/latest`
const FEATURED_PERSONALITY_IDS = ['gentleman', 'chainsaw', 'harmonist']
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
const VIRAL_MISSIONS = [
  {
    title: 'The 15-Second Snore Test',
    brief: 'Press SNORE, switch personalities once, then send the live site to someone who will laugh.',
    share: 'I just ran the 15-second OpenSnoRE test. Click, snore, star: https://amolsarva.github.io/OpenSNORE/',
  },
  {
    title: 'The Bored Meeting Rescue',
    brief: 'Pick a boring situation, start snoring, and see how long you can endure before the meter gets rude.',
    share: 'OpenSnoRE is now handling my boring meeting energy: https://amolsarva.github.io/OpenSNORE/',
  },
  {
    title: 'The Snore Personality Draft',
    brief: 'Try three snore personalities and decide which one deserves a dedicated fanbase.',
    share: 'I am voting for a ridiculous OpenSnoRE snore personality. Try yours: https://amolsarva.github.io/OpenSNORE/',
  },
  {
    title: 'The Quieter Night Preview',
    brief: 'Open Stop Snoring, preview one guided exercise, then star the repo if this should get more polished.',
    share: 'OpenSnoRE is half joke, half snoring exercise coach. It is weirdly useful: https://amolsarva.github.io/OpenSNORE/',
  },
]
const ALIBIS = [
  'Sorry, I was on mute.',
  'I was pressure-testing the silence in this call.',
  'I was giving that idea room to breathe.',
  'I was aligning asynchronously with the oxygen in the room.',
  'I was letting the previous point land.',
  'I was running a local-first attention simulation.',
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
  const [meetingStatus, setMeetingStatus] = useState('opens the selected meeting page in a new tab')
  const [holdEvent, setHoldEvent] = useState('toy timer ready')
  const [demoStatus, setDemoStatus] = useState('simulated 20-second meeting joke ready')
  const [listening, setListening] = useState(false)
  const [micStatus, setMicStatus] = useState(
    SpeechRecognition
      ? 'speech wake detection available'
      : 'speech wake detection unsupported here',
  )
  const [lastTranscript, setLastTranscript] = useState('')
  const [shareStatus, setShareStatus] = useState('share the live app')
  const [previewedExercises, setPreviewedExercises] = useState(false)
  const [missionIndex, setMissionIndex] = useState(0)
  const [alibi, setAlibi] = useState(ALIBIS[0])
  const [reportStatus, setReportStatus] = useState('ready to copy')
  const [lifetimeStats, setLifetimeStats] = useState({ totalSnores: 0, bestScore: 0 })

  const engineRef = useRef(null)
  const resumeTimerRef = useRef(null)
  const demoTimersRef = useRef([])
  const recognitionRef = useRef(null)

  useEffect(() => {
    engineRef.current = new SnoreEngine()
    try {
      const saved = window.localStorage.getItem('opensnore.stats')
      if (saved) setLifetimeStats(JSON.parse(saved))
    } catch {
      // Local stats are optional; private browsing can block storage.
    }
    return () => engineRef.current?.stop()
  }, [])

  const handleSnore = useCallback(() => {
    setSnoreCount((c) => c + 1)
    setLifetimeStats((prev) => {
      const next = { ...prev, totalSnores: prev.totalSnores + 1 }
      try {
        window.localStorage.setItem('opensnore.stats', JSON.stringify(next))
      } catch {
        // Ignore storage failures; the live snore should never depend on persistence.
      }
      return next
    })
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

  const shareOpenSnoRE = async () => {
    const shareData = {
      title: 'OpenSnoRE',
      text: 'Try OpenSnoRE: fake snores for boring calls, real exercises for quieter nights.',
      url: LIVE_APP_URL,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus('share sheet opened')
        setAgentLine('OpenSnoRE escaped into the group chat')
        return
      }
      await navigator.clipboard.writeText(LIVE_APP_URL)
      setShareStatus('live app link copied')
      setAgentLine('link copied for one bored person')
    } catch {
      setShareStatus(LIVE_APP_URL)
      setAgentLine('copy manually: amolsarva.github.io/OpenSNORE')
    }
  }

  const copyText = async (text, successMessage) => {
    try {
      await navigator.clipboard.writeText(text)
      setReportStatus(successMessage)
      setAgentLine(successMessage)
    } catch {
      setReportStatus('copy failed; select the text manually')
      setAgentLine('clipboard refused the bit')
    }
  }

  const rerollMission = () => {
    setMissionIndex((prev) => (prev + 1) % VIRAL_MISSIONS.length)
    setReportStatus('new mission loaded')
  }

  const rerollAlibi = () => {
    const next = ALIBIS[(ALIBIS.indexOf(alibi) + 1) % ALIBIS.length]
    setAlibi(next)
    setAgentLine(next)
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
    setMeetingStatus(`opened ${meetingHost}; no lobby automation`)
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
  const activeMission = VIRAL_MISSIONS[missionIndex]
  const activeSituation = SITUATIONS.find((s) => s.id === situation)
  const snoreScore = Math.min(999, Math.round(snoreCount * 13 + survived * 1.7 + boredomLevel * 4))
  const reportText = `OpenSnoRE report: ${snoreCount} synthetic snores, ${formatSurvived(survived)} endured${activeSituation ? ` during ${activeSituation.label}` : ''}, ${Math.round(boredomLevel)}% bored, ${PERSONALITIES[personality].name} mode. Try it: ${LIVE_APP_URL}`
  const achievementList = [
    {
      id: 'first-snore',
      label: 'First Snore',
      unlocked: snoreCount > 0,
      detail: 'Pressed the button.',
    },
    {
      id: 'personality',
      label: 'Taste Maker',
      unlocked: personality !== 'gentleman',
      detail: 'Changed the snore vibe.',
    },
    {
      id: 'survivor',
      label: 'Meeting Survivor',
      unlocked: survived >= 30,
      detail: 'Endured 30 seconds.',
    },
    {
      id: 'training',
      label: 'Exercise Explorer',
      unlocked: previewedExercises,
      detail: 'Opened the exercise coach.',
    },
    {
      id: 'chaos',
      label: 'Boredom Scholar',
      unlocked: boredomLevel >= 50,
      detail: 'Reached 50% bored.',
    },
  ]
  const unlockedCount = achievementList.filter((a) => a.unlocked).length

  useEffect(() => {
    if (snoreScore <= lifetimeStats.bestScore) return
    setLifetimeStats((prev) => {
      const next = { ...prev, bestScore: snoreScore }
      try {
        window.localStorage.setItem('opensnore.stats', JSON.stringify(next))
      } catch {
        // Optional persistence only.
      }
      return next
    })
  }, [lifetimeStats.bestScore, snoreScore])
  return (
    <div className="app">
      <Stars />

      <header className="header">
        <div className="header-left">
          <span className="logo-moon">🌙</span>
          <div>
            <div className="logo-title">OpenSnoRE</div>
            <div className="logo-sub">Synthetic snores, exercises, and a local audio lab</div>
          </div>
        </div>
        <div className="header-right">
          {snoreCount > 0 && (
            <div className="header-actions" aria-label="Project actions">
              <button className="share-btn" onClick={shareOpenSnoRE}>
                Share
              </button>
              <a
                className="star-link"
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Star on GitHub
              </a>
            </div>
          )}
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
          onClick={() => {
            setPreviewedExercises(true)
            setActiveTab('train')
          }}
        >
          💪 Stop Snoring
        </button>
        <button
          className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab')}
        >
          📈 Snore Lab
        </button>
      </nav>

      {activeTab === 'snore' ? (
        <main className="main">
          <section className="snore-intro">
            <span className="section-label">Synthetic snore generator</span>
            <h1>Press SNORE. Hear a ridiculous synthetic snore.</h1>
            <p>Start with the joke. Exercises and local sleep-audio analysis are one tap away.</p>
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

          <div className="home-secondary-actions" aria-label="More OpenSnoRE modes">
            <button
              className="small-action"
              onClick={() => {
                setPreviewedExercises(true)
                setActiveTab('train')
              }}
            >
              Try exercises
            </button>
            <button className="ghost-action" onClick={() => setActiveTab('lab')}>
              Analyze sleep audio
            </button>
          </div>

          <section className="home-session-stats" aria-label="Current snore session">
            <div>
              <strong>{snoreCount}</strong>
              <span>snores</span>
            </div>
            <div>
              <strong>{formatSurvived(survived)}</strong>
              <span>endured</span>
            </div>
            <div>
              <strong>{pConfig.name}</strong>
              <span>personality</span>
            </div>
          </section>

          <button className="home-install-link" onClick={() => setActiveTab('install')}>
            Install options
          </button>

          {/* Personality selector */}
          <div className="section">
            <h3 className="section-label">Snore Personality</h3>
            <div className="personality-grid featured">
              {FEATURED_PERSONALITY_IDS.map((id) => PERSONALITIES[id]).map((p) => (
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
            <details className="personality-more">
              <summary>More personalities</summary>
              <div className="personality-grid">
                {Object.values(PERSONALITIES)
                  .filter((p) => !FEATURED_PERSONALITY_IDS.includes(p.id))
                  .map((p) => (
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
            </details>
          </div>

          <details className="home-more experiments-more">
            <summary>More joke tools and meeting experiments</summary>
            <div className="home-more-body">
              <div className="experiment-note">
                These are sketches and browser-dependent experiments, not meeting automation.
                Each card says what it can actually do.
              </div>
              <button className="demo-btn" onClick={runDemoMode}>
                Run simulated meeting demo
              </button>

              <section className="insanity-grid" aria-label="OpenSnoRE viral tools">
            <div className="insanity-card mission-card">
              <span className="section-label">Mission control</span>
              <h2>{activeMission.title}</h2>
              <p>{activeMission.brief}</p>
              <div className="insanity-actions">
                <button
                  className="small-action"
                  onClick={() => copyText(activeMission.share, 'mission copy copied')}
                >
                  Copy mission
                </button>
                <button className="ghost-action" onClick={rerollMission}>
                  New mission
                </button>
              </div>
            </div>

            <div className="insanity-card report-card">
              <span className="section-label">Shareable report</span>
              <div className="score-row">
                <strong>{snoreScore}</strong>
                <span>snore score</span>
              </div>
              <div className="lifetime-row">
                <span>{lifetimeStats.totalSnores} lifetime snores</span>
                <span>{lifetimeStats.bestScore} best score</span>
              </div>
              <p>{reportText}</p>
              <div className="insanity-actions">
                <button
                  className="small-action"
                  onClick={() => copyText(reportText, 'snore report copied')}
                >
                  Copy report
                </button>
                <button className="ghost-action" onClick={shareOpenSnoRE}>
                  Share site
                </button>
              </div>
              <span className="copy-status">{reportStatus}</span>
            </div>

            <div className="insanity-card alibi-card">
              <span className="section-label">Meeting alibi</span>
              <blockquote>{alibi}</blockquote>
              <div className="insanity-actions">
                <button
                  className="small-action"
                  onClick={() => copyText(alibi, 'alibi copied')}
                >
                  Copy alibi
                </button>
                <button className="ghost-action" onClick={rerollAlibi}>
                  Reroll
                </button>
              </div>
            </div>

            <div className="insanity-card achievement-card">
              <span className="section-label">Achievements</span>
              <h2>{unlockedCount}/{achievementList.length} unlocked</h2>
              <div className="achievement-list">
                {achievementList.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`achievement-pill ${achievement.unlocked ? 'unlocked' : ''}`}
                  >
                    <span>{achievement.unlocked ? '✓' : '•'}</span>
                    <div>
                      <strong>{achievement.label}</strong>
                      <small>{achievement.detail}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </section>

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
                <h3 className="section-label">Meeting Link Opener</h3>
                <span className="soon-pill">opens a page only</span>
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
                <h3 className="section-label">Hold Timer Simulation</h3>
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
                <h3 className="section-label">Name Wake Experiment</h3>
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
            </div>
          </details>
        </main>
      ) : activeTab === 'train' ? (
        <StopSnoringPage />
      ) : activeTab === 'install' ? (
        <InstallPage
          releasesUrl={RELEASES_URL}
          shareStatus={shareStatus}
          onBack={() => setActiveTab('snore')}
          onShare={shareOpenSnoRE}
        />
      ) : (
        <SnoreLabPage />
      )}
    </div>
  )
}
