import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function MiniSparkline({ data, color }) {
  const chartData = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function StatsCard({ label, value, sub, color, trend }) {
  return (
    <div className="card px-5 py-4 flex flex-col gap-1 card-hover">
      <p className="text-xs font-medium" style={{ color: '#64748B' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <div className="flex items-end justify-between mt-1">
        <p className="text-xs" style={{ color: '#475569' }}>{sub}</p>
        {trend && <MiniSparkline data={trend} color={color} />}
      </div>
    </div>
  );
}
