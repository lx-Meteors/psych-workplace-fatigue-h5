import React from 'react'

const ACCESSORIES = {
  driver: { label: 'FLAG', icon: '🚩' },
  analyst: { label: 'LENS', icon: '🔍' },
  connector: { label: 'LINK', icon: '🧷' },
  operator: { label: 'BLOCK', icon: '🧱' },
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export function BeeAvatar({ typeId, variant = 'flat', primary = '#2B4EFF', accent = '#22C55E', size = 220 }) {
  const acc = ACCESSORIES[typeId] ?? { label: 'BEE', icon: '🐝' }
  const s = clamp(size, 140, 320)
  const ids = `${variant}_${typeId}`.replace(/[^a-zA-Z0-9_]/g, '_')

  if (variant === 'pixel') {
    return <PixelBee ids={ids} acc={acc} size={s} primary={primary} accent={accent} />
  }

  if (variant === 'toon') {
    return <ToonBee ids={ids} acc={acc} size={s} primary={primary} accent={accent} />
  }

  return <FlatBee ids={ids} acc={acc} size={s} primary={primary} accent={accent} />
}

function FlatBee({ ids, acc, size, primary, accent }) {
  const stroke = '#0B1220'
  const honey = '#FFD778'
  const honey2 = '#F6B63D'
  const wing = '#E6F0FF'
  const wing2 = '#FFFFFF'
  const shade = 'rgba(15,23,42,0.12)'

  return (
    <svg
      aria-label={`Bee avatar flat`}
      height={size}
      role="img"
      viewBox="0 0 240 240"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`bee_bg_${ids}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={primary} stopOpacity="0.18" />
          <stop offset="1" stopColor={accent} stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id={`bee_body_${ids}`} cx="34%" cy="24%" r="80%">
          <stop offset="0" stopColor="#FFF2C2" />
          <stop offset="0.45" stopColor={honey} />
          <stop offset="1" stopColor={honey2} />
        </radialGradient>
        <radialGradient id={`bee_wing_${ids}`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="1" stopColor={wing} stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id={`bee_gloss_${ids}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`softShadow_${ids}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor={shade} />
        </filter>
        <filter id={`inner_${ids}`} x="-40%" y="-40%" width="180%" height="180%">
          <feOffset dx="0" dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="1" k3="-0.8" />
        </filter>
      </defs>

      <g filter={`url(#softShadow_${ids})`}>
        <circle cx="120" cy="120" r="104" fill={`url(#bee_bg_${ids})`} />
        <circle cx="120" cy="120" r="104" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" />
      </g>

      {/* wings */}
      <g opacity="0.98">
        <path
          d="M78 88c-18 0-34 18-34 38 0 18 14 28 30 28 18 0 32-12 32-32 0-18-10-34-28-34Z"
          fill={`url(#bee_wing_${ids})`}
          stroke={stroke}
          strokeOpacity="0.22"
          strokeWidth="2"
        />
        <path
          d="M162 88c18 0 34 18 34 38 0 18-14 28-30 28-18 0-32-12-32-32 0-18 10-34 28-34Z"
          fill={`url(#bee_wing_${ids})`}
          stroke={stroke}
          strokeOpacity="0.22"
          strokeWidth="2"
        />
        <path d="M62 110c18 4 28 14 36 30" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
        <path d="M178 110c-18 4-28 14-36 30" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* antenna */}
      <path d="M108 78c-10-18-20-18-28-12" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M132 78c10-18 20-18 28-12" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="67" r="7" fill={accent} stroke={stroke} strokeWidth="3" />
      <circle cx="166" cy="67" r="7" fill={primary} stroke={stroke} strokeWidth="3" />

      {/* body */}
      <g filter={`url(#inner_${ids})`}>
        <ellipse cx="120" cy="135" rx="70" ry="62" fill={`url(#bee_body_${ids})`} stroke={stroke} strokeWidth="4" />
        <path d="M66 110c24-18 44-26 110-22" fill="none" stroke={stroke} strokeOpacity="0.10" strokeWidth="10" strokeLinecap="round" />
        <path d="M72 128h96" stroke={stroke} strokeWidth="11" strokeLinecap="round" opacity="0.52" />
        <path d="M76 152h88" stroke={stroke} strokeWidth="11" strokeLinecap="round" opacity="0.52" />
        <path d="M88 174h64" stroke={stroke} strokeWidth="11" strokeLinecap="round" opacity="0.52" />
        <path d="M62 126c12 14 18 16 32 18" fill="none" stroke="#fff" strokeOpacity="0.32" strokeWidth="9" strokeLinecap="round" />
        <path d="M86 102h78c16 0 28 10 28 24 0 6-2 10-5 14" fill="none" stroke={`url(#bee_gloss_${ids})`} strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* face */}
      <g>
        <g>
          <circle cx="96" cy="124" r="11" fill="#fff" />
          <circle cx="144" cy="124" r="11" fill="#fff" />
          <circle cx="96" cy="124" r="7" fill={stroke} />
          <circle cx="144" cy="124" r="7" fill={stroke} />
          <circle cx="93" cy="121" r="2.5" fill="#fff" opacity="0.9" />
          <circle cx="141" cy="121" r="2.5" fill="#fff" opacity="0.9" />
        </g>
        <path d="M110 146c8 8 12 8 20 0" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        <path d="M120 150c0 10 0 10 0 10" stroke={stroke} strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M92 112c8-10 18-14 30-10"
          fill="none"
          stroke={stroke}
          strokeOpacity="0.55"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M148 112c-8-10-18-14-30-10"
          fill="none"
          stroke={stroke}
          strokeOpacity="0.55"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* accessory badge */}
      <g>
        <rect x="70" y="180" width="100" height="34" rx="16" fill={stroke} opacity="0.92" />
        <rect x="72" y="182" width="96" height="30" rx="14" fill="#fff" opacity="0.08" />
        <text x="84" y="204" fontSize="14" fontWeight="900" fill="#fff" letterSpacing="1.6">
          {acc.label}
        </text>
        <text x="158" y="205" fontSize="16" fontWeight="900" fill="#fff">
          {acc.icon}
        </text>
      </g>
    </svg>
  )
}

