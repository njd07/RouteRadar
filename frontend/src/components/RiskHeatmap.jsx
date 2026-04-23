import React from 'react';

// Approximate [x%, y%] positions on a 1000×500 world map SVG
const REGIONS = [
  { name: 'Eastern Europe',   x: 54, y: 26, level: 'high' },
  { name: 'South China Sea',  x: 80, y: 44, level: 'medium' },
  { name: 'West Coast US',    x: 13, y: 36, level: 'medium' },
  { name: 'Middle East',      x: 61, y: 42, level: 'high' },
  { name: 'Taiwan Strait',    x: 82, y: 40, level: 'high' },
  { name: 'Red Sea',          x: 58, y: 48, level: 'medium' },
  { name: 'Gulf of Mexico',   x: 22, y: 44, level: 'low' },
  { name: 'South Africa',     x: 56, y: 72, level: 'low' },
];

const COLORS = {
  high:   'rgba(239,68,68,0.7)',
  medium: 'rgba(249,115,22,0.6)',
  low:    'rgba(234,179,8,0.5)',
};
const GLOW = {
  high:   'rgba(239,68,68,0.3)',
  medium: 'rgba(249,115,22,0.25)',
  low:    'rgba(234,179,8,0.2)',
};

export default function RiskHeatmap({ segments = [] }) {
  // Build extra risk points from actual segment data
  const extraPoints = segments.map((seg, i) => {
    const score = seg.segmentScore || 50;
    const level = score > 66 ? 'high' : score > 33 ? 'medium' : 'low';
    // Distribute across the map
    return { name: `${seg.from}→${seg.to}`, x: 15 + (i * 17) % 70, y: 30 + (i * 13) % 40, level };
  });

  const allPoints = [...REGIONS, ...extraPoints];
  const [tooltip, setTooltip] = React.useState(null);

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ borderRadius: 10, background: '#071525' }}
      >
        {/* Simplified continent shapes */}
        <g opacity="0.35" fill="#1E3A5F" stroke="#2A4A6F" strokeWidth="0.5">
          {/* North America */}
          <path d="M80 80 L240 55 L280 120 L260 200 L200 250 L130 240 L90 190 Z" />
          {/* South America */}
          <path d="M160 270 L230 255 L250 350 L210 430 L155 410 L130 340 Z" />
          {/* Europe */}
          <path d="M430 65 L530 55 L555 110 L510 145 L455 135 Z" />
          {/* Africa */}
          <path d="M430 155 L555 145 L580 270 L545 375 L470 390 L400 310 L405 210 Z" />
          {/* Asia */}
          <path d="M555 55 L800 40 L880 115 L900 220 L790 265 L660 235 L575 185 L550 130 Z" />
          {/* Australia */}
          <path d="M740 320 L840 300 L860 390 L780 415 L720 375 Z" />
        </g>

        {/* Heat circles */}
        {allPoints.map((pt, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltip({ name: pt.name, x: pt.x, y: pt.y, level: pt.level })}
            onMouseLeave={() => setTooltip(null)}>
            {/* Outer glow */}
            <circle cx={`${pt.x * 10}`} cy={`${pt.y * 5}`} r="28" fill={GLOW[pt.level]} />
            {/* Main dot */}
            <circle cx={`${pt.x * 10}`} cy={`${pt.y * 5}`} r="10" fill={COLORS[pt.level]} />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute text-xs px-2 py-1 rounded-lg pointer-events-none z-10"
          style={{
            left: `${tooltip.x}%`, top: `${tooltip.y}%`,
            background: '#0D1B2E', border: '1px solid #1E3A5F',
            color: COLORS[tooltip.level], transform: 'translate(-50%, -130%)',
          }}>
          {tooltip.name} · <span style={{ textTransform: 'capitalize' }}>{tooltip.level} risk</span>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-3 flex items-center gap-4">
        {['low', 'medium', 'high'].map(l => (
          <div key={l} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[l] }} />
            <span className="text-xs capitalize" style={{ color: '#64748B' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
