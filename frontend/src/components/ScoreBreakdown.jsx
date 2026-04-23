import React from 'react';

const DIMS = [
  { key: 'geopolitical',      label: 'Geopolitical Risk',   color: '#EF4444' },
  { key: 'weather',           label: 'Natural Disasters',   color: '#F97316' },
  { key: 'infrastructure',    label: 'Logistics',           color: '#3B82F6' },
  { key: 'supplierDependency',label: 'Supplier Stability',  color: '#EAB308' },
  { key: 'regulatory',        label: 'Cyber Security',      color: '#8B5CF6' },
];

export default function ScoreBreakdown({ segments = [] }) {
  if (!segments.length) return null;

  // Average each dimension across all segments, then scale 1-10 → 0-100
  const avgs = DIMS.map(d => {
    const avg = segments.reduce((s, seg) => s + (seg.risks?.[d.key] || 0), 0) / segments.length;
    return { ...d, value: Math.round(avg * 10) };
  });

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>SCORE BREAKDOWN</p>
      {avgs.map(d => (
        <div key={d.key}>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#94A3B8' }}>{d.label}</span>
            <span className="font-semibold" style={{ color: d.color }}>{d.value}</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: '#1E3A5F' }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${d.value}%`, background: d.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}
