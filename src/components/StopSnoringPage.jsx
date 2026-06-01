import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { EXERCISES, PROGRAMS, CATEGORIES } from '../data/exercises.js'
import ExercisePlayer from './ExercisePlayer.jsx'

const TRAINING_STORAGE_KEY = 'opensnore.training'

function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function formatPracticeDate(key) {
  return new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function getTrainingStreak(completions) {
  const completedDays = new Set(completions.map((completion) => completion.date))
  let cursor = new Date()
  let streak = 0

  while (completedDays.has(dateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date()
    day.setDate(day.getDate() - (6 - index))
    return dateKey(day)
  })
}

export default function StopSnoringPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeExercise, setActiveExercise] = useState(null)
  const [expandedProgram, setExpandedProgram] = useState(null)
  const [trainingStats, setTrainingStats] = useState({
    sessions: 0,
    totalSeconds: 0,
    completions: [],
    lastCompleted: null,
  })

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TRAINING_STORAGE_KEY)
      if (saved) setTrainingStats(JSON.parse(saved))
    } catch {
      // Practice stats are optional; private browsing can block storage.
    }
  }, [])

  const visibleExercises =
    categoryFilter === 'all'
      ? EXERCISES
      : EXERCISES.filter((e) => e.category === categoryFilter)

  const startExercise = (exercise) => setActiveExercise(exercise)

  const recordCompletion = useCallback((exercise, totalSeconds) => {
    setTrainingStats((prev) => {
      const completion = {
        id: `${Date.now()}-${exercise.id}`,
        exerciseId: exercise.id,
        name: exercise.name,
        emoji: exercise.emoji,
        seconds: totalSeconds,
        date: dateKey(),
        completedAt: new Date().toISOString(),
      }
      const next = {
        sessions: prev.sessions + 1,
        totalSeconds: prev.totalSeconds + totalSeconds,
        completions: [completion, ...(prev.completions || [])].slice(0, 20),
        lastCompleted: completion,
      }
      try {
        window.localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Keep the in-memory update even if persistence is unavailable.
      }
      return next
    })
  }, [])

  const startProgram = (program) => {
    const first = EXERCISES.find((e) => e.id === program.exerciseIds[0])
    if (first) setActiveExercise(first)
  }

  const completedDays = useMemo(
    () => new Set((trainingStats.completions || []).map((completion) => completion.date)),
    [trainingStats.completions],
  )
  const practiceStreak = useMemo(
    () => getTrainingStreak(trainingStats.completions || []),
    [trainingStats.completions],
  )
  const weeklyDays = useMemo(() => getLastSevenDays(), [])
  const totalMinutes = Math.round(trainingStats.totalSeconds / 60)
  const completedToday = completedDays.has(dateKey())

  return (
    <div className="stop-page">
      {activeExercise && (
        <ExercisePlayer
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onComplete={recordCompletion}
        />
      )}

      {/* Science callout */}
      <div className="science-banner">
        <div className="science-banner-icon">🧬</div>
        <div className="science-banner-body">
          <p>
            <strong>Exercises may help some people.</strong> Myofunctional therapy targets the
            tongue, throat, and jaw. Small studies and meta-analyses suggest it can reduce snoring
            for some people, but results vary.
          </p>
          <p>
            This is a practice tool, not a diagnosis or treatment plan. Talk with a medical
            professional about persistent loud snoring, breathing pauses, gasping, or daytime
            sleepiness because those can be signs of sleep apnea or another sleep disorder.
          </p>
        </div>
      </div>

      <section className="practice-panel" aria-label="Local practice progress">
        <div>
          <span className="section-label">Local practice coach</span>
          <h2>{completedToday ? 'Today is logged.' : 'Finish one exercise to log today.'}</h2>
          <p>
            OpenSnoRE saves only completion summaries in this browser. No account,
            no server, and no health claims.
          </p>
        </div>
        <div className="practice-metrics">
          <div className="practice-metric">
            <strong>{practiceStreak}</strong>
            <span>day streak</span>
          </div>
          <div className="practice-metric">
            <strong>{trainingStats.sessions}</strong>
            <span>sessions</span>
          </div>
          <div className="practice-metric">
            <strong>{totalMinutes}</strong>
            <span>minutes</span>
          </div>
        </div>
        <div className="practice-week" aria-label="Seven day practice history">
          {weeklyDays.map((day) => (
            <div key={day} className={`practice-day ${completedDays.has(day) ? 'done' : ''}`}>
              <span>{formatPracticeDate(day)}</span>
              <strong>{completedDays.has(day) ? 'Done' : 'Open'}</strong>
            </div>
          ))}
        </div>
        {trainingStats.lastCompleted && (
          <p className="practice-last">
            Last completed: {trainingStats.lastCompleted.emoji} {trainingStats.lastCompleted.name}
          </p>
        )}
      </section>

      {/* Programs */}
      <section className="stop-section">
        <h2 className="stop-section-title">
          <span>📋</span> Guided Programs
        </h2>
        <p className="stop-section-sub">
          Curated routines. Pick one and stick with it.
        </p>
        <div className="programs-grid">
          {PROGRAMS.map((program) => {
            const isExpanded = expandedProgram === program.id
            const programExercises = program.exerciseIds
              .map((id) => EXERCISES.find((e) => e.id === id))
              .filter(Boolean)

            return (
              <div
                key={program.id}
                className={`program-card ${isExpanded ? 'expanded' : ''}`}
                style={{ '--prog-color': program.color }}
              >
                <div className="program-card-top">
                  <div className="program-emoji-wrap">
                    <span className="program-emoji">{program.emoji}</span>
                  </div>
                  <div className="program-meta">
                    <div className="program-name">{program.name}</div>
                    <div className="program-desc">{program.description}</div>
                    <div className="program-tags">
                      <span className="program-tag">{program.duration} min</span>
                      <span className="program-tag">{program.level}</span>
                      <span className="program-tag">{program.exerciseIds.length} exercises</span>
                    </div>
                    <div className="program-freq">🔁 {program.frequency}</div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="program-exercises-list">
                    {programExercises.map((ex, i) => (
                      <div key={ex.id} className="program-ex-row">
                        <span className="program-ex-num">{i + 1}</span>
                        <span className="program-ex-emoji">{ex.emoji}</span>
                        <div className="program-ex-info">
                          <span className="program-ex-name">{ex.name}</span>
                          <span className="program-ex-detail">
                            {ex.reps} reps · {ex.steps.length} steps
                          </span>
                        </div>
                        <button
                          className="program-ex-start"
                          onClick={() => startExercise(ex)}
                        >
                          Start
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="program-card-actions">
                  <button
                    className="program-btn-secondary"
                    onClick={() =>
                      setExpandedProgram(isExpanded ? null : program.id)
                    }
                  >
                    {isExpanded ? 'Collapse ↑' : 'View exercises ↓'}
                  </button>
                  <button
                    className="program-btn-primary"
                    onClick={() => startProgram(program)}
                  >
                    ▶ Begin
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Exercise Library */}
      <section className="stop-section">
        <h2 className="stop-section-title">
          <span>🏃</span> Exercise Library
        </h2>

        {/* Category filter */}
        <div className="cat-filter">
          <button
            className={`cat-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              className={`cat-btn ${categoryFilter === key ? 'active' : ''}`}
              onClick={() => setCategoryFilter(key)}
              style={{ '--cat-color': cat.color }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        <div className="exercises-grid">
          {visibleExercises.map((ex) => {
            const cat = CATEGORIES[ex.category]
            const totalSec = ex.steps.reduce((s, st) => s + st.duration, 0) * ex.reps

            return (
              <div key={ex.id} className="exercise-card">
                <div className="exercise-card-header">
                  <span className="exercise-emoji">{ex.emoji}</span>
                  <div className="exercise-badges">
                    <span
                      className="exercise-cat-badge"
                      style={{ '--cat-color': cat.color }}
                    >
                      {cat.emoji} {cat.label}
                    </span>
                    <span
                      className={`exercise-diff-badge diff-${ex.difficulty.toLowerCase()}`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>
                </div>

                <div className="exercise-name">{ex.name}</div>
                <p className="exercise-benefit">{ex.benefit}</p>
                <p className="exercise-science-note">
                  <span className="science-icon">🔬</span> {ex.science}
                </p>

                <div className="exercise-footer">
                  <div className="exercise-stats">
                    <span>{ex.reps} reps</span>
                    <span>·</span>
                    <span>{ex.steps.length} steps</span>
                    <span>·</span>
                    <span>~{Math.round(totalSec / 60)} min</span>
                  </div>
                  <button className="exercise-start-btn" onClick={() => startExercise(ex)}>
                    ▶ Start
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="stop-section">
        <h2 className="stop-section-title">
          <span>📖</span> How This Works
        </h2>
        <div className="how-grid">
          {HOW_ITEMS.map((item) => (
            <div key={item.title} className="how-card">
              <span className="how-emoji">{item.emoji}</span>
              <strong className="how-title">{item.title}</strong>
              <p className="how-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const HOW_ITEMS = [
  {
    emoji: '💪',
    title: 'Muscles are one factor',
    desc: 'Snoring can have multiple contributors, including airway anatomy and muscle tone. These exercises focus on the muscles you can practice.',
  },
  {
    emoji: '🔁',
    title: 'Practice takes time',
    desc: 'Studies usually ask people to practice for weeks, not minutes. One session is a warm-up; repeated practice is the experiment.',
  },
  {
    emoji: '👅',
    title: 'Tongue exercises can help',
    desc: 'Tongue posture and control can affect the airway for some people. These exercises build awareness and strength without promising a specific result.',
  },
  {
    emoji: '🎵',
    title: 'Singing-style practice is an option',
    desc: 'Singing-style throat work has been studied for snoring and can be a memorable way to practice soft-palate control.',
  },
]
