import React from 'react';

export default function RecommendationList({ recommendations = [] }) {
  if (!recommendations.length) return null;
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold mb-3 flex items-center gap-2 text-white">
        <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
        Recommendations
      </p>
      <ul className="space-y-2.5">
        {recommendations.map((rec, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>{i + 1}</span>
            <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{rec}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