function ToonBee({ ids, acc, size, primary, accent }) {
  const stroke = '#0B1220'
  const shade = 'rgba(15,23,42,0.18)'

  return (
    <svg aria-label="Bee avatar toon" height={size} role="img" viewBox="0 0 240 240" width={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`toon_bg_${ids}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor={primary} stopOpacity="0.18" />
          <stop offset="1" stopColor={accent} stopOpacity="0.12" />
        </radialGradient>
        <radialGradient id={`toon_body_${ids}`} cx="35%" cy="25%" r="80%">
          <stop offset="0" stopColor="#FFE79A" />
          <stop offset="0.55" stopColor="#F6C945" />
          <stop offset="1" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient id={`toon_wing_${ids}`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#E6F0FF" stopOpacity="0.75" />
        </radialGradient>
        <filter id={`toonShadow_${ids}`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor={shade} />
        </filter>
      </defs>

      <g filter={`url(#toonShadow_${ids})`}>
        <circle cx="120" cy="120" r="104" fill={`url(#toon_bg_${ids})`} />
        <circle cx="120" cy="120" r="104" fill="none" stroke={stroke} strokeOpacity="0.12" strokeWidth="2" />
      </g>

      <path
        d="M78 88c-18 0-34 18-34 38 0 18 14 28 30 28 18 0 32-12 32-32 0-18-10-34-28-34Z"
        fill={`url(#toon_wing_${ids})`}
        stroke={stroke}
        strokeOpacity="0.2"
        strokeWidth="2"
      />
      <path
        d="M162 88c18 0 34 18 34 38 0 18-14 28-30 28-18 0-32-12-32-32 0-18 10-34 28-34Z"
        fill={`url(#toon_wing_${ids})`}
        stroke={stroke}
        strokeOpacity="0.2"
        strokeWidth="2"
      />

      <path d="M108 78c-10-18-20-18-28-12" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <path d="M132 78c10-18 20-18 28-12" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="67" r="7" fill={accent} stroke={stroke} strokeWidth="3" />
      <circle cx="166" cy="67" r="7" fill={primary} stroke={stroke} strokeWidth="3" />

      <g filter={`url(#toonShadow_${ids})`}>
        <ellipse cx="120" cy="135" rx="70" ry="62" fill={`url(#toon_body_${ids})`} stroke={stroke} strokeWidth="4" />
        <path d="M78 122h84" stroke={stroke} strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <path d="M82 148h76" stroke={stroke} strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <path d="M94 172h52" stroke={stroke} strokeWidth="10" strokeLinecap="round" opacity="0.55" />
        <path d="M72 116c34-24 70-26 118-14" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" />
        <path d="M60 138c14 18 24 22 44 26" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" />
      </g>

      <circle cx="96" cy="124" r="10" fill={stroke} />
      <circle cx="144" cy="124" r="10" fill={stroke} />
      <path d="M110 146c8 8 12 8 20 0" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />

      <g>
        <rect x="74" y="182" width="92" height="30" rx="14" fill={stroke} opacity="0.92" />
        <text x="86" y="203" fontSize="14" fontWeight="800" fill="#fff" letterSpacing="1.2">
          {acc.label}
        </text>
        <text x="156" y="204" fontSize="16" fontWeight="900" fill="#fff">
          {acc.icon}
        </text>
      </g>
    </svg>
  )
}

function PixelBee({ ids, acc, size, primary, accent }) {
  const stroke = '#0B1220'
  const px = 8
  const startX = 44
  const startY = 48
  const grid = Array.from({ length: 18 }, () => Array.from({ length: 18 }, () => null))

  function fill(x, y, color) {
    if (x < 0 || y < 0 || x >= 18 || y >= 18) return
    grid[y][x] = color
  }

  // background ring
  for (let y = 0; y < 18; y++) {
    for (let x = 0; x < 18; x++) {
      const dx = x - 8.5
      const dy = y - 8.5
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 8.6 && d > 7.1) fill(x, y, 'rgba(15,23,42,0.10)')
      if (d < 7.1) fill(x, y, 'rgba(43,78,255,0.08)')
    }
  }

  // wings
  ;[
    [3, 6],
    [2, 7],
    [3, 8],
    [4, 7],
    [13, 6],
    [14, 7],
    [13, 8],
    [12, 7],
  ].forEach(([x, y]) => fill(x, y, '#E6F0FF'))

  // body blob
  const body = [
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
    [10, 8],
    [5, 9],
    [6, 9],
    [7, 9],
    [8, 9],
    [9, 9],
    [10, 9],
    [11, 9],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
    [11, 10],
    [6, 11],
    [7, 11],
    [8, 11],
    [9, 11],
    [10, 11],
    [7, 12],
    [8, 12],
    [9, 12],
  ]
  body.forEach(([x, y]) => fill(x, y, '#F6C945'))
  ;[
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
  ].forEach(([x, y]) => fill(x, y, '#0B1220'))

  // eyes + smile
  fill(7, 9, '#0B1220')
  fill(9, 9, '#0B1220')
  fill(8, 11, '#0B1220')

  // antenna dots
  fill(5, 6, accent)
  fill(11, 6, primary)

  const scale = size / 240

  return (
    <svg aria-label="Bee avatar pixel" height={size} role="img" viewBox="0 0 240 240" width={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="240" height="240" fill="transparent" />
      <g transform={`scale(${scale})`}>
        <rect x="40" y="40" width="160" height="160" rx="18" fill="rgba(255,255,255,0.75)" stroke={stroke} strokeOpacity="0.12" />
        {grid.map((row, y) =>
          row.map((color, x) =>
            color ? (
              <rect
                key={`${ids}_${x}_${y}`}
                x={startX + x * px}
                y={startY + y * px}
                width={px}
                height={px}
                fill={color}
              />
            ) : null,
          ),
        )}

        <rect x="78" y="182" width="84" height="26" rx="10" fill={stroke} opacity="0.92" />
        <text x="88" y="201" fontSize="12" fontWeight="800" fill="#fff" letterSpacing="1.2">
          {acc.label}
        </text>
        <text x="150" y="201" fontSize="14" fontWeight="900" fill="#fff">
          {acc.icon}
        </text>
      </g>
    </svg>
  )
}

