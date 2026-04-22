import React from 'react';
import { useReport } from '../context/ReportContext';

export default function LoadingState() {
  const { loadingStep } = useReport();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative mb-8">
        {/* Outer ring animation */}
        <div className="w-20 h-20 rounded-full border-4 border-accent-blue/20 absolute inset-0 animate-pulse-ring" />
        {/* Spinning ring */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-accent-blue animate-spin-slow" />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🔍
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">Analyzing Your Supply Chain</h2>
      <p className="text-sm text-accent-blue font-medium animate-pulse">{loadingStep || 'Processing…'}</p>
      <p className="text-xs text-gray-400 mt-4 max-w-xs text-center">
        Our AI is examining geopolitical risks, weather patterns, infrastructure quality, and regulatory factors across your supply chain.
      </p>
    </div>
  );
}
