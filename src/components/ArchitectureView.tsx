import React, { useState } from 'react';
import { REPOSITORY_ARCHITECTURE_ASCII } from '../data/specs';
import { Copy, Check, Download, Terminal, FolderTree } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REPOSITORY_ARCHITECTURE_ASCII);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([REPOSITORY_ARCHITECTURE_ASCII], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repository_architecture_map.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1 uppercase tracking-wider">
            <FolderTree className="w-4 h-4" />
            <span>Repository Architecture Map</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Enterprise Zero-Trust Repository Structure</h2>
          <p className="text-slate-400 text-sm mt-1">
            Production-grade ASCII repository folder tree detailing microservice boundaries, IaC templates, secure CI/CD GitHub Action workflows, and backend modules.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Tree'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Map</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 text-slate-300">synapse-xdr tree structure</span>
          </div>
          <span>UTF-8 · Git Main · Zero-Trust OCI</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
            {REPOSITORY_ARCHITECTURE_ASCII}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
            01
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Microservice Boundaries</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Strictly isolated container domains separating eBPF XDP packet interception, Wazuh endpoint telemetry, Kafka streaming, and FastAPI orchestration.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
            02
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Infrastructure-as-Code (IaC)</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Terraform modules defining cloud VPC peering, least-privilege IAM roles, and Hardware Security Module (HSM) key vaults.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
            03
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2">Hardened CI/CD Pipelines</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            GitHub Actions enforcing automated SAST/DAST vulnerability scanning, Trivy SBOM container hardening, and rootless OCI deployments.
          </p>
        </div>
      </div>
    </div>
  );
};
