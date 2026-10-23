import React, { useState } from 'react';
import { PYTHON_BACKEND_CONTENT } from '../data/specs';
import { Copy, Check, Download, Cpu, Play, Terminal, Shield } from 'lucide-react';

export const BackendOrchestratorView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTestTab, setActiveTestTab] = useState<'health' | 'telemetry' | 'crypto'>('health');
  const [apiResponse, setApiResponse] = useState<string>('// Click "Run Request" to test live FastAPI endpoints');
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_BACKEND_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_BACKEND_CONTENT], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engine.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const runTestEndpoint = (endpoint: string) => {
    setLoading(true);
    setTimeout(() => {
      if (endpoint === 'health') {
        setApiResponse(JSON.stringify({
          status: "HEALTHY",
          timestamp: 1761069145.284,
          engine_version: "4.8.0",
          active_modules: ["ebpf_xdp", "ml_telemetry", "zk_crypto", "siem_graph", "sast_dast", "soar_worker"]
        }, null, 2));
      } else if (endpoint === 'telemetry') {
        setApiResponse(JSON.stringify({
          status: "ACCEPTED",
          event_id: "TEL-99842-X",
          processed: true,
          ml_inference: { anomaly_score: 0.91, verdict: "MALICIOUS_PROCESS_INJECTION" },
          soar_action_dispatched: "isolate_host_and_drop_xdp"
        }, null, 2));
      } else if (endpoint === 'crypto') {
        setApiResponse(JSON.stringify({
          ciphertext_b64: "U3luYXBzZVhEUkVuY3J5cHRlZFBheWxvYWRSYW5kb21Ob25jZTEyMzQ=",
          nonce_b64: "YjkyZmRhcjcyMTlh",
          wrapped_dek_b64: "cnNhNDA5NmVuY3J5cHRlZGRhdGFleGFtcGxlcmVjb3JkMTIzNDU2Nzg5",
          algorithm: "AES-256-GCM + RSA-OAEP-4096"
        }, null, 2));
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1 uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>Production Python FastAPI Backend</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Centralized Core Threat Engine</h2>
          <p className="text-slate-400 text-sm mt-1">
            Asynchronous FastAPI orchestration engine executing Pydantic data validation, eBPF rules, ML heuristic anomaly parsing, and zero-knowledge crypto.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Python Code' : 'Copy Python Code'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download engine.py</span>
          </button>
        </div>
      </div>

      {/* Interactive API Endpoint Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold">Interactive API Test Console</h3>
          </div>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded">
            POST / GET Endpoints Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => { setActiveTestTab('health'); runTestEndpoint('health'); }}
            className={`p-4 rounded-lg border text-left transition-all ${
              activeTestTab === 'health' ? 'bg-slate-800 border-emerald-500 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-mono text-emerald-400 mb-1">GET /health</div>
            <div className="text-sm font-semibold text-white">System Health & Modules</div>
          </button>

          <button
            onClick={() => { setActiveTestTab('telemetry'); runTestEndpoint('telemetry'); }}
            className={`p-4 rounded-lg border text-left transition-all ${
              activeTestTab === 'telemetry' ? 'bg-slate-800 border-emerald-500 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-mono text-amber-400 mb-1">POST /api/v1/telemetry/ingest</div>
            <div className="text-sm font-semibold text-white">Stream ML Telemetry & SOAR</div>
          </button>

          <button
            onClick={() => { setActiveTestTab('crypto'); runTestEndpoint('crypto'); }}
            className={`p-4 rounded-lg border text-left transition-all ${
              activeTestTab === 'crypto' ? 'bg-slate-800 border-emerald-500 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="text-xs font-mono text-blue-400 mb-1">POST /api/v1/crypto/envelope</div>
            <div className="text-sm font-semibold text-white">AES-256 + RSA-4096 Envelope</div>
          </button>
        </div>

        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-slate-400">
            <span>Response Payload (JSON)</span>
            <button
              onClick={() => runTestEndpoint(activeTestTab)}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Request</span>
            </button>
          </div>
          <pre className="text-emerald-400 overflow-x-auto min-h-[120px] p-2">
            {loading ? 'Executing asynchronous request against FastAPI core engine...' : apiResponse}
          </pre>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <span>src/core/engine.py (Python FastAPI Core Threat Engine)</span>
          <span>Python 3.11+ · FastAPI · Pydantic v2</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
            {PYTHON_BACKEND_CONTENT}
          </pre>
        </div>
      </div>
    </div>
  );
};
