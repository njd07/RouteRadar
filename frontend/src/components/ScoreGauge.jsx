import React from 'react';

const RISK_COLORS = {
  low: { stroke: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  medium: { stroke: '#EAB308', bg: 'rgba(234,179,8,0.1)' },
  high: { stroke: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  critical: { stroke: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function getLevel(score) {
  if (score <= 25) return 'low';
  if (score <= 50) return 'medium';
  if (score <= 75) return 'high';
  return 'critical';
}

export default function ScoreGauge({ score = 0 }) {
  const level = getLevel(score);
  const colors = RISK_COLORS[level];
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background circle */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {/* Score text */}
        <text x="90" y="82" textAnchor="middle" className="text-3xl font-bold" fill={colors.stroke}>
          {score}
        </text>
        <text x="90" y="104" textAnchor="middle" className="text-xs" fill="#9CA3AF">
          / 100
        </text>
      </svg>
    </div>
  );
}
