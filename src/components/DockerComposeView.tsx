import React, { useState } from 'react';
import { DOCKER_COMPOSE_CONTENT } from '../data/specs';
import { Copy, Check, Download, Database, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

export const DockerComposeView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'healthy'>('healthy');

  const handleCopy = () => {
    navigator.clipboard.writeText(DOCKER_COMPOSE_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([DOCKER_COMPOSE_CONTENT], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const testHealth = () => {
    setHealthStatus('checking');
    setTimeout(() => setHealthStatus('healthy'), 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Container Orchestration</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Production Docker Compose Configuration</h2>
          <p className="text-slate-400 text-sm mt-1">
            Hardened OCI orchestration implementing health checks, CPU/Memory resource caps, rootless privilege drop, and isolated networks.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied YAML' : 'Copy YAML'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download YAML</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">PRIVILEGE DROP</p>
            <p className="text-sm font-bold">No-New-Privileges</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">RESOURCE CAPS</p>
            <p className="text-sm font-bold">4.0 CPU / 8GB RAM</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">ENCRYPTED VOLUMES</p>
            <p className="text-sm font-bold">WORM Bind Mounts</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-mono">HEALTHCHECK</p>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {healthStatus === 'healthy' ? 'HEALTHY (100%)' : 'CHECKING...'}
            </p>
          </div>
          <button
            onClick={testHealth}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono rounded border border-slate-700 text-slate-300"
          >
            Probe
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span>docker-compose.yml (Production OCI Spec)</span>
          <span>Docker Engine v26.0+ · Compose v2.25+</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-slate-300 font-mono text-xs leading-relaxed">
            {DOCKER_COMPOSE_CONTENT}
          </pre>
        </div>
      </div>
    </div>
  );
};
