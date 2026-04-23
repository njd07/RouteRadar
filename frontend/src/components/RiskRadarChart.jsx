import React from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

const DIMS = [
  { key: 'supplierDependency', label: 'Supplier Instability' },
  { key: 'geopolitical',       label: 'Geopolitical Tension' },
  { key: 'weather',            label: 'Natural Disasters' },
  { key: 'infrastructure',     label: 'Logistics Disruptions' },
  { key: 'regulatory',         label: 'Cyber Threats' },
  { key: 'supplierDependency', label: 'Demand Volatility' }, // reuse for demo
];

function CustomTick({ payload, x, y }) {
  const text = payload.value;
  const words = text.split(' ');
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fill="#64748B">
      {words.map((w, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>{w}</tspan>)}
    </text>
  );
}

export default function RiskRadarChart({ segments = [] }) {
  if (!segments.length) return null;

  const data = DIMS.map(d => ({
    dimension: d.label,
    value: Math.round(
      (segments.reduce((s, seg) => s + (seg.risks?.[d.key] || 5), 0) / segments.length) * 10,
    ),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
        <PolarGrid stroke="#1E3A5F" />
        <PolarAngleAxis dataKey="dimension" tick={<CustomTick />} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#1E3A5F' }} axisLine={false} />
        <Radar name="Risk" dataKey="value"
          stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2}
          dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }} />
        <Tooltip
          contentStyle={{ background: '#0D1B2E', border: '1px solid #1E3A5F', borderRadius: 8, fontSize: 12 }}
          itemStyle={{ color: '#3B82F6' }} labelStyle={{ color: '#94A3B8' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
