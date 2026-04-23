import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../context/ReportContext';
import StatsCard from '../components/StatsCard';
import ScoreGauge from '../components/ScoreGauge';
import RiskBadge from '../components/RiskBadge';
import RiskRadarChart from '../components/RiskRadarChart';
import RiskHeatmap from '../components/RiskHeatmap';
import SegmentCard from '../components/SegmentCard';
import VulnerabilityList from '../components/VulnerabilityList';
import RecommendationList from '../components/RecommendationList';
import RecentAlerts from '../components/RecentAlerts';
import ScoreBreakdown from '../components/ScoreBreakdown';
import ChatPanel from '../components/ChatPanel';

function buildStats(report) {
  const highSegs = report.segments.filter(s => s.segmentScore > 50).length;
  const critSegs = report.segments.filter(s => s.segmentScore > 75).length;
  const impact   = report.estimatedImpact || 'N/A - Volume Required';
  return [
    { label: 'Active Risks',        value: report.vulnerabilities.length,   sub: 'High Impact',      color: '#EF4444', trend: [3,5,4,7,6,8,7,9,8,10] },
    { label: 'At-Risk Shipments',   value: highSegs,                         sub: 'Critical Window',  color: '#F97316', trend: [2,3,2,4,3,5,4,6,5,7] },
    { label: 'Disrupted Suppliers', value: critSegs,                         sub: 'Require Attention',color: '#EAB308', trend: [1,2,1,3,2,4,3,5,4,6] },
    { label: 'Estimated Impact',    value: impact,                           sub: 'Potential Loss',   color: '#3B82F6', trend: [5,4,6,5,7,6,8,7,9,8] },
  ];
}

export default function Dashboard() {
  const { currentReport } = useReport();
  const navigate = useNavigate();

  if (!currentReport) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <div className="text-5xl">📡</div>
        <h2 className="text-2xl font-bold text-white">No Report Loaded</h2>
        <p className="text-sm max-w-sm" style={{ color: '#64748B' }}>
          Analyze a supply chain from the Home page, or load a past report from History.
        </p>
        <button onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ background: '#3B82F6' }}>
          Analyze a Supply Chain
        </button>
      </div>
    );
  }

  const r = currentReport;
  const stats = buildStats(r);

  return (
    <div className="flex h-full overflow-hidden animate-fade-in">
      {/* ── Center Content ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-white">Global Supply Chain Overview</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            Real-time risk intelligence and supply chain visibility
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {stats.map((s, i) => <StatsCard key={i} {...s} />)}
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Risk Radar */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white">Risk Radar ⓘ</p>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>Probability</span>
            </div>
            <RiskRadarChart segments={r.segments} />
          </div>

          {/* Score Gauge + Breakdown */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white">Score Gauge ⓘ</p>
              <RiskBadge level={r.riskLevel} />
            </div>
            <div className="flex justify-center">
              <ScoreGauge score={r.overallScore} />
            </div>
            <ScoreBreakdown segments={r.segments} />
          </div>
        </div>

        {/* Heatmap + Alerts row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Risk Heatmap */}
          <div className="card p-5">
            <p className="text-xs font-semibold text-white mb-3">Risk Heatmap</p>
            <RiskHeatmap segments={r.segments} />
          </div>

          {/* Recent Alerts */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white">Recent Alerts</p>
              <button className="text-xs" style={{ color: '#3B82F6' }}>View All</button>
            </div>
            <RecentAlerts vulnerabilities={r.vulnerabilities} createdAt={r.createdAt} />
          </div>
        </div>

        {/* Segments + Recommendations */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold text-white mb-3">Supply Chain Segments ({r.segments.length})</p>
            <div className="space-y-2">
              {r.segments.map((seg, i) => <SegmentCard key={i} segment={seg} index={i} />)}
            </div>
          </div>
          <div className="space-y-4">
            <VulnerabilityList vulnerabilities={r.vulnerabilities} />
            <RecommendationList recommendations={r.recommendations} />
          </div>
        </div>
      </div>

      {/* ── Right Chat Panel ── */}
      <div className="w-72 flex-shrink-0 flex flex-col" style={{ background: '#08111F' }}>
        <ChatPanel reportId={r.id} />
      </div>
    </div>
  );
}
