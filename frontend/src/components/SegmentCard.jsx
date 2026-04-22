import React, { useState } from 'react';
import RiskBadge from './RiskBadge';

const MODE_ICONS = {
  sea: '🚢',
  air: '✈️',
  road: '🚛',
  rail: '🚂',
  multimodal: '🔄',
};

const RISK_LABELS = {
  geopolitical: 'Geopolitical',
  weather: 'Weather',
  infrastructure: 'Infrastructure',
  supplierDependency: 'Supplier Dependency',
  regulatory: 'Regulatory',
};

function getRiskBarColor(value) {
  if (value <= 3) return 'bg-risk-low';
  if (value <= 5) return 'bg-risk-medium';
  if (value <= 7) return 'bg-risk-high';
  return 'bg-risk-critical';
}

function getSegmentLevel(score) {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

export default function SegmentCard({ segment, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden hover:border-accent-blue/30 transition-colors"
    >
      {/* Header — always visible */}
      <button
        id={`segment-${index}`}
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl shrink-0">{MODE_ICONS[segment.mode] || '📦'}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {segment.from} → {segment.to}
            </p>
            <p className="text-xs text-gray-500">{segment.product} · {segment.mode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <RiskBadge level={getSegmentLevel(segment.segmentScore)} />
          <span className="text-gray-400 text-sm transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>
            ▼
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 animate-fade-in">
          {/* Summary */}
          <p className="text-sm text-gray-600 mt-3 mb-4">{segment.summary}</p>

          {/* Risk Bars */}
          <div className="space-y-2.5">
            {Object.entries(segment.risks || {}).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{RISK_LABELS[key] || key}</span>
                  <span className="text-gray-500 font-semibold">{value}/10</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${getRiskBarColor(value)}`}
                    style={{ width: `${(value / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Segment Score */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Segment Score</span>
            <span className="text-lg font-bold text-gray-800">{segment.segmentScore}<span className="text-xs text-gray-400">/100</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
