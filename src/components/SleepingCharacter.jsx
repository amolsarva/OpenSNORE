import React from 'react'

export default function SleepingCharacter({ isSnoring }) {
  return (
    <div className={`character-wrap ${isSnoring ? 'snoring' : ''}`}>
      <svg
        viewBox="-100 -165 200 240"
        className="sleeping-face"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pillow */}
        <ellipse cx="0" cy="74" rx="108" ry="32" fill="#1e1b4b" />
        <ellipse cx="0" cy="67" rx="105" ry="28" fill="#2e2a5e" />
        {/* Pillow highlight */}
        <ellipse cx="-20" cy="60" rx="30" ry="6" fill="rgba(255,255,255,0.04)" />

        {/* Blanket */}
        <path
          d="M-108,80 Q-50,62 0,65 Q50,62 108,80 L108,120 Q50,98 0,102 Q-50,98 -108,120 Z"
          fill="#312e81"
        />
        <path
          d="M-108,80 Q-50,62 0,65 Q50,62 108,80"
          fill="none"
          stroke="#4338ca"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Head */}
        <circle cx="0" cy="0" r="80" fill="#fde68a" />
        {/* Head shadow */}
        <ellipse cx="0" cy="70" rx="78" ry="16" fill="rgba(0,0,0,0.2)" />

        {/* Night cap body */}
        <path d="M-40,-62 Q-12,-115 0,-155 Q12,-115 40,-62 Z" fill="#4c1d95" />
        {/* Cap band */}
        <ellipse cx="0" cy="-62" rx="44" ry="14" fill="#6d28d9" />
        {/* Cap stripe */}
        <path
          d="M-38,-68 Q0,-80 38,-68"
          stroke="#7c3aed"
          strokeWidth="2.5"
          fill="none"
          opacity="0.6"
        />
        {/* Pom-pom */}
        <circle cx="0" cy="-158" r="8" fill="#e9d5ff" />
        <circle cx="0" cy="-158" r="5" fill="white" opacity="0.7" />

        {/* Cheeks */}
        <circle cx="-40" cy="24" r="20" fill="#fca5a5" opacity="0.38" />
        <circle cx="40" cy="24" r="20" fill="#fca5a5" opacity="0.38" />

        {/* Left eyebrow (relaxed arch) */}
        <path
          d="M-52,-38 Q-33,-46 -14,-38"
          stroke="#92400e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Right eyebrow */}
        <path
          d="M14,-38 Q33,-46 52,-38"
          stroke="#92400e"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Left eye closed - downward crescent */}
        <path
          d="M-52,-22 Q-33,-38 -14,-22"
          stroke="#78350f"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Left eyelid shimmer */}
        <path
          d="M-52,-22 Q-33,-30 -14,-22"
          stroke="#fbbf24"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Right eye closed */}
        <path
          d="M14,-22 Q33,-38 52,-22"
          stroke="#78350f"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M14,-22 Q33,-30 52,-22"
          stroke="#fbbf24"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Nose */}
        <ellipse cx="-7" cy="14" r="3.5" fill="#d97706" opacity="0.45" />
        <ellipse cx="7" cy="14" r="3.5" fill="#d97706" opacity="0.45" />
        <path
          d="M-7,14 Q0,22 7,14"
          stroke="#d97706"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Mouth — open O for snoring */}
        <ellipse cx="0" cy="48" rx="18" ry={isSnoring ? 15 : 11} fill="#7c2d12" />
        <ellipse
          cx="0"
          cy={isSnoring ? 49 : 48}
          rx="13"
          ry={isSnoring ? 11 : 8}
          fill="#1c0a0a"
        />

        {/* Tongue when snoring hard */}
        {isSnoring && (
          <ellipse cx="0" cy="57" rx="9" ry="5.5" fill="#b45309" opacity="0.65" />
        )}

        {/* Ear left */}
        <path
          d="M-80,-10 Q-98,0 -80,20"
          stroke="#fde68a"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-80,-6 Q-93,2 -80,18"
          stroke="#fbbf24"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Ear right */}
        <path
          d="M80,-10 Q98,0 80,20"
          stroke="#fde68a"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M80,-6 Q93,2 80,18"
          stroke="#fbbf24"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}
