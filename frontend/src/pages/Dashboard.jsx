import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../context/ReportContext';
import ScoreGauge from '../components/ScoreGauge';
import RiskBadge from '../components/RiskBadge';
import RiskRadarChart from '../components/RiskRadarChart';
import SegmentCard from '../components/SegmentCard';
import VulnerabilityList from '../components/VulnerabilityList';
import RecommendationList from '../components/RecommendationList';
import ChatPanel from '../components/ChatPanel';

export default function Dashboard() {
  const { currentReport } = useReport();
  const navigate = useNavigate();

  if (!currentReport) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800">No Report Loaded</h2>
        <p className="mt-2 text-gray-500 max-w-md">
          Analyze a supply chain from the Home page, or load a past report from History.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const report = currentReport;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Risk Analysis Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generated {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'just now'}
        </p>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-3 space-y-6">
          {/* Score Gauge */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Overall Risk Score</h3>
            <ScoreGauge score={report.overallScore} />
            <div className="mt-4">
              <RiskBadge level={report.riskLevel} />
            </div>
          </div>

          {/* Industry Context */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Industry Context</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{report.industryContext}</p>
          </div>
        </div>

        {/* ── Center Column ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Segments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Supply Chain Segments ({report.segments.length})
            </h3>
            <div className="space-y-3">
              {report.segments.map((seg, idx) => (
                <SegmentCard key={idx} segment={seg} index={idx} />
              ))}
            </div>
          </div>

          {/* Vulnerabilities */}
          <VulnerabilityList vulnerabilities={report.vulnerabilities} />

          {/* Recommendations */}
          <RecommendationList recommendations={report.recommendations} />
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Risk Dimensions</h3>
            <RiskRadarChart segments={report.segments} />
          </div>

          {/* Chat Panel */}
          <ChatPanel reportId={report.id} />
        </div>
      </div>
    </div>
  );
}
