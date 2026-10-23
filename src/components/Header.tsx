import React from 'react';
import { ShieldCheck, Terminal, Cpu, Database, LayoutDashboard } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRunSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onRunSimulation }) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap">Synapse-XDR</h1>
          <p className="text-[11px] text-slate-400 font-mono tracking-wide">ZERO-TRUST ORCHESTRATION</p>
        </div>
      </div>

      {/* Zone 2: Navigation links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-sm font-medium">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'architecture' ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Architecture Map</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'docker' ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Docker Compose</span>
        </button>

        <button
          onClick={() => setActiveTab('backend')}
          className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'backend' ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>FastAPI Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('cockpit')}
          className={`px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === 'cockpit' ? 'bg-slate-900 text-emerald-400 shadow-sm border border-slate-700' : 'text-slate-300 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>6 Domains Cockpit</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onRunSimulation}
          className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-slate-900 animate-pulse"></span>
          Simulate Attack Vector
        </button>
      </div>
    </header>
  );
};
