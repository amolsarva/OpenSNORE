import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import SleepingCharacter from './components/SleepingCharacter.jsx'
import SituationPicker, { SITUATIONS } from './components/SituationPicker.jsx'
import StopSnoringPage from './components/StopSnoringPage.jsx'
import { SnoreEngine, PERSONALITIES } from './audio/snoreEngine.js'

const ZZZ_POOL = ['z', 'z', 'Z', 'Z', 'ZZ', 'Zz', 'ZZZ', 'z z']
let nextBubbleId = 0

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

export default function App() {
  const [activeTab, setActiveTab] = useState('snore')
  const [isSnoring, setIsSnoring] = useState(false)
  const [personality, setPersonality] = useState('gentleman')
  const [situation, setSituation] = useState(null)
  const [snoreCount, setSnoreCount] = useState(0)
  const [boredomLevel, setBoredomLevel] = useState(0)
  const [survived, setSurvived] = useState(0)
  const [bubbles, setBubbles] = useState([])

  const engineRef = useRef(null)

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

  const toggleSnore = () => {
    if (!engineRef.current) return
    if (isSnoring) {
      engineRef.current.stop()
      setIsSnoring(false)
    } else {
      engineRef.current.start(personality, handleSnore)
      setIsSnoring(true)
    }
  }

  const handlePersonality = (id) => {
    setPersonality(id)
    engineRef.current?.setPersonality(id)
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

      {activeTab === 'snore' ? (
        <main className="main">
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
