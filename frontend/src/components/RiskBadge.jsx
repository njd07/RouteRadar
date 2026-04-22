import React from 'react';

const BADGE_STYLES = {
  LOW: 'bg-risk-low/10 text-risk-low border-risk-low/30',
  MEDIUM: 'bg-risk-medium/10 text-risk-medium border-risk-medium/30',
  HIGH: 'bg-risk-high/10 text-risk-high border-risk-high/30',
  CRITICAL: 'bg-risk-critical/10 text-risk-critical border-risk-critical/30',
};

export default function RiskBadge({ level = 'LOW' }) {
  const styles = BADGE_STYLES[level] || BADGE_STYLES.LOW;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles}`}
    >
      {level}
    </span>
  );
}
