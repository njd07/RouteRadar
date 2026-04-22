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
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load report history.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadReport = async (id) => {
    try {
      const report = await getReportById(id);
      setCurrentReport(report);
      resetChat();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to load report.');
    }
  };

  const getScoreColor = (score) => {
    if (score <= 25) return 'text-risk-low';
    if (score <= 50) return 'text-risk-medium';
    if (score <= 75) return 'text-risk-high';
    return 'text-risk-critical';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Report History</h1>
      <p className="text-sm text-gray-500 mb-8">View and load your past supply chain analyses.</p>

      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading reports…</p>
        </div>
      )}

      {error && <p className="text-sm text-risk-critical mb-4">{error}</p>}

      {!loading && reports.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-700">No Reports Yet</h2>
          <p className="mt-2 text-gray-500">Analyze a supply chain to create your first report.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            Analyze Now
          </button>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <button
            key={report.id}
            id={`report-${report.id}`}
            onClick={() => handleLoadReport(report.id)}
            className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent-blue/30 transition-all p-5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}
                  </span>
                  <RiskBadge level={report.riskLevel} />
                  {report.segmentCount > 0 && (
                    <span className="text-xs text-gray-400">{report.segmentCount} segments</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{report.rawDescription}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : '—'}
                </p>
              </div>
              <span className="text-gray-300 group-hover:text-accent-blue transition-colors text-xl mt-1">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
