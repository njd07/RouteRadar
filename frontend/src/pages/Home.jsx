import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../context/ReportContext';
import { analyzeSupplyChain } from '../services/api';
import LoadingState from '../components/LoadingState';

const SAMPLES = [
  {
    title: '🔋 EV Battery Supply Chain',
    text: 'We source raw lithium from mines in Chile, ship it by sea to our battery cell manufacturing plant in Shenzhen, China. The finished battery cells are then air-freighted to our EV assembly plant in Fremont, California, where they are installed in vehicles distributed across North American dealerships by road.',
  },
  {
    title: '☕ Organic Coffee Supply Chain',
    text: 'Our company imports organic coffee beans from smallholder farmers in Ethiopia. The beans are trucked to Djibouti port, then shipped by sea to Rotterdam, Netherlands for roasting. Roasted coffee is distributed by road across EU markets, with a secondary rail shipment to our UK warehouse post-Brexit.',
  },
  {
    title: '🔬 Semiconductor Supply Chain',
    text: 'We manufacture semiconductor chips using silicon wafers sourced from Japan, shipped by sea to our fab in Taiwan. Finished chips are air-freighted to assembly plants in Vietnam and Malaysia, then distributed by multimodal transport to consumer electronics manufacturers in South Korea and the United States.',
  },
];

export default function Home() {
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const { setCurrentReport, isLoading, setIsLoading, setLoadingStep, resetChat } = useReport();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!desc.trim()) { setError('Please describe your supply chain first.'); return; }
    setError(''); setIsLoading(true); resetChat();
    try {
      setLoadingStep('Parsing your supply chain…');
      await new Promise(r => setTimeout(r, 600));
      setLoadingStep('Analyzing risks with Google Gemma 4…');
      const report = await analyzeSupplyChain(desc);
      setCurrentReport(report);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally { setIsLoading(false); setLoadingStep(''); }
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-full" style={{ background: '#060D1A' }}>
      {/* Hero */}
      <div className="px-8 py-16 text-center" style={{ background: 'linear-gradient(180deg, #08111F 0%, #060D1A 100%)', borderBottom: '1px solid #1E3A5F' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6"
          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6' }}>
          🛰️ AI-Powered Risk Intelligence
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
          <span style={{ color: '#3B82F6' }}>Route</span>Radar
        </h1>
        <p className="text-lg mb-2" style={{ color: '#94A3B8' }}>Know Your Risk Before It Knows You</p>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#475569' }}>
          Describe your supply chain in plain English and get AI-powered risk analysis, vulnerability insights, and actionable recommendations instantly.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <label className="block text-sm font-semibold mb-2 text-white">Describe Your Supply Chain</label>
        <textarea
          rows={5}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition"
          style={{ background: '#0D1B2E', border: `1px solid ${error ? '#EF4444' : '#1E3A5F'}`, color: '#E2E8F0', lineHeight: 1.7 }}
          placeholder="e.g. We source raw materials from Country A, ship by sea to our factory in Country B, and distribute by road across Region C…"
          value={desc}
          onChange={e => { setDesc(e.target.value); setError(''); }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAnalyze();
            }
          }}
          onFocus={e => e.target.style.borderColor = '#3B82F6'}
          onBlur={e => e.target.style.borderColor = error ? '#EF4444' : '#1E3A5F'}
        />
        {error && <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>{error}</p>}

        <button onClick={handleAnalyze} disabled={isLoading}
          className="mt-4 w-full font-semibold py-3 px-6 rounded-xl text-sm text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)', boxShadow: '0 4px 24px rgba(59,130,246,0.3)' }}>
          🔍 Analyze Supply Chain with Google Gemma 4
        </button>

        {/* Samples */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Try a Sample</p>
          <div className="grid grid-cols-3 gap-4">
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => { setDesc(s.text); setError(''); }}
                className="text-left p-4 rounded-xl transition-all group card card-hover">
                <h3 className="font-semibold text-sm text-white mb-1.5 group-hover:text-blue-400 transition-colors">{s.title}</h3>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#475569' }}>{s.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
