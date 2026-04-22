import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const DIMENSION_LABELS = {
  geopolitical: 'Geopolitical',
  weather: 'Weather',
  infrastructure: 'Infrastructure',
  supplierDependency: 'Supplier Dep.',
  regulatory: 'Regulatory',
};

const COLORS = ['#3B82F6', '#EF4444', '#22C55E', '#F97316', '#8B5CF6', '#EC4899'];

export default function RiskRadarChart({ segments = [] }) {
  if (segments.length === 0) return null;

  // Build data points — average across all segments, plus individual segments
  const dimensions = Object.keys(DIMENSION_LABELS);

  const data = dimensions.map((dim) => {
    const point = { dimension: DIMENSION_LABELS[dim] };

    // Average
    const avg = segments.reduce((sum, s) => sum + (s.risks?.[dim] || 0), 0) / segments.length;
    point['Average'] = Math.round(avg * 10) / 10;

    // Individual segments
    segments.forEach((seg, idx) => {
      point[`${seg.from}→${seg.to}`] = seg.risks?.[dim] || 0;
    });

    return point;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />

        {/* Average radar */}
        <Radar
          name="Average"
          dataKey="Average"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.15}
          strokeWidth={2}
        />

        {/* Individual segment radars (show max 3 to avoid clutter) */}
        {segments.slice(0, 3).map((seg, idx) => (
          <Radar
            key={idx}
            name={`${seg.from}→${seg.to}`}
            dataKey={`${seg.from}→${seg.to}`}
            stroke={COLORS[(idx + 1) % COLORS.length]}
            fill={COLORS[(idx + 1) % COLORS.length]}
            fillOpacity={0.05}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E5E7EB' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
