import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-navy-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-navy-700">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-accent-blue">Route</span>Radar
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Supply Chain Risk Intelligence</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <SidebarLink to="/" icon="🏠" label="Home" />
          <SidebarLink to="/dashboard" icon="📊" label="Dashboard" />
          <SidebarLink to="/history" icon="📋" label="History" />
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-700">
          <p className="text-xs text-gray-500">Powered by Gemini 1.5 Pro</p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
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
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent-blue/20 text-accent-blue'
            : 'text-gray-300 hover:bg-navy-800 hover:text-white'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {label}
    </NavLink>
  );
}

export default App;
