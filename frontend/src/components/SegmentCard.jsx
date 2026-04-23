import React, { useState } from 'react';
import RiskBadge from './RiskBadge';

const MODE_ICONS = { sea: '🚢', air: '✈️', road: '🚛', rail: '🚂', multimodal: '🔄' };
const RISK_LABELS = { geopolitical: 'Geopolitical', weather: 'Weather', infrastructure: 'Infrastructure', supplierDependency: 'Supplier Dep.', regulatory: 'Regulatory' };

function barColor(v) {
  if (v <= 3) return '#22C55E';
  if (v <= 5) return '#EAB308';
  if (v <= 7) return '#F97316';
  return '#EF4444';
}
function level(score) {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

export default function SegmentCard({ segment, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden transition-all" style={{ background: '#071525', border: '1px solid #1E3A5F' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0">{MODE_ICONS[segment.mode] || '📦'}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{segment.from} → {segment.to}</p>
            <p className="text-xs" style={{ color: '#475569' }}>{segment.product} · {segment.mode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <RiskBadge level={level(segment.segmentScore)} />
          <span className="text-xs transition-transform" style={{ color: '#475569', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-in" style={{ borderTop: '1px solid #1E3A5F' }}>
          <p className="text-xs mt-3 mb-3 leading-relaxed" style={{ color: '#94A3B8' }}>{segment.summary}</p>
          <div className="space-y-2">
            {Object.entries(segment.risks || {}).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span style={{ color: '#64748B' }}>{RISK_LABELS[k] || k}</span>
                  <span className="font-semibold" style={{ color: barColor(v) }}>{v}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: '#1E3A5F' }}>
                  <div className="h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${(v / 10) * 100}%`, background: barColor(v) }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-2.5" style={{ borderTop: '1px solid #1E3A5F' }}>
            <span className="text-xs" style={{ color: '#475569' }}>Segment Score</span>
            <span className="text-sm font-bold text-white">{segment.segmentScore}<span className="text-xs" style={{ color: '#475569' }}>/100</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
