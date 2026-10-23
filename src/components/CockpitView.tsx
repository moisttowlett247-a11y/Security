import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, Lock, Share2, Search, Play, CheckCircle2, 
  Terminal, ShieldCheck, Cpu, RefreshCw, AlertTriangle, Database, Zap 
} from 'lucide-react';
import { SecurityDomain, ThreatEvent } from '../types';

export const CockpitView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<SecurityDomain>('ebpf');
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[00:00:01] SYNAPSE-XDR Core initialized successfully.",
    "[00:00:02] eBPF XDP hook attached to eth0 (line-rate packet drop active).",
    "[00:00:03] Suricata multi-threaded IDS/IPS JSON parser listening on stream socket.",
    "[00:00:04] Zero-knowledge vault initialized with AES-256-GCM + RSA-4096 KEK wrapping."
  ]);

  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([
    {
      id: "INC-88210",
      timestamp: "10:52:14 UTC",
      domain: "ebpf",
      severity: "CRITICAL",
      sourceIp: "198.51.100.42",
      targetAsset: "gateway-router-01",
      description: "DDoS SYN flood attack detected at XDP layer (1.4M pps).",
      mitigationAction: "Dropped at kernel driver level via eBPF XDP hook.",
      status: "MITIGATED"
    },
    {
      id: "INC-88211",
      timestamp: "10:51:30 UTC",
      domain: "endpoint",
      severity: "HIGH",
      targetAsset: "prod-worker-db-04",
      description: "Living-off-the-land (LotL) binary execution: suspicious PowerShell spawn from w3wp.exe.",
      mitigationAction: "Process thread suspended & process memory snapshotted.",
      status: "ISOLATED"
    },
    {
      id: "INC-88212",
      timestamp: "10:48:02 UTC",
      domain: "sast",
      severity: "MEDIUM",
      targetAsset: "auth-service-v2",
      description: "CVE-2026-3112 dependency vulnerability detected in Nmap NSE scan (CVSS 8.4).",
      mitigationAction: "Automated GitHub PR generated & patch scheduled.",
      status: "PENDING"
    }
  ]);

  const triggerLiveAttackSimulation = () => {
    setSimulationRunning(true);
    const newLogTime = new Date().toLocaleTimeString();
    setLogs(prev => [
      `[${newLogTime}] INITIATING ATTACK SIMULATION: Multi-vector APT simulation started...`,
      `[${newLogTime}] eBPF XDP Dropper intercepted 150,000 malformed packets from 203.0.113.19.`,
      `[${newLogTime}] ML Heuristic engine flagged anomalous parent-child lineage (bash -> nc -> root).`,
      `[${newLogTime}] SOAR Playbook executed: host prod-worker-db-04 isolated from network namespace.`,
      `[${newLogTime}] Cryptographic WORM snapshot successfully locked to immutable vault storage.`,
      ...prev
    ]);

    const newEvent: ThreatEvent = {
      id: `INC-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: `${newLogTime} UTC`,
      domain: 'soar',
      severity: 'CRITICAL',
      sourceIp: '203.0.113.19',
      targetAsset: 'cluster-master-node',
      description: 'Sophisticated multi-vector attack detected across XDP, Endpoint syscalls, and IAM tokens.',
      mitigationAction: 'Automated SOAR playbook executed instantaneous network isolation and WORM lock.',
      status: 'MITIGATED'
    };

    setTimeout(() => {
      setThreatEvents(prev => [newEvent, ...prev]);
      setSimulationRunning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Security Command Center</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Active Defense & Orchestration Cockpit</h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time telemetry, eBPF packet interception, ML anomaly inference, zero-knowledge crypto, and automated SOAR playbooks.
          </p>
        </div>
        <button
          onClick={triggerLiveAttackSimulation}
          disabled={simulationRunning}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          {simulationRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{simulationRunning ? 'Simulating Threat...' : 'Run Attack Simulation'}</span>
        </button>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedDomain('ebpf')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'ebpf' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">XDP</span>
          </div>
          <div className="text-sm font-bold text-white">01. eBPF Defense</div>
          <div className="text-xs text-slate-400 mt-1">Kernel-level dropping</div>
        </button>

        <button
          onClick={() => setSelectedDomain('endpoint')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'endpoint' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">ML</span>
          </div>
          <div className="text-sm font-bold text-white">02. Telemetry & ML</div>
          <div className="text-xs text-slate-400 mt-1">Behavioral anomaly engine</div>
        </button>

        <button
          onClick={() => setSelectedDomain('identity')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'identity' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">AES/RSA</span>
          </div>
          <div className="text-sm font-bold text-white">03. ZK Crypto</div>
          <div className="text-xs text-slate-400 mt-1">Envelope encryption</div>
        </button>

        <button
          onClick={() => setSelectedDomain('siem')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'siem' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Graph</span>
          </div>
          <div className="text-sm font-bold text-white">04. Distributed SIEM</div>
          <div className="text-xs text-slate-400 mt-1">Lateral movement tracer</div>
        </button>

        <button
          onClick={() => setSelectedDomain('sast')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'sast' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">CVSS</span>
          </div>
          <div className="text-sm font-bold text-white">05. Attack Surface</div>
          <div className="text-xs text-slate-400 mt-1">Nmap & automated PRs</div>
        </button>

        <button
          onClick={() => setSelectedDomain('soar')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedDomain === 'soar' ? 'bg-slate-900 border-emerald-500 text-white shadow-lg' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">WORM</span>
          </div>
          <div className="text-sm font-bold text-white">06. SOAR Playbooks</div>
          <div className="text-xs text-slate-400 mt-1">Celery workers & locks</div>
        </button>
      </div>

      {/* Domain Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-6">
        {selectedDomain === 'ebpf' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">01. Autonomous Network Defense & eBPF XDP Packet Interception</h3>
                <p className="text-slate-400 text-sm">Bypasses standard kernel network stack at line-rate for instant malicious packet dropping.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                XDP Driver Mode: Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">PACKETS DROPPED / SEC</p>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">1,428,950 pps</p>
                <p className="text-[11px] text-slate-500 mt-1">Zero kernel allocation overhead</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">SURICATA IDS THREATS</p>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1">14 Signatures</p>
                <p className="text-[11px] text-slate-500 mt-1">Multi-threaded JSON stream</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">LATENCY OVERHEAD</p>
                <p className="text-2xl font-bold font-mono text-blue-400 mt-1">0.14 microseconds</p>
                <p className="text-[11px] text-slate-500 mt-1">Hardware-accelerated NIC drop</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-xs">
              <p className="text-slate-400 mb-2">// eBPF XDP C Kernel Hook Snippet (xdp_dropper.c)</p>
              <pre className="text-emerald-400 overflow-x-auto">
{`SEC("xdp")
int xdp_malicious_packet_dropper(struct xdp_md *ctx) {
    void *data = (void *)(long)ctx->data;
    void *data_end = (void *)(long)ctx->data_end;
    struct ethhdr *eth = data;
    
    if ((void *)(eth + 1) > data_end)
        return XDP_PASS;
        
    // Line-rate IP blacklist check via eBPF hash map
    if (is_blacklisted_ip(eth)) {
        return XDP_DROP; // Instant drop before socket buffer allocation
    }
    return XDP_PASS;
}`}
              </pre>
            </div>
          </div>
        )}

        {selectedDomain === 'endpoint' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">02. Advanced Endpoint Telemetry & Behavioral Anomaly Engines</h3>
                <p className="text-slate-400 text-sm">Asynchronous event loop processing sys_enter/sys_exit syscalls and streaming ML heuristic inference.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                OSQuery / Wazuh Agents Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">SYSCALLS PROCESSED</p>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">45.8M / min</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">ANOMALY THRESHOLD</p>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1">0.85 (Strict)</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">PROCESS INJECTIONS CAUGHT</p>
                <p className="text-2xl font-bold font-mono text-blue-400 mt-1">3 Prevented</p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 font-mono text-xs">
              <p className="text-slate-400 mb-2">// ML Heuristic Anomaly Stream Parser</p>
              <pre className="text-emerald-400 overflow-x-auto">
{`async def parse_syscall_event(event: SyscallTelemetry):
    lineage = fetch_parent_child_lineage(event.pid)
    score = ml_inference_model.evaluate_lineage(lineage, event.syscall)
    if score > 0.85:
        await trigger_automatic_thread_suspension(event.pid)`}
              </pre>
            </div>
          </div>
        )}

        {selectedDomain === 'identity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">03. Hardened Identity Oversight & Zero-Knowledge Cryptography</h3>
                <p className="text-slate-400 text-sm">AES-256-GCM data encryption key (DEK) wrapped with asymmetric RSA-4096 / Ed25519 key encryption key (KEK).</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                FIPS 140-3 Level 4 HSM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-mono">ENVELOPE ENCRYPTION SPEC</p>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p>• Cipher: AES-256-GCM (Authenticated)</p>
                  <p>• Key Wrapping: RSA-4096 OAEP SHA-256</p>
                  <p>• Token Validation: RS256 Stateless JWT with MFA</p>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-mono">KEY ROTATION STATUS</p>
                <div className="text-xs text-slate-300 space-y-1 font-mono">
                  <p>• KEK Rotation Interval: Every 24 Hours</p>
                  <p>• Active Key ID: kr-key-2026-q4</p>
                  <p>• Hardware Module: AWS CloudHSM / Vault HSM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedDomain === 'siem' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">04. Real-Time Distributed SIEM Log Aggregation & Graph Analysis</h3>
                <p className="text-slate-400 text-sm">Kafka/Logstash data pipelines with in-memory graph correlation tracing lateral movement.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                Kafka KRaft Cluster: 100k msg/s
              </span>
            </div>

            <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex items-center justify-center gap-6">
              <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <p className="text-xs font-mono text-slate-400">ENTRY ASSET</p>
                <p className="text-sm font-bold text-white mt-1">Web Gateway (DMZ)</p>
              </div>
              <div className="text-emerald-400 font-mono text-xs">── lateral ──&gt;</div>
              <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <p className="text-xs font-mono text-slate-400">PIVOT ASSET</p>
                <p className="text-sm font-bold text-amber-400 mt-1">App Server (Internal)</p>
              </div>
              <div className="text-emerald-400 font-mono text-xs">── stolen token ──&gt;</div>
              <div className="text-center p-4 bg-slate-900 border border-red-500/50 rounded-lg">
                <p className="text-xs font-mono text-red-400">TARGET ASSET</p>
                <p className="text-sm font-bold text-red-400 mt-1">Core Database (Isolated)</p>
              </div>
            </div>
          </div>
        )}

        {selectedDomain === 'sast' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">05. Continuous Attack Surface Reduction & SAST/DAST Pipelines</h3>
                <p className="text-slate-400 text-sm">Headless Nmap NSE scripts, raw XML parsing, dynamic CVSS v3.1 scoring, and GitHub PR patch creation.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                GitHub API Integration: Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">CVSS V3.1 THRESHOLD</p>
                <p className="text-2xl font-bold font-mono text-red-400 mt-1">&gt;= 7.0 (Block)</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">OPEN ADVISORIES</p>
                <p className="text-2xl font-bold font-mono text-amber-400 mt-1">2 Patched</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">AUTOMATED PRs CREATED</p>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">5 Pull Requests</p>
              </div>
            </div>
          </div>
        )}

        {selectedDomain === 'soar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">06. Event-Driven SOAR Playbooks & Immutable Backup Locks</h3>
                <p className="text-slate-400 text-sm">Celery/Redis worker architecture isolating compromised assets and triggering WORM cryptographic snapshots.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded">
                WORM Lock: Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-mono">CELERY ASYNC WORKERS</p>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>• Queue: synapse-soar-priority</p>
                  <p>• Concurrency: 16 Workers</p>
                  <p>• Max Execution Latency: &lt; 250ms</p>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-mono">IMMUTABLE WORM SNAPSHOTS</p>
                <div className="text-xs text-slate-300 font-mono space-y-1">
                  <p>• Retention Lock: 7 Years (SEC 17a-4)</p>
                  <p>• Object Storage: AWS S3 Object Lock</p>
                  <p>• Ransomware Defeat: Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incident Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold">Live Incident Response Log Stream</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Showing recent security events</span>
        </div>

        <div className="space-y-3">
          {threatEvents.map(event => (
            <div key={event.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {event.id}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{event.timestamp}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    event.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {event.severity}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{event.description}</p>
                <p className="text-xs text-slate-400"><span className="text-slate-500">Mitigation:</span> {event.mitigationAction}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded">
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Live Logs */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
          <span>Engine Telemetry Stream Log</span>
          <span>Buffer: 1024 KB</span>
        </div>
        <div className="space-y-1 font-mono text-xs text-emerald-400 max-h-40 overflow-y-auto">
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
