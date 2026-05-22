import React, { useState, useEffect, useCallback } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 42

export default function ExercisePlayer({ exercise, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [repIndex, setRepIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(exercise.steps[0].duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const totalSteps = exercise.steps.length
  const totalReps = exercise.reps
  const step = exercise.steps[stepIndex]

  // Single-tick timer — clean and stale-closure-free
  useEffect(() => {
    if (!isRunning || isComplete) return

    if (timeLeft <= 0) {
      const nextStep = stepIndex + 1
      if (nextStep < totalSteps) {
        setStepIndex(nextStep)
        setTimeLeft(exercise.steps[nextStep].duration)
      } else {
        const nextRep = repIndex + 1
        if (nextRep < totalReps) {
          setRepIndex(nextRep)
          setStepIndex(0)
          setTimeLeft(exercise.steps[0].duration)
        } else {
          setIsComplete(true)
          setIsRunning(false)
        }
      }
      return
    }

    const t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000)
    return () => clearTimeout(t)
  }, [isRunning, isComplete, timeLeft, stepIndex, repIndex, exercise, totalSteps, totalReps])

  const goTo = useCallback(
    (newStep, newRep = repIndex) => {
      setStepIndex(newStep)
      setRepIndex(newRep)
      setTimeLeft(exercise.steps[newStep].duration)
      setIsRunning(false)
    },
    [repIndex, exercise],
  )

  const prevStep = () => {
    if (stepIndex > 0) goTo(stepIndex - 1)
    else if (repIndex > 0) goTo(totalSteps - 1, repIndex - 1)
  }

  const nextStep = () => {
    if (stepIndex < totalSteps - 1) goTo(stepIndex + 1)
    else if (repIndex < totalReps - 1) goTo(0, repIndex + 1)
    else {
      setIsComplete(true)
      setIsRunning(false)
    }
  }

  // Overall progress: fraction of total ticks elapsed
  const stepDurTotal = exercise.steps.reduce((s, st) => s + st.duration, 0)
  const totalTicks = stepDurTotal * totalReps
  const elapsed =
    repIndex * stepDurTotal +
    exercise.steps.slice(0, stepIndex).reduce((s, st) => s + st.duration, 0) +
    (step.duration - timeLeft)
  const overallPct = Math.min(100, (elapsed / totalTicks) * 100)
  const dashOffset = CIRCUMFERENCE * (timeLeft / step.duration)

  if (isComplete) {
    return (
      <div className="player-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="player-card completion">
          <div className="completion-emoji">🎉</div>
          <h2 className="completion-title">Exercise Complete!</h2>
          <p className="completion-name">{exercise.emoji} {exercise.name}</p>
          <p className="completion-benefit">{exercise.benefit}</p>
          <div className="completion-stats">
            <span className="completion-stat">
              <strong>{totalReps}</strong> reps
            </span>
            <span className="completion-sep">·</span>
            <span className="completion-stat">
              <strong>{totalSteps}</strong> steps
            </span>
            <span className="completion-sep">·</span>
            <span className="completion-stat">
              <strong>~{Math.round(totalTicks / 60)}</strong> min
            </span>
          </div>
          <button className="player-done-btn" onClick={onClose}>
            Done ✓
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="player-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="player-card">
        {/* Header */}
        <div className="player-header">
          <span className="player-exercise-name">
            {exercise.emoji} {exercise.name}
          </span>
          <button className="player-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="player-overall-track">
          <div className="player-overall-fill" style={{ width: `${overallPct}%` }} />
        </div>

        {/* Rep dots */}
        <div className="player-reps">
          <div className="rep-dots">
            {Array.from({ length: totalReps }, (_, i) => (
              <div
                key={i}
                className={`rep-dot ${i < repIndex ? 'done' : i === repIndex ? 'active' : ''}`}
              />
            ))}
          </div>
          <span className="rep-label">
            Rep {repIndex + 1} / {totalReps}
          </span>
        </div>

        {/* Main step display */}
        <div className="player-step-area">
          {/* Countdown ring */}
          <div className="countdown-wrap">
            <svg viewBox="0 0 100 100" className="countdown-svg">
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="rgba(139,92,246,0.12)"
                strokeWidth="7"
              />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  transition: 'stroke-dashoffset 0.85s linear',
                }}
              />
            </svg>
            <div className="countdown-inner">
              <span className="countdown-cue">{step.cue}</span>
              <span className="countdown-time">{timeLeft}</span>
              <span className="countdown-unit">sec</span>
            </div>
          </div>

          {/* Step text */}
          <div className="step-text-area">
            <div className="step-position">
              Step {stepIndex + 1} of {totalSteps}
            </div>
            <div className="step-title-text">{step.title}</div>
            <p className="step-instruction-text">{step.instruction}</p>
          </div>
        </div>

        {/* Step dots */}
        <div className="step-pip-row">
          {exercise.steps.map((_, i) => (
            <button
              key={i}
              className={`step-pip ${i < stepIndex ? 'done' : i === stepIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button
            className="ctrl-btn secondary"
            onClick={prevStep}
            disabled={stepIndex === 0 && repIndex === 0}
          >
            ← Prev
          </button>
          <button
            className={`ctrl-btn primary ${isRunning ? 'running' : ''}`}
            onClick={() => setIsRunning((r) => !r)}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button className="ctrl-btn secondary" onClick={nextStep}>
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
