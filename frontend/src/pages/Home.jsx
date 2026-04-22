import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReport } from '../context/ReportContext';
import { analyzeSupplyChain } from '../services/api';
import LoadingState from '../components/LoadingState';

const SAMPLE_DESCRIPTIONS = [
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
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { setCurrentReport, isLoading, setIsLoading, setLoadingStep, resetChat } = useReport();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please describe your supply chain before analyzing.');
      return;
    }

    setError('');
    setIsLoading(true);
    resetChat();

    try {
      setLoadingStep('Parsing your supply chain…');
      // Small delay so user sees the parsing step
      await new Promise((r) => setTimeout(r, 800));
      setLoadingStep('Analyzing risks with AI…');

      const report = await analyzeSupplyChain(description);
      setCurrentReport(report);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* Hero */}
      <div className="bg-navy-900 text-white px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-accent-blue">Route</span>Radar
        </h1>
        <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
          Know Your Risk Before It Knows You
        </p>
        <p className="mt-2 text-sm text-gray-400 max-w-xl mx-auto">
          Describe your supply chain in plain English and get AI-powered risk analysis, vulnerability insights, and actionable recommendations.
        </p>
      </div>

      {/* Input Section */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <label htmlFor="supply-chain-input" className="block text-sm font-semibold text-gray-700 mb-2">
          Describe Your Supply Chain
        </label>
        <textarea
          id="supply-chain-input"
          rows={6}
          className="w-full rounded-xl border border-gray-300 shadow-sm px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none resize-none transition"
          placeholder="e.g. We source raw materials from Country A, ship by sea to our factory in Country B, and distribute by road across Region C…"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError('');
          }}
        />

        {error && (
          <p className="mt-2 text-sm text-risk-critical">{error}</p>
        )}

        <button
          id="analyze-button"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="mt-4 w-full bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-accent-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔍 Analyze Supply Chain
        </button>

        {/* Sample Descriptions */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Try a Sample Supply Chain
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SAMPLE_DESCRIPTIONS.map((sample, idx) => (
              <button
                key={idx}
                id={`sample-${idx}`}
                onClick={() => {
                  setDescription(sample.text);
                  setError('');
                }}
                className="text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-accent-blue hover:shadow-md transition-all group"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-accent-blue transition-colors">
                  {sample.title}
                </h3>
                <p className="mt-1.5 text-xs text-gray-500 line-clamp-3">
                  {sample.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
