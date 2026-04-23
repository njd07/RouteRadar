import React from 'react';
import { useReport } from '../context/ReportContext';

const STEPS = ['Parsing your supply chain…', 'Analyzing risks with Google Gemma 4…', 'Building your report…'];

export default function LoadingState() {
  const { loadingStep } = useReport();
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 rounded-full absolute inset-0 animate-pulse-ring"
          style={{ border: '2px solid rgba(59,130,246,0.3)' }} />
        <div className="w-20 h-20 rounded-full animate-spin-slow"
          style={{ border: '3px solid transparent', borderTopColor: '#3B82F6' }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🛰️</div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Analyzing Your Supply Chain</h2>
        <p className="text-sm font-medium animate-pulse" style={{ color: '#3B82F6' }}>
          {loadingStep || 'Processing…'}
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs rounded-lg px-3 py-2"
            style={{ background: '#0D1B2E', border: '1px solid #1E3A5F', color: loadingStep === s ? '#3B82F6' : '#334155' }}>
            <span>{loadingStep === s ? '⏳' : '○'}</span> {s}
          </div>
        ))}
      </div>
    </div>
  );
}
