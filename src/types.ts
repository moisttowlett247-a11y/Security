export type ActiveTab = 'architecture' | 'docker' | 'backend' | 'cockpit';

export type SecurityDomain = 'ebpf' | 'endpoint' | 'identity' | 'siem' | 'sast' | 'soar';

export interface ThreatEvent {
  id: string;
  timestamp: string;
  domain: SecurityDomain;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceIp?: string;
  targetAsset: string;
  description: string;
  mitigationAction: string;
  status: 'MITIGATED' | 'ISOLATED' | 'PENDING' | 'RESOLVED';
}

export interface MetricStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}
