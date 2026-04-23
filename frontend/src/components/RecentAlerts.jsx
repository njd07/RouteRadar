import React from 'react';

function getAlertLevel(vuln) {
  const v = vuln.toLowerCase();
  if (v.includes('critical') || v.includes('severe') || v.includes('high')) return 'high';
  if (v.includes('cyber') || v.includes('hack') || v.includes('digital')) return 'cyber';
  return 'medium';
}

const ICONS = { high: '🔺', medium: '⚠️', cyber: '🛡️' };
const COLORS = { high: '#EF4444', medium: '#F97316', cyber: '#EAB308' };

export default function RecentAlerts({ vulnerabilities = [], createdAt }) {
  const time = createdAt ? new Date(createdAt) : new Date();
  const fmt = (offsetMin) => {
    const d = new Date(time.getTime() - offsetMin * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const alerts = vulnerabilities.slice(0, 4).map((v, i) => ({
    text: v, level: getAlertLevel(v), time: fmt(i * 25),
  }));

  if (!alerts.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-xl card-hover transition-all"
          style={{ background: '#071525', border: '1px solid #1E3A5F' }}>
          <span className="mt-0.5 text-base shrink-0">{ICONS[a.level]}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs leading-relaxed" style={{ color: '#CBD5E1' }}>{a.text}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold capitalize px-1.5 py-0.5 rounded"
                style={{ color: COLORS[a.level], background: `${COLORS[a.level]}18` }}>
                {a.level === 'cyber' ? 'Cyber Threat' : a.level === 'high' ? 'High Impact' : 'Medium Impact'}
              </span>
              <span className="text-xs" style={{ color: '#475569' }}>{a.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
