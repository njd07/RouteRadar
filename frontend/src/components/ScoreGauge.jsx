import React from 'react';

function getLevel(score) {
  if (score <= 25) return { label: 'LOW',      color: '#22C55E', track: '#14532D' };
  if (score <= 50) return { label: 'MODERATE', color: '#EAB308', track: '#713F12' };
  if (score <= 75) return { label: 'HIGH',     color: '#F97316', track: '#7C2D12' };
  return              { label: 'CRITICAL',  color: '#EF4444', track: '#7F1D1D' };
}

export default function ScoreGauge({ score = 0 }) {
  const { label, color } = getLevel(score);
  const R = 68, cx = 90, cy = 90;
  const TOTAL_ANGLE = 240; // degrees of arc (120 each side from bottom)
  const startAngle = 150; // degrees from right (3 o'clock)
  const arc = (TOTAL_ANGLE * score) / 100;

  function polarToXY(deg, r) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg, r) {
    const s = polarToXY(startDeg, r);
    const e = polarToXY(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackStart = startAngle;
  const trackEnd   = startAngle + TOTAL_ANGLE;
  const fillEnd    = startAngle + arc;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="140" viewBox="0 0 180 160">
        {/* Track */}
        <path d={describeArc(trackStart, trackEnd, R)} fill="none"
          stroke="#1E3A5F" strokeWidth="10" strokeLinecap="round" />
        {/* Fill */}
        {score > 0 && (
          <path d={describeArc(trackStart, fillEnd, R)} fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'all 1s ease-out' }} />
        )}
        {/* Score */}
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="28" fontWeight="800" fill="white">{score}</text>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="11" fill="#64748B">/100</text>
        {/* Label */}
        <text x={cx} y={cy + 48} textAnchor="middle" fontSize="11" fontWeight="600" fill={color}>{label}</text>
      </svg>
      <p className="text-xs mt-1" style={{ color: '#475569' }}>Overall Supply Chain Health</p>
    </div>
  );
}
