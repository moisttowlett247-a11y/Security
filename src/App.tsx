/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureView } from './components/ArchitectureView';
import { DockerComposeView } from './components/DockerComposeView';
import { BackendOrchestratorView } from './components/BackendOrchestratorView';
import { CockpitView } from './components/CockpitView';
import { ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cockpit');

  const handleRunSimulation = () => {
    setActiveTab('cockpit');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onRunSimulation={handleRunSimulation} />

      <main className="flex-1 pb-16">
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'docker' && <DockerComposeView />}
        {activeTab === 'backend' && <BackendOrchestratorView />}
        {activeTab === 'cockpit' && <CockpitView />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>Synapse-XDR Enterprise Cybersecurity Orchestration System</div>
          <div className="flex items-center gap-4">
            <span>Zero-Trust Architecture</span>
            <span>·</span>
            <span>eBPF XDP Line-Rate Defense</span>
            <span>·</span>
            <span>FIPS 140-3 HSM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
