import React from 'react';

export default function RecommendationList({ recommendations = [] }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-risk-low inline-block" />
        Recommendations
      </h3>
      <ul className="space-y-3">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-risk-low/10 text-risk-low text-xs font-bold flex items-center justify-center mt-0.5">
              {idx + 1}
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">{rec}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
