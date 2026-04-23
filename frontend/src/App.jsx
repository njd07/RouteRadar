import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import { useReport } from './context/ReportContext';

function Sparkline({ data, color = '#3B82F6' }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 64, h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function App() {
  const { currentReport } = useReport();
  const trendData = [40, 38, 45, 42, 48, 44, 50, 47, 52, 49];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#060D1A' }}>
      {/* ── Sidebar ── */}
      <aside className="w-52 flex flex-col shrink-0" style={{ background: '#08111F', borderRight: '1px solid #1E3A5F' }}>
        {/* Logo */}
        <div className="px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'rgba(59,130,246,0.2)' }}>🛰️</div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                <span style={{ color: '#3B82F6' }}>Route</span>Radar
              </h1>
              <p className="text-xs" style={{ color: '#475569' }}>Supply Chain AI</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          <SidebarLink to="/" icon="🏠" label="Home" />
          <SidebarLink to="/dashboard" icon="⊞" label="Dashboard" />
          <SidebarLink to="/history" icon="🕐" label="History" />
        </nav>

        {/* Quick Insight */}
        <div className="px-4 pb-3">
          <div className="rounded-xl p-3" style={{ background: '#0D1B2E', border: '1px solid #1E3A5F' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Quick Insight</p>
            <Sparkline data={trendData} color="#3B82F6" />
            <p className="text-xs mt-1.5 font-medium" style={{ color: '#22C55E' }}>↑ 4.2% vs last 7 days</p>
            <p className="text-xs mt-1" style={{ color: '#475569' }}>Supply Chain Health</p>
          </div>
          <div className="flex items-center gap-1.5 mt-3 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-blink" />
            <p className="text-xs" style={{ color: '#475569' }}>Live</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'text-white'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
      style={({ isActive }) => isActive ? { background: 'rgba(59,130,246,0.15)', color: '#3B82F6' } : {}}
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  );
}

export default App;
