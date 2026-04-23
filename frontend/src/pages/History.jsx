import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../context/ReportContext';
import { getReports, getReportById } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setCurrentReport, resetChat } = useReport();
  const navigate = useNavigate();

  useEffect(() => {
    getReports()
      .then(setReports)
      .catch(() => setError('Failed to load history. Firestore may not be configured yet.'))
      .finally(() => setLoading(false));
  }, []);

  const load = async (id) => {
    try {
      const r = await getReportById(id);
      setCurrentReport(r); resetChat(); navigate('/dashboard');
    } catch { setError('Failed to load report.'); }
  };

  const scoreColor = s => s > 75 ? '#EF4444' : s > 50 ? '#F97316' : s > 25 ? '#EAB308' : '#22C55E';

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-1">Report History</h1>
      <p className="text-xs mb-8" style={{ color: '#475569' }}>View and reload past supply chain analyses.</p>

      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 rounded-full mx-auto mb-3 animate-spin-slow"
            style={{ border: '3px solid #1E3A5F', borderTopColor: '#3B82F6' }} />
          <p className="text-sm" style={{ color: '#475569' }}>Loading reports…</p>
        </div>
      )}

      {error && <p className="text-xs mb-4 px-4 py-3 rounded-xl" style={{ color: '#F97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-lg font-semibold text-white mb-2">No Reports Yet</p>
          <p className="text-sm mb-4" style={{ color: '#475569' }}>Analyze a supply chain to create your first report.</p>
          <button onClick={() => navigate('/')}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: '#3B82F6' }}>Analyze Now</button>
        </div>
      )}

      <div className="space-y-3">
        {reports.map(r => (
          <button key={r.id} onClick={() => load(r.id)}
            className="w-full text-left card card-hover p-5 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold" style={{ color: scoreColor(r.overallScore) }}>{r.overallScore}</span>
                  <RiskBadge level={r.riskLevel} />
                  <span className="text-xs" style={{ color: '#334155' }}>{r.segmentCount} segments</span>
                </div>
                <p className="text-xs truncate" style={{ color: '#64748B' }}>{r.rawDescription}</p>
                <p className="text-xs mt-1.5" style={{ color: '#334155' }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                </p>
              </div>
              <span className="text-xl mt-1 group-hover:translate-x-1 transition-transform" style={{ color: '#1E3A5F' }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
