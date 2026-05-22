import React from 'react'

export const SITUATIONS = [
  {
    id: 'standup',
    label: 'Team Standup',
    emoji: '⏰',
    desc: 'Everyone has updates. Everyone.',
    rate: 2.5,
  },
  {
    id: 'qbr',
    label: 'Quarterly Review',
    emoji: '📊',
    desc: '47 slides. You are on slide 12.',
    rate: 4.0,
  },
  {
    id: 'hr',
    label: 'Mandatory HR Training',
    emoji: '📋',
    desc: 'Module 3 of 12. Ethics Awareness.',
    rate: 3.5,
  },
  {
    id: 'tcs',
    label: 'Reading T&Cs',
    emoji: '📜',
    desc: 'Consent is basically theoretical.',
    rate: 5.0,
  },
  {
    id: 'diet',
    label: "Someone's Diet Plan",
    emoji: '🥗',
    desc: 'Intermittent fasting changed everything.',
    rate: 3.0,
  },
  {
    id: 'nft',
    label: 'NFT Pitch Meeting',
    emoji: '🖼️',
    desc: 'Web3 will fix this, apparently.',
    rate: 6.0,
  },
  {
    id: 'podcast',
    label: 'Productivity Podcast',
    emoji: '🎙️',
    desc: 'Wake up at 4am. Be better. No.',
    rate: 2.8,
  },
  {
    id: 'zoom',
    label: "You're On Mute",
    emoji: '🔇',
    desc: 'The other mute button. No, the other one.',
    rate: 3.2,
  },
  {
    id: 'synergy',
    label: 'Synergy Discussion',
    emoji: '🤝',
    desc: "Let's circle back on that action item.",
    rate: 4.5,
  },
  {
    id: 'update',
    label: 'Windows Update',
    emoji: '💻',
    desc: 'Please do not turn off your computer.',
    rate: 2.0,
  },
  {
    id: 'pivot',
    label: 'Strategic Pivot',
    emoji: '🔄',
    desc: 'Everything is the same but different now.',
    rate: 3.8,
  },
  {
    id: 'vibes',
    label: 'Vibes Check Meeting',
    emoji: '✨',
    desc: 'We just wanted to connect. For 90 minutes.',
    rate: 5.5,
  },
]

export default function SituationPicker({ selected, onSelect }) {
  const activeSituation = SITUATIONS.find((s) => s.id === selected)

  return (
    <div className="situation-picker">
      <h3 className="section-label">What Are You Suffering Through?</h3>
      <div className="situation-grid">
        {SITUATIONS.map((s) => (
          <button
            key={s.id}
            className={`situation-chip ${selected === s.id ? 'active' : ''}`}
            onClick={() => onSelect(s.id === selected ? null : s.id)}
            title={s.desc}
          >
            <span className="situation-emoji">{s.emoji}</span>
            <span className="situation-label">{s.label}</span>
          </button>
        ))}
      </div>
      {activeSituation && (
        <p className="situation-desc">
          <em>{activeSituation.desc}</em>
          <span className="situation-rate">
            {' '}· Boredom rate: {activeSituation.rate}x
          </span>
        </p>
      )}
    </div>
  )
}
