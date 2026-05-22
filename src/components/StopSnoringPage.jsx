import React, { useState } from 'react'
import { EXERCISES, PROGRAMS, CATEGORIES } from '../data/exercises.js'
import ExercisePlayer from './ExercisePlayer.jsx'

export default function StopSnoringPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeExercise, setActiveExercise] = useState(null)
  const [expandedProgram, setExpandedProgram] = useState(null)

  const visibleExercises =
    categoryFilter === 'all'
      ? EXERCISES
      : EXERCISES.filter((e) => e.category === categoryFilter)

  const startExercise = (exercise) => setActiveExercise(exercise)

  const startProgram = (program) => {
    const first = EXERCISES.find((e) => e.id === program.exerciseIds[0])
    if (first) setActiveExercise(first)
  }

  return (
    <div className="stop-page">
      {activeExercise && (
        <ExercisePlayer
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
        />
      )}

      {/* Science callout */}
      <div className="science-banner">
        <div className="science-banner-icon">🧬</div>
        <div className="science-banner-body">
          <strong>The evidence is real.</strong> Myofunctional therapy — targeted exercises for
          the tongue, throat, and jaw — reduces snoring frequency by 36% and severity by 59% on
          average. That's from a 2015 meta-analysis of randomized trials. Results appear in 4–8 weeks
          of consistent daily practice. The hardest part is starting.
        </div>
      </div>

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
    title: 'Muscle, not anatomy',
    desc: 'Snoring is usually caused by weak, floppy throat muscles — not your bone structure. Tone the muscles, quiet the snore.',
  },
  {
    emoji: '🔁',
    title: 'Consistency is the drug',
    desc: 'Research shows 3–4 sessions per week for 6–8 weeks produces lasting results. One session is a warm-up. Fifty is a cure.',
  },
  {
    emoji: '👅',
    title: 'Tongue posture matters most',
    desc: 'Where your tongue rests during sleep determines whether your airway stays open. These exercises teach it to stay up.',
  },
  {
    emoji: '🎵',
    title: 'Singing actually works',
    desc: 'Singing is the only exercise for snoring that has been studied in a proper randomized controlled trial. This is your prescription.',
  },
]
