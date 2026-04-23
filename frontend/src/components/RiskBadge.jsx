import React from 'react';

const LEVEL_COLOR = { LOW: '#22C55E', MEDIUM: '#EAB308', HIGH: '#F97316', CRITICAL: '#EF4444' };
const BADGE_BG   = { LOW: '#22C55E18', MEDIUM: '#EAB30818', HIGH: '#F9731618', CRITICAL: '#EF444418' };

export default function RiskBadge({ level = 'LOW', size = 'sm' }) {
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${textSize} font-bold uppercase tracking-wider`}
      style={{ color: LEVEL_COLOR[level], background: BADGE_BG[level] }}>
      {level}
    </span>
  );
}
