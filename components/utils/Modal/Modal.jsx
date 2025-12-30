import React from 'react'

export default function Medal({
  title = 'Champion',
  subtitle = '1st Place',
  size = 220,
  variant = 'gold',
  ribbonColor = '#8B5CF6',
  showGlow = true,
}) {
  const VARIANT_COLORS = {
    gold: { stop1: '#FFD54A', stop2: '#FFB300' },
    silver: { stop1: '#E0E0E0', stop2: '#9E9E9E' },
    bronze: { stop1: '#D6A26E', stop2: '#B36A2F' },
  }

  const colors = VARIANT_COLORS[variant]
  const svgId = `medal-${Math.random().toString(36).slice(2, 9)}`

  return (
    <div className="inline-flex flex-col items-center gap-3" style={{ width: size }}>
      <div className="relative">
        <svg
          id={svgId}
          width={size}
          height={size}
          viewBox="0 0 220 220"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`g-${svgId}`} x1="0" x2="1">
              <stop offset="0%" stopColor={colors.stop1} />
              <stop offset="100%" stopColor={colors.stop2} />
            </linearGradient>
            <radialGradient id={`glow-${svgId}`} cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ribbon */}
          <g>
            <path d="M70 30 L95 80 L125 80 L150 30 L125 30 L110 60 L95 30 Z" fill={ribbonColor} />
          </g>

          {/* medal */}
          <g transform="translate(0,30)">
            <circle cx="110" cy="90" r="66" fill={`url(#g-${svgId})`} stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
            <circle cx="110" cy="90" r="54" fill="#ffffff" opacity="0.06" />
            <circle cx="110" cy="90" r="44" fill={`url(#g-${svgId})`} stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
            {showGlow && <ellipse cx="90" cy="70" rx="36" ry="20" fill={`url(#glow-${svgId})`} opacity="0.9" />}

            <text x="110" y="100" textAnchor="middle" fontSize="40" fontWeight={800} fill="#ffffff">1</text>
          </g>

          <text x="110" y="200" textAnchor="middle" fontSize="18" fontWeight={700} fill="#111827">{title}</text>
          <text x="110" y="218" textAnchor="middle" fontSize="12" fill="#374151">{subtitle}</text>
        </svg>
      </div>
    </div>
  )
}
